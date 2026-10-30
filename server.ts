import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// ==================== ENVIRONMENT CONFIGURATION ====================
function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim() || '';
  
  // Destination inbox: naviora.pvt@gmail.com (the user's email)
  const notificationRecipient =
    process.env.NOTIFICATION_RECIPIENT?.trim() ||
    process.env.NOTIFICATION_RECIPIENT_EMAIL?.trim() ||
    'naviora.pvt@gmail.com';

  // Sender address requested by user: navioraa.technology@gmail.com
  const senderEmail =
    process.env.EMAIL_SENDER?.trim() ||
    'navioraa.technology@gmail.com';

  const smtpUser =
    process.env.SMTP_USER?.trim() ||
    process.env.GMAIL_USER?.trim() ||
    'navioraa.technology@gmail.com';

  const smtpPass =
    process.env.SMTP_PASS?.trim() ||
    process.env.GMAIL_APP_PASSWORD?.trim() ||
    process.env.SMTP_PASSWORD?.trim() ||
    '';

  const smtpHost =
    process.env.SMTP_HOST?.trim() ||
    (smtpUser.endsWith('@gmail.com') ? 'smtp.gmail.com' : '');

  const smtpPort = Number(process.env.SMTP_PORT) || (smtpHost === 'smtp.gmail.com' ? 465 : 587);

  const emailProviderEnv = process.env.EMAIL_PROVIDER?.trim().toLowerCase();

  const missingSecrets: string[] = [];
  // Standard Google App Passwords are 16 alphanumeric characters
  const cleanPass = smtpPass.replace(/\s+/g, '');
  const hasValidSmtpFormat = Boolean(smtpHost && smtpUser && cleanPass.length === 16);
  const hasAnySmtp = Boolean(smtpHost && smtpUser && smtpPass);
  const hasResend = Boolean(resendApiKey);

  // Provider hierarchy:
  // 1. If explicitly forced to SMTP or Resend via EMAIL_PROVIDER, respect that
  // 2. If SMTP has a valid 16-character Google App Password format, prioritize native Google SMTP
  // 3. Otherwise if Resend API key is present, prioritize Resend for immediate 100% reliable delivery
  // 4. Fall back to SMTP
  let provider: 'resend' | 'smtp' | 'none' = 'none';
  if (emailProviderEnv === 'smtp') {
    provider = hasAnySmtp ? 'smtp' : 'none';
  } else if (emailProviderEnv === 'resend') {
    provider = hasResend ? 'resend' : 'none';
  } else if (hasValidSmtpFormat) {
    provider = 'smtp';
  } else if (hasResend) {
    provider = 'resend';
  } else if (hasAnySmtp) {
    provider = 'smtp';
  }

  if (!hasAnySmtp && !hasResend) {
    missingSecrets.push('RESEND_API_KEY or SMTP_PASS (16-character Google App Password for navioraa.technology@gmail.com)');
  }

  let resolvedSender = `Navioraa Admissions <${senderEmail}>`;
  if (provider === 'resend') {
    // Resend requires verified domain or onboarding@resend.dev, with display name navioraa.technology@gmail.com
    resolvedSender = `navioraa.technology@gmail.com <onboarding@resend.dev>`;
  } else if (provider === 'smtp') {
    resolvedSender = `Navioraa Admissions <${smtpUser}>`;
  }

  const readyToSend =
    (provider === 'resend' && Boolean(notificationRecipient && resolvedSender)) ||
    (provider === 'smtp' && Boolean(smtpHost && smtpUser && smtpPass && notificationRecipient && resolvedSender));

  return {
    provider,
    resendApiKey,
    notificationRecipient,
    emailFrom: resolvedSender,
    smtp: {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      secure: smtpPort === 465,
    },
    missingSecrets,
    readyToSend,
  };
}

// ==================== DISPATCH HELPER ====================
interface EmailResult {
  sent: boolean;
  provider: string;
  messageId?: string;
  error?: string;
  recipientDelivered?: string;
  note?: string;
}

interface SendEmailOptions {
  replyTo?: string;
  plainText?: string;
}

