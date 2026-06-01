const express = require('express');
const multer = require('multer');

const User = require('../models/User');
const {requireAuth} = require('../middleware/auth');

let xlsx;

try {
  xlsx = require('xlsx');
} catch (err) {
  xlsx = null;
}

const router = express.Router();

const allowedRoles = ['admin', 'matchmaker', 'user'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 5 * 1024 * 1024},
});

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizeEmail(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function normalizeGender(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase();

  if (normalized === 'male' || normalized === 'זכר') {
    return 'male';
  }

  if (normalized === 'female' || normalized === 'נקבה') {
    return 'female';
  }

  return undefined;
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function handleDuplicateKey(error) {
  if (error?.code === 11000) {
    const fields = Object.keys(error.keyPattern || {});
    const field = fields[0] || 'field';
    const err = new Error(`${field} is already in use`);
    err.status = 409;
    return err;
  }

  return error;
}

function sanitizeUser(user) {
  return {
    id: user.id || user._id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    role: user.role,
    gender: user.gender,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function requireUserFields({fullName, phone, email, password}) {
  if (!fullName || !phone || !email || !password) {
    throw createHttpError(
      'fullName, phone, email, and password are required',
      400,
    );
  }
}

router.post('/register', requireAuth(['admin']), async (req, res, next) => {
  try {
    const {fullName, phone, email, password, gender} = req.body;

    requireUserFields({fullName, phone, email, password});

    const user = new User({
      fullName: String(fullName).trim(),
      phone: normalizePhone(phone),
      email: normalizeEmail(email),
      gender: normalizeGender(gender),
      role: 'matchmaker',
      isActive: true,
    });

    user.setPassword(password);

    await user.save();

    res.status(201).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(handleDuplicateKey(error));
  }
});

router.post('/register-user', async (req, res, next) => {
  try {
    const {fullName, phone, email, password, gender} = req.body;

    requireUserFields({fullName, phone, email, password});

    const user = new User({
      fullName: String(fullName).trim(),
      phone: normalizePhone(phone),
      email: normalizeEmail(email),
      gender: normalizeGender(gender),
      role: 'user',
      isActive: true,
    });

    user.setPassword(password);

    await user.save();

    res.status(201).json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(handleDuplicateKey(error));
  }
});

router.get('/all', requireAuth(['admin']), async (_req, res, next) => {
  try {
    const users = await User.find({});

    const sortedUsers = [...users].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return bTime - aTime;
    });

    res.json({
      users: sortedUsers.map(sanitizeUser),
    });
  } catch (error) {
    next(error);
  }
});

router.put('/update/:id', requireAuth(['admin']), async (req, res, next) => {
  try {
    const {id} = req.params;
    const {fullName, phone, email, password, role, gender, isActive} = req.body;

    const user = await User.findById(id);

    if (!user) {
      throw createHttpError('User not found', 404);
    }

    if (fullName) {
      user.fullName = String(fullName).trim();
    }

    if (phone) {
      user.phone = normalizePhone(phone);
    }

    if (email) {
      user.email = normalizeEmail(email);
    }

    if (role) {
      if (!allowedRoles.includes(role)) {
        throw createHttpError('Invalid role', 400);
      }

      user.role = role;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'gender')) {
      const normalizedGender = normalizeGender(gender);

      if (normalizedGender) {
        user.gender = normalizedGender;
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'isActive')) {
      user.isActive = Boolean(isActive);
    }

    if (password) {
      user.setPassword(password);
    }

    await user.save();

    res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(handleDuplicateKey(error));
  }
});

router.delete('/delete/:id', requireAuth(['admin']), async (req, res, next) => {
  try {
    const {id} = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      throw createHttpError('User not found', 404);
    }

    res.json({
      message: 'User deleted',
      id,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/import',
  requireAuth(['admin']),
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!xlsx) {
        throw createHttpError('xlsx module not installed', 500);
      }

      if (!req.file) {
        throw createHttpError('file is required', 400);
      }

      const workbook = xlsx.read(req.file.buffer, {type: 'buffer'});
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows = xlsx.utils.sheet_to_json(sheet, {defval: ''});

      let created = 0;
      let updated = 0;
      let skipped = 0;

      for (const row of rows) {
        const fullName = row.fullName || row.FullName || row.name || row.Name;
        const phone = normalizePhone(row.phone || row.Phone);
        const email = normalizeEmail(row.email || row.Email);
        const role = String(row.role || row.Role || 'matchmaker')
          .trim()
          .toLowerCase();
        const gender = normalizeGender(row.gender || row.Gender);

        if (!fullName || !phone) {
          skipped += 1;
          continue;
        }

        if (!allowedRoles.includes(role)) {
          skipped += 1;
          continue;
        }

        const existingUsers = await User.find({});
        const existing = existingUsers.find(
          item => normalizePhone(item.phone) === phone,
        );

        if (existing) {
          existing.fullName = String(fullName).trim();

          if (email) {
            existing.email = email;
          }

          existing.role = role;

          if (gender) {
            existing.gender = gender;
          }

          await existing.save();
          updated += 1;
        } else {
          const user = new User({
            fullName: String(fullName).trim(),
            phone,
            email,
            role,
            gender,
            isActive: true,
          });

          await user.save();
          created += 1;
        }
      }

      res.json({
        summary: {
          created,
          updated,
          skipped,
          total: rows.length,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
