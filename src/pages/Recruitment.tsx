import { useState, useEffect, useRef, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { toast } from "sonner";
import { 
  Upload, FileText, Loader2, Sparkles, MapPin, Clock, Briefcase, 
  ArrowRight, ShieldCheck, Building2, Store, Radio, Camera, Users,
  Heart, Coffee, Award, ChevronDown, CheckCircle2, X, Download, ExternalLink, Eye
} from "lucide-react";

const Recruitment = () => {
  const [content, setContent] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    position: "Thực tập sinh Thương mại điện tử",
    message: ""
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);

  const [activeJdModalJob, setActiveJdModalJob] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedExts = /\.(pdf|png|jpg|jpeg|doc|docx)$/i;
      if (!allowedExts.test(file.name)) {
        toast.error("Chỉ chấp nhận file CV định dạng PDF, PNG, JPG hoặc Word (doc/docx)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước file CV tối đa là 10MB");
        return;
      }
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast.error("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email");
      return;
    }
    if (!cvFile) {
      toast.error("Vui lòng đính kèm file CV của bạn");
      return;
    }

    setSubmitting(true);
    setUploadProgress(true);

    try {
      const uploadData = new FormData();
      uploadData.append("cvFile", cvFile);

      const uploadRes = await fetch("/api/contact/upload-cv", {
        method: "POST",
        body: uploadData
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.message || "Không thể tải lên file CV. Vui lòng thử lại.");
      }

      const { fileUrl } = await uploadRes.json();
      setUploadProgress(false);

      const contactPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        requestType: `Ứng tuyển: ${formData.position}`,
        street: formData.position,
        ward: "Ứng tuyển CV",
        city: "Hồ sơ tuyển dụng",
        country: "Việt Nam",
        message: `Vị trí ứng tuyển: ${formData.position}\nĐường dẫn tải CV: ${makeSiteUrl(fileUrl)}\n\nLời nhắn từ ứng viên:\n${formData.message}`
      };

      const submitRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload)
      });

      if (!submitRes.ok) {
        const errData = await submitRes.json();
        throw new Error(errData.message || "Lỗi khi gửi hồ sơ ứng tuyển.");
      }

      toast.success("Nộp hồ sơ ứng tuyển thành công! GCnature sẽ liên hệ với bạn trong 24 - 48 giờ.");
      
      setFormData({
        name: "",
        phone: "",
        email: "",
        position: "Thực tập sinh Thương mại điện tử",
        message: ""
      });
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
      setUploadProgress(false);
    }
  };

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('all');

  useEffect(() => {
    fetch(`/api/settings/page/page_recruitment?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setContent(data);
        }
      })
      .catch(err => console.error("Load recruitment page error:", err));
  }, []);

  const allJobs = useMemo(() => {
    if (content?.tabsConfig && Array.isArray(content.tabsConfig) && content.tabsConfig.length > 0) {
      return content.tabsConfig.filter((j: any) => j.isActive !== false);
    }
    return [
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
  }, [content]);

  const filteredJobs = useMemo(() => {
    if (selectedDept === 'all') return allJobs;
    return allJobs.filter((j: any) => j.department === selectedDept);
  }, [allJobs, selectedDept]);

  const handleApplyClick = (positionTitle: string) => {
    let targetPosition = positionTitle.replace(/^\[GC NATURE\] TUYỂN DỤNG:\s*/i, '').trim();
    setFormData(prev => ({ ...prev, position: targetPosition }));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const officeLocations = [
    {
      city: "CS HÀ NỘI (CƠ SỞ 1)",
      name: "Trụ Sở Truyền Thông & Showroom Mỹ Phẩm",
      address: "111 Trung Phụng, Văn Miếu - Quốc Tử Giám, Đống Đa, Hà Nội",
      tag: "Trụ Sở Chính",
      badgeColor: "bg-teal-600",
      icon: Store,
      desc: "Văn phòng làm việc phòng Truyền Thông, PR Báo chí và Showroom trải nghiệm sản phẩm mỹ phẩm Hàn Quốc chính hãng.",
      features: ["Trực quan sản phẩm", "Tiếp khách & Đối tác", "Không gian xanh mướt"]
    },
    {
      city: "CS HÀ NỘI (CƠ SỞ 2)",
      name: "Trung Tâm E-Commerce & Studio Livestream",
      address: "S1.06 Vinsmart Tây Mỗ, Nam Từ Liêm, Hà Nội",
      tag: "Vận Hành & Livestream",
      badgeColor: "bg-amber-600",
      icon: Radio,
      desc: "Trung tâm phát triển Thương mại điện tử (Shopee, TikTok Shop, Lazada), Studio Livestream Commerce hiện đại & Phòng Video Editor.",
      features: ["Studio Live chuẩn 4K", "Phòng Vận hành TMĐT", "Góc Chill Break-time"]
    },
    {
      city: "CS HỒ CHÍ MINH",
      name: "Chi Nhánh Miền Nam & Kho Phân Phối",
      address: "104 Nguyễn Thị Nhung, Vạn Phúc, Thủ Đức, TP. Hồ Chí Minh",
      tag: "Chi Nhánh Miền Nam",
      badgeColor: "bg-blue-600",
      icon: Building2,
      desc: "Chi nhánh phát triển thị trường Miền Nam, điều phối kho bãi phân phối toàn quốc và Chăm sóc Khách hàng chuyên nghiệp.",
      features: ["Kho vận chuyển tốc độ", "Đội ngũ CSKH 24/7", "Khu đô thị Vạn Phúc"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 md:pb-0 font-sans text-slate-800">
      <SEOHead
        title={content?.seoTitle || content?.title || "Tuyển Dụng & Văn Hóa Doanh Nghiệp | GCnature"}
        description={content?.seoDesc || content?.desc || "Cơ sở làm việc tại Hà Nội & TP.HCM cùng Album hình ảnh văn hóa làm việc Gen Z năng động tại GCnature."}
        keywords={content?.seoKeywords || "tuyển dụng gcnature, văn phòng gcnature, văn hóa doanh nghiệp gcnature, thực tập sinh tmdt, video editor"}
        canonical={makeSiteUrl("/tuyen-dung")}
      />
      <Header />

      <main className="space-y-16 md:space-y-24">
        <section 
          className="relative overflow-hidden py-20 md:py-28 bg-slate-950 text-white bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url(${content?.bannerImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80"})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/30 to-blue-900/30 backdrop-blur-[2px]" />
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-400" /> CHÀO MỪNG BẠN ĐẾN VỚI GC NATURE
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {content?.title || "GC Nature Tuyển Dụng"}
            </h1>

            <p className="text-sm md:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              {content?.desc || "Gia nhập nhà GC Nature chúng mình để cùng sáng tạo những ý tưởng tiếp thị độc đáo, cùng học hỏi và kiến tạo giá trị thương hiệu mỹ phẩm tự nhiên chuẩn Hàn Quốc!"}
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => jobsRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs md:text-sm rounded-xl transition-all shadow-lg hover:shadow-teal-500/20 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" /> Xem Các Vị Trí Đang Tuyển
              </button>
              <button 
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs md:text-sm rounded-xl transition-all backdrop-blur-md flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Nộp Hồ Sơ CV Trực Tiếp
              </button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
              📍 VĂN PHÒNG LÀM VIỆC MODERN
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hệ Thống Cơ Sở & Văn Phòng Năng Động
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Không gian sáng tạo, trang thiết bị livestream 4K và môi trường Gen Z cởi mở tại Hà Nội và TP.HCM
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officeLocations.map((loc, idx) => {
              const IconComp = loc.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 space-y-5 shadow-2xs hover:shadow-lg transition-all duration-300 relative group overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase text-white ${loc.badgeColor} px-3 py-1 rounded-full tracking-wider shadow-xs`}>
                        {loc.tag}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">{loc.city}</span>
                      <h3 className="text-base md:text-lg font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                        {loc.name}
                      </h3>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-600 font-normal leading-relaxed pt-1 border-t border-slate-100">
                      <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{loc.address}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
                  📸 ALBUM HÌNH ẢNH THỰC TẾ
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                  Cuộc Sống Thường Ngày Tại GC Nature
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> Môi Trường Thân Thiện</span>
                <span className="flex items-center gap-1.5"><Coffee className="w-4 h-4 text-amber-600" /> Trà Chiều Free Mỗi Tuần</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2 md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl bg-slate-900 min-h-[300px]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80"
                  alt="Họp Team Brainstorming"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="bg-teal-600 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">BRAINSTORMING</span>
                  <p className="font-extrabold text-base md:text-lg">Họp Team Định Hướng Chiến Dịch Mới</p>
                  <p className="text-xs text-slate-200 font-normal">Tự do đưa ra ý tưởng tiếp thị đột phá, tôn trọng sự sáng tạo cá nhân.</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl bg-slate-900 h-48 sm:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80"
                  alt="Studio Livestream"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                  <span className="bg-amber-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">STUDIO LIVE</span>
                  <p className="font-bold text-xs">Vận Hành Session TikTok Live</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl bg-slate-900 h-48 sm:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80"
                  alt="Văn Phòng Hiện Đại"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                  <span className="bg-blue-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">WORKSTATION</span>
                  <p className="font-bold text-xs">Không Gian Hiện Đại & Chill</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl bg-slate-900 h-48 sm:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80"
                  alt="Training Chuyên Môn"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                  <span className="bg-purple-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">TRAINING</span>
                  <p className="font-bold text-xs">Cầm Tay Chỉ Việc 1-on-1</p>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-2xl bg-slate-900 h-48 sm:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80"
                  alt="Team Building"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                  <span className="bg-rose-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">TEAM BUILDING</span>
                  <p className="font-bold text-xs">Trà Chiều & Tiệc Sinh Nhật</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={jobsRef} className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" />
                Các Vị Trí Đang Tuyển Dụng (Mô Tả JD Chi Tiết)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem thông tin Mô tả công việc, Yêu cầu ứng viên và đính kèm file JD cho từng vị trí
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tất cả vị trí' },
                { key: 'ecom', label: 'TMĐT' },
                { key: 'seo', label: 'SEO' },
                { key: 'marketing', label: 'Marketing' },
                { key: 'media', label: 'Truyền thông' },
                { key: 'livestream', label: 'Livestream' },
                { key: 'editor', label: 'Video Editor' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedDept(tab.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDept === tab.key
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 text-sm">
                Hiện tại chưa có bài đăng mô tả chi tiết cho phòng ban này. Bạn có thể nộp CV trực tiếp ở form ứng tuyển bên dưới!
              </div>
            ) : (
              filteredJobs.map((job: any, idx: number) => {
                const jobIdStr = job.id || `job-${idx}`;
                const isExpanded = expandedJobId === jobIdStr;
                return (
                  <div 
                    key={jobIdStr} 
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-2xs hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full inline-block">
                            🔥 GC Nature Recruiting
                          </span>
                          {job.jdFileUrl && (
                            <button
                              onClick={() => window.open(job.jdFileUrl, '_blank')}
                              className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1 transition-all"
                            >
                              <FileText className="w-3 h-3 text-emerald-600" /> Tệp JD: {job.jdFileName || 'Xem PDF/Ảnh JD'}
                            </button>
                          )}
                        </div>

                        <h2 
                          onClick={() => setExpandedJobId(isExpanded ? null : jobIdStr)}
                          className="text-lg md:text-xl font-extrabold text-slate-900 hover:text-teal-700 transition-colors cursor-pointer"
                        >
                          {job.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5 font-medium">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-600" /> {job.location || "Hà Nội"}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-600" /> {job.type || "Ca linh hoạt / Toàn thời gian"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedJobId(isExpanded ? null : jobIdStr)}
                          className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all h-10 flex items-center gap-1.5 shadow-2xs ${
                            isExpanded
                              ? "bg-teal-600 text-white border-teal-600 hover:bg-teal-700"
                              : "bg-white text-slate-800 hover:text-teal-700 border-slate-200 hover:border-teal-500"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" /> {isExpanded ? "Thu gọn JD" : "Xem nhanh"}
                        </button>

                        {job.jdFileUrl && (
                          <button
                            onClick={() => window.open(job.jdFileUrl, '_blank')}
                            className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold transition-all h-10 flex items-center gap-1.5 shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-teal-600" /> Xem JD
                          </button>
                        )}

                        <button
                          onClick={() => handleApplyClick(job.title)}
                          className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm h-10 flex items-center gap-1.5"
                        >
                          Ứng tuyển ngay <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-normal">
                      {job.excerpt}
                    </p>

                    {isExpanded && (
                      <div className="border-t border-slate-100 pt-6 mt-4 prose prose-teal max-w-none text-sm text-slate-700 leading-relaxed font-normal space-y-4">
                        {job.jdFileUrl && (
                          <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                                📄
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-teal-950">Tệp JD Đính Kèm Vị Trí Tuyển Dụng</h4>
                                <p className="text-[11px] text-teal-700">{job.jdFileName || 'Tệp tài liệu đính kèm (PDF/Ảnh/Word)'}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => setActiveJdModalJob(job)}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                            >
                              <Eye className="w-4 h-4" /> Mở Tệp Xem Trực Tiếp
                            </button>
                          </div>
                        )}

                        <div dangerouslySetInnerHTML={{ __html: job.contentHtml || job.content || "<p>Chưa có mô tả bổ sung.</p>" }} />
                        
                        <div className="pt-4 flex justify-end">
                          <button
                            onClick={() => handleApplyClick(job.title)}
                            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                          >
                            Ứng Tuyển Ngay Vị Trí Này <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ═══ 5. LUXURY CV APPLICATION FORM ═══ */}
        <section ref={formRef} className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-lg space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="text-center space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-extrabold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Nộp Hồ Sơ Trực Tiếp
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Ứng Tuyển Ngay Vào GCnature
              </h2>
              <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
                Điền thông tin và đính kèm CV (PDF/Word/Ảnh). Phòng Nhân sự sẽ liên hệ tư vấn vị trí phù hợp nhất cho bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Họ và tên <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-normal transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Số điện thoại / Zalo <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Ví dụ: 0912345678"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-normal transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Địa chỉ Email <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="email@example.com"
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 font-normal transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Vị trí ứng tuyển <span className="text-rose-500">*</span></label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 bg-white font-semibold text-slate-800 transition-all"
                  >
                    <option value="Thực tập sinh Thương mại điện tử">Thực tập sinh Thương mại điện tử (E-commerce Intern)</option>
                    <option value="Thực tập sinh SEO">Thực tập sinh SEO</option>
                    <option value="Thực tập sinh Marketing">Thực tập sinh Marketing</option>
                    <option value="Thực tập sinh Truyền thông">Thực tập sinh Truyền thông</option>
                    <option value="Thực tập sinh Livestream TikTok/Shopee">Thực tập sinh Livestream TikTok/Shopee</option>
                    <option value="Nhân viên Video Editor">Nhân viên Video Editor (Chính thức)</option>
                    <option value="Vị trí ứng tuyển tự do">Vị trí ứng tuyển tự do</option>
                  </select>
                </div>
              </div>

              {/* Upload CV Drag & Drop Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Đính kèm hồ sơ CV của bạn <span className="text-rose-500">*</span></label>
                <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-6 transition-all bg-slate-50/50 text-center relative group cursor-pointer">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-slate-600">
                      {cvFile ? (
                        <span className="font-semibold text-teal-700 flex items-center justify-center gap-1.5 bg-teal-50 py-1.5 px-3 rounded-lg border border-teal-100 max-w-fit mx-auto">
                          <FileText className="w-4 h-4 text-teal-600" /> {cvFile.name} ({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      ) : (
                        <>
                          <span className="font-bold text-teal-600 hover:underline">Nhấp vào đây để tải CV</span> hoặc kéo thả tập tin vào khung này
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Định dạng hỗ trợ: PDF, Word (doc/docx), PNG, JPG (Tối đa 10MB)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Lời nhắn / Giới thiệu thêm (Không bắt buộc)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Chia sẻ thêm về kinh nghiệm làm việc, dự án đã thực hiện hoặc nguyện vọng phát triển tại GCnature..."
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 resize-none font-normal transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadProgress ? "Đang tải file CV..." : "Đang gửi hồ sơ..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Gửi Hồ Sơ Ứng Tuyển
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Recruitment;
