const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {Buffer} = require('buffer');
const User = require('../models/User');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

function createToken(user) {
  return jwt.sign({sub: user.id, role: user.role}, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, storedHash] = stored.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hash));
}

// יצירת אדמין ראשון: מותר רק אם אין אדמין קיים
router.post('/register-admin', async (req, res, next) => {
  try {
    const adminCount = await User.countDocuments({role: 'admin'});
    if (adminCount > 0) {
      const error = new Error('Admin already exists');
      error.status = 403;
      throw error;
    }

    const {fullName, phone, email, password} = req.body;
    if (!fullName || !phone || !email || !password) {
      const error = new Error('fullName, phone, email, password are required');
      error.status = 400;
      throw error;
    }

    const user = new User({fullName, phone, email, role: 'admin'});
    user.passwordHash = hashPassword(password);
    await user.save();

    res.status(201).json({user, token: createToken(user)});
  } catch (error) {
    next(error);
  }
});

// הרשמת שדכנית/שדכן - אדמין בלבד
router.post(
  '/register-matchmaker',
  requireAuth(['admin']),
  async (req, res, next) => {
    try {
      const {fullName, phone, email, password} = req.body;
      if (!fullName || !phone || !email || !password) {
        const error = new Error(
          'fullName, phone, email, password are required',
        );
        error.status = 400;
        throw error;
      }
      const user = new User({fullName, phone, email, role: 'matchmaker'});
      user.passwordHash = hashPassword(password);
      await user.save();
      res.status(201).json({user, token: createToken(user)});
    } catch (error) {
      let nextError = error;
      if (nextError?.code === 11000) {
        nextError = new Error('Phone or email already in use');
        nextError.status = 409;
      }
      next(nextError);
    }
  },
);

router.post('/login', async (req, res, next) => {
  try {
    const {phone, password} = req.body;
    if (!phone || !password) {
      const error = new Error('phone and password are required');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({phone}).select('+passwordHash');
    if (
      !user ||
      !user.passwordHash ||
      !verifyPassword(password, user.passwordHash)
    ) {
      const error = new Error('invalid credentials');
      error.status = 401;
      throw error;
    }

    res.json({user, token: createToken(user)});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
