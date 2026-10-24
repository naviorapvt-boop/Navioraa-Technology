import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// ==================== ENVIRONMENT CONFIGURATION ====================
function getEmailConfig() {
  const resendApiKey = process.env.RESEND_API_KEY?.trim() || '';
  
  // Destination inbox: navioraa.technology@gmail.com
  const envRecipient =
    process.env.NOTIFICATION_RECIPIENT?.trim() ||
    process.env.NOTIFICATION_RECIPIENT_EMAIL?.trim();

  const notificationRecipient =
    envRecipient && envRecipient !== 'naviora.pvt@gmail.com'
      ? envRecipient
      : 'navioraa.technology@gmail.com';

  // Sender address: naviora.pvt@gmail.com
  const emailFrom =
    process.env.EMAIL_FROM?.trim() ||
    'NAVIORAA Admissions <naviora.pvt@gmail.com>';

  const smtpUser =
    process.env.SMTP_USER?.trim() ||
    process.env.GMAIL_USER?.trim() ||
    'naviora.pvt@gmail.com';

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
  const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass);
  const hasResend = Boolean(resendApiKey);

  // User requirement: Use RESEND_API_KEY as primary email provider.
  // Use SMTP only if explicitly configured via EMAIL_PROVIDER=smtp or if SMTP is available and Resend is not.
  let provider: 'resend' | 'smtp' | 'none' = 'none';
  if (emailProviderEnv === 'smtp') {
    provider = hasSmtp ? 'smtp' : 'none';
  } else if (hasResend) {
    provider = 'resend';
  } else if (hasSmtp) {
    provider = 'smtp';
  }

  if (!hasSmtp && !hasResend) {
    missingSecrets.push('RESEND_API_KEY or SMTP_PASS (Google App Password for naviora.pvt@gmail.com)');
  }

  let resolvedSender = emailFrom;
  if (provider === 'resend') {
    // Resend requires verified domain or its official testing sender onboarding@resend.dev
    if (resolvedSender.toLowerCase().includes('@gmail.com') || resolvedSender.toLowerCase().includes('@yahoo.com')) {
      resolvedSender = 'NAVIORAA Admissions <onboarding@resend.dev>';
    }
  } else if (provider === 'smtp') {
    if (!resolvedSender.includes('<')) {
      resolvedSender = `NAVIORAA Admissions <${smtpUser}>`;
    }
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

  // Helper for SMTP dispatch (Delivers genuine, non-spam emails directly via Google Mail infrastructure)
  const trySmtp = async (targetRecipients: string[]): Promise<EmailResult> => {
    try {
      const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });

      const uniqueRecipients = Array.from(new Set(targetRecipients.map(r => r.trim()).filter(Boolean)));
      const toHeader = uniqueRecipients.join(', ');

      const info = await transporter.sendMail({
        from: `NAVIORAA Admissions <${config.smtp.user}>`,
        to: toHeader,
        replyTo: options?.replyTo || config.smtp.user,
        subject: subject,
        text: plainTextContent,
        html: htmlBody,
        headers: {
          'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          'Auto-Submitted': 'auto-generated',
          'X-Auto-Response-Suppress': 'OOF, AutoReply',
          'Precedence': 'bulk',
        },
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
          ? `Invalid Google SMTP credentials for ${config.smtp.user}. Note: Google requires a 16-character App Password (not your personal account password). Generate one at https://myaccount.google.com/apppasswords and set it in SMTP_PASS.`
          : `SMTP delivery failure: ${errText}`,
      };
    }
  };

  // Helper for Resend dispatch
  const tryResend = async (targetRecipient: string, isFallback: boolean = false): Promise<EmailResult> => {
    try {
      const bodyPayload = isFallback
        ? `
          <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; color: #1E40AF; line-height: 1.5;">
            <strong>Admissions Notice:</strong> Routed to verified admin account (<code>naviora.pvt@gmail.com</code>). All applicant contact details and query notes are preserved below.<br/>
          </div>
          ${htmlBody}
        `
        : htmlBody;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.emailFrom,
          to: [targetRecipient],
          reply_to: options?.replyTo || 'naviora.pvt@gmail.com',
          subject: subject,
          text: plainTextContent,
          html: bodyPayload,
          headers: {
            'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          },
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
        note: isFallback ? 'Delivered via Resend to account inbox (naviora.pvt@gmail.com)' : undefined,
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
    // Attempt dispatch to designated recipient: navioraa.technology@gmail.com
    let resendResult = await tryResend(config.notificationRecipient);
    if (resendResult.sent) {
      return resendResult;
    }

    // If failed, check if SMTP is available as fallback for 100% genuine delivery
    if (config.smtp.pass && config.smtp.user) {
      const smtpRecipients = [config.notificationRecipient];
      if (config.smtp.user && !smtpRecipients.includes(config.smtp.user)) {
        smtpRecipients.push(config.smtp.user);
      }
      const smtpResult = await trySmtp(smtpRecipients);
      if (smtpResult.sent) {
        return smtpResult;
      }
    }

    // Safe fallback: Deliver via Resend to the verified account owner address (naviora.pvt@gmail.com)
    // to ensure no applicant enquiry is ever lost
    if (config.notificationRecipient !== 'naviora.pvt@gmail.com') {
      const fallbackResult = await tryResend('naviora.pvt@gmail.com', true);
      if (fallbackResult.sent) {
        return fallbackResult;
      }
    }

    return resendResult;
  }

  // 2. Direct Provider: SMTP (delivers to both inboxes for total reliability)
  if (config.provider === 'smtp') {
    const smtpRecipients = [config.notificationRecipient];
    if (config.smtp.user && !smtpRecipients.includes(config.smtp.user)) {
      smtpRecipients.push(config.smtp.user);
    }

    const smtpResult = await trySmtp(smtpRecipients);
    if (smtpResult.sent) {
      return smtpResult;
    }

    // If SMTP failed (e.g. invalid app password) and Resend is available, try Resend as fallback
    if (config.resendApiKey) {
      const resendFallback = await tryResend('naviora.pvt@gmail.com', true);
      if (resendFallback.sent) {
        return resendFallback;
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
  const emailSubject = `Course Enquiry: ${programOrService} - ${fullName.trim()}`;

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

// ==================== VITE MIDDLEWARE / STATIC ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NAVIORAA Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
