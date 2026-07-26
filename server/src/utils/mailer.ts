import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '../config';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Send an email using Nodemailer
 * Falls back to printing to console and appending to mock_emails.log if SMTP is not fully configured or fails
 */
export async function sendMail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  const isSMTPConfigured = SMTP_USER && SMTP_PASS && SMTP_PASS !== 'your_gmail_app_password_here';

  if (!isSMTPConfigured) {
    const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const linkMatch = htmlContent.match(/href="([^"]+)"/);
    const link = linkMatch ? linkMatch[1] : '';

    const logEntry = `
======================================================
[${new Date().toLocaleString('vi-VN')}] 
TO: ${to}
SUBJECT: ${subject}
LINK: ${link}
CONTENT:
${cleanText}
======================================================
`;
    
    const logPath = path.resolve(__dirname, '../../mock_emails.log');
    try {
      fs.appendFileSync(logPath, logEntry, 'utf8');
      console.log(`[Mailer] Mock email written to ${logPath}`);
    } catch (e) {
      console.error('[Mailer] Failed to write mock email log:', e);
    }

    console.log('\n======================================================');
    console.log(`✉️  [MOCK EMAIL] TO: ${to}`);
    console.log(`✉️  SUBJECT: ${subject}`);
    console.log(`✉️  LINK: ${link}`);
    console.log('======================================================\n');
    
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"GC Nature support" <${SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`[Mailer] Email sent to ${to} successfully.`);
    return true;
  } catch (error) {
    console.error(`[Mailer] Failed to send email to ${to}:`, error);

    // Fallback: log reset link to mock_emails.log so system doesn't block the user
    const cleanText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const linkMatch = htmlContent.match(/href="([^"]+)"/);
    const link = linkMatch ? linkMatch[1] : '';

    const logEntry = `
======================================================
[${new Date().toLocaleString('vi-VN')}] (FALLBACK - SMTP AUTH/NETWORK FAILURE)
TO: ${to}
SUBJECT: ${subject}
LINK: ${link}
ERROR: ${error instanceof Error ? error.message : String(error)}
CONTENT:
${cleanText}
======================================================
`;
    const logPath = path.resolve(__dirname, '../../mock_emails.log');
    try {
      fs.appendFileSync(logPath, logEntry, 'utf8');
      console.log(`[Mailer] [FALLBACK] Email logged to ${logPath} due to SMTP failure.`);
    } catch (e) {
      console.error('[Mailer] [FALLBACK] Failed to write mock email log:', e);
    }

    console.log('\n======================================================');
    console.log(`✉️  [MOCK EMAIL - SMTP FAILED] TO: ${to}`);
    console.log(`✉️  LINK: ${link}`);
    console.log('======================================================\n');

    return true; // Return true so the client-side user still receives success view
  }
}
