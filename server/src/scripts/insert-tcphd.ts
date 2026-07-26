import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🛠  Adding new CICA COMPLEX SERUM product to database...');

  // 1. Find category ID for "Serum / Tinh chất đặc trị" or fall back to first category
  let categoryId: number | null = null;
  let categoryName = 'Serum / Tinh chất đặc trị';

  try {
    const dbCategory = await prisma.categories.findFirst({
      where: {
        name: {
          contains: 'da mặt'
        }
      }
    });
    if (dbCategory) {
      categoryId = dbCategory.id;
      console.log(`Using Category: ${dbCategory.name} (ID: ${dbCategory.id})`);
    } else {
      const firstCat = await prisma.categories.findFirst();
      if (firstCat) {
        categoryId = firstCat.id;
        console.log(`Using Fallback Category: ${firstCat.name} (ID: ${firstCat.id})`);
      }
    }
  } catch (err) {
    console.warn('Could not query categories table. Creating without category relation...');
  }

  // 2. Prepare description HTML/Markdown
  const description = `Serum Phục Hồi Da CICA COMPLEX SERUM Chiết Xuất Rau Má Dịu Da Giảm Kích Ứng cho Da Nhạy Cảm

Vì sao bạn sẽ thích
Da bạn dễ ửng đỏ châm chích khi đổi thời tiết hay nổi mụn ẩn vì hàng rào bảo vệ yếu. ANELY Cica Complex Serum đến từ Hàn Quốc chính là vệ sĩ dịu nhẹ mà làn da nhạy cảm đang cần. Kết cấu gel serum xanh trong mỏng nhẹ thẩm thấu tức thì để lại cảm giác mát lạnh ẩm mượt và êm dịu ngay từ lần đầu sử dụng.

ƯU ĐIỂM NỔI BẬT
🌿 Bộ tự Rau Má vàng Asiaticoside Madecassoside Axit Asiatic Axit Madecassic làm dịu nhanh vùng da kích ứng đỏ rát
🌿 Chiết xuất Centella Asiatica + Keo Ong tăng cường hàng rào ẩm hỗ trợ phục hồi da yếu sau mụn
💧 Niacinamide + Beta-Glucan giúp da sáng đều màu mờ vết thâm sau mụn se khít lỗ chân lông
💧 Sodium Hyaluronate + Panthenol + Allantoin cấp ẩm sâu giữ da căng mọng suốt ngày dài
🍃 Bổ sung loạt chiết xuất thực vật: lô hội tảo bẹ hoa tím rễ cây du rễ khoai lang nuôi dưỡng và làm mát da
✅ Không cồn khô không paraben dịu nhẹ an toàn cho da nhạy cảm bà bầu có thể tham khảo

THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc trên Coupang Olive Young TOP tìm kiếm trên Naver được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam

THÀNH PHẦN CHÍNH
Dipropylene glycol glycerin niacinamide 1,2-hexanediol dầu thầu dầu hydro hóa PEG-60 chlorphenesin caprylyl glycol carbomer trietanolamine panthenol betaine allantoin adenosine xanthan gum disodium EDTA hương thơm butylene glycol Natri hyaluronate chiết xuất lá lô hội chiết xuất tảo bẹ chiết xuất hoa tím chiết xuất rễ cây du chiết xuất rễ khoai lang beta-glucan chiết xuất Centella Asiatica số màu vàng 4 số màu xanh 1 chiết xuất keo ong asiaticoside axit asiatic madecassoside axit madecassic

HƯỚNG DẪN SỬ DỤNG
Bước 1 Làm sạch da với sữa rửa mặt sau đó cân bằng bằng toner
Bước 2 Lấy 2-3 giọt serum chấm đều lên 5 điểm: trán mũi cằm và hai má
Bước 3 Vỗ nhẹ từ trong ra ngoài đến khi serum thẩm thấu hoàn toàn
Bước 4 Tiếp tục với kem dưỡng ẩm đừng quên kem chống nắng vào buổi sáng
👉 Dùng đều đặn 2 lần mỗi ngày sáng tối để cảm nhận da dịu mềm mượt rõ rệt

HƯỚNG DẪN BẢO QUẢN
Để nơi khô thoáng tránh ánh nắng trực tiếp và nhiệt độ cao trên 30 độ C
Đậy kín nắp sau mỗi lần dùng để giữ trọn dưỡng chất
Không dùng tay bẩn hoặc dụng cụ không sạch tiếp xúc trực tiếp với serum
Để xa tầm tay trẻ em`;

  const featuresVn = JSON.stringify([
    "Làm dịu rát đỏ tức thì với tinh chất Cica rau má cô đặc",
    "Phục hồi hàng rào bảo vệ da yếu sau mụn hoặc peel da",
    "Cấp ẩm sâu suốt 24h, ngừa khô ráp và bong tróc",
    "Không chứa cồn khô, paraben, hương liệu tổng hợp độc hại"
  ]);

  // 3. Upsert product
  const product = await prisma.products.upsert({
    where: { product_id: 'TCPHD' },
    update: {
      sku: 'TCPHD',
      name: 'Serum Rau Má Phục Hồi Da CICA COMPLEX SERUM GC NATURE Chiết Xuất Rau Má Giảm Kích Ứng cho Da Nhạy Cảm Hàn Quốc',
      short_name: 'Serum Rau Má CICA GC NATURE',
      category_id: categoryId,
      category_name: categoryName,
      price: BigInt(280000),
      original_price: BigInt(400000),
      discount: 30,
      badge: 'Bán chạy',
      rating: 5.0,
      sold: 928,
      stock: 836,
      brand: 'GC Nature',
      description: description,
      shopee_url: 'https://s.shopee.vn/5VTJbcYtHN',
      tiktok_url: 'https://vt.tiktok.com/ZS965wrq4NUJv-Ultvr/',
      is_active: true,
      features_vn: featuresVn,
      footer_info: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
      production_year: 2026
    },
    create: {
      product_id: 'TCPHD',
      sku: 'TCPHD',
      name: 'Serum Rau Má Phục Hồi Da CICA COMPLEX SERUM GC NATURE Chiết Xuất Rau Má Giảm Kích Ứng cho Da Nhạy Cảm Hàn Quốc',
      short_name: 'Serum Rau Má CICA GC NATURE',
      category_id: categoryId,
      category_name: categoryName,
      price: BigInt(280000),
      original_price: BigInt(400000),
      discount: 30,
      badge: 'Bán chạy',
      rating: 5.0,
      sold: 928,
      stock: 836,
      brand: 'GC Nature',
      description: description,
      shopee_url: 'https://s.shopee.vn/5VTJbcYtHN',
      tiktok_url: 'https://vt.tiktok.com/ZS965wrq4NUJv-Ultvr/',
      is_active: true,
      features_vn: featuresVn,
      footer_info: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
      production_year: 2026
    }
  });

  console.log(`✓ Product CICA COMPLEX SERUM GC NATURE upserted (ID: ${product.id})`);

  // 4. Delete old images if exist and create new ones
  await prisma.product_images.deleteMany({
    where: { product_id: 'TCPHD' }
  });

  const imagesData = [
    { product_id: 'TCPHD', image_url: '/products/TCPHD.1.jpg', sort_order: 0 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.2.jpg', sort_order: 1 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.3.jpg', sort_order: 2 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.4.jpg', sort_order: 3 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.5.jpg', sort_order: 4 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.6.jpg', sort_order: 5 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.7.jpg', sort_order: 6 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.8.jpg', sort_order: 7 },
    { product_id: 'TCPHD', image_url: '/products/TCPHD.9.jpg', sort_order: 8 }
  ];

  await prisma.product_images.createMany({
    data: imagesData
  });
  console.log('✓ Product images created');

  // 5. Delete old reviews and insert 4 custom reviews
  await prisma.product_reviews.deleteMany({
    where: { product_id: 'TCPHD' }
  });

  const reviewsData = [
    {
      product_id: 'TCPHD',
      reviewer_name: 'Huyền My',
      avatar_letter: 'M',
      avatar_color: 'bg-emerald-500',
      rating: 5,
      review_date: '22/06/2026',
      is_verified: true,
      review_text: 'Serum xài rất mát, thấm nhanh, da mình nhạy cảm dễ ửng đỏ mà bôi em này lên thấy dịu hẳn luôn. Sẽ mua lại!',
      helpful_count: 12
    },
    {
      product_id: 'TCPHD',
      reviewer_name: 'Trần Hưng',
      avatar_letter: 'H',
      avatar_color: 'bg-teal-500',
      rating: 5,
      review_date: '24/06/2026',
      is_verified: true,
      review_text: 'Sản phẩm chất lượng tốt, lành tính, không cồn không hương liệu hóa học nồng nặc. Phục hồi da mụn cực ổn.',
      helpful_count: 8
    },
    {
      product_id: 'TCPHD',
      reviewer_name: 'Ngọc Anh',
      avatar_letter: 'A',
      avatar_color: 'bg-cyan-500',
      rating: 5,
      review_date: '25/06/2026',
      is_verified: true,
      review_text: 'Chất gel mát lạnh, bôi lên da thấm liền không bị bết rít. Mình dùng sau khi peel da thấy hồi phục rất nhanh.',
      helpful_count: 15
    },
    {
      product_id: 'TCPHD',
      reviewer_name: 'Lê Thu',
      avatar_letter: 'T',
      avatar_color: 'bg-blue-500',
      rating: 5,
      review_date: '26/06/2026',
      is_verified: true,
      review_text: 'Giao hàng nhanh, đóng gói cẩn thận. Serum cấp ẩm tốt, da đỡ khô ráp hơn nhiều.',
      helpful_count: 6
    }
  ];

  await prisma.product_reviews.createMany({
    data: reviewsData
  });
  console.log('✓ 4 custom product reviews created successfully');

  await prisma.$disconnect();
  console.log('🎉 Done! CICA COMPLEX SERUM added successfully.');
}

main().catch((err) => {
  console.error('Failed to run insertion script:', err);
  process.exit(1);
});
