import nodemailer from 'nodemailer';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

/**
 * Retrieve effective SMTP settings from the database (site_settings),
 * with fallback to environment variables.
 */
export const getEffectiveSmtpConfig = async (): Promise<SmtpConfig | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM site_settings WHERE id = 1');
    const s: any = rows.length > 0 ? rows[0] : {};

    const user = s.smtp_user?.trim() || process.env.SMTP_USER?.trim() || process.env.EMAIL_USER?.trim() || '';
    const rawPass = s.smtp_pass?.trim() || process.env.SMTP_PASS?.trim() || process.env.EMAIL_PASS?.trim() || '';

    // If neither user nor pass is configured anywhere, we cannot send mail
    if (!user || !rawPass) {
      return null;
    }

    const host = s.smtp_host?.trim() || process.env.SMTP_HOST?.trim() || (user.includes('@gmail.com') ? 'smtp.gmail.com' : 'smtp.gmail.com');
    // If Gmail, remove spaces from 16-char App Password (e.g. 'iypb elwo rbom elbu' -> 'iypbelworbomelbu')
    const pass = (user.includes('@gmail.com') || host.includes('gmail')) ? rawPass.replace(/\s+/g, '') : rawPass;
    const port = Number(s.smtp_port) || Number(process.env.SMTP_PORT) || 587;
    const secure = s.smtp_secure !== undefined ? Boolean(s.smtp_secure) : (port === 465 || process.env.SMTP_SECURE === 'true');
    const from = s.smtp_from_email?.trim() || process.env.SMTP_FROM?.trim() || user;
    const to = s.notification_email?.trim() || process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim() || s.contact_email?.trim() || user;

    return {
      host,
      port,
      secure,
      user,
      pass,
      from,
      to,
    };
  } catch (error) {
    console.error('Error getting SMTP config:', error);
    return null;
  }
};

/**
 * Creates a nodemailer Transporter based on the provided SMTP config.
 */
export const createSmtpTransporter = (config: SmtpConfig) => {
  const isGmail = config.host === 'smtp.gmail.com' || (!config.host && config.user.includes('@gmail.com'));

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure, // true for 465, false for 587 / other
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Sends a notification email to the admin when a client submits the Start Project / Contact form.
 */
export const sendProjectInquiryEmail = async ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => {
  const config = await getEffectiveSmtpConfig();
  if (!config) {
    console.warn('⚠️ SMTP credentials not configured (in DB or .env). Skipping email dispatch.');
    return { success: false, reason: 'SMTP not configured' };
  }

  const transporter = createSmtpTransporter(config);
  const now = new Date().toLocaleString();

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f1117; color: #ffffff; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #161822; border-radius: 16px; border: 1px solid #282c3f; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0b4cfc 0%, #002ba8 100%); padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; }
          .header p { margin: 8px 0 0; font-size: 14px; color: rgba(255,255,255,0.85); }
          .content { padding: 32px 24px; }
          .meta-card { background: #1e2230; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; border: 1px solid #2e344a; }
          .field { margin-bottom: 12px; }
          .field:last-child { margin-bottom: 0; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #8f9bb3; font-weight: 700; margin-bottom: 4px; }
          .value { font-size: 15px; color: #ffffff; font-weight: 600; }
          .value a { color: #5b8cff; text-decoration: none; }
          .message-card { background: #1e2230; border-radius: 12px; padding: 20px; border-left: 4px solid #0b4cfc; }
          .message-text { font-size: 15px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; word-break: break-word; }
          .action-btn { display: inline-block; background: #0b4cfc; color: #ffffff !important; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin-top: 24px; text-align: center; }
          .footer { padding: 20px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #282c3f; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Project Inquiry</h1>
            <p>A client has reached out through your portfolio website</p>
          </div>
          <div class="content">
            <div class="meta-card">
              <div class="field">
                <div class="label">Client Name</div>
                <div class="value">${name}</div>
              </div>
              <div class="field" style="margin-top: 14px;">
                <div class="label">Client Email</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field" style="margin-top: 14px;">
                <div class="label">Date & Time</div>
                <div class="value" style="font-size: 13px; color: #cbd5e1;">${now}</div>
              </div>
            </div>

            <div class="label" style="margin-bottom: 8px;">Project Message / Requirements</div>
            <div class="message-card">
              <div class="message-text">${message}</div>
            </div>

            <div style="text-align: center;">
              <a href="mailto:${email}?subject=Re:%20Project%20Inquiry%20via%20Portfolio" class="action-btn">
                Reply Directly to ${name}
              </a>
            </div>
          </div>
          <div class="footer">
            Sent automatically by your Portfolio Website &bull; Notification dispatched to ${config.to}
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `New Project Inquiry from ${name}\n\n` +
    `Client Name: ${name}\n` +
    `Client Email: ${email}\n` +
    `Received At: ${now}\n\n` +
    `Message:\n${message}\n\n` +
    `--- Sent from your portfolio website ---`;

  try {
    const info = await transporter.sendMail({
      from: `"${name} (Portfolio Inquiry)" <${config.user}>`,
      to: config.to,
      replyTo: email,
      subject: `🚀 New Project Inquiry from ${name}`,
      text: textBody,
      html: htmlBody,
    });
    console.log('✅ Notification email dispatched to admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Failed to send project inquiry email:', error);
    return { success: false, error: error?.message || 'Failed to send email' };
  }
};
