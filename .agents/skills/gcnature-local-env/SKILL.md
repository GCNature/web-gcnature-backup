---
name: gcnature-local-env
description: Quy trình khởi chạy môi trường phát triển local, cấu hình cổng và quy định về các trang chính sách cho dự án GCnature.
---

# Kỹ năng Môi trường local & Quy định dự án GCnature

Tài liệu này cung cấp các hướng dẫn và câu lệnh chính xác để duy trì môi trường phát triển local của dự án GCnature hoạt động chính xác cùng các quy định nghiệp vụ cốt lõi.

## 1. Khởi động Cơ sở dữ liệu (MySQL MariaDB)
- **Thư mục dữ liệu chính thức**: `C:\Users\webMercy\mysql_data`
- **Tệp cấu hình chính thức**: `C:\Users\webMercy\mysql_data\my.ini`
- **Lưu ý quan trọng**: Không sử dụng lệnh `C:\xampp\mysql_start.bat` mặc định vì nó sẽ trỏ về thư mục dữ liệu trống của XAMPP.
- **Câu lệnh khởi động đúng**:
  ```powershell
  C:\xampp\mysql\bin\mysqld.exe --defaults-file=C:\Users\webMercy\mysql_data\my.ini --standalone
  ```

## 2. Khởi động Máy chủ Backend
- **Đường dẫn thư mục**: `server/`
- **Cổng hoạt động (Port)**: `8081`
- **Câu lệnh khởi động đúng**:
  ```powershell
  & "C:\Users\webMercy\AppData\Local\ms-playwright-go\1.57.0\node.exe" "node_modules/tsx/dist/cli.mjs" "src/index.ts"
  ```

## 3. Khởi động Frontend & Server Tĩnh (Static Delivery)
- **Thư mục phân phối**: `dist/`
- **Kịch bản chạy server tĩnh**: `scratch/server.ps1`
- **Cổng hoạt động (Port)**: `8086` (Tránh dùng cổng `8085` do bị tiến trình hệ thống System PID 4 chiếm giữ).
- **Proxy cấu hình**: Server tĩnh phải proxy toàn bộ các yêu cầu bắt đầu bằng `/api/` về `http://localhost:8081` của backend.

## 4. Quy tắc về các trang Chính sách (Policy Pages Rules)
- Dự án GCnature **chỉ có duy nhất 6 trang chính sách** sau đây hoạt động công khai. Không được thêm bất kỳ chính sách nào khác:
  1. **Chính sách mua hàng** (`/chinh-sach/mua-hang`): Nêu rõ điều khoản **KHÔNG ĐỒNG KIỂM** khi nhận hàng để bảo mật seal niêm phong mỹ phẩm. Khách hàng bắt buộc quay video unboxing làm căn cứ khiếu nại.
  2. **Chính sách bảo mật** (`/chinh-sach/bao-mat`): Cam kết bảo mật dữ liệu khách hàng.
  3. **Chính sách thanh toán** (`/chinh-sach/thanh-toan`): Hỗ trợ COD, chuyển khoản VietQR. **Không hiển thị công khai số tài khoản nhận tiền hay tên chủ thẻ** trực tiếp trên giao diện chính sách.
  4. **Chính sách Đại Lý** (`/chinh-sach/dai-ly`): Định tuyến trực tiếp tới trang AgentPolicy chuyên nghiệp chứa bảng so sánh đại lý.
  5. **Chính sách khách hàng thân thiết** (`/chinh-sach/khach-hang-than-thiet`): Cơ chế tích điểm GC Point.
  6. **Chính sách xử lý khiếu nại** (`/chinh-sach/khieu-nai`): Hướng dẫn xử lý kích ứng da có chẩn đoán y tế và quy trình đổi trả hàng lỗi.

## 5. Quy tắc Tránh Purge CSS trong Tailwind
- Khi thay đổi màu nền động hoặc các thuộc tính giao diện dùng biến động từ danh sách phần tử (ví dụ: các icon mạng xã hội ở chân trang), không sử dụng class động dạng `bg-${social.color}` vì bộ biên dịch Tailwind CSS sẽ loại bỏ (purge) chúng khi đóng gói.
- **Giải pháp**: Sử dụng trực tiếp inline style cho thuộc tính màu (ví dụ: `style={{ backgroundColor: social.color }}` với mã màu hex `#FF0000` cho Youtube).
