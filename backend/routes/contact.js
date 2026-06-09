const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const requiredFields = ['name', 'email', 'message'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createTransportConfig() {
  const smtpHost = String(process.env.SMTP_HOST || '').trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || 'false') === 'true';
  const smtpUser = String(process.env.SMTP_USER || '').trim();
  const smtpPass = String(process.env.SMTP_PASS || '').trim();
  const smtpService = String(process.env.SMTP_SERVICE || '')
    .trim()
    .toLowerCase();

  const hasAuth = Boolean(smtpUser && smtpPass);
  const auth = hasAuth
    ? {
        user: smtpUser,
        pass: smtpPass,
      }
    : undefined;

  if (smtpHost) {
    return {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      family: 4,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth,
    };
  }

  if (smtpService === 'gmail') {
    return {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      family: 4,
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      auth,
    };
  }

  if (smtpService) {
    return {
      service: smtpService,
      family: 4,
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      auth,
    };
  }

  return null;
}

router.post('/', async (req, res) => {
  try {
    const {name, email, phone = '', message} = req.body || {};

    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanPhone = String(phone || '').trim();
    const cleanMessage = String(message || '').trim();

    const missingField = [
      ['name', cleanName],
      ['email', cleanEmail],
      ['message', cleanMessage],
    ].find(([, value]) => !value)?.[0];

    if (missingField) {
      return res.status(400).json({
        error: 'missing_field',
        field: missingField,
        message: `Missing required field: ${missingField}`,
      });
    }

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        error: 'invalid_email',
        field: 'email',
        message: 'Invalid email format',
      });
    }

    const hasSmtpService = Boolean(
      String(process.env.SMTP_SERVICE || '').trim(),
    );

    const hasSmtpHost = Boolean(String(process.env.SMTP_HOST || '').trim());

    const hasContactTo = Boolean(String(process.env.CONTACT_TO || '').trim());

    if ((!hasSmtpService && !hasSmtpHost) || !hasContactTo) {
      return res.status(500).json({
        error: 'mail_not_configured',
        message: 'Set CONTACT_TO and either SMTP_SERVICE or SMTP_HOST',
      });
    }

    const transportConfig = createTransportConfig();

    if (!transportConfig) {
      return res.status(500).json({
        error: 'mail_not_configured',
        message: 'SMTP transport is not configured',
      });
    }

    const transporter = nodemailer.createTransport(transportConfig);

    await transporter.sendMail({
      from:
        process.env.CONTACT_FROM ||
        process.env.SMTP_USER ||
        'noreply@thematchers.app',

      to: process.env.CONTACT_TO,

      replyTo: cleanEmail,

      subject: `TheMatchers Contact Form - ${cleanName}`,

      text: [
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone || '-'}`,
        '',
        'Message:',
        cleanMessage,
      ].join('\n'),

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Request</h2>

          <p>
            <strong>Name:</strong>
            ${cleanName}
          </p>

          <p>
            <strong>Email:</strong>
            ${cleanEmail}
          </p>

          <p>
            <strong>Phone:</strong>
            ${cleanPhone || '-'}
          </p>

          <hr />

          <p>
            <strong>Message:</strong>
          </p>

          <p>${cleanMessage.replace(/\n/g, '<br />')}</p>
        </div>
      `,
    });

    return res.json({
      ok: true,
      message: 'Email sent successfully',
    });
  } catch (err) {
    console.error('[contact] send failed', {
      message: err?.message,
      code: err?.code,
      command: err?.command,
    });

    return res.status(500).json({
      error: 'mail_send_failed',
      message: err?.message || 'Failed to send email',
      code: err?.code || undefined,
      command: err?.command || undefined,
    });
  }
});

module.exports = router;
