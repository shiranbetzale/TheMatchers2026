const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {Buffer} = require('buffer');

const User = require('../models/User');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
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

async function findUserByPhone(phone) {
  const normalizedPhone = normalizePhone(phone);
  const users = await findAllUsers();

  return users.find(user => normalizePhone(user.phone) === normalizedPhone);
}

async function findUserByPhoneOrEmail(phone, email) {
  const normalizedPhone = normalizePhone(phone);
  const normalizedEmail = normalizeEmail(email);
  const users = await findAllUsers();

  return users.find(user => {
    const samePhone = normalizePhone(user.phone) === normalizedPhone;
    const sameEmail = normalizeEmail(user.email) === normalizedEmail;

    return samePhone || sameEmail;
  });
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

    if (
      !user ||
      !user.passwordHash ||
      !verifyPassword(password, user.passwordHash)
    ) {
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

module.exports = router;
