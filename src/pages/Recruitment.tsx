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
  Heart, Coffee, Award, ChevronDown, CheckCircle2
} from "lucide-react";

const Recruitment = () => {
  const [content, setContent] = useState<{
    title: string;
    desc: string;
    sections: { title: string; content: string }[];
    updatedAt?: string;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
    bannerImage?: string;
  } | null>(null);

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
      // 1. Upload CV file
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

      // 2. Submit Application via contact API
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

  const [recruitmentArticles, setRecruitmentArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [expandedArticleSlug, setExpandedArticleSlug] = useState<string | null>(null);

  const handleApplyClick = (positionTitle: string) => {
    let targetPosition = positionTitle.replace(/^\[GC NATURE\] TUYỂN DỤNG:\s*/i, '').trim();
    setFormData(prev => ({ ...prev, position: targetPosition }));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [selectedDept, setSelectedDept] = useState<'all' | 'ecom' | 'seo' | 'marketing' | 'media' | 'editor' | 'livestream'>('all');

  const getArticleDeptKey = (title: string): 'ecom' | 'seo' | 'marketing' | 'media' | 'editor' | 'livestream' | 'other' => {
    const t = title.toLowerCase();
    if (t.includes('thương mại điện tử') || t.includes('tmđt') || t.includes('e-commerce') || t.includes('shopee')) return 'ecom';
    if (t.includes('seo') || t.includes('từ khóa') || t.includes('website')) return 'seo';
    if (t.includes('marketing') || t.includes('tiếp thị')) return 'marketing';
    if (t.includes('truyền thông') || t.includes('pr')) return 'media';
    if (t.includes('editor') || t.includes('dựng phim') || t.includes('video')) return 'editor';
    if (t.includes('livestream') || t.includes('live stream') || t.includes('trợ live')) return 'livestream';
    return 'other';
  };

  const filteredArticles = useMemo(() => {
    if (selectedDept === 'all') return recruitmentArticles;
    return recruitmentArticles.filter(a => getArticleDeptKey(a.title) === selectedDept);
  }, [recruitmentArticles, selectedDept]);

  useEffect(() => {
    fetch(`/api/settings/page/page_recruitment?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.sections && data.sections.length > 0) {
          setContent(data);
        }
      })
      .catch(err => console.error("Load recruitment page error:", err));

    fetch(`/api/articles?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter(a => {
            const cat = (a.category || "").toLowerCase().trim();
            return cat === "tuyển dụng" || cat === "tuyendung" || cat === "tuyen-dung";
          });
          setRecruitmentArticles(filtered);
        }
      })
      .catch(err => console.error("Load recruitment articles error:", err))
      .finally(() => setLoadingArticles(false));
  }, []);

  // Office Locations Data
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
        {/* ═══ 1. LUXURY HERO BANNER ═══ */}
        <section 
          className="relative overflow-hidden py-20 md:py-28 bg-slate-950 text-white bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url(${content?.bannerImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80"})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/30 to-blue-900/30 backdrop-blur-[2px]" />
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              GCnature Korea Careers & Culture Portal
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-teal-200">
              {content?.title || "Tuyển Dụng: Gia Nhập Đội Ngũ GCnature"}
            </h1>

            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {content?.desc || "Thương hiệu mỹ phẩm nội địa Hàn Quốc chính hãng đang tìm kiếm những mảnh ghép đam mê E-commerce, SEO, Content & Livestream Commerce!"}
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
              <button 
                onClick={() => jobsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
              >
                Khám Phá Các Vị Trí Đang Tuyển <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-sm backdrop-blur-md"
              >
                Nộp CV Trực Tiếp
              </button>
            </div>
          </div>
        </section>

        {/* ═══ 2. THAY THẾ SECTION: 3 CƠ SỞ VĂN PHÒNG GC NATURE ═══ */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-2xs space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-teal-600" />
                Hệ Thống Môi Trường Làm Việc
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Địa Điểm Văn Phòng Tại 3 Cơ Sở GC Nature
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Môi trường làm việc chuẩn hiện đại, kết nối giao thông thuận tiện tại trung tâm Hà Nội & TP. Hồ Chí Minh
              </p>
            </div>

            {/* 3 Office Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {officeLocations.map((loc, i) => {
                const IconComponent = loc.icon;
                return (
                  <div 
                    key={i} 
                    className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-6 space-y-4 flex flex-col justify-between hover:shadow-md hover:border-teal-400/60 transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`${loc.badgeColor} text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-2xs`}>
                          {loc.city}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                          {loc.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed flex items-start gap-2 bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                          <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{loc.address}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ 3. THAY THẾ SECTION: ALBUM HÌNH ẢNH VĂN HÓA DOANH NGHIỆP (BENTO MASONRY GRID) ═══ */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-2xs space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
                <Camera className="w-4 h-4 text-teal-600" />
                Văn Hóa & Con Người GC Nature
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Album Khoảnh Khắc Teamwork & Đời Sống Văn Phòng
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Năng lượng trẻ trung, môi trường cởi mở, không gian làm việc mộng mơ và những buổi tiệc chill cùng đồng nghiệp Gen Z!
              </p>
            </div>

            {/* Bento Grid Gallery with Different Aspect Ratios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Photo 1: Large Main Hero Photo (2 cols, 2 rows) */}
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

              {/* Photo 2: Studio Livestream (1 col, 1 row) */}
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

              {/* Photo 3: Workspace Environment (1 col, 1 row) */}
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

              {/* Photo 4: Training & Workshop (1 col, 1 row) */}
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

              {/* Photo 5: Team Building & Party (1 col, 1 row) */}
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

        {/* ═══ 4. DETAILED JOB POSTINGS WITH EXPANDABLE ACCORDIONS ═══ */}
        <section ref={jobsRef} className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" />
                Các Vị Trí Đang Tuyển Dụng (Mô Tả JD Chi Tiết)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xem thông tin Mô tả công việc, Yêu cầu ứng viên và Quyền lợi cho từng vị trí
              </p>
            </div>

            {/* Department Filter Bar */}
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
                  onClick={() => setSelectedDept(tab.key as any)}
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

          {/* Detailed Job Cards List */}
          <div className="space-y-5">
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 text-sm">
                Hiện tại chưa có bài đăng mô tả chi tiết cho phòng ban này. Bạn có thể nộp CV trực tiếp ở form ứng tuyển bên dưới!
              </div>
            ) : (
              filteredArticles.map((article, idx) => {
                const isExpanded = expandedArticleSlug === article.slug;
                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 space-y-4 shadow-2xs hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full inline-block">
                          🔥 GC Nature Recruiting
                        </span>
                        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 hover:text-teal-700 transition-colors">
                          {article.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5 font-medium">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-600" /> S1.06 Vinsmart City & 111 Phố Trung Phụng, Hà Nội</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-600" /> Ca linh hoạt / Toàn thời gian</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedArticleSlug(isExpanded ? null : article.slug)}
                          className="px-4 py-2 border border-slate-200 hover:border-teal-500 rounded-xl text-xs font-bold text-slate-700 hover:text-teal-700 transition-all h-10 flex items-center gap-1.5"
                        >
                          {isExpanded ? "Thu gọn JD" : "Xem chi tiết JD"} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleApplyClick(article.title)}
                          className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm h-10 flex items-center gap-1.5"
                        >
                          Ứng tuyển ngay <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-normal">
                      {article.excerpt}
                    </p>

                    {/* Rich HTML Content of JD */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 pt-6 mt-4 prose prose-teal max-w-none text-sm text-slate-700 leading-relaxed font-normal space-y-4">
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        
                        <div className="pt-4 flex justify-end">
                          <button
                            onClick={() => handleApplyClick(article.title)}
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
