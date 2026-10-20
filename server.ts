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

  const missingSecrets: string[] = [];

  const hasSmtp = Boolean(smtpHost && smtpUser && smtpPass);
  const hasResend = Boolean(resendApiKey);

  let provider: 'resend' | 'smtp' | 'none' = 'none';
  if (hasSmtp) {
    provider = 'smtp';
  } else if (hasResend) {
    provider = 'resend';
  }

  if (!hasSmtp && !hasResend) {
    missingSecrets.push('SMTP_PASS (Google App Password for naviora.pvt@gmail.com) OR RESEND_API_KEY');
  }

  let resolvedSender = emailFrom;
  if (provider === 'resend') {
    // Resend requires a verified domain or its official sandbox sender onboarding@resend.dev
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
}

interface SendEmailOptions {
  replyTo?: string;
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
      error: `Missing required server secrets: [${missing || 'SMTP_PASS / RESEND_API_KEY'}]. Please configure environment variables in your server configuration.`,
    };
  }

  // 1. Primary / Configured Provider: Resend API
  if (config.provider === 'resend') {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.emailFrom,
          to: [config.notificationRecipient],
          reply_to: options?.replyTo || 'naviora.pvt@gmail.com',
          subject: subject,
          html: htmlBody,
        }),
      });

      const responseData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorDetail = responseData.message || responseData.error || `HTTP ${res.status}: ${res.statusText}`;
        return {
          sent: false,
          provider: 'resend',
          error: `Resend API rejected email dispatch: ${errorDetail}`,
        };
      }

      return {
        sent: true,
        provider: 'resend',
        messageId: responseData.id || 'resend-dispatched',
      };
    } catch (netErr) {
      return {
        sent: false,
        provider: 'resend',
        error: `Network error connecting to Resend API: ${netErr instanceof Error ? netErr.message : String(netErr)}`,
      };
    }
  }

  // 2. Direct Provider: SMTP (Gmail SMTP for naviora.pvt@gmail.com)
  if (config.provider === 'smtp') {
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

      const info = await transporter.sendMail({
        from: config.emailFrom,
        to: config.notificationRecipient,
        replyTo: options?.replyTo || config.emailFrom,
        subject: subject,
        html: htmlBody,
      });

      return {
        sent: true,
        provider: 'smtp',
        messageId: info.messageId,
      };
    } catch (smtpErr) {
      return {
        sent: false,
        provider: 'smtp',
        error: `SMTP delivery failure from ${config.smtp.user} to ${config.notificationRecipient}: ${smtpErr instanceof Error ? smtpErr.message : String(smtpErr)}`,
      };
    }
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
    recipient: config.notificationRecipient,
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

  // Construct Notification Email HTML with all filled details
  const emailSubject = `[New Navioraa Enquiry] ${programOrService} — ${fullName.trim()}`;
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #0f172a;">
      <!-- Header -->
      <div style="border-bottom: 2px solid #0B3B82; padding-bottom: 16px; margin-bottom: 20px;">
        <table style="width: 100%;">
          <tr>
            <td>
              <h2 style="color: #0B3B82; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">NAVIORAA Institute & Tech Labs</h2>
              <p style="color: #DA271F; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 4px 0 0 0;">New Website Admissions & Project Enquiry</p>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <span style="display: inline-block; background-color: #EBF2FF; color: #0B3B82; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
                Admissions Alert
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Routing Info Box -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; font-size: 12px; color: #475569;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 80px; font-weight: 600; color: #64748B;">From:</td>
            <td style="font-weight: 700; color: #0F172A;">naviora.pvt@gmail.com</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #64748B; padding-top: 4px;">To:</td>
            <td style="font-weight: 700; color: #0B3B82; padding-top: 4px;">navioraa.technology@gmail.com</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #64748B; padding-top: 4px;">Enquiry ID:</td>
            <td style="font-family: monospace; color: #334155; padding-top: 4px;">${enquiryId || 'Auto-generated'}</td>
          </tr>
        </table>
      </div>

      <!-- Complete Filled Contact Details Table -->
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #0B3B82; margin: 0 0 12px 0; font-weight: 700;">
        Applicant Information
      </h3>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 10px 0; font-weight: 600; color: #64748B; width: 170px;">Full Name:</td>
          <td style="padding: 10px 0; font-weight: 700; font-size: 15px; color: #0F172A;">${fullName.trim()}</td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 10px 0; font-weight: 600; color: #64748B;">Email Address:</td>
          <td style="padding: 10px 0;">
            <a href="mailto:${email.trim()}" style="color: #0B3B82; font-weight: 600; text-decoration: underline;">
              ${email.trim()}
            </a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 10px 0; font-weight: 600; color: #64748B;">Phone / WhatsApp:</td>
          <td style="padding: 10px 0;">
            <a href="tel:${cleanPhone}" style="color: #0B3B82; font-weight: 600; text-decoration: none;">
              ${phone.trim()}
            </a>
            &nbsp;·&nbsp;
            <a href="${waLink}" target="_blank" style="color: #16A34A; font-weight: 600; text-decoration: underline;">
              Chat on WhatsApp
            </a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #F1F5F9;">
          <td style="padding: 10px 0; font-weight: 600; color: #64748B;">Program / Service:</td>
          <td style="padding: 10px 0; font-weight: 700; color: #0B3B82;">
            ${programOrService}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0 6px 0; font-weight: 600; color: #64748B; vertical-align: top;">
            Background & Query:
          </td>
          <td style="padding: 12px 0 6px 0;">
            <div style="background-color: #F8FAFC; padding: 14px; border-radius: 8px; border-left: 4px solid #0B3B82; font-size: 13px; line-height: 1.6; color: #1E293B;">
              ${message.trim().replace(/\n/g, '<br/>')}
            </div>
          </td>
        </tr>
      </table>

      <!-- Quick Action Buttons -->
      <div style="margin: 24px 0; padding: 16px; background-color: #EFF6FF; border-radius: 12px; text-align: center;">
        <p style="font-size: 12px; font-weight: 600; color: #1E40AF; margin: 0 0 12px 0;">
          Direct Applicant Actions
        </p>
        <div style="display: inline-block;">
          <a href="mailto:${email.trim()}?subject=Re:%20Navioraa%20Enquiry%20-%20${encodeURIComponent(programOrService)}" 
             style="display: inline-block; background-color: #0B3B82; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; margin-right: 8px;">
            Reply to Applicant via Email
          </a>
          <a href="${waLink}" 
             target="_blank"
             style="display: inline-block; background-color: #16A34A; color: #ffffff; padding: 10px 18px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none;">
            Message on WhatsApp
          </a>
        </div>
      </div>

      <!-- Footer Timestamp & Routing Metadata -->
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #64748B; line-height: 1.6;">
        <p style="margin: 0;"><strong>Submission Timestamp:</strong> ${istTime} (IST)</p>
        <p style="margin: 2px 0 0 0;"><strong>Sender Account:</strong> naviora.pvt@gmail.com</p>
        <p style="margin: 2px 0 0 0;"><strong>Recipient Inbox:</strong> navioraa.technology@gmail.com</p>
        <p style="margin: 6px 0 0 0; color: #94A3B8;">This email was automatically generated and dispatched upon submission of the NAVIORAA enquiry form.</p>
      </div>
    </div>
  `;

  // Dispatch email with replyTo set to the applicant
  const delivery = await sendNotificationEmail(emailSubject, emailHtml, {
    replyTo: `${fullName.trim()} <${email.trim()}>`,
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
    emailMessage: `Notification email successfully delivered to ${config.notificationRecipient}`,
    provider: delivery.provider,
    messageId: delivery.messageId,
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
