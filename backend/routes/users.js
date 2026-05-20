const express = require('express');
const User = require('../models/User');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
let xlsx;
try {
  // Optional dependency; used only for import route
  xlsx = require('xlsx');
} catch (err) {
  xlsx = null;
}

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

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

router.post('/register', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;

    if (!fullName || !phone) {
      const error = new Error('fullName and phone are required');
      error.status = 400;
      throw error;
    }

    const user = new User({ fullName, phone, role: 'matchmaker' });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    next(handleDuplicateKey(error));
  }
});

router.post('/register-user', async (req, res, next) => {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      const error = new Error('fullName, phone, email, and password are required');
      error.status = 400;
      throw error;
    }

    const user = new User({ fullName, phone, email, role: 'user' });
    user.setPassword(password);
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    next(handleDuplicateKey(error));
  }
});

router.get('/all', requireAuth(['admin']), async (_req, res, next) => {
  try {
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.put('/update/:id', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, phone, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (password) user.setPassword(password);

    await user.save();

    res.json({ user });
  } catch (error) {
    next(handleDuplicateKey(error));
  }
});

router.delete('/delete/:id', requireAuth(['admin']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    res.json({ message: 'User deleted', id });
  } catch (error) {
    next(error);
  }
});

router.post('/import', requireAuth(['admin']), upload.single('file'), async (req, res, next) => {
  try {
    if (!xlsx) {
      const error = new Error('xlsx module not installed');
      error.status = 500;
      throw error;
    }

    if (!req.file) {
      const error = new Error('file is required');
      error.status = 400;
      throw error;
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const fullName = row.fullName || row.FullName || row.name || row.Name;
      const phone = (row.phone || row.Phone || '').toString().trim();
      const email = (row.email || row.Email || '').toString().trim();
      const role = (row.role || row.Role || 'matchmaker').toLowerCase();
      const gender = row.gender || row.Gender;

      if (!fullName || !phone) {
        skipped += 1;
        continue;
      }

      const existing = await User.findOne({ phone });
      if (existing) {
        existing.fullName = fullName;
        if (email) existing.email = email;
        if (role) existing.role = role;
        if (gender) existing.gender = gender;
        await existing.save();
        updated += 1;
      } else {
        await User.create({
          fullName,
          phone,
          email,
          role,
          gender,
        });
        created += 1;
      }
    }

    res.json({ summary: { created, updated, skipped, total: rows.length } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
