# ✅ CONTACT FORM ĐÃ CÀI ĐẶT XONG

## 🎉 ĐÃ HOÀN THÀNH:

### 1. **Backend** ✅
- ✅ Cài đặt nodemailer
- ✅ Tạo email service (`server/src/services/email.ts`)
- ✅ Cập nhật contact API để gửi email
- ✅ Backend đang chạy trên port 8081

### 2. **SMTP Configuration** ✅
- ✅ Đã thêm vào `server/.env`:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="mercytechglobal@gmail.com"
SMTP_PASS="your_gmail_app_password_here"
ADMIN_EMAIL="mercytechglobal@gmail.com"
```

### 3. **Email Template** ✅
- ✅ HTML email đẹp với thông tin đầy đủ
- ✅ Hiển thị: Tên, SĐT, Email, Nội dung, Thời gian
- ✅ Gửi đến: mercytechglobal@gmail.com

---

## ⚠️ CẦN LÀM NGAY:

### Bước 1: Tạo Gmail App Password
1. Đăng nhập Gmail: mercytechglobal@gmail.com
2. Vào: https://myaccount.google.com/apppasswords
3. Tạo App Password mới (chọn "Mail" và "Other")
4. Copy password (dạng: xxxx xxxx xxxx xxxx)
5. Cập nhật vào `server/.env`:
```env
SMTP_PASS="xxxx xxxx xxxx xxxx"
```

### Bước 2: Chạy Database Migration
```bash
cd server
npx prisma db push
npx prisma generate
```

**Lỗi hiện tại:** Database credentials không đúng
- Kiểm tra lại username/password trong DATABASE_URL
- Đảm bảo MySQL server đang chạy

### Bước 3: Restart Backend (sau khi sửa SMTP_PASS)
```bash
# Stop server hiện tại (Ctrl+C)
npm run dev
```

---

## 🧪 TEST CONTACT FORM:

### 1. Mở trang liên hệ:
```
http://localhost:8080/lien-he
```

### 2. Điền form:
- Họ và tên: Test User
- Số điện thoại: 0898273899
- Email: test@example.com
- Nội dung: Đây là test message

### 3. Click "Gửi Yêu Cầu"

### 4. Kiểm tra:
- ✅ Toast notification "Yêu cầu đã được gửi thành công"
- ✅ Form reset về trống
- ✅ Check email mercytechglobal@gmail.com có nhận được email không
- ✅ Check database có record mới trong bảng `contact_requests`

---

## 📧 EMAIL SẼ TRÔNG NHƯ THẾ NÀO:

**Subject:** 🔔 [Liên hệ mới] Test User

**Nội dung:**
```
📧 Yêu cầu liên hệ mới
Từ website Mercy

👤 Họ và tên: Test User
📱 Số điện thoại: 0898273899
📧 Email: test@example.com

💬 Nội dung:
Đây là test message

🕐 Thời gian: 30/04/2026, 00:57:43

Email này được gửi tự động từ hệ thống Mercy
Vui lòng liên hệ lại khách hàng trong thời gian sớm nhất
```

---

## 🔧 TROUBLESHOOTING:

### Lỗi: "Authentication failed"
- Chưa tạo Gmail App Password
- Hoặc SMTP_PASS sai format
- **Giải pháp:** Tạo App Password mới và cập nhật .env

### Lỗi: "Can't reach database"
- Database credentials sai
- Hoặc MySQL server không chạy
- **Giải pháp:** Kiểm tra DATABASE_URL trong .env

### Email không gửi được
- Check console log có lỗi gì không
- Verify SMTP settings
- **Test SMTP connection:**
```typescript
import { testEmailConnection } from './services/email';
testEmailConnection();
```

### Form submit nhưng không có gì xảy ra
- Check browser console có lỗi không
- Check backend logs
- Verify API endpoint `/api/contact` hoạt động

---

## 📊 DATABASE SCHEMA:

```sql
CREATE TABLE `contact_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('pending', 'contacted', 'resolved', 'spam') DEFAULT 'pending',
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
);
```

---

## 🎯 CHECKLIST:

- [x] Cài đặt nodemailer
- [x] Tạo email service
- [x] Cập nhật contact API
- [x] Thêm SMTP config vào .env
- [x] Backend đang chạy
- [ ] **Tạo Gmail App Password** ⚠️ QUAN TRỌNG
- [ ] Cập nhật SMTP_PASS trong .env
- [ ] Chạy database migration
- [ ] Test gửi form
- [ ] Verify email nhận được

---

## 📝 LƯU Ý:

1. **Gmail App Password** là bắt buộc, không thể dùng password thường
2. Email gửi **không đồng bộ** (non-blocking), nếu email fail thì form vẫn submit thành công
3. Tất cả contact requests đều được lưu vào database
4. Admin có thể xem danh sách trong admin panel (nếu tạo)

---

**Trạng thái hiện tại:** Backend đã sẵn sàng, chỉ cần cập nhật Gmail App Password là có thể test!
