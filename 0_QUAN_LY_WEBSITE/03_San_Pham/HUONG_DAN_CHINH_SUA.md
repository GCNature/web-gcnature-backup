# 📌 QUẢN LÝ SẢN PHẨM (PRODUCTS)

Thư mục này quản lý toàn bộ dữ liệu, hình ảnh và thông tin liên quan đến các dòng sản phẩm của GCnature.

## 📂 Cấu trúc thư mục con:
1. `Thong_Tin/`:
   - Chứa mã nguồn quản lý danh mục sản phẩm, giá bán, giá niêm yết, thành phần, công dụng.
   - File dữ liệu: `src/data/products.ts` & Bảng `products` trong CSDL MySQL.
2. `Hinh_Anh/`:
   - Thư mục lưu ảnh sản phẩm: `public/products/` & `public/uploads/`
3. `Thong_Tin_Khac/`:
   - Mã Vouchers: `src/pages/Vouchers.tsx`
   - Đánh giá sản phẩm: `src/components/ReviewSection.tsx`
   - So sánh sản phẩm: `src/pages/Compare.tsx` & `src/components/CompareBar.tsx`

## 💻 Mã nguồn liên quan:
- Trang danh sách sản phẩm (Shop/Catalog): `src/pages/Catalog.tsx`, `src/pages/Shop.tsx`
- Trang chi tiết sản phẩm: `src/pages/ProductDetail.tsx`
- Trang quản trị Admin thêm/sửa sản phẩm: `src/pages/admin/AdminProducts.tsx`