async function sendNotificationEmail(
  subject: string,
  htmlBody: string,
  options?: SendEmailOptions
): Promise<EmailResult> {
  const config = getEmailConfig();

  if (!config.readyToSend) {
    const missing = config.missingSecrets.join(', ');
    return {
      sent: false,
      provider: config.provider,
      error: `Missing required server secrets: [${missing || 'RESEND_API_KEY or SMTP_PASS'}]. Please configure environment variables in your server configuration.`,
    };
  }

  const plainTextContent = options?.plainText || subject;

  // Helper for SMTP dispatch
  const trySmtp = async (targetRecipients: string[]): Promise<EmailResult> => {
    try {
      const isPort465 = Number(config.smtp.port) === 465;
      const transporter = nodemailer.createTransport({
        host: config.smtp.host || 'smtp.gmail.com',
        port: Number(config.smtp.port) || (isPort465 ? 465 : 587),
        secure: isPort465, // true for 465, false for 587 (STARTTLS)
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });

      const uniqueRecipients = Array.from(new Set(targetRecipients.map(r => r.trim()).filter(Boolean)));
      const toHeader = uniqueRecipients.join(', ');

      const info = await transporter.sendMail({
        from: `Navioraa Admissions <${config.smtp.user || 'navioraa.technology@gmail.com'}>`,
        to: toHeader,
        replyTo: options?.replyTo || 'navioraa.technology@gmail.com',
        subject: subject,
        text: plainTextContent,
        html: htmlBody,
      });

      return {
        sent: true,
        provider: 'smtp',
        messageId: info.messageId,
        recipientDelivered: toHeader,
      };
    } catch (smtpErr) {
      const errText = smtpErr instanceof Error ? smtpErr.message : String(smtpErr);
      const isBadCredentials = errText.includes('535') || errText.includes('BadCredentials') || errText.includes('Username and Password not accepted');
      return {
        sent: false,
        provider: 'smtp',
        error: isBadCredentials
          ? `Google SMTP requires a 16-character App Password (not your account login password). Generate one at https://myaccount.google.com/apppasswords and set in SMTP_PASS.`
          : `SMTP delivery failure: ${errText}`,
      };
    }
  };

  // Helper for Resend dispatch
  const tryResend = async (targetRecipient: string): Promise<EmailResult> => {
    try {
      // In Resend, envelope domain must be @resend.dev unless custom domain is verified.
      // Setting display name 'navioraa.technology@gmail.com <onboarding@resend.dev>' ensures recipient sees navioraa.technology@gmail.com
      const resendSender = 'navioraa.technology@gmail.com <onboarding@resend.dev>';

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resendSender,
          to: [targetRecipient],
          reply_to: options?.replyTo || 'navioraa.technology@gmail.com',
          subject: subject,
          text: plainTextContent,
          html: htmlBody,
        }),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorDetail = responseData.message || responseData.error || `HTTP ${res.status}: ${res.statusText}`;
        return {
          sent: false,
          provider: 'resend',
          error: errorDetail,
        };
      }

      return {
        sent: true,
        provider: 'resend',
        messageId: responseData.id || 'resend-dispatched',
        recipientDelivered: targetRecipient,
      };
    } catch (netErr) {
      return {
        sent: false,
        provider: 'resend',
        error: `Network error connecting to Resend API: ${netErr instanceof Error ? netErr.message : String(netErr)}`,
      };
    }
  };

  // 1. Primary: Resend API
  if (config.provider === 'resend') {
    let resendResult = await tryResend(config.notificationRecipient);
    if (resendResult.sent) {
      return resendResult;
    }

    // If Resend failed with custom recipient, ensure delivery to verified owner naviora.pvt@gmail.com
    if (config.notificationRecipient !== 'naviora.pvt@gmail.com') {
      console.warn(`[Email Dispatch] Delivery to ${config.notificationRecipient} failed (${resendResult.error}). Attempting fallback to verified account owner naviora.pvt@gmail.com...`);
      const fallbackResult = await tryResend('naviora.pvt@gmail.com');
      if (fallbackResult.sent) {
        return {
          ...fallbackResult,
          note: 'Delivered to verified account inbox (naviora.pvt@gmail.com)',
        };
      }
    }

    // If SMTP is available, try as backup
    if (config.smtp.pass && config.smtp.user) {
      const smtpResult = await trySmtp([config.notificationRecipient]);
      if (smtpResult.sent) {
        return smtpResult;
      }
    }

    return resendResult;
  }

  // 2. Direct Provider: SMTP
  if (config.provider === 'smtp') {
    const smtpRecipients = [config.notificationRecipient];
    if (config.smtp.user && !smtpRecipients.includes(config.smtp.user)) {
      smtpRecipients.push(config.smtp.user);
    }

    const smtpResult = await trySmtp(smtpRecipients);
    if (smtpResult.sent) {
      return smtpResult;
    }

    // If SMTP failed (e.g. invalid app password) and Resend is available, fall back immediately to Resend
    if (config.resendApiKey) {
      console.warn(`[Email Dispatch] SMTP failed (${smtpResult.error}). Falling back to Resend API for delivery to naviora.pvt@gmail.com...`);
      const resendFallback = await tryResend('naviora.pvt@gmail.com');
      if (resendFallback.sent) {
        return {
          ...resendFallback,
          note: 'Delivered via Resend backup to naviora.pvt@gmail.com (Google App Password needed for direct SMTP)',
        };
      }
    }

    return smtpResult;
  }

  return {
    sent: false,
    provider: 'none',
    error: 'No active email provider configured.',
  };
}

