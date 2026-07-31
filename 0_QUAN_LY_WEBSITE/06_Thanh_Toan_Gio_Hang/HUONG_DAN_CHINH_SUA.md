# 📌 QUẢN LÝ THÔNG TIN THANH TOÁN & GIỎ HÀNG

Quản lý thông tin chuyển khoản ngân hàng, mã QR VietQR, giỏ hàng và quy trình đặt hàng.

## 📂 Thông tin Tài khoản Ngân hàng:
- Ngân hàng: **ACB (Ngân hàng Á Châu)**
- Số tài khoản: `0559869392`
- Chủ tài khoản: GCnature Korea / Nguyễn Văn Mạnh
- API tự động duyệt đơn ATM/Chuyển khoản: ACB Cron Auto-check (`server/src/cron/acbJob.ts`)

## 💻 Mã nguồn liên quan:
- Giỏ hàng rút gọn (Drawer Side Bar): `src/components/CartDrawer.tsx`
- Trang giỏ hàng đầy đủ: `src/pages/Cart.tsx`
- Trang Thanh toán & Điền địa chỉ: `src/pages/Checkout.tsx`
- Pop-up Thanh toán nhanh: `src/components/CheckoutPopup.tsx`
- Quản lý ngân hàng trong Admin: `src/pages/admin/AdminPaymentMethods.tsx`
