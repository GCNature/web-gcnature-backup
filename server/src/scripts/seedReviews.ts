/**
 * Seed product reviews for every active product.
 *
 * For each product we create 6–10 realistic-looking Vietnamese reviews using a
 * pool of names, avatars and category-aware review templates. The review_date
 * is randomized over the past 90 days so the storefront feels alive.
 *
 * Usage (from /server):
 *     npx tsx src/scripts/seedReviews.ts
 *
 * Idempotent: re-running first deletes any review whose reviewer_name starts
 * with "[seed]" so the count stays stable.
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/* ────────────────────────────────────────────────────────────
   Static pools
   ──────────────────────────────────────────────────────────── */
const reviewerNames = [
  'Nguyễn Minh Anh', 'Trần Hoàng Nam', 'Lê Thị Thu', 'Phạm Quốc Đạt',
  'Hoàng Thanh Tùng', 'Vũ Hồng Phúc', 'Đặng Bảo Châu', 'Bùi Khánh Linh',
  'Đỗ Tuấn Khang', 'Ngô Thị Mai', 'Dương Văn Hậu', 'Lý Bích Ngọc',
  'Trịnh Quang Vinh', 'Phan Thu Trang', 'Tạ Đức Huy', 'Cao Thanh Hằng',
  'Lưu Anh Quân', 'Hồ Hải Đăng', 'Mai Diệu Linh', 'Đinh Trọng Nghĩa',
  'Lương Phương Thảo', 'Võ Trí Dũng', 'Hà Minh Tuấn', 'Tô Khánh Vy',
  'Chu Bảo Long', 'Đoàn Thùy Dương', 'Phùng Quang Minh', 'Kiều Hoài Nam',
];

const avatarColors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500',
  'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500',
  'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-lime-500',
];

/** Buckets of review templates keyed by SKU prefix */
const templatesBySkuPrefix: Record<string, string[]> = {
  // MCK = Kính Thông Minh AI (Bluetooth)
  MCK: [
    'Đeo cả ngày không mỏi mắt, âm thanh nghe nhạc hay, gọi điện rõ ràng. Pin trâu 1 lần sạc dùng được 2 ngày.',
    'Thiết kế gọn nhẹ trẻ trung, đeo lái xe nghe chỉ đường rất tiện. Trợ lý AI phản hồi nhanh.',
    'Mua tặng vợ, vợ ưng lắm. Tròng đổi màu ngoài nắng cực chuẩn, kết nối Bluetooth ổn định.',
    'Chất lượng âm thanh ngoài mong đợi, bass rõ. Kết nối với iPhone không bị giật.',
    'Mới đầu hơi lạ vì đeo có loa, sau quen thấy thật sự tiện cho người chạy xe ngoài đường.',
    'Khen shop tư vấn rất nhiệt, đóng gói cẩn thận. Sản phẩm chính hãng, có cả thẻ bảo hành.',
    'Mic gọi điện trong phòng họp ổn, đối phương nghe rõ. Tròng kính nhẹ.',
    'Pin ngày thường 8-10h sử dụng, đủ dùng cho 1 ngày làm việc. Có nút cảm ứng nhạy.',
    'Đeo đi du lịch tiện, vừa nghe nhạc vừa che nắng UV400. Bao da đẹp.',
    'Đặt hàng xong hôm sau giao luôn. Kính nhẹ, đeo gọng êm tai.',
  ],
  // KDT = Kính Dịch Thuật
  KDT: [
    'Đi du lịch Thái Lan dùng dịch thuật realtime cực tiện, không cần mở app điện thoại.',
    'Mua cho con học tiếng Anh, tốc độ dịch nhanh, độ chính xác khá ổn so với giá.',
    'Tham gia hội thảo nước ngoài rất hữu ích, dịch tiếng Anh — Việt mượt.',
    'Pin ổn cho 1 buổi tour cả ngày. Dịch tiếng Hàn, Nhật, Trung đều test ngon.',
    'Hơi delay nhẹ với câu dài nhưng nói chậm thì rất chuẩn. Đáng tiền.',
    'Người làm xuất khẩu lao động cực thích món này. Giao tiếp với foreman nước ngoài dễ thở hơn.',
    'Gọng kính nhẹ, đeo cả ngày không thấy nặng. Có chống ánh sáng xanh tốt.',
    'Mua đúng dịp giảm giá, chất lượng vượt kỳ vọng. Hộp đựng cứng cáp.',
    'Tích hợp 40+ ngôn ngữ, có cả tiếng địa phương như Quảng Đông. Kính dịch thuật xịn nhất tầm giá.',
  ],
  // POV = Kính Camera POV
  POV: [
    'Quay vlog du lịch cực tiện, không cần cầm máy. Hình 2K rõ nét.',
    'Reviewer xe đạp dùng kính này quay POV đẹp luôn. Pin 2-3h quay liên tục.',
    'Quay con học tập tự nhiên, không bị chú ý. Mic thu âm sắc nét.',
    'Camera 32MP chụp ảnh chi tiết, file ảnh xuất ra rõ. Gọng chắc.',
    'Bán hàng livestream tay free, chỉ cần đeo kính là quay được.',
    'Quay POV làm bếp YouTube, content sống động hơn nhiều.',
    'Chống rung khá ổn, lúc đi bộ vẫn ra video xem được. Mong update firmware tốt hơn.',
    'Đi phượt quay đường đèo cực phê. Lưu thẳng vào điện thoại qua Wi-Fi.',
    'Giá hợp lý so với GoPro nhỏ gọn này. Dùng ổn định cho người mới làm content.',
  ],
  // Robot AI / RB
  RB: [
    'Bé nhà mình mê tít, suốt ngày trò chuyện với bot. Mắt LED biểu cảm dễ thương.',
    'Mua làm quà sinh nhật cháu 6 tuổi, cháu vui ơi là vui. Tặng kèm sách hướng dẫn.',
    'Bot phát âm tiếng Anh chuẩn, hỗ trợ con học từ vựng tốt.',
    'Pin ổn, sạc nhanh. Đặt câu hỏi đơn giản đáp lại có lý.',
    'Thiết kế đáng yêu, nhiều phiên bản (Capy, Gấu Trúc, Thỏ) tha hồ chọn.',
    'Tương tác giọng nói nhạy, con thích. App điều khiển cũng dễ dùng.',
    'So với mấy đồ chơi giáo dục khác giá tương đương thì con này thông minh hơn nhiều.',
  ],
  // Phụ kiện / fallback
  BD: [
    'Bao da chính hãng, da mềm, ôm sát kính. Đẹp và bảo vệ kính tốt.',
    'Đường chỉ may chắc chắn, đeo bên hông cool ngầu. Đáng mua.',
    'Có khóa từ tính tiện lấy ra cất vào. Hợp với kính Mercy của mình.',
    'Tặng kèm khăn lau, thực sự ưng cả combo. Shop chu đáo.',
  ],
};