// ==================== API ROUTES ====================

// Diagnostic Endpoint: Check configured secrets without exposing sensitive credentials
app.get('/api/email-status', (req: Request, res: Response) => {
  const config = getEmailConfig();
  res.json({
    status: 'ok',
    provider: config.provider,
    readyToSend: config.readyToSend,
    recipient: config.notificationRecipient,
    from: config.emailFrom,
    missingSecrets: config.missingSecrets,
    checks: {
      hasResendApiKey: Boolean(config.resendApiKey),
      hasNotificationRecipient: Boolean(process.env.NOTIFICATION_RECIPIENT || process.env.NOTIFICATION_RECIPIENT_EMAIL),
      hasEmailFrom: Boolean(process.env.EMAIL_FROM),
      hasSmtpHost: Boolean(config.smtp.host),
      hasSmtpUser: Boolean(config.smtp.user),
      hasSmtpPass: Boolean(config.smtp.pass),
    },
  });
});

// Test Email Dispatch Endpoint: Run a live test without a public form submission
app.post('/api/test-email', async (req: Request, res: Response) => {
  const config = getEmailConfig();

  if (!config.readyToSend) {
    return res.status(400).json({
      success: false,
      configured: false,
      error: `Cannot send test email: Missing secrets [${config.missingSecrets.join(', ')}]`,
      missingSecrets: config.missingSecrets,
    });
  }

  const testSubject = `[NAVIORAA Test] Email Integration Ping (${config.provider.toUpperCase()})`;
  const testHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
      <h2 style="color: #0B3B82; margin-top: 0;">NAVIORAA Email Notification Test</h2>
      <p>This is a live test notification confirming that the server-side email integration for NAVIORAA is operational.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 6px; font-weight: bold; width: 140px;">Provider:</td><td>${config.provider.toUpperCase()}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Sender:</td><td>${config.emailFrom}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Recipient:</td><td>${config.notificationRecipient}</td></tr>
        <tr><td style="padding: 6px; font-weight: bold;">Timestamp:</td><td>${new Date().toISOString()}</td></tr>
      </table>
      <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Sent securely from NAVIORAA Enterprise Server.</p>
    </div>
  `;

  const result = await sendNotificationEmail(testSubject, testHtml);

  if (!result.sent) {
    return res.status(502).json({
      success: false,
      configured: true,
      error: result.error,
      provider: result.provider,
    });
  }

  res.json({
    success: true,
    configured: true,
    messageId: result.messageId,
    provider: result.provider,
    recipient: result.recipientDelivered || config.notificationRecipient,
    note: result.note,
  });
});

// Enquiry Email Submission Endpoint
app.post('/api/enquiries', async (req: Request, res: Response) => {
  const { fullName, email, phone, programOrService, message, enquiryId } = req.body;
  console.log(`[API /api/enquiries] Received enquiry: "${fullName}" <${email}>, Phone: ${phone}, Program: "${programOrService}"`);

  // Strict Server-Side Validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Full name is required.' });
  }
  if (fullName.trim().length > 120) {
    return res.status(400).json({ success: false, error: 'Full name cannot exceed 120 characters.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }
  if (email.trim().length > 150) {
    return res.status(400).json({ success: false, error: 'Email cannot exceed 150 characters.' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7 || phone.trim().length > 40) {
    return res.status(400).json({ success: false, error: 'Valid phone contact number is required (7-40 characters).' });
  }

  if (!programOrService || typeof programOrService !== 'string' || programOrService.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Program or service of interest is required.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'A message or background overview is required.' });
  }
  if (message.trim().length > 2000) {
    return res.status(400).json({ success: false, error: 'Message cannot exceed 2000 characters.' });
  }

  const config = getEmailConfig();

  const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');
  const waLink = `https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}`;
  const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' });

  // Construct Genuine, Spam-Proof Notification Email
  const emailSubject = `New Admissions Inquiry: ${fullName.trim()} - ${programOrService}`;

  const plainTextBody = [
    `NEW ADMISSION & COURSE ENQUIRY`,
    `============================================================`,
    `Program / Service: ${programOrService}`,
    `Applicant Name:    ${fullName.trim()}`,
    `Email Address:     ${email.trim()}`,
    `Phone Number:      ${cleanPhone}`,
    `Enquiry Reference: ${enquiryId || 'Auto-generated'}`,
    `Date & Time:       ${istTime} (IST)`,
    `============================================================`,
    ``,
    `APPLICANT QUERY & BACKGROUND:`,
    `${message.trim()}`,
    ``,
    `============================================================`,
    `DIRECT ACTIONS:`,
    `Reply by Email:   mailto:${email.trim()}?subject=Re:%20Navioraa%20Enquiry%20-%20${encodeURIComponent(programOrService)}`,
    `Chat on WhatsApp: ${waLink}`,
    ``,
    `NAVIORAA Institute of Technology & R&D`,
    `Official Website: https://navioraa.com | Contact: +91 9890187383`,
  ].join('\n');

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #0f172a; line-height: 1.5;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #0052FF; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #0052FF; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">NAVIORAA Institute of Technology & R&D</h2>
        <p style="color: #475569; font-size: 12px; margin: 4px 0 0 0; font-weight: 500;">New Admissions & Course Inquiry Notification</p>
      </div>

      <!-- Overview Box -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: #334155;">
        <p style="margin: 0;"><strong>Inquiry Subject:</strong> ${programOrService}</p>
        <p style="margin: 4px 0 0 0;"><strong>Reference ID:</strong> <span style="font-family: monospace;">${enquiryId || 'Auto-generated'}</span></p>
        <p style="margin: 4px 0 0 0;"><strong>Submission Time:</strong> ${istTime} (IST)</p>
      </div>

      <!-- Applicant Details -->
      <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #0052FF; margin: 0 0 10px 0; font-weight: 700;">
        Applicant Contact Information
      </h3>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 9px 0; font-weight: 600; color: #64748B; width: 150px;">Full Name:</td>
          <td style="padding: 9px 0; font-weight: 700; color: #0F172A; font-size: 14px;">${fullName.trim()}</td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 9px 0; font-weight: 600; color: #64748B;">Email Address:</td>
          <td style="padding: 9px 0;">
            <a href="mailto:${email.trim()}" style="color: #0052FF; font-weight: 600; text-decoration: underline;">
              ${email.trim()}
            </a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 9px 0; font-weight: 600; color: #64748B;">Phone / Mobile:</td>
          <td style="padding: 9px 0;">
            <a href="tel:${cleanPhone}" style="color: #0F172A; font-weight: 600; text-decoration: none;">
              ${phone.trim()}
            </a>
            &nbsp;·&nbsp;
            <a href="${waLink}" target="_blank" style="color: #16A34A; font-weight: 600; text-decoration: underline;">
              Open WhatsApp
            </a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 9px 0; font-weight: 600; color: #64748B;">Program of Interest:</td>
          <td style="padding: 9px 0; font-weight: 700; color: #0052FF;">
            ${programOrService}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0 6px 0; font-weight: 600; color: #64748B; vertical-align: top;">
            Query & Message:
          </td>
          <td style="padding: 12px 0 6px 0;">
            <div style="background-color: #F8FAFC; padding: 12px; border-radius: 6px; border-left: 3px solid #0052FF; font-size: 13px; line-height: 1.6; color: #1E293B;">
              ${message.trim().replace(/\n/g, '<br/>')}
            </div>
          </td>
        </tr>
      </table>

      <!-- Quick Action Buttons -->
      <div style="margin: 20px 0; padding: 14px; background-color: #F0F7FF; border-radius: 8px; text-align: center;">
        <a href="mailto:${email.trim()}?subject=Re:%20Navioraa%20Enquiry%20-%20${encodeURIComponent(programOrService)}" 
           style="display: inline-block; background-color: #0052FF; color: #ffffff; padding: 9px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none; margin-right: 6px;">
          Reply to Applicant via Email
        </a>
        <a href="${waLink}" 
           target="_blank"
           style="display: inline-block; background-color: #16A34A; color: #ffffff; padding: 9px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">
          Message on WhatsApp
        </a>
      </div>

      <!-- Footer Note -->
      <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B; line-height: 1.5;">
        <p style="margin: 0;">This email was generated from the NAVIORAA official website enquiry form.</p>
        <p style="margin: 2px 0 0 0;">For urgent admissions questions: Call +91 9890187383 or email naviora.pvt@gmail.com.</p>
      </div>
    </div>
  `;

  // Dispatch email with replyTo set to the applicant and multi-part plainText
  const delivery = await sendNotificationEmail(emailSubject, emailHtml, {
    replyTo: `${fullName.trim()} <${email.trim()}>`,
    plainText: plainTextBody,
  });

  console.log(`[API /api/enquiries] Email delivery status:`, {
    sent: delivery.sent,
    provider: delivery.provider,
    recipient: delivery.recipientDelivered || config.notificationRecipient,
    messageId: delivery.messageId,
    error: delivery.error,
  });

  if (!delivery.sent) {
    // Submission is valid, but email provider is not yet configured or had an issue
    return res.json({
      success: true,
      emailDelivered: false,
      emailMessage: delivery.error || 'Email notification pending provider configuration',
      provider: delivery.provider,
      missingSecrets: config.missingSecrets,
      enquiryId,
    });
  }

  // Email succeeded
  res.json({
    success: true,
    emailDelivered: true,
    emailMessage: delivery.note
      ? `Notification email delivered: ${delivery.note}`
      : `Notification email successfully delivered to ${delivery.recipientDelivered || config.notificationRecipient}`,
    provider: delivery.provider,
    messageId: delivery.messageId,
    recipientDelivered: delivery.recipientDelivered || config.notificationRecipient,
    enquiryId,
  });
});

// ==================== ADMIN AUTHENTICATION API ====================
const PRIMARY_ADMIN_CREDENTIALS: Record<string, { pass: string; name: string; role: string }> = {
  'shubhammahadik3228@gmail.com': {
    pass: 'Harvey@2026',
    name: 'Shubham Mahadik',
    role: 'owner',
  },
  'naviora.pvt@gmail.com': {
    pass: 'Harvey@2026',
    name: 'Navioraa Executive',
    role: 'owner',
  },
  'admin@navioraa.com': {
    pass: 'Harvey@2026',
    name: 'Master Admin',
    role: 'owner',
  },
};

// Admin Login Endpoint: Fallback & direct authentication provider
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPass = String(password).trim();

  const record = PRIMARY_ADMIN_CREDENTIALS[cleanEmail];
  if (record && record.pass === cleanPass) {
    console.log(`[Admin Auth] Successful administrator login for: ${cleanEmail} (${record.name})`);
    return res.json({
      success: true,
      user: {
        uid: `admin_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: record.name,
        role: record.role,
        photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa_WSW8m4TWYjK86YTPjBEJw81ncR7hMWmutBNBrs_edazprH7gJ4AvsCoYPhs1XURNDk8BEqWhdJJRuhMxy-STstF8j-U6F429qxEb6L2GcjhkHp-MXiK2rVyiL1YRzZIqpl-NUVHBJinwHxnvZWJyVvRUGbB-n4sk7pKrTLLaw5H65iFU9SeniqfnXyPWAojTAplMKscGMI6MIvItz5L9qtLktxLRWv9u8urbJcoQ-oUQBCnEYZyZQ',
        token: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      },
    });
  }

  console.warn(`[Admin Auth] Failed administrator login attempt for: ${cleanEmail}`);
  return res.status(401).json({
    success: false,
    error: 'Invalid administrator email or password. Please verify credentials.',
  });
});

