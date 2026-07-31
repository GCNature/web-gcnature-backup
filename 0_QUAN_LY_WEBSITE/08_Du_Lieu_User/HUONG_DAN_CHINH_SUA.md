# 📌 QUẢN LÝ DỮ LIỆU USER & ĐĂNG NHẬP

Quản lý đăng ký tài khoản khách hàng, đăng nhập bằng Email/Password, đăng nhập Google One-Tap, thông tin cá nhân và lịch sử đơn hàng.

## 📂 Các tính năng chính:
1. **Đăng nhập Google OAuth (Google One-Tap)**:
   - Google Client ID: `671275324232-jedlb9gmfkj2n44dbcc5rgvcvlb1s936.apps.googleusercontent.com`
2. **Quản lý Tài khoản cá nhân**:
   - Trang cá nhân: `src/pages/Account.tsx`
   - Quản lý lịch sử mua hàng, địa chỉ giao hàng.

## 💻 Mã nguồn liên quan:
- Trang Đăng nhập: `src/pages/Login.tsx`
- Trang Đăng ký: `src/pages/Register.tsx`
- Trang Quên mật khẩu & Reset Mật khẩu: `src/pages/ForgotPassword.tsx`, `src/pages/ResetPassword.tsx`
- Route API Authentication: `server/src/routes/auth.ts`
- Trang Admin Quản lý Thành viên/User: `src/pages/admin/AdminUsers.tsx`
