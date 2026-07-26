import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🛠  Adding new TCCA HYALURONIC SERUM product to database...');

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
  const description = `Serum Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC GC NATURE Cấp Nước Đa Tầng Căng Bóng Da Hàn Quốc

Vì sao bạn sẽ thích
Da khô căng bong tróc lớp trang điểm dễ mốc cám và xuống tông. Serum SKIN BALANCING HYALURONIC là ly nước thần cho làn da thiếu ẩm với 8 dạng Hyaluronic Acid phân tử khác nhau thẩm thấu sâu vào từng lớp biểu bì khoá ẩm bền lâu suốt 24 giờ. Kết hợp Niacinamide Panthenol cùng dịch ốc sên và chiết xuất thảo mộc Hàn Quốc sản phẩm giúp da căng mọng mềm mịn sáng khoẻ rạng rỡ ngay từ những lần đầu dùng.

ƯU ĐIỂM NỔI BẬT
🌿 Cấp nước đa tầng da căng bóng tức thì nhờ 8 dạng Hyaluronic Acid
🌿 Làm sáng đều màu mờ vết thâm sạm nhờ Niacinamide
🌿 Làm dịu da nhạy cảm giảm mẩn đỏ nhờ Panthenol & Allantoin
🌿 Phục hồi làm mềm mượt bề mặt da nhờ tinh chất Ốc Sên Hàn Quốc Snail Filtrate
🌿 Tăng độ đàn hồi ngăn ngừa lão hoá sớm nhờ Beta-Glucan & Adenosine
🌿 Nuôi dưỡng da từ sâu bên trong bởi 7 chiết xuất thảo dược Hàn sắn dây cỏ ba lá lựu đương quy
🌿 Kết cấu lỏng nhẹ thấm nhanh không nhờn rít phù hợp mọi loại da kể cả da dầu mụn

THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc trên Coupang Olive Young TOP tìm kiếm trên Naver được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam

THÀNH PHẦN CHÍNH
Water Glycerin Dipropylene Glycol Glycereth-26 Niacinamide Betaine 1,2-Hexanediol PEG-60 Hydrogenated Castor Oil Chlorphenesin Acrylates C10-30 Alkyl Acrylate Crosspolymer Triethanolamine Caprylyl Glycol Panthenol Xanthan Gum Hydroxyethylcellulose Fragrance Allantoin Adenosine Disodium EDTA Sodium Polyacrylate Butylene Glycol Sodium Hyaluronate Snail Secretion Filtrate Beta-Glucan Pentylene Glycol Soy Isoflavones Pueraria Lobata Root Extract Pueraria Mirifica Root Extract Polygonum Cuspidatum Root Extract Cimicifuga Racemosa Root Extract Sodium Hyaluronate Crosspolymer Hydrolyzed Hyaluronic Acid Trifolium Pratense Clover Flower Extract Punica Granatum Fruit Extract Angelica Polymorpha Sinensis Root Extract CI 42090 Hyaluronic Acid Sodium Acetylated Hyaluronate Hydroxypropyltrimonium Hyaluronate Hydrolyzed Sodium Hyaluronate

HƯỚNG DẪN SỬ DỤNG
Bước 1 Làm sạch da với sữa rửa mặt cân bằng bằng toner
Bước 2 Lấy 2-3 giọt serum ra lòng bàn tay
Bước 3 Vỗ nhẹ đều khắp mặt và cổ ưu tiên vùng khô
Bước 4 Đợi 30 giây rồi dùng tiếp kem dưỡng và kem chống nắng
👉 Dùng đều đặn sáng và tối để cảm nhận làn da căng mịn rõ rệt

HƯỚNG DẪN BẢO QUẢN
Để nơi khô ráo thoáng mát tránh ánh nắng trực tiếp và nhiệt độ cao
Đậy kín nắp ngay sau khi sử dụng để giữ chất lượng tinh chất
Để xa tầm tay trẻ em
Ngưng dùng và rửa sạch với nước nếu xuất hiện dấu hiệu khó chịu`;

  const featuresVn = JSON.stringify([
    "Cấp ẩm đa tầng tức thì với 8 loại phân tử Hyaluronic Acid",
    "Da căng mịn, mọng mượt, ngăn ngừa hiện tượng mốc phấn",
    "Làm dịu rát và mẩn đỏ với Panthenol và dịch nhầy ốc sên",
    "Thấm thấu cực nhanh, không gây bít tắc chân lông sinh mụn"
  ]);

  // 3. Upsert product
  const product = await prisma.products.upsert({
    where: { product_id: 'TCCA' },
    update: {
      sku: 'TCCA',
      name: 'Serum Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC GC NATURE Cấp Nước Đa Tầng Căng Bóng Da Hàn Quốc',
      short_name: 'Serum Cấp Ẩm Hyaluronic GC NATURE',
      category_id: categoryId,
      category_name: categoryName,
      price: BigInt(280000),
      original_price: BigInt(400000),
      discount: 30,
      badge: 'Cấp ẩm sâu',
      rating: 5.0,
      sold: 928,
      stock: 836,
      brand: 'GC Nature',
      description: description,
      shopee_url: 'https://s.shopee.vn/3LOp3cBoBe',
      tiktok_url: 'https://vt.tiktok.com/ZS965T7PXBPV6-Y08Dv/',
      is_active: true,
      features_vn: featuresVn,
      footer_info: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
      production_year: 2026
    },
    create: {
      product_id: 'TCCA',
      sku: 'TCCA',
      name: 'Serum Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC GC NATURE Cấp Nước Đa Tầng Căng Bóng Da Hàn Quốc',
      short_name: 'Serum Cấp Ẩm Hyaluronic GC NATURE',
      category_id: categoryId,
      category_name: categoryName,
      price: BigInt(280000),
      original_price: BigInt(400000),
      discount: 30,
      badge: 'Cấp ẩm sâu',
      rating: 5.0,
      sold: 928,
      stock: 836,
      brand: 'GC Nature',
      description: description,
      shopee_url: 'https://s.shopee.vn/3LOp3cBoBe',
      tiktok_url: 'https://vt.tiktok.com/ZS965T7PXBPV6-Y08Dv/',
      is_active: true,
      features_vn: featuresVn,
      footer_info: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
      production_year: 2026
    }
  });

  console.log(`✓ Product SKIN BALANCING HYALURONIC upserted (ID: ${product.id})`);

  // 4. Delete old images if exist and create new ones
  await prisma.product_images.deleteMany({
    where: { product_id: 'TCCA' }
  });

  const imagesData = [
    { product_id: 'TCCA', image_url: '/products/TCCA.1.jpeg', sort_order: 0 },
    { product_id: 'TCCA', image_url: '/products/TCCA.2.jpeg', sort_order: 1 },
    { product_id: 'TCCA', image_url: '/products/TCCA.3.jpeg', sort_order: 2 }
  ];

  await prisma.product_images.createMany({
    data: imagesData
  });
  console.log('✓ Product images created');

  // 5. Delete old reviews and insert 4 custom reviews
  await prisma.product_reviews.deleteMany({
    where: { product_id: 'TCCA' }
  });

  const reviewsData = [
    {
      product_id: 'TCCA',
      reviewer_name: 'Minh Thư',
      avatar_letter: 'T',
      avatar_color: 'bg-[#5dc1d1]',
      rating: 5,
      review_date: '23/06/2026',
      is_verified: true,
      review_text: 'Serum dưỡng ẩm siêu đỉnh luôn á, bôi lên da mát mát, căng mịn tức thì luôn. Rất đáng tiền!',
      helpful_count: 9
    },
    {
      product_id: 'TCCA',
      reviewer_name: 'Hoàng Oanh',
      avatar_letter: 'O',
      avatar_color: 'bg-emerald-500',
      rating: 5,
      review_date: '24/06/2026',
      is_verified: true,
      review_text: 'Da khô ráp dùng em này cấp nước quá tuyệt. Mình hay bị mốc nền khi makeup bôi em này lót trước là mịn cả ngày.',
      helpful_count: 14
    },
    {
      product_id: 'TCCA',
      reviewer_name: 'Hải Đăng',
      avatar_letter: 'Đ',
      avatar_color: 'bg-teal-500',
      rating: 5,
      review_date: '25/06/2026',
      is_verified: true,
      review_text: 'Kết cấu thấm nhanh không bết dính. Da đủ nước nhìn căng bóng khỏe mạnh hơn nhiều.',
      helpful_count: 7
    },
    {
      product_id: 'TCCA',
      reviewer_name: 'Thanh Hà',
      avatar_letter: 'H',
      avatar_color: 'bg-blue-500',
      rating: 5,
      review_date: '26/06/2026',
      is_verified: true,
      review_text: 'Giao hàng nhanh, chai thủy tinh dày dặn cầm chắc tay. Cấp ẩm ổn, mùi dịu nhẹ.',
      helpful_count: 5
    }
  ];

  await prisma.product_reviews.createMany({
    data: reviewsData
  });
  console.log('✓ 4 custom product reviews created successfully');

  await prisma.$disconnect();
  console.log('🎉 Done! TCCA product added successfully.');
}

main().catch((err) => {
  console.error('Failed to run TCCA insertion script:', err);
  process.exit(1);
});
