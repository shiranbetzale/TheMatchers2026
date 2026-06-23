const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {Buffer} = require('buffer');

const User = require('../models/User');
const {requireAuth} = require('../middleware/auth');
const {admin} = require('../config/firebase');

const router = express.Router();

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function normalizeLocalPhone(phone) {
  const normalizedPhone = normalizePhone(phone);

  if (normalizedPhone.startsWith('972')) {
    return `0${normalizedPhone.slice(3)}`;
  }

  return normalizedPhone;
}

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id || user._id,
      role: user.role,
      phone: user.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
}

function createCandidateToken(matchmaker, candidatePhone) {
  return jwt.sign(
    {
      sub: matchmaker.id || matchmaker._id,
      role: 'user',
      phone: candidatePhone,
      matchmakerPhone: matchmaker.phone,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
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

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');

  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) {
    return false;
  }

  const [salt, storedHash] = stored.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hash));
}

async function findAllUsers() {
  return User.find({});
}

function buildPhoneLookupValues(phone) {
  const digits = normalizePhone(phone);
  const values = new Set();

  if (digits) {
    values.add(digits);
  }

  if (digits.startsWith('972')) {
    const localPhone = `0${digits.slice(3)}`;
    values.add(localPhone);
    values.add(`+${digits}`);
  } else if (digits.startsWith('0')) {
    const internationalPhone = `972${digits.slice(1)}`;
    values.add(internationalPhone);
    values.add(`+${internationalPhone}`);
  } else if (digits.startsWith('5')) {
    values.add(`0${digits}`);
    values.add(`972${digits}`);
    values.add(`+972${digits}`);
  }

  return Array.from(values).filter(Boolean);
}

async function findUserByPhoneFast(phone) {
  const phoneValues = buildPhoneLookupValues(phone);

  if (!phoneValues.length) {
    return null;
  }

  const snapshot = await User.collection
    .where('phone', 'in', phoneValues.slice(0, 30))
    .get();

  const users = snapshot.docs.map(doc => User._fromSnapshot(doc)).filter(Boolean);
  const normalizedPhone = normalizeLocalPhone(phone);

  return (
    users.find(user => normalizeLocalPhone(user.phone) === normalizedPhone) ||
    users[0] ||
    null
  );
}

async function findUserByPhone(phone) {
  return findUserByPhoneFast(phone);
}

async function findUserByPhoneOrEmail(phone, email) {
  const normalizedEmail = normalizeEmail(email);
  const [userByPhone, emailSnapshot] = await Promise.all([
    findUserByPhoneFast(phone),
    normalizedEmail
      ? User.collection.where('email', '==', normalizedEmail).get()
      : Promise.resolve({docs: []}),
  ]);
  const userByEmail =
    emailSnapshot.docs.map(doc => User._fromSnapshot(doc)).filter(Boolean)[0] ||
    null;

  if (userByPhone || userByEmail) {
    return userByPhone || userByEmail;
  }

  return null;
}

function requireFields(fields, body) {
  const missingField = fields.find(field => !String(body[field] || '').trim());

  if (missingField) {
    throw createHttpError(`${fields.join(', ')} are required`, 400);
  }
}

function validatePassword(password) {
  if (String(password || '').length < 6) {
    throw createHttpError('Password must contain at least 6 characters', 400);
  }
}