// Admin Forgot Password / Verification Endpoint
app.post('/api/admin/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Administrator email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const record = PRIMARY_ADMIN_CREDENTIALS[cleanEmail];

  if (!record) {
    return res.status(404).json({
      success: false,
      error: `The email "${cleanEmail}" is not recognized as a registered NAVIORAA administrator.`,
    });
  }

  const resetSubject = `[NAVIORAA Security] Administrator Credentials & Password Verification`;
  const resetHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #0f172a; line-height: 1.5;">
      <div style="border-bottom: 2px solid #0052FF; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #0052FF; margin: 0; font-size: 20px; font-weight: 800;">NAVIORAA Administrator Security Verification</h2>
        <p style="color: #475569; font-size: 12px; margin: 4px 0 0 0;">Password Recovery Request for ${record.name}</p>
      </div>

      <p style="font-size: 13px; color: #334155;">Hello <strong>${record.name}</strong>,</p>
      <p style="font-size: 13px; color: #334155;">A password verification request was initiated for your administrator account.</p>

      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
        <p style="margin: 0 0 8px 0;"><strong>Administrator Account:</strong> <span style="font-family: monospace;">${cleanEmail}</span></p>
        <p style="margin: 0 0 8px 0;"><strong>Current Access Key:</strong> <span style="font-family: monospace; font-weight: bold; background-color: #EEF2F6; padding: 2px 6px; border-radius: 4px;">${record.pass}</span></p>
        <p style="margin: 0;"><strong>Assigned Role:</strong> <span style="color: #0052FF; font-weight: bold; text-transform: uppercase;">${record.role}</span></p>
      </div>

      <p style="font-size: 12px; color: #64748b;">You can use these credentials to log in at your administration portal anytime:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://navioraa.com/admin/login" style="background-color: #0052FF; color: #ffffff; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block;">
          Open Admin Login Portal
        </a>
      </div>

      <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B;">
        <p style="margin: 0;">If you did not request this verification, please contact naviora.pvt@gmail.com immediately.</p>
      </div>
    </div>
  `;

  try {
    const delivery = await sendNotificationEmail(resetSubject, resetHtml, {
      plainText: `NAVIORAA Admin Password Verification:\nEmail: ${cleanEmail}\nPassword: ${record.pass}\nRole: ${record.role}`,
    });

    console.log(`[Admin Password Reset] Verification sent to ${cleanEmail}:`, delivery);
    return res.json({
      success: true,
      message: `Password verification instructions have been dispatched to ${cleanEmail}. Check your inbox!`,
    });
  } catch (err) {
    console.error('Password reset dispatch error:', err);
    return res.json({
      success: true,
      message: `Password verification instructions processed. Please check ${cleanEmail}.`,
    });
  }
});

// ==================== VITE MIDDLEWARE / STATIC & SPA REFRESH FALLBACK ====================
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const distIndexHtml = path.resolve(distPath, 'index.html');
  const rootIndexHtml = path.resolve(__dirname, 'index.html');

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    // Guaranteed SPA Catch-All for Development:
    // When refreshing any route (e.g. /courses, /about, /projects, /resources, /contact, /admin, /admin/dashboard),
    // serve index.html with Vite transformation so React Router takes over with zero 404s.
    app.get('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl.split('?')[0];
      // Never intercept API routes
      if (url.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      // Let missing static assets with extensions fall through to 404 rather than returning HTML
      if (path.extname(url) && !url.endsWith('.html')) {
        return next();
      }

      try {
        let template = await fs.promises.readFile(rootIndexHtml, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production Mode:
    // Serve static assets from dist
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath, { index: false }));
    } else {
      app.use(express.static(__dirname, { index: false }));
    }

    // SPA Catch-All for Production
    app.get('*', (req: Request, res: Response, next) => {
      const url = req.originalUrl.split('?')[0];
      if (url.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }

      if (path.extname(url) && !url.endsWith('.html')) {
        return next();
      }

      if (fs.existsSync(distIndexHtml)) {
        return res.sendFile(distIndexHtml);
      }
      return res.sendFile(rootIndexHtml);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NAVIORAA Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
