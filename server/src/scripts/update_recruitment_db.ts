import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const jobs = [
  {
    id: 'job-1',
    title: 'Thực tập sinh Thương mại điện tử (E-commerce Intern)',
    department: 'ecom',
    departmentName: 'TMĐT',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Đam mê vận hành gian hàng Shopee, TikTok Shop, Lazada, hỗ trợ flashsale, quản lý kho & tối ưu doanh số mỹ phẩm Hàn Quốc.',
    jdFileUrl: '/uploads/jd/GC_NATURE_TUYỂN_DỤNG_THỰC_TẬP_SINH_THƯƠNG_MẠI_ĐIỆN_TỬ.pdf',
    jdFileName: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH THƯƠNG MẠI ĐIỆN TỬ.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Hỗ trợ đăng tải sản phẩm, thiết kế giao diện gian hàng Shopee / TikTok Shop / Lazada.</p><p>- Quản lý đơn hàng, phản hồi tin nhắn khách hàng & hỗ trợ chuẩn bị sản phẩm cho phiên livestream.</p><p>- Tham gia cài đặt chương trình khuyến mãi Flashsale, Voucher giảm giá & tối ưu doanh số.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Đam mê ngành hàng Mỹ phẩm Skincare Hàn Quốc.</p><p>- Nhanh nhẹn, có tinh thần trách nhiệm & tư duy E-Commerce năng động.</p><h3>3. QUYỀN LỢI & THƯỞNG</h3><p>- Phụ cấp thực tập + Thưởng % doanh số gian hàng hấp dẫn.</p><p>- Được đào tạo bài bản 1-on-1 từ Trưởng phòng E-Commerce.</p><p>- Hỗ trợ con dấu xác nhận thực tập cho sinh viên.</p>',
    isActive: true
  },
  {
    id: 'job-2',
    title: 'Thực tập sinh SEO Websites',
    department: 'seo',
    departmentName: 'SEO',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Nghiên cứu bộ từ khóa xu hướng mỹ phẩm Hàn Quốc, viết bài chuẩn SEO Onpage và tối ưu thứ hạng website GCnature.',
    jdFileUrl: '/uploads/jd/GC_NATURE_TUYỂN_DỤNG_THỰC_TẬP_SINH_SEO.pdf',
    jdFileName: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH SEO.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Nghiên cứu từ khóa xu hướng Skincare & Làm đẹp chuẩn Hàn Quốc.</p><p>- Viết và tối ưu bài viết bài viết kiến thức chăm sóc da chuẩn SEO Onpage trên website GCnature.</p><p>- Kiểm tra backlink, thứ hạng Google & hỗ trợ tối ưu trải nghiệm người dùng trên website.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Đam mê công việc SEO, làm nội dung blog & tối ưu công cụ tìm kiếm Google.</p><p>- Có kỹ năng viết lách tốt, cẩn thận, ham học hỏi.</p><h3>3. QUYỀN LỢI</h3><p>- Trợ cấp hàng tháng + Thưởng KPI bài viết đạt top Google.</p><p>- Được hướng dẫn quy trình SEO Onpage/Offpage thực chiến chuyên sâu.</p>',
    isActive: true
  },
  {
    id: 'job-3',
    title: 'Thực tập sinh Marketing / Content',
    department: 'marketing',
    departmentName: 'Marketing',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Sáng tạo nội dung Fanpage, Instagram, thiết kế hình ảnh banner & xây dựng kịch bản truyền thông mỹ phẩm.',
    jdFileUrl: '/uploads/jd/TUYỂN_DỤNG_THỰC_TẬP_SINH_MARKETING.pdf',
    jdFileName: 'TUYỂN DỤNG_ THỰC TẬP SINH MARKETING.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Sáng tạo ý tưởng nội dung bài đăng Fanpage Facebook, Instagram, TikTok.</p><p>- Lên kịch bản video ngắn và phối hợp với đội ngũ Video Editor để quay dựng.</p><p>- Lập kế hoạch truyền thông cho các dòng sản phẩm mặt nạ, serum, kem dưỡng GCnature.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Có khả năng tư duy sáng tạo nội dung bắt trend nhanh.</p><p>- Yêu thích làm đẹp, hiểu biết về các thành phần dưỡng da Hàn Quốc.</p><h3>3. QUYỀN LỢI</h3><p>- Môi trường làm việc Gen Z năng động, sáng tạo.</p><p>- Phụ cấp hàng tháng & cơ hội trở thành Nhân viên chính thức sau 3 tháng.</p>',
    isActive: true
  },
  {
    id: 'job-4',
    title: 'Thực tập sinh Truyền thông & Thương hiệu',
    department: 'media',
    departmentName: 'Truyền thông',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Kết nối KOC/KOL làm đẹp, gửi mẫu trải nghiệm sản phẩm, hỗ trợ PR sự kiện thương hiệu mỹ phẩm.',
    jdFileUrl: '/uploads/jd/TUYỂN_DỤNG_THỰC_TẬP_SINH_TRUYỀN_THÔNG.pdf',
    jdFileName: 'TUYỂN DỤNG_ THỰC TẬP SINH TRUYỀN THÔNG.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Tìm kiếm, kết nối và đàm phán hợp tác với KOL/KOC trong lĩnh vực Mỹ phẩm & Skincare.</p><p>- Điều phối gửi sản phẩm mẫu trải nghiệm và theo dõi bài đăng của KOL/KOC.</p><p>- Hỗ trợ chuẩn bị sự kiện ra mắt sản phẩm mới và thông tin PR báo chí.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Kỹ năng giao tiếp, đàm phán tốt & nhạy bén với các Beauty Influencer trên Social.</p><p>- Năng nổ, chủ động trong công việc.</p><h3>3. QUYỀN LỢI</h3><p>- Trợ cấp hấp dẫn + Thưởng chương trình hợp tác KOL/KOC thành công.</p>',
    isActive: true
  },
  {
    id: 'job-5',
    title: 'Nhân viên Truyền thông (Chính thức)',
    department: 'media',
    departmentName: 'Truyền thông',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Toàn thời gian (Full-time)',
    excerpt: 'Lập kế hoạch chiến dịch truyền thông tổng thể, định vị thương hiệu mỹ phẩm Hàn Quốc GCnature trên đa kênh.',
    jdFileUrl: '/uploads/jd/TUYỂN_DỤNG_NHÂN_VIÊN_TRUYỀN_THÔNG.pdf',
    jdFileName: 'TUYỂN DỤNG_ NHÂN VIÊN TRUYỀN THÔNG.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Xây dựng và triển khai chiến lược truyền thông thương hiệu GCnature trên Báo chí, Mạng xã hội & Event.</p><p>- Quản lý mối quan hệ với đối tác truyền thông, cơ quan báo chí & Agency.</p><p>- Đo lường hiệu quả các chiến dịch PR Thương hiệu và điều chỉnh tối ưu.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Tốt nghiệp đại học chuyên ngành Truyền thông, PR, Marketing hoặc liên quan.</p><p>- Có từ 1-2 năm kinh nghiệm trong ngành Mỹ phẩm, Skincare hoặc FMCG.</p><h3>3. QUYỀN LỢI</h3><p>- Lương cứng cạnh tranh từ 10 - 15 triệu + Thưởng KPI chiến dịch.</p><p>- Thưởng tháng 13, BHXH đầy đủ & du lịch hàng năm.</p>',
    isActive: true
  },
  {
    id: 'job-6',
    title: 'Thực tập sinh Livestream TikTok / Shopee',
    department: 'livestream',
    departmentName: 'Livestream',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Hỗ trợ vận hành phiên live, ghim deal flashsale, tư vấn sản phẩm và tương tác với người xem phiên livestream.',
    jdFileUrl: '/uploads/jd/TUYỂN_DỤNG_THỰC_TẬP_SINH_LIVESTREAM_TIK_TOK_SHOPEE.pdf',
    jdFileName: 'TUYỂN DỤNG_ THỰC TẬP SINH LIVESTREAM TIK TOK_SHOPEE.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Trợ lý phiên live: Ghim sản phẩm, tung voucher flashsale & điều phối kỹ thuật Studio Live.</p><p>- Tham gia cùng Host đứng phiên livestream tư vấn công dụng mặt nạ, serum GCnature.</p><p>- Tổng hợp số liệu doanh thu sau mỗi ca live để báo cáo cải thiện.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Tự tin, ngoại hình sáng, nói chuyện lưu thoát & tự nhiên trước ống kính.</p><p>- Đam mê bán hàng Livestream Commerce.</p><h3>3. QUYỀN LỢI</h3><p>- Phụ cấp ca live + Thưởng doanh số livestream siêu hấp dẫn.</p>',
    isActive: true
  },
  {
    id: 'job-7',
    title: 'Chuyên viên Livestream (Host Live Chính thức)',
    department: 'livestream',
    departmentName: 'Livestream',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Toàn thời gian (Full-time)',
    excerpt: 'Trực tiếp đứng phiên livestream tư vấn chốt đơn các sản phẩm mỹ phẩm Hàn Quốc trên TikTok Shop & Shopee Live.',
    jdFileUrl: '/uploads/jd/TUYỂN_DỤNG_LIVESTREAM_TIK_TOK_SHOPEE.pdf',
    jdFileName: 'TUYỂN DỤNG_ LIVESTREAM TIK TOK_SHOPEE.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Đứng phiên livestream chính tư vấn chi tiết thành phần, công dụng & ưu đãi mỹ phẩm GCnature.</p><p>- Làm chủ không khí ca live, tương tác nảy lửa với khách hàng để chốt đơn hàng liên tục.</p><p>- Phối hợp với team E-Commerce chuẩn bị độc quyền deal Flashsale siêu hời.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Đã có kinh nghiệm Livestream bán hàng Mỹ phẩm / Thời trang / Skincare thành thạo.</p><p>- Giọng nói chuẩn, năng lượng cao, biết cách chốt deal tự nhiên.</p><h3>3. QUYỀN LỢI</h3><p>- Lương thỏa thuận cao (8 - 18 triệu) + % HOA HỒNG CHIẾT KHẤU DOANH SỐ CA LIVE BỨC PHÁ.</p>',
    isActive: true
  },
  {
    id: 'job-8',
    title: 'Thực tập sinh Video Editor (Quay Dựng)',
    department: 'editor',
    departmentName: 'Video Editor',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Quay & biên tập video ngắn TikTok/Reels, cắt dựng clip trải nghiệm mặt nạ, serum, góc quay ấn tượng.',
    jdFileUrl: '/uploads/jd/TUYỂN_DỤNG_THỰC_TẬP_SINH_EDITOR.pdf',
    jdFileName: 'TUYỂN DỤNG_ THỰC TẬP SINH EDITOR.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Hỗ trợ quay phim và dựng video ngắn TikTok, Reels, Shorts về sản phẩm mỹ phẩm GCnature.</p><p>- Chèn hiệu ứng sound effect, subtitle và tối ưu màu sắc hình ảnh thu hút.</p><p>- Theo dõi xu hướng video làm đẹp bắt mắt trên TikTok.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Sử dụng cơ bản CapCut, Premiere Pro, Photoshop hoặc Canva.</p><p>- Gu thẩm mỹ tốt, đam mê lĩnh vực sản xuất video ngắn.</p><h3>3. QUYỀN LỢI</h3><p>- Phụ cấp hàng tháng + Thưởng theo lượng view video đạt mốc xu hướng.</p>',
    isActive: true
  },
  {
    id: 'job-9',
    title: 'Nhân viên Video Editor (Chính thức)',
    department: 'editor',
    departmentName: 'Video Editor',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Toàn thời gian (Full-time)',
    excerpt: 'Phụ trách toàn bộ quy trình sản xuất video quảng cáo TikTok Ads, Reels, Youtube Shorts chuyên nghiệp.',
    jdFileUrl: '/uploads/jd/Tuyển_dụng_nhân_viên_Editor.pdf',
    jdFileName: 'Tuyển dụng nhân viên Editor.pdf',
    contentHtml: '<h3>1. MÔ TẢ CÔNG VIỆC</h3><p>- Lên ý tưởng góc quay, đạo diễn hình ảnh & dựng hoàn chỉnh video ngắn quảng cáo mỹ phẩm Hàn Quốc.</p><p>- Tối ưu định dạng video chạy quảng cáo TikTok Ads, Meta Ads đạt tỷ lệ chuyển đổi cao.</p><p>- Quản lý hệ thống lưu trữ tài nguyên hình ảnh & video thương hiệu.</p><h3>2. YÊU CẦU ỨNG VIÊN</h3><p>- Thành thạo Adobe Premiere, After Effects, Photoshop.</p><p>- Đã có sản phẩm video ngắn hoặc portfolio từng thực hiện thành công.</p><h3>3. QUYỀN LỢI</h3><p>- Lương cứng 9 - 14 triệu + Thưởng KPI doanh số video quảng cáo.</p><p>- Môi trường sáng tạo, thiết bị làm việc hiện đại.</p>',
    isActive: true
  }
];

async function run() {
  const payload = {
    title: 'GC Nature Tuyển Dụng',
    desc: 'Gia nhập nhà GC Nature chúng mình để cùng sáng tạo những ý tưởng tiếp thị độc đáo, cùng học hỏi và kiến tạo giá trị thương hiệu mỹ phẩm tự nhiên chuẩn Hàn Quốc!',
    tabsConfig: jobs,
    sections: [],
    updatedAt: new Date().toISOString()
  };

  await prisma.settings.upsert({
    where: { key: 'page_recruitment' },
    update: { value: JSON.stringify(payload) },
    create: { key: 'page_recruitment', value: JSON.stringify(payload) }
  });

  console.log('Successfully updated DB page_recruitment settings with all 9 positions and PDF links!');
}

run().finally(() => prisma.$disconnect());
