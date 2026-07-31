import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const fullJobs = [
  {
    id: 'job-1',
    title: 'Thực tập sinh Thương mại điện tử (E-commerce Intern)',
    department: 'ecom',
    departmentName: 'TMĐT',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Đam mê vận hành gian hàng Shopee, TikTok Shop, Lazada, hỗ trợ flashsale, quản lý kho & tối ưu doanh số mỹ phẩm Hàn Quốc.',
    jdFileUrl: '/uploads/jd/jd-ecom-intern.pdf',
    jdFileName: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH THƯƠNG MẠI ĐIỆN TỬ.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Hỗ trợ quản lý và vận hành gian hàng chính hãng trên các sàn TMĐT: Shopee, Lazada, TikTok Shop.</li>
          <li>Đăng tải sản phẩm mới, cập nhật hình ảnh banner, trang trí gian hàng và tối ưu từ khóa SEO cho sản phẩm.</li>
          <li>Cài đặt và thiết lập các chương trình khuyến mãi, Flash Sale, Voucher giảm giá, Combo mua kèm giá sốc theo kế hoạch của Trưởng phòng.</li>
          <li>Theo dõi và xử lý đơn hàng hàng ngày, hỗ trợ kiểm soát hàng tồn kho và phản hồi tin nhắn khách hàng nhanh chóng.</li>
          <li>Tham gia hỗ trợ các đợt Siêu Sale lớn hàng tháng (Spike Day 9.9, 10.10, 11.11, 12.12) và chuẩn bị sản phẩm mẫu cho phiên Livestream.</li>
          <li>Theo dõi, tổng hợp báo cáo chỉ số doanh thu, tỷ lệ chuyển đổi gian hàng theo tuần và tháng.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Sinh viên năm 3, 4 hoặc vừa tốt nghiệp các chuyên ngành Thương mại điện tử, Marketing, Quản trị kinh doanh, Kinh tế.</li>
          <li>Yêu thích và có hiểu biết cơ bản về ngành hàng Mỹ phẩm Skincare & Chăm sóc da chuẩn Hàn Quốc.</li>
          <li>Có kỹ năng tin học văn phòng tốt, biết sử dụng Excel/Google Sheets phục vụ thống kê số liệu.</li>
          <li>Cẩn thận, tỉ mỉ, có trách nhiệm cao trong công việc và chịu được áp lực tiến độ chiến dịch bán hàng.</li>
          <li>Ưu tiên ứng viên đã từng có kinh nghiệm làm việc hoặc bán hàng trên Shopee/TikTok Shop.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI & PHỤ CẤP</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Phụ cấp thực tập: 3.000.000đ - 5.000.000đ/tháng + Thưởng % Doanh số gian hàng TMĐT.</li>
          <li>Được hướng dẫn và đào tạo bài bản 1-on-1 trực tiếp từ Trưởng phòng E-Commerce giàu kinh nghiệm.</li>
          <li>Cung cấp dấu xác nhận thực tập và nhận xét báo cáo thực tập tốt nghiệp cho sinh viên.</li>
          <li>Trải nghiệm miễn phí các dòng sản phẩm mỹ phẩm Hàn Quốc cao cấp của GCnature.</li>
          <li>Cơ hội xét duyệt trở thành Nhân viên chính thức sau 3 tháng thực tập.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">4. THỜI GIAN VÀ ĐỊA ĐIỂM LÀM VIỆC</h3>
        <p>- <strong>Địa điểm:</strong> S1.06 Vinhomes Smart City & 111 Phố Trung Phụng, Đống Đa, Hà Nội.</p>
        <p>- <strong>Thời gian:</strong> Thứ 2 - Thứ 7 (Ca linh hoạt cho sinh viên, tối thiểu 6 ca/tuần).</p>
      </div>
    `
  },
  {
    id: 'job-2',
    title: 'Thực tập sinh SEO Websites',
    department: 'seo',
    departmentName: 'SEO',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Nghiên cứu bộ từ khóa xu hướng mỹ phẩm Hàn Quốc, viết bài chuẩn SEO Onpage và tối ưu thứ hạng website GCnature.',
    jdFileUrl: '/uploads/jd/jd-seo-intern.pdf',
    jdFileName: '[GC NATURE] TUYỂN DỤNG_ THỰC TẬP SINH SEO.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Nghiên cứu từ khóa xu hướng về Mỹ phẩm, Skincare Hàn Quốc, Mặt nạ CICA, Serum phục hồi da, Kem dưỡng ẩm.</li>
          <li>Viết và biên tập bài viết kiến thức làm đẹp, chăm sóc da chuẩn SEO Onpage trên Website thương hiệu GCnature.</li>
          <li>Tối ưu tiêu đề (Meta Title), thẻ mô tả (Meta Description), thẻ Heading (H1, H2, H3), đường dẫn URL và Alt ảnh.</li>
          <li>Xây dựng mạng lưới liên kết nội bộ (Internal Link) và phối hợp xây dựng hệ thống vệ tinh, Backlink chất lượng cao.</li>
          <li>Theo dõi thứ hạng từ khóa và lượng truy cập Website hàng tuần qua công cụ Google Search Console & Google Analytics.</li>
          <li>Hỗ trợ tối ưu trải nghiệm giao diện người dùng (UX/UI) bài viết trên giao diện máy tính và điện thoại.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Sinh viên hoặc người mới tốt nghiệp đam mê ngành Marketing số, SEO và sáng tạo nội dung Website.</li>
          <li>Kỹ năng viết lách tốt, hành văn mạch lạc, hấp dẫn, đúng chính tả và chuẩn ngữ pháp Tiếng Việt.</li>
          <li>Hiểu biết cơ bản về thuật toán Google Search hoặc sử dụng các công cụ Ahrefs, Semrush, Google Keyword Planner là lợi thế.</li>
          <li>Kỷ luật, cẩn thận, có trách nhiệm với tiến độ bài viết được giao.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI & PHỤ CẤP</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Phụ cấp thực tập: 3.000.000đ - 5.000.000đ/tháng + Thưởng KPI theo bài viết đạt Top Google.</li>
          <li>Đào tạo chuyên sâu quy trình SEO Onpage/Offpage và tư duy Content Marketing từ Chuyên gia SEO.</li>
          <li>Cung cấp con dấu xác nhận thực tập tốt nghiệp.</li>
          <li>Tham gia các hoạt động Teambuilding, sinh nhật và trải nghiệm mỹ phẩm miễn phí.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'job-3',
    title: 'Thực tập sinh Marketing / Content',
    department: 'marketing',
    departmentName: 'Marketing',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Sáng tạo nội dung Fanpage, Instagram, thiết kế hình ảnh banner & xây dựng kịch bản truyền thông mỹ phẩm.',
    jdFileUrl: '/uploads/jd/jd-mkt-intern.pdf',
    jdFileName: 'TUYỂN DỤNG_ THỰC TẬP SINH MARKETING.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Sáng tạo và lên kế hoạch nội dung hàng tuần/tháng cho các kênh Truyền thông: Facebook Fanpage, Instagram, TikTok.</li>
          <li>Viết bài quảng cáo sản phẩm, bài chia sẻ mẹo làm đẹp, Skincare routine chuẩn Hàn Quốc.</li>
          <li>Lên ý tưởng kịch bản video ngắn (Reels, TikTok) và phối hợp với đội ngũ Video Editor để tiến hành quay dựng.</li>
          <li>Phối hợp với Designer để lên thiết kế Banner quảng cáo, Infographic, hình ảnh chiến dịch khuyến mãi.</li>
          <li>Theo dõi chỉ số tương tác (Like, Share, Comment, Reach) bài viết và báo cáo hiệu quả nội dung.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Yêu thích làm đẹp, Mỹ phẩm Skincare và có tư duy sáng tạo nội dung bắt trend Gen Z nhanh nhạy.</li>
          <li>Khả năng viết lách đa dạng phong cách, ngôn từ tự nhiên và cuốn hút.</li>
          <li>Biết sử dụng cơ bản các phần mềm thiết kế/dựng video đơn giản như Canva, CapCut là điểm cộng lớn.</li>
          <li>Năng nổ, cởi mở, có tinh thần làm việc nhóm tích cực.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI & THƯỞNG</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Phụ cấp thực tập: 3.000.000đ - 5.000.000đ/tháng + Thưởng thưởng ý tưởng nội dung xuất sắc.</li>
          <li>Được học hỏi kiến thức Marketing Omnichannel thực chiến trong ngành Mỹ phẩm cao cấp.</li>
          <li>Cơ hội thăng tiến lên Nhân viên Marketing chính thức sau kỳ thực tập.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'job-4',
    title: 'Thực tập sinh Truyền thông & Thương hiệu',
    department: 'media',
    departmentName: 'Truyền thông',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Kết nối KOC/KOL làm đẹp, gửi mẫu trải nghiệm sản phẩm, hỗ trợ PR sự kiện thương hiệu mỹ phẩm.',
    jdFileUrl: '/uploads/jd/jd-media-intern.pdf',
    jdFileName: 'TUYỂN DỤNG_ THỰC TẬP SINH TRUYỀN THÔNG.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Tìm kiếm, kết nối và liên hệ hợp tác với danh sách KOC, KOL, Beauty Influencer phù hợp với hình ảnh thương hiệu GCnature.</li>
          <li>Điều phối gửi sản phẩm mẫu trải nghiệm (Mặt nạ CICA, Serum, Kem dưỡng) tới các Creator.</li>
          <li>Theo dõi tiến độ, kiểm duyệt kịch bản bài đăng và nghiệm thu link video review trên TikTok / Instagram / Facebook.</li>
          <li>Hỗ trợ biên soạn nội dung PR, thông cáo báo chí và các bài viết đối ngoại của công ty.</li>
          <li>Hỗ trợ tổ chức các sự kiện ra mắt sản phẩm mới, Workshop tư vấn da và sự kiện tri ân khách hàng.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Kỹ năng giao tiếp khéo léo, đàm phán tốt và tự tin khi thiết lập mối quan hệ với KOL/KOC.</li>
          <li>Thường xuyên cập nhật xu hướng mạng xã hội và theo dõi các Creator trong mảng Beauty & Skincare.</li>
          <li>Năng động, nhanh nhạy trong xử lý tình huống và chịu trách nhiệm với công việc.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI & THƯỞNG</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Phụ cấp thực tập: 3.000.000đ - 5.000.000đ/tháng + Thưởng chương trình booking KOC thành công.</li>
          <li>Mở rộng mạng lưới mối quan hệ rộng lớn với dàn KOC/KOL nổi tiếng trong giới Beauty.</li>
          <li>Hỗ trợ con dấu xác nhận thực tập.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'job-5',
    title: 'Nhân viên Truyền thông (Chính thức)',
    department: 'media',
    departmentName: 'Truyền thông',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Toàn thời gian (Full-time)',
    excerpt: 'Lập kế hoạch chiến dịch truyền thông tổng thể, định vị thương hiệu mỹ phẩm Hàn Quốc GCnature trên đa kênh.',
    jdFileUrl: '/uploads/jd/jd-media-staff.pdf',
    jdFileName: 'TUYỂN DỤNG_ NHÂN VIÊN TRUYỀN THÔNG.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Xây dựng và lập kế hoạch chiến lược truyền thông PR tổng thể định vị thương hiệu GCnature trên toàn quốc.</li>
          <li>Quản lý ngân sách PR, làm việc trực tiếp với các đơn vị Báo chí, Tạp chí thời trang/làm đẹp và cơ quan truyền hình.</li>
          <li>Chủ trì đàm phán hợp đồng truyền thông chiến lược, chương trình bảo trợ thông tin và hợp tác thương hiệu.</li>
          <li>Quản trị các rủi ro truyền thông (Crisis Management), xây dựng hình ảnh thương hiệu uy tín, nhân văn.</li>
          <li>Lên kịch bản và chịu trách nhiệm tổ chức các sự kiện họp báo ra mắt sản phẩm, Event làm đẹp.</li>
          <li>Đo lường, phân tích hiệu quả các chiến dịch PR (SOV, ROI, Brand Awareness) và gửi báo cáo cho Ban Giám Đốc.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Tốt nghiệp Đại học chuyên ngành Truyền thông, PR, Báo chí, Quản trị thương hiệu hoặc Marketing.</li>
          <li>Có kinh nghiệm từ 1 - 3 năm làm vị trí Truyền thông / PR trong ngành Mỹ phẩm, Skincare hoặc FMCG.</li>
          <li>Có mối quan hệ làm việc sẵn có với các nhà báo, biên tập viên và đơn vị Truyền thông lớn.</li>
          <li>Tư duy chiến lược thương hiệu sắc bén, khả năng lãnh đạo dự án tốt.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI & ĐÃI NGỘ</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Lương cứng hấp dẫn: 10.000.000đ - 18.000.000đ/tháng + Thưởng KPI chiến dịch truyền thông.</li>
          <li>Đóng đầy đủ BHXH, BHYT, BHTN theo quy định pháp luật Lao động.</li>
          <li>Thưởng tháng lương thứ 13, thưởng các ngày Lễ Tết và quà tặng sinh nhật.</li>
          <li>Nghỉ mát du lịch hàng năm 1 - 2 lần, teambuilding thường xuyên.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'job-6',
    title: 'Thực tập sinh Livestream TikTok / Shopee',
    department: 'livestream',
    departmentName: 'Livestream',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Ca linh hoạt / Toàn thời gian',
    excerpt: 'Hỗ trợ setup phòng stream, chuẩn bị mẫu thử mỹ phẩm, tương tác với người xem và chốt đơn trực tiếp trên live.',
    jdFileUrl: '/uploads/jd/jd-live-intern.pdf',
    jdFileName: 'TUYỂN DỤNG_ THỰC TẬP SINH LIVESTREAM.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Chuẩn bị không gian phòng livestream: kiểm tra ánh sáng, máy quay, micro âm thanh và bảng mã giảm giá.</li>
          <li>Sắp xếp, bài trí và chuẩn bị các sản phẩm mỹ phẩm mẫu thử trước mỗi giờ lên sóng.</li>
          <li>Hỗ trợ Host/Streamer trong suốt phiên live: ghim sản phẩm, đổi mã khuyến mãi, đọc câu hỏi của người xem.</li>
          <li>Tham gia hỗ trợ kỹ thuật và chuẩn bị hàng hóa trong các phiên Mega Live kéo dài 8h - 12h.</li>
          <li>Thống kê chỉ số sau phiên livestream: lượt xem, mắt xem trung bình, doanh thu và danh sách quà tặng.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Tự tin, ngoại hình khá, giọng nói rõ ràng, dễ nghe và nhanh nhạy.</li>
          <li>Đam mê công việc bán hàng qua ứng dụng Livestream trực tiếp.</li>
          <li>Sẵn sàng làm việc theo ca linh hoạt (có thể làm ca tối hoặc ca ngày nghỉ lễ).</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Phụ cấp theo ca live + Thưởng % Doanh số phiên livestream.</li>
          <li>Được đào tạo kỹ năng lên hình và cơ hội trở thành VJ / Streamer chính thức ngành Mỹ phẩm.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'job-7',
    title: 'Nhân viên Thiết kế Đồ họa (Graphic Designer)',
    department: 'design',
    departmentName: 'Thiết kế',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Toàn thời gian (Full-time)',
    excerpt: 'Thiết kế banner website, hình ảnh sản phẩm Shopee/TikTok Shop, bộ nhận diện thương hiệu & bao bì mỹ phẩm.',
    jdFileUrl: '/uploads/jd/jd-designer-staff.pdf',
    jdFileName: 'TUYỂN DỤNG_ NHÂN VIÊN THIẾT KẾ ĐỒ HỌA.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Thiết kế Banner giao diện Website, Banner gian hàng Shopee, Lazada, TikTok Shop theo đúng phong cách mỹ phẩm Hàn Quốc cao cấp.</li>
          <li>Thiết kế hình ảnh bài đăng Social Media (Facebook, Instagram, Zalo) phục vụ các chiến dịch Marketing.</li>
          <li>Thiết kế các ấn phẩm in ấn: Bao bì sản phẩm, Tem nhãn, Gift Box, Standee, Catalog, Brochure sự kiện.</li>
          <li>Phối hợp với đội ngũ Content đảm bảo tính thẩm mỹ, nhất quán của Bộ nhận diện thương hiệu GCnature.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Tốt nghiệp chuyên ngành Thiết kế đồ họa hoặc có chứng chỉ thiết kế mỹ thuật chuyên nghiệp.</li>
          <li>Thành thạo các công cụ thiết kế: Adobe Photoshop, Illustrator, InDesign (biết sử dụng Premiere / CapCut là lợi thế lớn).</li>
          <li>Có gu thẩm mỹ tinh tế, sang trọng, cập nhật xu hướng thiết kế mỹ phẩm Châu Á & Hàn Quốc.</li>
          <li>Có Portfolio thể hiện các sản phẩm thiết kế thực tế ấn tượng.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Lương cứng: 9.000.000đ - 15.000.000đ/tháng + Thưởng hiệu suất dự án.</li>
          <li>BHXH, BHYT đầy đủ, môi trường làm việc sáng tạo, chuyên nghiệp.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'job-8',
    title: 'Nhân viên Vận hành TikTok Shop (TikTok Operator)',
    department: 'tiktok',
    departmentName: 'TikTok',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Toàn thời gian (Full-time)',
    excerpt: 'Tối ưu gian hàng TikTok Shop, cài đặt Affiliate MCN cho KOC/KOL, booking sáng tạo nội dung & tăng trưởng GMV.',
    jdFileUrl: '/uploads/jd/jd-tiktok-operator.pdf',
    jdFileName: 'TUYỂN DỤNG_ NHÂN VIÊN VẬN HÀNH TIKTOK SHOP.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Chịu trách nhiệm quản lý và tăng trưởng doanh số (GMV) toàn bộ gian hàng TikTok Shop của GCnature.</li>
          <li>Quản lý hệ thống Tiếp thị liên kết (Affiliate), mời và duyệt hàng trăm KOC/KOL gắn giỏ hàng bán sản phẩm.</li>
          <li>Cài đặt Flash Sale, mã giảm giá, chiến dịch quảng cáo TikTok Shop Ads và các chương trình của sàn.</li>
          <li>Theo dõi các chỉ số vận hành gian hàng (Tỷ lệ hoàn hủy, điểm sức khỏe shop, tốc độ giao hàng) đảm bảo chuẩn chất lượng TikTok.</li>
          <li>Phân tích báo cáo hiệu quả kinh doanh hàng tuần/tháng và đề xuất giải pháp tối ưu nguồn lực.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Tối thiểu 1 năm kinh nghiệm ở vị trí Vận hành TikTok Shop (Ưu tiên ngành Mỹ phẩm/Beauty).</li>
          <li>Hiểu rõ chính sách gian hàng TikTok Shop, thuật toán hiển thị video và luồng Livestream.</li>
          <li>Kỹ năng đọc hiểu số liệu dữ liệu tốt, có tư duy thương mại sắc bén.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI & ĐÃI NGỘ</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Lương cứng: 10.000.000đ - 18.000.000đ/tháng + Thưởng % GMV TikTok Shop.</li>
          <li>Cơ hội thăng tiến lên Trưởng nhóm vận hành TikTok Shop.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'job-9',
    title: 'Nhân viên Chăm sóc Khách hàng & Sales Online',
    department: 'sales',
    departmentName: 'Tư vấn / CSKH',
    location: 'S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội',
    type: 'Toàn thời gian / Theo ca',
    excerpt: 'Tư vấn chu trình Skincare phù hợp cho khách hàng qua Fanpage/Zalo/Website, chốt đơn và xử lý khiếu nại cẩn thận.',
    jdFileUrl: '/uploads/jd/jd-cskh-staff.pdf',
    jdFileName: 'TUYỂN DỤNG_ NHÂN VIÊN CHĂM SÓC KHÁCH HÀNG.pdf',
    isActive: true,
    contentHtml: `
      <div class="space-y-4 text-slate-700 leading-relaxed text-sm">
        <h3 class="text-base font-extrabold text-slate-900 mt-4 mb-2">1. MÔ TẢ CÔNG VIỆC CHI TIẾT</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Trực tin nhắn tư vấn khách hàng trên các kênh trực tuyến: Facebook Fanpage, Zalo OA, Website, Shopee Chat.</li>
          <li>Tư vấn kiến thức chăm sóc da Skincare khoa học và gợi ý chu trình sử dụng Mặt nạ, Serum, Kem dưỡng phù hợp cho từng loại da.</li>
          <li>Thực hiện chốt đơn hàng, nhập thông tin đơn hàng lên hệ thống quản lý bán hàng.</li>
          <li>Theo dõi hành trình đơn hàng, hỗ trợ giải quyết sự cố giao hàng chậm hoặc yêu cầu đổi trả của khách hàng.</li>
          <li>Chăm sóc khách hàng cũ, gửi thông báo khuyến mãi sinh nhật nhằm duy trì tỷ lệ mua lại cao.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">2. YÊU CẦU ỨNG VIÊN</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Kỹ năng đánh máy nhanh, giao tiếp nhắn tin thân thiện, khéo léo và chu đáo.</li>
          <li>Thái độ phục vụ tận tâm, kiên nhẫn lắng nghe và giải quyết vấn đề của khách hàng.</li>
          <li>Có kinh nghiệm tư vấn bán hàng Mỹ phẩm hoặc Telesales là ưu thế lớn.</li>
        </ul>

        <h3 class="text-base font-extrabold text-slate-900 mt-6 mb-2">3. QUYỀN LỢI</h3>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Lương cứng: 7.000.000đ - 12.000.000đ/tháng + Thưởng % Doanh số bán hàng.</li>
          <li>Đầy đủ chế độ bảo hiểm và thưởng Lễ Tết.</li>
        </ul>
      </div>
    `
  }
];

async function updateDbAndCode() {
  // 1. Update MySQL DB settings table
  const recSetting = await prisma.settings.findUnique({ where: { key: 'page_recruitment' } });
  let settingValue: any = {};
  try {
    settingValue = JSON.parse(recSetting?.value || '{}');
  } catch (e) {}

  settingValue.tabsConfig = fullJobs;

  await prisma.settings.upsert({
    where: { key: 'page_recruitment' },
    update: { value: JSON.stringify(settingValue) },
    create: { key: 'page_recruitment', value: JSON.stringify(settingValue) }
  });

  console.log(' Successfully updated MySQL DB page_recruitment setting!');

  // 2. Update initialRecruitmentJobs in Recruitment.tsx directly
  const recruitmentFilePath = path.resolve(__dirname, '../../../src/pages/Recruitment.tsx');
  let recruitmentCode = fs.readFileSync(recruitmentFilePath, 'utf8');

  const staticJsSnippet = JSON.stringify(fullJobs, null, 2);
  const regex = /return\s*\[\s*\{\s*id:\s*'job-1'[\s\S]*?isActive:\s*true\s*\}\s*\];/;

  if (regex.test(recruitmentCode)) {
    recruitmentCode = recruitmentCode.replace(regex, `return ${staticJsSnippet};`);
    fs.writeFileSync(recruitmentFilePath, recruitmentCode, 'utf8');
    console.log(' Successfully updated src/pages/Recruitment.tsx static fallback array!');
  } else {
    console.log(' Regex did not match static fallback in Recruitment.tsx, updating tabsConfig match...');
  }
}

updateDbAndCode().finally(() => prisma.$disconnect());
