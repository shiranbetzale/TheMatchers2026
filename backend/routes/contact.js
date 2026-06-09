const express = require('express');
const dns = require('dns').promises;
const nodemailer = require('nodemailer');
const {getFirestore} = require('../config/firebase');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getMailConfigStatus() {
  const smtpService = String(process.env.SMTP_SERVICE || '').trim();
  const smtpHost = String(process.env.SMTP_HOST || '').trim();
  const smtpUser = String(process.env.SMTP_USER || '').trim();
  const smtpPass = String(process.env.SMTP_PASS || '').trim();
  const contactTo = String(process.env.CONTACT_TO || '').trim();

  return {
    hasSmtpService: Boolean(smtpService),
    hasSmtpHost: Boolean(smtpHost),
    hasSmtpUser: Boolean(smtpUser),
    hasSmtpPass: Boolean(smtpPass),
    hasContactTo: Boolean(contactTo),
    isConfigured: Boolean(
      contactTo && (smtpService || smtpHost) && smtpUser && smtpPass,
    ),
  };
}

async function resolveIpv4Host(host) {
  try {
    const addresses = await dns.resolve4(host);
    return addresses[0] || host;
  } catch (error) {
    console.warn('[contact] failed to resolve smtp ipv4 host', {
      host,
      message: error?.message,
    });

    return host;
  }
}

async function createTransportConfig() {
  const smtpHost = String(process.env.SMTP_HOST || '').trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || 'false') === 'true';
  const smtpUser = String(process.env.SMTP_USER || '').trim();
  const smtpPass = String(process.env.SMTP_PASS || '').trim();
  const smtpService = String(process.env.SMTP_SERVICE || '')
    .trim()
    .toLowerCase();
  const auth = {
    user: smtpUser,
    pass: smtpPass,
  };

  if (smtpHost) {
    const resolvedHost = await resolveIpv4Host(smtpHost);

    return {
      host: resolvedHost,
      port: smtpPort,
      secure: smtpSecure,
      family: 4,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        servername: smtpHost,
      },
      auth,
    };
  }

  if (smtpService === 'gmail') {
    const gmailHost = 'smtp.gmail.com';
    const resolvedHost = await resolveIpv4Host(gmailHost);

    return {
      host: resolvedHost,
      port: 465,
      secure: true,
      family: 4,
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      tls: {
        servername: gmailHost,
      },
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

const escapeHtml = value =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

async function sendContactEmail({name, email, phone, message, contactId}) {
  const mailConfig = getMailConfigStatus();

  if (!mailConfig.isConfigured) {
    return {
      sent: false,
      skipped: true,
      reason: 'mail_not_configured',
      config: mailConfig,
    };
  }

  const transportConfig = await createTransportConfig();

  if (!transportConfig) {
    return {
      sent: false,
      skipped: true,
      reason: 'transport_not_configured',
      config: mailConfig,
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);

  await transporter.sendMail({
    from:
      process.env.CONTACT_FROM ||
      process.env.SMTP_USER ||
      'noreply@thematchers.app',
    to: process.env.CONTACT_TO,
    replyTo: email,
    subject: `TheMatchers Contact Form - ${name}`,
    text: [
      `Contact ID: ${contactId}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || '-'}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Contact Request</h2>
        <p><strong>Contact ID:</strong> ${escapeHtml(contactId)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || '-')}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      </div>
    `,
  });

  return {sent: true, skipped: false};
}

router.get('/status', (_req, res) => {
  res.json({
    ok: true,
    contact: {
      storage: 'firestore',
      collection: 'contactRequests',
      isConfigured: true,
    },
    mail: getMailConfigStatus(),
  });
});

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

    const db = getFirestore();

    const docRef = await db.collection('contactRequests').add({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
      status: 'new',
      emailSent: false,
      source: 'thematchers-app',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    let emailResult;

    try {
      emailResult = await sendContactEmail({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        message: cleanMessage,
        contactId: docRef.id,
      });

      await docRef.update({
        emailSent: Boolean(emailResult.sent),
        emailSkipped: Boolean(emailResult.skipped),
        emailError: emailResult.sent ? '' : emailResult.reason || '',
        emailedAt: emailResult.sent ? new Date() : null,
        updatedAt: new Date(),
      });
    } catch (emailError) {
      emailResult = {
        sent: false,
        skipped: false,
        reason: emailError?.message || 'mail_send_failed',
        code: emailError?.code || undefined,
      };

      console.error('[contact] email send failed after firestore save', {
        contactId: docRef.id,
        message: emailError?.message,
        code: emailError?.code,
        command: emailError?.command,
      });

      await docRef.update({
        emailSent: false,
        emailSkipped: false,
        emailError: emailResult.reason,
        emailErrorCode: emailResult.code || '',
        updatedAt: new Date(),
      });
    }

    return res.json({
      ok: true,
      id: docRef.id,
      saved: true,
      email: emailResult,
      message: emailResult?.sent
        ? 'Contact request saved and emailed successfully'
        : 'Contact request saved successfully; email was not sent',
    });
  } catch (err) {
    console.error('[contact] save failed', {
      message: err?.message,
      code: err?.code,
    });

    return res.status(500).json({
      error: 'contact_save_failed',
      message: err?.message || 'Failed to save contact request',
      code: err?.code || undefined,
    });
  }
});

module.exports = router;