router.post('/register-admin', async (req, res, next) => {
  try {
    const users = await findAllUsers();
    const adminExists = users.some(user => user.role === 'admin');

    if (adminExists) {
      throw createHttpError('Admin already exists', 403);
    }

    requireFields(['fullName', 'phone', 'email', 'password'], req.body);

    const fullName = String(req.body.fullName).trim();
    const phone = normalizePhone(req.body.phone);
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password);

    validatePassword(password);

    const existingUser = await findUserByPhoneOrEmail(phone, email);

    if (existingUser) {
      throw createHttpError('Phone or email already in use', 409);
    }

    const user = new User({
      fullName,
      phone,
      email,
      role: 'admin',
      isActive: true,
    });

    user.passwordHash = hashPassword(password);

    await user.save();

    res.status(201).json({
      user: sanitizeUser(user),
      token: createToken(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/register-matchmaker',
  requireAuth(['admin']),
  async (req, res, next) => {
    try {
      requireFields(['fullName', 'phone', 'email', 'password'], req.body);

      const fullName = String(req.body.fullName).trim();
      const phone = normalizePhone(req.body.phone);
      const email = normalizeEmail(req.body.email);
      const password = String(req.body.password);
      const gender = req.body.gender || undefined;

      validatePassword(password);

      const existingUser = await findUserByPhoneOrEmail(phone, email);

      if (existingUser) {
        throw createHttpError('Phone or email already in use', 409);
      }

      const user = new User({
        fullName,
        phone,
        email,
        gender,
        role: 'matchmaker',
        isActive: true,
      });

      user.passwordHash = hashPassword(password);

      await user.save();

      res.status(201).json({
        user: sanitizeUser(user),
        token: createToken(user),
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/login', async (req, res, next) => {
  try {
    requireFields(['phone', 'password'], req.body);

    const phone = normalizePhone(req.body.phone);
    const password = String(req.body.password);

    const user = await findUserByPhone(phone);

    if (!user) {
      if (__dirname) {
        console.warn('Login failed: user not found', {phone});
      }
      throw createHttpError('invalid credentials', 401);
    }

    if (!user.passwordHash) {
      console.warn('Login failed: user has no password hash', {
        phone,
        userId: user.id || user._id,
        role: user.role,
      });
      throw createHttpError('invalid credentials', 401);
    }

    if (!verifyPassword(password, user.passwordHash)) {
      console.warn('Login failed: password mismatch', {
        phone,
        userId: user.id || user._id,
        role: user.role,
      });
      throw createHttpError('invalid credentials', 401);
    }

    if (user.isActive === false) {
      throw createHttpError('user is inactive', 403);
    }

    res.json({
      user: sanitizeUser(user),
      token: createToken(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/candidate/send-code', async (req, res, next) => {
  try {
    requireFields(['phone', 'matchmakerPhone'], req.body);

    const phone = normalizePhone(req.body.phone);
    const matchmakerPhone = normalizePhone(req.body.matchmakerPhone);
    const matchmaker = await findUserByPhone(matchmakerPhone);

    console.log('candidate login check', {
      phone,
      matchmakerPhone,
      matchmaker: matchmaker
        ? {
            id: matchmaker.id || matchmaker._id,
            phone: matchmaker.phone,
            role: matchmaker.role,
            isActive: matchmaker.isActive,
          }
        : null,
    });

    if (
      !matchmaker ||
      matchmaker.isActive === false ||
      (matchmaker.role !== 'matchmaker' && matchmaker.role !== 'admin')
    ) {
      throw createHttpError('matchmaker not found', 404);
    }

    res.json({
      ok: true,
      phone,
      matchmakerPhone,
      channel: 'firebase',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/candidate/verify-firebase', async (req, res, next) => {
  try {
    requireFields(['phone', 'matchmakerPhone', 'firebaseIdToken'], req.body);

    const phone = normalizeLocalPhone(req.body.phone);
    const matchmakerPhone = normalizePhone(req.body.matchmakerPhone);
    const matchmaker = await findUserByPhone(matchmakerPhone);

    if (
      !matchmaker ||
      matchmaker.isActive === false ||
      (matchmaker.role !== 'matchmaker' && matchmaker.role !== 'admin')
    ) {
      throw createHttpError('matchmaker not found', 404);
    }

    let decodedToken;

    try {
      decodedToken = await admin
        .auth()
        .verifyIdToken(String(req.body.firebaseIdToken));
    } catch (error) {
      throw createHttpError('invalid firebase token', 401);
    }

    const verifiedPhone = normalizeLocalPhone(decodedToken.phone_number);

    if (!verifiedPhone || verifiedPhone !== phone) {
      throw createHttpError('phone mismatch', 401);
    }

    res.json({
      user: {
        id: matchmaker.id || matchmaker._id,
        phone,
        role: 'user',
        matchmakerPhone,
      },
      token: createCandidateToken(matchmaker, phone),
      nextScreen: 'Wizard',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/candidate/verify-code', async (req, res, next) => {
  try {
    requireFields(['phone', 'matchmakerPhone', 'code'], req.body);

    const phone = normalizeLocalPhone(req.body.phone);
    const matchmakerPhone = normalizePhone(req.body.matchmakerPhone);
    const code = normalizePhone(req.body.code);
    const matchmaker = await findUserByPhone(matchmakerPhone);

    if (
      !matchmaker ||
      matchmaker.isActive === false ||
      (matchmaker.role !== 'matchmaker' && matchmaker.role !== 'admin')
    ) {
      throw createHttpError('matchmaker not found', 404);
    }

    if (code !== matchmakerPhone) {
      throw createHttpError('invalid candidate code', 401);
    }

    res.json({
      user: {
        id: matchmaker.id || matchmaker._id,
        phone,
        role: 'user',
        matchmakerPhone,
      },
      token: createCandidateToken(matchmaker, phone),
      nextScreen: 'Wizard',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