const fallbackTemplates = [
  'Sản phẩm chất lượng, đóng gói cẩn thận, ship nhanh. Mercy tư vấn nhiệt tình.',
  'Mua dùng đã 2 tuần, chưa thấy lỗi gì. Đáng tiền.',
  'Bảo hành 12 tháng yên tâm, nhân viên hỗ trợ dễ thương.',
  'Tặng kèm phụ kiện đầy đủ. Sẽ ủng hộ Mercy lần tới.',
  'Hộp đẹp, sản phẩm chính hãng. Khen shop.',
];

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function templatesForProduct(productSku: string, productName: string): string[] {
  const sku = (productSku || productName || '').toUpperCase();
  for (const prefix of Object.keys(templatesBySkuPrefix)) {
    if (sku.startsWith(prefix) || sku.includes(prefix)) {
      return templatesBySkuPrefix[prefix];
    }
  }
  return fallbackTemplates;
}

function randomDateWithinPastDays(days: number): Date {
  const now = Date.now();
  const offset = Math.floor(Math.random() * days * 24 * 3600_000);
  return new Date(now - offset);
}

function formatDateLabel(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Weighted rating: mostly 5★, some 4★, occasional 3★, rare lower */
function weightedRating(): number {
  const r = Math.random();
  if (r < 0.65) return 5;
  if (r < 0.9) return 4;
  if (r < 0.97) return 3;
  return randInt(1, 2);
}

/* ────────────────────────────────────────────────────────────
   Main
   ──────────────────────────────────────────────────────────── */
async function main() {
  console.log('🌱 Seeding product reviews...');

  const products = await prisma.products.findMany({
    where: { is_active: true },
    select: { id: true, product_id: true, sku: true, name: true },
  });
  if (products.length === 0) {
    console.error('❌ No active products. Aborting.');
    process.exit(1);
  }
  console.log(`Found ${products.length} active products`);

  // Wipe previous seeded reviews (idempotent)
  const removed = await prisma.product_reviews.deleteMany({
    where: { reviewer_name: { startsWith: '[seed]' } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} previous seed reviews`);
  }

  let totalCreated = 0;
  for (const p of products) {
    const sku = (p as any).sku || p.product_id;
    const templates = templatesForProduct(sku, p.name);
    const count = randInt(6, 10);

    const rows = Array.from({ length: count }).map((_, i) => {
      const reviewer = pick(reviewerNames);
      const rating = weightedRating();
      const date = randomDateWithinPastDays(90);
      const text = pick(templates);
      return {
        product_id: p.product_id,
        reviewer_name: `[seed] ${reviewer}`,
        avatar_letter: reviewer.charAt(0).toUpperCase(),
        avatar_color: pick(avatarColors),
        rating,
        review_date: formatDateLabel(date),
        review_text: text,
        is_verified: Math.random() < 0.6, // 60% verified
        helpful_count: randInt(0, 35),
        is_active: true,
        sort_order: i,
        created_at: date,
      };
    });

    await prisma.product_reviews.createMany({ data: rows });
    totalCreated += rows.length;
  }

  console.log(`✓ Created ${totalCreated} reviews across ${products.length} products`);
  console.log('✅ Seed complete!');
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
