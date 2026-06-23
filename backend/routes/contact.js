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
  const resendApiKey = String(process.env.RESEND_API_KEY || '').trim();

  return {
    hasResendApiKey: Boolean(resendApiKey),
    hasSmtpService: Boolean(smtpService),
    hasSmtpHost: Boolean(smtpHost),
    hasSmtpUser: Boolean(smtpUser),
    hasSmtpPass: Boolean(smtpPass),
    hasContactTo: Boolean(contactTo),
    isConfigured: Boolean(
      contactTo &&
        (resendApiKey || ((smtpService || smtpHost) && smtpUser && smtpPass)),
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

async function createTransportConfig(overrides = {}) {
  const smtpHost = String(process.env.SMTP_HOST || '').trim();
  const smtpPort = Number(overrides.port || process.env.SMTP_PORT || 587);
  const smtpSecure =
    overrides.secure !== undefined
      ? Boolean(overrides.secure)
      : String(process.env.SMTP_SECURE || 'false') === 'true';
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
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
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
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
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
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
      auth,
    };
  }

  return null;
}

async function createTransportConfigs() {
  const primaryConfig = await createTransportConfig();
  const smtpService = String(process.env.SMTP_SERVICE || '')
    .trim()
    .toLowerCase();
  const smtpHost = String(process.env.SMTP_HOST || '').trim().toLowerCase();
  const isGmail =
    smtpService === 'gmail' ||
    smtpHost.includes('gmail.com') ||
    String(process.env.SMTP_USER || '').trim().endsWith('@gmail.com');

  if (!primaryConfig || !isGmail) {
    return primaryConfig ? [primaryConfig] : [];
  }

  const gmailHost = 'smtp.gmail.com';
  const resolvedHost = await resolveIpv4Host(gmailHost);
  const gmailAuth = {
    user: String(process.env.SMTP_USER || '').trim(),
    pass: String(process.env.SMTP_PASS || '').trim(),
  };
  const gmailFallbackConfigs = [
    {
      host: resolvedHost,
      port: 587,
      secure: false,
      family: 4,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
      tls: {
        servername: gmailHost,
      },
      auth: gmailAuth,
    },
    {
      host: resolvedHost,
      port: 465,
      secure: true,
      family: 4,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
      tls: {
        servername: gmailHost,
      },
      auth: gmailAuth,
    },
  ];
  const configsByKey = new Map();

  [primaryConfig, ...gmailFallbackConfigs].forEach(config => {
    const key = `${config.host || config.service}:${config.port}:${config.secure}`;
    configsByKey.set(key, config);
  });

  return Array.from(configsByKey.values());
}

const escapeHtml = value =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

function buildContactMail({name, email, phone, message, contactId}) {
  const from =
    process.env.CONTACT_FROM ||
    process.env.SMTP_USER ||
    'noreply@thematchers.app';

  return {
    from,
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
  };
}

async function sendResendEmail(mailOptions) {
  const resendApiKey = String(process.env.RESEND_API_KEY || '').trim();

  if (!resendApiKey) {
    return null;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: mailOptions.from,
      to: [mailOptions.to],
      reply_to: mailOptions.replyTo,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.error || `Resend failed with ${response.status}`,
    );
    error.status = response.status;
    error.code = data?.name || 'RESEND_SEND_FAILED';
    throw error;
  }

  return {sent: true, skipped: false, provider: 'resend', id: data?.id || ''};
}

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

  const mailOptions = buildContactMail({name, email, phone, message, contactId});

  const resendResult = await sendResendEmail(mailOptions);

  if (resendResult) {
    return resendResult;
  }

  const transportConfigs = await createTransportConfigs();

  if (!transportConfigs.length) {
    return {
      sent: false,
      skipped: true,
      reason: 'transport_not_configured',
      config: mailConfig,
    };
  }

  let lastError;

  for (const transportConfig of transportConfigs) {
    try {
      const transporter = nodemailer.createTransport(transportConfig);

      await transporter.sendMail(mailOptions);

      return {sent: true, skipped: false};
    } catch (error) {
      lastError = error;

      console.warn('[contact] smtp attempt failed', {
        host: transportConfig.host || transportConfig.service,
        port: transportConfig.port,
        secure: transportConfig.secure,
        message: error?.message,
        code: error?.code,
      });
    }
  }

  throw lastError || new Error('mail_send_failed');
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
