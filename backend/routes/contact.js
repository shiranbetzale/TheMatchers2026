const express = require('express');

const router = express.Router();

const requiredFields = ['name', 'email', 'message'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res, next) => {
  try {
    let nodemailer;
    try {
      nodemailer = require('nodemailer');
    } catch (err) {
      return res.status(500).json({
        error: 'mail_dependency_missing',
        message: 'nodemailer is not installed',
      });
    }

    const {name, email, phone = '', message} = req.body || {};
    const missingField = requiredFields.find(
      field => !req.body?.[field]?.trim(),
    );

    if (missingField) {
      return res.status(400).json({
        error: 'missing_field',
        field: missingField,
      });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: 'invalid_email',
        field: 'email',
      });
    }

    if (!process.env.SMTP_HOST || !process.env.CONTACT_TO) {
      return res.status(500).json({
        error: 'mail_not_configured',
        message: 'SMTP_HOST and CONTACT_TO must be configured',
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      replyTo: email.trim(),
      subject: `TheMatchers contact: ${name.trim()}`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Phone: ${phone.trim() || '-'}`,
        '',
        'Message:',
        message.trim(),
      ].join('\n'),
    });

    res.json({ok: true});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
