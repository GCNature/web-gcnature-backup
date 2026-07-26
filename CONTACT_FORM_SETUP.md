# 📋 HƯỚNG DẪN CÀI ĐẶT CONTACT FORM

## ✅ Đã hoàn thành:

### 1. **Database Schema** ✅
- Đã thêm model `contact_requests` vào Prisma schema
- Các trường: id, name, phone, email, message, status, notes, created_at, updated_at
- Status: pending, contacted, resolved, spam

### 2. **Backend API** ✅
- Đã tạo file `server/src/routes/contact.ts`
- Endpoints:
  - `POST /api/contact` - Tạo yêu cầu liên hệ mới
  - `GET /api/contact` - Lấy danh sách (Admin)
  - `PATCH /api/contact/:id` - Cập nhật status (Admin)
  - `DELETE /api/contact/:id` - Xóa (Admin)
- Đã đăng ký route trong `server/src/index.ts`

### 3. **Frontend** ✅
- Đã cập nhật `src/pages/Contact.tsx`
- Form gửi dữ liệu qua API thay vì mở email
- Validation đầy đủ
- Toast notifications

---

## 🚀 CÁC BƯỚC CẦN LÀM TIẾP:

### Bước 1: Chạy Database Migration
```bash
cd server
npx prisma db push
```

Hoặc nếu muốn tạo migration file:
```bash
npx prisma migrate dev --name add_contact_requests
```

### Bước 2: Generate Prisma Client
```bash
npx prisma generate
```

### Bước 3: Restart Backend Server
```bash
npm run dev
```

### Bước 4: Test Contact Form
1. Mở trang `/lien-he`
2. Điền form và gửi
3. Kiểm tra database có record mới không

---

## 📊 ADMIN PANEL (Tùy chọn)

Nếu muốn admin xem contact requests trong panel, cần tạo trang admin:

### File cần tạo: `src/pages/admin/AdminContacts.tsx`

```tsx
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Đã cập nhật trạng thái");
        fetchContacts();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const statusColors = {
    pending: "bg-yellow-500",
    contacted: "bg-blue-500",
    resolved: "bg-green-500",
    spam: "bg-red-500"
  };

  const statusLabels = {
    pending: "Chờ xử lý",
    contacted: "Đã liên hệ",
    resolved: "Đã giải quyết",
    spam: "Spam"
  };

  if (loading) return <AdminLayout title="Liên hệ"><div>Đang tải...</div></AdminLayout>;

  return (
    <AdminLayout title="Quản lý liên hệ">
      <div className="space-y-4">
        {contacts.map((contact: any) => (
          <Card key={contact.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {contact.phone} • {contact.email}
                  </p>
                </div>
                <Badge className={statusColors[contact.status]}>
                  {statusLabels[contact.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{contact.message}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateStatus(contact.id, 'contacted')}>
                  Đã liên hệ
                </Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(contact.id, 'resolved')}>
                  Đã giải quyết
                </Button>
                <Button size="sm" variant="destructive" onClick={() => updateStatus(contact.id, 'spam')}>
                  Spam
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(contact.created_at).toLocaleString('vi-VN')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
```

### Thêm route vào `src/App.tsx`:
```tsx
<Route path="/admin/contacts" element={<AdminContacts />} />
```

---

## 🔔 EMAIL NOTIFICATIONS (Tùy chọn)

Nếu muốn gửi email tự động khi có contact request mới, cần:

### 1. Cài đặt Nodemailer:
```bash
cd server
npm install nodemailer
npm install -D @types/nodemailer
```

### 2. Cấu hình SMTP trong `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mercytechglobal@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=mercytechglobal@gmail.com
```

### 3. Tạo email service: `server/src/services/email.ts`
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendContactNotification(contact: any) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `[Liên hệ mới] ${contact.name}`,
    html: `
      <h2>Yêu cầu liên hệ mới</h2>
      <p><strong>Họ tên:</strong> ${contact.name}</p>
      <p><strong>Số điện thoại:</strong> ${contact.phone}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Nội dung:</strong></p>
      <p>${contact.message}</p>
      <hr>
      <p><small>Thời gian: ${new Date(contact.created_at).toLocaleString('vi-VN')}</small></p>
    `
  };

  await transporter.sendMail(mailOptions);
}
```

### 4. Gọi trong API route:
```typescript
// Trong server/src/routes/contact.ts
import { sendContactNotification } from '../services/email';

// Sau khi create contact request:
try {
  await sendContactNotification(contactRequest);
} catch (error) {
  console.error('Failed to send email notification:', error);
  // Không throw error, vẫn trả về success
}
```

---

## 📝 SQL MIGRATION (Nếu không dùng Prisma)

Nếu muốn tạo bảng thủ công:

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## ✅ CHECKLIST

- [x] Tạo Prisma schema
- [x] Tạo API routes
- [x] Đăng ký routes trong server
- [x] Cập nhật frontend form
- [ ] Chạy database migration
- [ ] Generate Prisma client
- [ ] Restart backend server
- [ ] Test contact form
- [ ] (Tùy chọn) Tạo admin panel
- [ ] (Tùy chọn) Setup email notifications

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:
1. ✅ User điền form → Gửi → Lưu vào database
2. ✅ Toast notification thành công
3. ✅ Form reset về trạng thái ban đầu
4. ✅ Admin có thể xem danh sách trong panel (nếu làm)
5. ✅ Admin nhận email thông báo (nếu setup SMTP)

---

**Lưu ý:** Hiện tại database chưa chạy nên cần start MySQL/MariaDB trước khi test!
