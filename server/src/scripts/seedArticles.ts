/**
 * Seed sample blog articles for the Mercy storefront.
 *
 * Idempotent: re-running deletes any article whose slug starts with "seed-"
 * and re-inserts the canonical demo set so dates/order stay stable.
 *
 * Usage (from /server):
 *     npx tsx src/scripts/seedArticles.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  views: number;
  daysAgo: number;
}

const seeds: SeedArticle[] = [
  {
    slug: 'seed-mercy-ra-mat-mck-6-flagship-2026',
    title: 'Mercy chính thức ra mắt MCK 6.0 — kính thông minh AI flagship 2026',
    excerpt:
      'Mercy MCK 6.0 mang đến trải nghiệm trợ lý AI tốc độ cao, camera 32MP, pin 12 giờ và thiết kế đeo gọn nhẹ. Đây là flagship dẫn dắt thị trường kính thông minh Việt Nam năm 2026.',
    content: `# Mercy MCK 6.0 — Kính thông minh AI flagship 2026

Sau hơn một năm phát triển, Mercy chính thức trình làng MCK 6.0 — phiên bản kính thông minh đỉnh cao mới nhất với hàng loạt nâng cấp đáng giá so với thế hệ MCK 5.x.

## Những điểm nổi bật

- **Trợ lý AI thế hệ mới**: phản hồi tức thì, hỗ trợ tiếng Việt tự nhiên hơn, có thể tóm tắt cuộc họp, dịch realtime và đặt lịch nhanh chóng.
- **Camera 32MP cải tiến**: chế độ quay POV 2K@60fps, ổn định hình ảnh tốt hơn 30%, bắt nét nhanh trong điều kiện thiếu sáng.
- **Pin 12 giờ**: nghe nhạc Bluetooth liên tục cả ngày làm việc, sạc nhanh USB-C 0-80% trong 35 phút.
- **Thiết kế gọng titan**: nhẹ chỉ 38g, chuẩn IP65 chống nước bụi, tròng đổi màu UV400.

## Đối tượng phù hợp

MCK 6.0 hướng đến doanh nhân, content creator và những ai muốn một thiết bị kết nối tích hợp đeo trên người, thay thế tai nghe Bluetooth + camera POV thông thường.

## Giá bán & ưu đãi

Trong tuần ra mắt, Mercy áp dụng giá ưu đãi cùng quà tặng bao da chính hãng. Khách hàng đặt sớm còn được tặng gói bảo hành 12 tháng và phụ kiện độc quyền.`,
    image: '/banners/hero-mck51.png',
    date: '15/05/2026',
    category: 'Sản phẩm mới',
    author: 'Mercy Team',
    views: 4820,
    daysAgo: 2,
  },
  {
    slug: 'seed-huong-dan-su-dung-kinh-mercy-ai',
    title: 'Hướng dẫn sử dụng Kính Thông Minh Mercy AI từ A đến Z',
    excerpt:
      'Tất tần tật cách kết nối Bluetooth, kích hoạt trợ lý AI, quay video POV, nghe nhạc và bảo quản kính Mercy đúng cách để dùng bền 3-5 năm.',
    content: `# Hướng dẫn sử dụng Kính Thông Minh Mercy AI

Bài viết này tổng hợp toàn bộ thao tác cơ bản cho người mới sở hữu kính thông minh Mercy.

## 1. Kết nối Bluetooth

1. Mở hộp, sạc kính 100% trong khoảng 1.5 giờ.
2. Bật kính (giữ nút nguồn 3 giây).
3. Trên điện thoại, vào **Cài đặt → Bluetooth**, chọn thiết bị "Mercy MCK".
4. Sau khi ghép nối, kính sẽ tự động kết nối lại ở các lần sử dụng sau.

## 2. Kích hoạt trợ lý AI

- Chạm nhẹ 2 lần vào càng kính bên phải.
- Nói câu lệnh, ví dụ: "Mercy, phát nhạc Sơn Tùng" hoặc "Dịch giúp tôi câu này sang tiếng Anh".

## 3. Quay video POV

Nhấn nút camera trên càng kính 1 lần để chụp ảnh, giữ 2 giây để quay video. File lưu vào bộ nhớ trong, đồng bộ qua app Mercy.

## 4. Bảo quản

- Sau khi dùng, lau tròng bằng khăn sợi nhỏ kèm theo.
- Khi không dùng, cất vào bao da để tránh trầy xước.
- Tránh để kính ở nhiệt độ cao (xe hơi giữa trưa, gần bếp).

Tuân thủ những bước trên, kính Mercy có thể đồng hành với bạn 3-5 năm.`,
    image: '/banners/hero-kdt51.png',
    date: '10/05/2026',
    category: 'Hướng dẫn',
    author: 'Mercy Support',
    views: 2340,
    daysAgo: 7,
  },
  {
    slug: 'seed-so-sanh-mercy-vs-xiaomi-ai-glasses',
    title: 'So sánh Kính Thông Minh Mercy MCK 5.1 và Xiaomi AI Glasses',
    excerpt:
      'Đánh giá chi tiết hai dòng kính thông minh hot nhất hiện nay: Mercy MCK 5.1 và Xiaomi AI Glasses. Sản phẩm nào phù hợp hơn với người dùng Việt?',
    content: `# Mercy MCK 5.1 vs Xiaomi AI Glasses — Cái nào đáng mua?

Trên thị trường kính thông minh hiện nay, Mercy MCK 5.1 và Xiaomi AI Glasses là hai cái tên được quan tâm nhất. Hãy cùng so sánh chi tiết.

## Thiết kế

- **Mercy MCK 5.1**: gọng nhẹ 40g, nhiều màu, có phiên bản tròng đổi màu thực sự bắt mắt.
- **Xiaomi AI Glasses**: thiết kế tối giản, hơi dày hơn, chỉ có màu đen.

**Người chiến thắng**: Mercy nhờ sự đa dạng và tròng UV400 đổi màu.

## Trợ lý AI

- **Mercy**: tích hợp AI đa nhiệm, hỗ trợ tiếng Việt tự nhiên, dịch realtime tốt.
- **Xiaomi**: AI mạnh nhưng chủ yếu tối ưu cho tiếng Trung và tiếng Anh, tiếng Việt vẫn còn cứng.

**Người chiến thắng**: Mercy cho thị trường Việt Nam.

## Camera

- **Mercy MCK 5.1**: camera 12MP, quay 1080p ổn định.
- **Xiaomi AI Glasses**: 8MP, quay 720p, chống rung tốt hơn.

**Người chiến thắng**: hòa — tùy nhu cầu (chất lượng vs ổn định).

## Giá bán & bảo hành

- **Mercy**: ~5 triệu đồng, bảo hành 12 tháng chính hãng tại Việt Nam.
- **Xiaomi**: ~7 triệu đồng (xách tay), bảo hành quốc tế khó claim trong nước.

**Kết luận**: Với tầm tiền và hệ sinh thái dịch vụ tại Việt Nam, Mercy MCK 5.1 là lựa chọn thực tế hơn.`,
    image: '/banners/MCK5.1-banner.png',
    date: '02/05/2026',
    category: 'Đánh giá',
    author: 'Tech Mercy',
    views: 5670,
    daysAgo: 15,
  },
  {
    slug: 'seed-uu-dai-30-4-1-5-giam-20-toan-shop',
    title: 'Đại lễ 30/4 - 1/5: Giảm 20% toàn shop, FREESHIP toàn quốc',
    excerpt:
      'Mercy tri ân khách hàng dịp Đại lễ với chương trình giảm 20% toàn bộ sản phẩm kính thông minh, robot AI, phụ kiện. Áp dụng từ 28/04 đến 02/05/2026.',
    content: `# Đại lễ 30/4 - 1/5: Mercy giảm sốc 20%

Nhân dịp Đại lễ thống nhất đất nước 30/4 - 1/5, Mercy gửi tặng khách hàng chương trình ưu đãi lớn nhất quý 2/2026.

## Chi tiết ưu đãi

- 🎯 **Giảm 20% toàn bộ sản phẩm**, không loại trừ.
- 🚚 **Freeship toàn quốc** đơn hàng từ 1 triệu.
- 🎁 **Tặng kèm**: Bao da cao cấp + dây đeo + khăn lau cho mọi đơn hàng kính thông minh.
- 💳 **Trả góp 0%** qua thẻ tín dụng.

## Sản phẩm hot

- Kính Thông Minh AI MCK 5.0 / 5.1 / 6.0
- Kính Camera POV 5.1
- Kính Dịch Thuật KDT 5.1
- Robot AI Baby3 các phiên bản

## Thời gian áp dụng

Từ ngày **28/04/2026** đến hết **02/05/2026**. Áp dụng song song online và tại 2 cửa hàng Mercy ở Hà Nội + TP.HCM.

Đặt hàng nhanh tại website Mercy hoặc nhắn tin Zalo 0898 273 899 để được tư vấn.`,
    image: '/banner2/img.png',
    date: '28/04/2026',
    category: 'Khuyến mãi',
    author: 'Marketing Mercy',
    views: 8920,
    daysAgo: 19,
  },
  {
    slug: 'seed-content-creator-chon-kinh-camera-pov',
    title: 'Vì sao TikToker chọn Kính Camera POV thay vì GoPro?',
    excerpt:
      'Tìm hiểu lý do hơn 200 nhà sáng tạo nội dung tại Việt Nam chuyển sang dùng kính camera POV của Mercy: nhẹ, kín đáo, quay được mọi tình huống tự nhiên.',
    content: `# Vì sao Kính Camera POV "lên ngôi" trong cộng đồng content creator?

Không phải tự nhiên mà từ đầu năm 2026, hàng loạt TikToker, vlogger Việt chuyển từ GoPro/action cam sang dùng kính camera POV của Mercy.

## 1. Quay tự nhiên, không lộ liễu

Khán giả tinh ý ngày càng "ngán" những góc quay GoPro gắn ngực hay mũ. Kính POV giúp video trông như góc nhìn thật của người quay, content cuốn hơn.

## 2. Nhẹ và đeo cả ngày

Kính POV chỉ ~40g, đeo đi quay phim cả ngày không mỏi. Trong khi GoPro + dây đeo đầu thường nặng 200g+.

## 3. Tích hợp với điện thoại

Mercy POV 5.1 có thể livestream trực tiếp qua điện thoại. Một số reviewer còn tận dụng micro tích hợp để thu âm thoại tự nhiên.

## 4. Giá phải chăng

Một chiếc Mercy POV 5.1 có giá tương đương 1/2 GoPro Hero, vẫn cho chất lượng 2K đủ dùng cho TikTok, Reels.

## Một số creator dùng Mercy POV

- @mr.manhdora.macginhi (review công nghệ)
- @hoangvu.vlog (du lịch & ẩm thực)
- @longchallenge (vlog đời thường)

Nếu bạn đang xây dựng kênh và muốn quay tự nhiên hơn, Mercy POV là lựa chọn đáng cân nhắc.`,
    image: '/banners/POV5.1-banner.png',
    date: '20/04/2026',
    category: 'Xu hướng',
    author: 'Content Mercy',
    views: 3210,
    daysAgo: 27,
  },
  {
    slug: 'seed-quy-trinh-bao-hanh-12-thang-mercy',
    title: 'Quy trình bảo hành 12 tháng Mercy: nhanh, gọn, không phiền hà',
    excerpt:
      'Tất cả sản phẩm Mercy chính hãng đều được bảo hành 12 tháng. Bài viết hướng dẫn chi tiết quy trình đăng ký và xử lý bảo hành nhanh nhất.',
    content: `# Quy trình bảo hành 12 tháng Mercy

Mỗi sản phẩm Mercy mua tại website chính thức hoặc cửa hàng đều được hưởng chế độ bảo hành 12 tháng đối với lỗi nhà sản xuất.

## Phạm vi bảo hành

- Lỗi pin (chai pin trên 30%).
- Lỗi mạch chính, loa, mic.
- Lỗi camera (không bật, lệch màu, không quay được).
- Lỗi kết nối Bluetooth, Wi-Fi.

## Không bảo hành

- Hư hỏng do va đập, rơi vỡ.
- Vào nước trên IP65 (kính có quy cách chống bụi nước cấp độ 65).
- Tự ý tháo lắp.
- Mất dây, bao da, khăn lau (phụ kiện không bảo hành).

## Cách yêu cầu bảo hành

1. **Online**: nhắn Zalo 0898 273 899 với mã đơn hàng + video lỗi.
2. **Cửa hàng**: mang sản phẩm + hóa đơn đến chi nhánh Mercy gần nhất.
3. Chờ 1-3 ngày kiểm tra. Nếu xác nhận lỗi nhà sản xuất, Mercy sẽ đổi sản phẩm mới hoặc sửa miễn phí.

## Cam kết của Mercy

Trong vòng 7 ngày đầu, sản phẩm lỗi nhà sản xuất sẽ được **đổi 1 đổi 1**. Sau 7 ngày, Mercy sẽ ưu tiên sửa hoặc đổi linh kiện.`,
    image: '/banners/promo-combo.png',
    date: '12/04/2026',
    category: 'Hỗ trợ',
    author: 'Mercy Care',
    views: 1480,
    daysAgo: 35,
  },
];

async function main() {
  console.log('🌱 Seeding articles...');

  // Wipe previous seeds
  const removed = await prisma.articles.deleteMany({
    where: { slug: { startsWith: 'seed-' } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} previous seed articles`);
  }

  for (const a of seeds) {
    const created = new Date(Date.now() - a.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.articles.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        image: a.image,
        date: a.date,
        category: a.category,
        author: a.author,
        views: a.views,
        is_published: true,
        created_at: created,
        updated_at: created,
      },
    });
    console.log(`✓ ${a.title}`);
  }

  console.log(`✅ Created ${seeds.length} articles`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
