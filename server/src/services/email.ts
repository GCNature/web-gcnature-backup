import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return phone;
}

export async function sendContactNotification(contact: any) {
  try {
    const formattedPhone = formatPhoneNumber(contact.phone);
    
    let address = 'Không có';
    let requestType = 'Thư liên hệ mới';
    let messageText = contact.message;

    try {
      const parsed = JSON.parse(contact.message);
      if (parsed.street || parsed.ward || parsed.city || parsed.country || parsed.requestType || parsed.message) {
        address = [parsed.street, parsed.ward, parsed.city, parsed.country].filter(Boolean).join(' - ') || 'Không có';
        requestType = parsed.requestType || 'Thư liên hệ mới';
        messageText = parsed.message || '';
      }
    } catch (e) {
      // Fallback parsing for old text format or raw messages
      if (contact.message.includes('[ĐĂNG KÝ ĐẠI LÝ]')) {
        requestType = 'Đăng ký đại lý mới';
        const areaMatch = contact.message.match(/Khu vực:\s*([^.]+)/);
        if (areaMatch) address = areaMatch[1].trim();
      }
    }

    const mailOptions = {
      from: `"GC Nature Website" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'gcnatureofficial@gmail.com',
      subject: `🔔 [${requestType}] ${contact.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
            .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; border: 1px solid #eee; }
            .label { font-weight: bold; color: #0d9488; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #0d9488; margin: 15px 0; border-top: 1px solid #eee; border-right: 1px solid #eee; border-bottom: 1px solid #eee; }
            .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📧 Yêu cầu liên hệ mới</h2>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Từ website GC Nature</p>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">👤 Họ và tên:</span> ${contact.name}
              </div>
              <div class="info-row">
                <span class="label">📱 Số điện thoại:</span> <a href="tel:${contact.phone}">${formattedPhone}</a>
              </div>
              <div class="info-row">
                <span class="label">📧 Email:</span> <a href="mailto:${contact.email}">${contact.email}</a>
              </div>
              <div class="info-row">
                <span class="label">📍 Địa chỉ:</span> ${address}
              </div>
              <div class="info-row">
                <span class="label">🏷️ Loại yêu cầu:</span> ${requestType}
              </div>
              <div class="message-box">
                <p class="label">💬 Nội dung yêu cầu:</p>
                <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${messageText}</p>
              </div>
              <div class="info-row">
                <span class="label">🕐 Thời gian:</span> ${new Date(contact.created_at || new Date()).toLocaleString('vi-VN', { 
                  timeZone: 'Asia/Ho_Chi_Minh',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
            <div class="footer">
              <p>Email này được gửi tự động từ hệ thống Mercy</p>
              <p>Vui lòng liên hệ lại khách hàng trong thời gian sớm nhất</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

// Test email connection
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection is ready');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
}
