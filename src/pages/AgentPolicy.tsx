import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { 
  Building2, 
  FileCheck, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Percent, 
  Globe, 
  CheckCircle2, 
  Info, 
  Truck, 
  FileText,
  Mail,
  Phone,
  User,
  MapPin,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import { toast } from "sonner";

export default function AgentPolicy() {
  const [content, setContent] = useState<{
    title: string;
    desc: string;
    sections: { title: string; content: string }[];
    updatedAt?: string;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
    tabsConfig?: any;
  } | null>(null);

  const DEFAULT_TABS_CONFIG = {
    npp: {
      name: "Nhà phân phối (NPP)",
      partnerStandard: "Có mặt bằng kinh doanh\nCó văn phòng kinh doanh",
      requiredDocs: "Giấy phép kinh doanh, Thông tin liên hệ, Địa điểm kinh doanh",
      requiredImport: "Đơn hàng tối thiểu 50.000.000 VNĐ",
      discount: "55%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Được quyền tham gia",
      onlineSale: "Website và Google map",
      exclusive: "Được mở showroom, cửa hàng, thương mại điện tử",
      csmSupport: "Có chuyên gia y dược & Hỗ trợ tổ chức sự kiện hàng tháng",
      mediaSupport: "Cung cấp tư liệu Marketing, hình ảnh sản phẩm, nội dung quảng cáo, và video đào tạo sản phẩm.",
      training: "Tổ chức các buổi huấn luyện về kiến thức sản phẩm, kỹ năng tư vấn khách hàng, và cập nhật xu hướng làm đẹp mới nhất.",
      branding: "Cấp thư ủy quyền phân phối chính thức từ GC Nature.",
      debt: "Thỏa thuận công nợ linh hoạt"
    },
    bs: {
      name: "Bác sĩ chuyên môn (BS)",
      partnerStandard: "Có phòng khám/cơ sở trị liệu chuyên môn hoặc mặt bằng kinh doanh",
      requiredDocs: "Giấy phép kinh doanh, Chứng chỉ hành nghề y/dược, Thông tin liên hệ",
      requiredImport: "Đơn hàng tối thiểu 10.000.000 VNĐ",
      discount: "50%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Được quyền tham gia",
      onlineSale: "Website và Google map chính hãng",
      exclusive: "Được mở showroom, cửa hàng, thương mại điện tử phân phối",
      csmSupport: "Có chuyên gia y dược & Hỗ trợ tổ chức sự kiện hàng tháng",
      mediaSupport: "Cung cấp tư liệu Marketing chuyên sâu, hình ảnh lâm sàng, nội dung khoa học, và video đào tạo sản phẩm.",
      training: "Tổ chức huấn luyện lâm sàng về hoạt chất, cơ chế sản phẩm và cập nhật kiến thức y khoa thẩm mỹ.",
      branding: "Cấp chứng nhận ủy quyền chuyên gia đối tác da liễu & Standee chính hãng.",
      debt: "Thỏa thuận công nợ linh hoạt"
    },
    c1: {
      name: "Đại lý cấp 1",
      partnerStandard: "Có mặt bằng hoặc kênh kinh doanh mỹ phẩm hoạt động ổn định",
      requiredDocs: "Giấy phép kinh doanh/Thông tin cá nhân, Địa điểm kinh doanh",
      requiredImport: "Đơn hàng tối thiểu 10.000.000 VNĐ",
      discount: "45%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Không hỗ trợ",
      onlineSale: "Website và Google map hệ thống",
      exclusive: "Được mở showroom, cửa hàng, bán hàng online thương mại điện tử",
      csmSupport: "Có chuyên gia y dược hỗ trợ tư vấn trực tuyến và sự kiện",
      mediaSupport: "Cung cấp tư liệu hình ảnh sản phẩm và nội dung bài viết mẫu.",
      training: "Hỗ trợ tài liệu đào tạo cơ bản về sản phẩm và phương pháp tư vấn.",
      branding: "Cấp giấy chứng nhận đại lý chính hãng cấp 1 & Standee thương hiệu.",
      debt: "Thỏa thuận thanh toán trước"
    },
    c2: {
      name: "Đại lý cấp 2",
      partnerStandard: "Có shop mỹ phẩm, spa nhỏ hoặc kênh bán hàng online cá nhân",
      requiredDocs: "Thông tin liên hệ, Kênh bán hàng chi tiết",
      requiredImport: "Đơn hàng tối thiểu 5.000.000 VNĐ",
      discount: "40%",
      bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
      revenueGuarantee: "Không hỗ trợ",
      onlineSale: "Website và định vị Google map",
      exclusive: "Được mở showroom, cửa hàng, bán lẻ tại khu vực",
      csmSupport: "Không áp dụng hỗ trợ sự kiện riêng biệt",
      mediaSupport: "Cung cấp tư liệu hình ảnh sản phẩm cơ bản.",
      training: "Hỗ trợ tài liệu hướng dẫn sử dụng sản phẩm cơ bản.",
      branding: "Cấp giấy chứng nhận đại lý chính hãng cấp 2.",
      debt: "Thanh toán 100% trước khi giao hàng"
    }
  };

  const [activeTab, setActiveTab] = useState<string>("npp");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    level: "npp",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/settings/page/page_agent_policy?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.sections && data.sections.length > 0) {
          setContent(data);
          if (data.tabsConfig) {
            const keys = Object.keys(data.tabsConfig);
            if (keys.length > 0) {
              setActiveTab(keys[0]);
              setFormData(prev => ({ ...prev, level: keys[0] }));
            }
          }
        }
      })
      .catch(err => console.error("Load agent policy page error:", err));
  }, []);

  const tabsConfig = content?.tabsConfig || DEFAULT_TABS_CONFIG;
  const activeData = tabsConfig[activeTab as keyof typeof tabsConfig] || DEFAULT_TABS_CONFIG[activeTab as keyof typeof DEFAULT_TABS_CONFIG];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      toast.error("Vui lòng điền đầy đủ các trường thông tin bắt buộc!");
      return;
    }

    const phoneRegex = /^(0[235789])[0-9]{8}$/;
    const cleanPhone = formData.phone.trim().replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số di động/bàn.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: cleanPhone,
          email: formData.email.trim() || `agent-${cleanPhone}@gcnature.com.vn`,
          city: formData.city.trim(),
          country: 'Việt Nam',
          requestType: 'Đăng ký đại lý mới',
          message: `[ĐĂNG KÝ ĐẠI LÝ] Khu vực: ${formData.city.trim()}. Cấp đại lý đăng ký: ${tabsConfig[formData.level as keyof typeof tabsConfig]?.name || formData.level}. Lời nhắn: ${formData.message.trim() || 'Không có'}`
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success("Gửi yêu cầu đăng ký đại lý thành công!", {
          description: "Bộ phận phát triển đại lý của GC Nature sẽ liên hệ lại với bạn trong vòng 24 giờ."
        });
        setFormData({
          name: "",
          phone: "",
          email: "",
          city: "",
          level: "npp",
          message: ""
        });
      } else {
        toast.error(resData.message || "Không thể gửi yêu cầu đăng ký. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Agent Policy registration error:", error);
      toast.error("Có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-16 md:pb-0">
      <SEOHead
        title={content?.seoTitle || content?.title || "Chính sách Đại lý Toàn quốc | GC Nature"}
        description={content?.seoDesc || content?.desc || "Chính sách hợp tác đại lý phân phối mỹ phẩm Hàn Quốc nhập khẩu chính hãng của Công Ty TNHH Sản Xuất và Thương Mại GC Nature."}
        keywords={content?.seoKeywords || "GC Nature, đại lý mỹ phẩm, chính sách đại lý, mỹ phẩm hàn quốc"}
        canonical={makeSiteUrl("/chinh-sach/dai-ly")}
      />
      <Header />

      <main className="w-full">
        {/* Modern Hero Banner Section */}
        <section className="relative h-[380px] md:h-[500px] flex items-center justify-center overflow-hidden bg-teal-950">
          <div className="absolute inset-0">
            <img 
              src={content?.heroImage || "/banners/agent_policy_banner.png"} 
              className="w-full h-full object-cover opacity-60" 
              alt="GC Nature Brand Banner" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/40 to-teal-950/20" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-1.5 bg-teal-500/90 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-teal-400/30 shadow-lg shadow-teal-500/20 mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Chính sách hợp tác 2026
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4 drop-shadow-md">
              {content?.title || "CHÍNH SÁCH ĐẠI LÝ TOÀN QUỐC"}
            </h1>
            <p className="text-teal-100 font-semibold text-xs md:text-sm uppercase tracking-widest opacity-95 mb-6">
              {content?.desc || "CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI GC NATURE"}
            </p>
            <div className="h-1 w-20 bg-teal-400 mx-auto rounded-full mb-6" />
            <p className="text-gray-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Đồng hành cùng GC Nature đưa những dòng mỹ phẩm nội địa Hàn Quốc đỉnh cao, an toàn và chuẩn khoa học tới mọi khách hàng Việt Nam.
            </p>
            <a 
              href="#form-dang-ky" 
              className="inline-block mt-8 bg-teal-400 hover:bg-teal-300 text-teal-950 font-extrabold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg hover:shadow-teal-400/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Đăng ký đối tác ngay
            </a>
          </div>
        </section>

        {/* Giới thiệu & Showroom Row */}
        <section className="container py-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                Về GC Nature
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                {content && content.sections && content.sections.length > 0
                  ? content.sections[0].title
                  : "Giới thiệu thương hiệu"}
              </h2>
              <div className="h-1 w-12 bg-teal-600 rounded-full" />
              <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {content && content.sections && content.sections.length > 0
                  ? content.sections[0].content
                  : `GC Nature - Sự chăm sóc toàn diện (GC 네이처 - 온전한 케어) là thương hiệu nhập khẩu và thương mại các dòng mỹ phẩm Hàn Quốc số 1 Việt Nam với sứ mệnh đem những sản phẩm mỹ phẩm chính hãng tốt nhất tới tay người tiêu dùng Việt Nam. Được thành lập bởi các Chuyên gia kinh doanh Mỹ Phẩm Hàn Quốc với hơn 10 năm kinh nghiệm, chúng tôi có sứ mệnh đưa những dòng sản phẩm tốt nhất, hiệu quả và an toàn nhất từ các nước với công nghệ sản xuất hóa mỹ phẩm hàng đầu tại Hàn Quốc và các nước phát triển.\n\nCác dòng sản phẩm của GC Nature là những sản phẩm liên tục lọt TOP bán chạy và tìm kiếm trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín.`}
              </p>
              {content?.updatedAt && (
                <div className="inline-block bg-teal-50 border border-teal-100 rounded-xl px-4 py-2 mt-4">
                  <p className="text-xs text-teal-800 font-bold">
                    Cập nhật mới nhất: {new Date(content.updatedAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              )}
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-cyan-500 rounded-3xl opacity-10 blur-xl -rotate-3 scale-105" />
              <div className="relative border-4 border-white shadow-2xl rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto">
                <img 
                  src={content?.showroomImage || "/banners/agent_showroom.png"} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  alt="GC Nature Premium Showroom" 
                />
                <div className="absolute bottom-4 left-4 right-4 bg-teal-950/80 backdrop-blur-md text-white p-4 rounded-2xl border border-teal-500/20">
                  <p className="text-xs font-bold text-teal-300 uppercase tracking-widest mb-0.5">Showroom Đối tác</p>
                  <p className="text-sm font-bold">Hỗ trợ trưng bày, thiết kế biển hiệu & standee chính hãng</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Trụ Cột Quyền Lợi */}
        <section className="bg-gradient-to-b from-gray-50 to-[#f3f7f9] py-16 border-y border-gray-100">
          <div className="container max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-teal-600 font-bold text-xs uppercase tracking-widest">Đặc Quyền Cốt Lõi</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 mb-3">TẠI SAO NÊN HỢP TÁC CÙNG GC NATURE?</h2>
              <p className="text-gray-500 text-sm md:text-base">Chúng tôi thiết lập nền tảng vững chắc để cùng đối tác xây dựng sự nghiệp kinh doanh bền vững và thịnh vượng.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Column 1 */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-5">
                  <Percent className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Chiết khấu cao vượt trội</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Mức chiết khấu trực tiếp lên đến 55% từ nhà phân phối. Đi kèm chương trình thưởng KPI hấp dẫn theo quý/năm và các kỳ nghỉ du lịch nước ngoài.
                </p>
              </div>

              {/* Column 2 */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">100% Chính hãng & Pháp lý</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Đầy đủ hóa đơn VAT, công bố kiểm định của Bộ Y Tế. Bảo vệ tuyệt đối đối tác trước các vấn đề pháp lý và nguồn gốc xuất xứ sản phẩm.
                </p>
              </div>

              {/* Column 3 */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-5">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Hỗ trợ Media & Marketing</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Cung cấp trọn bộ tài nguyên hình ảnh cao cấp, video KOLs phản hồi sản phẩm, bài viết quảng cáo chuẩn SEO và tài liệu tư vấn bán hàng.
                </p>
              </div>

              {/* Column 4 */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Đào tạo & Bảo hộ khu vực</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Huấn luyện kỹ năng soi da, tư vấn liệu trình da liễu chuyên sâu. Quy chế bảo hộ địa lý rõ ràng, phòng chống phá giá triệt để.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Banner: Chương Trình Thưởng Doanh Số Quý (Korea travel panorama banner) */}
        <section className="container py-8 max-w-6xl">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border border-teal-100/60 aspect-[16/9] md:aspect-[3/1] min-h-[300px] flex items-center bg-teal-50">
            {/* Background Image */}
            <img 
              src={content?.koreaImage || "/banners/korea_travel_banner.png"} 
              className="absolute inset-0 w-full h-full object-cover" 
              alt="Korea Travel Banner" 
            />
            {/* Blurry light white overlay to show text clearly while keeping background visible */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] bg-gradient-to-r from-white/85 via-white/40 to-transparent" />
            
            {/* Content overlay */}
            <div className="relative z-10 p-6 md:p-12 max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1 bg-teal-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md shadow-teal-600/10">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                Đặc quyền thưởng doanh số áp dụng cho tất cả đại lý
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-teal-950 uppercase tracking-tight leading-tight">
                Chương trình đại lý <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-cyan-700 font-extrabold">THƯỞNG KPI QUÝ &amp; DU LỊCH HÀN QUỐC</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-2">
                <div className="bg-white/90 backdrop-blur-sm border border-teal-100/80 p-3.5 rounded-2xl flex flex-col justify-center shadow-sm">
                  <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">Doanh số từ 50-100 triệu/quý</span>
                  <span className="text-lg md:text-xl font-black text-teal-950 mt-1">Thưởng 5%</span>
                </div>
                <div className="bg-white/90 backdrop-blur-sm border border-teal-100/80 p-3.5 rounded-2xl flex flex-col justify-center shadow-sm">
                  <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">Doanh số từ 100tr - 200 triệu/quý</span>
                  <span className="text-lg md:text-xl font-black text-teal-950 mt-1">Thưởng 6%</span>
                </div>
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-300 p-3.5 rounded-2xl flex flex-col justify-center shadow-lg shadow-amber-400/20 text-teal-950">
                  <span className="text-[10px] text-teal-950/80 font-black uppercase tracking-wider block font-bold">Doanh số &gt; 200 triệu</span>
                  <span className="text-sm md:text-base font-black text-teal-950 mt-1 leading-tight">Thưởng 8% + Tour HQ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Levels Comparison Table/Tabs */}
        <section className="container py-16 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-teal-600 font-bold text-xs uppercase tracking-widest">Phân Cấp Hợp Tác</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 mb-3">CHI TIẾT CHƯƠNG TRÌNH PHÂN CẤP ĐẠI LÝ</h2>
            <p className="text-gray-500 text-sm">Xem và đối chiếu chi tiết quyền lợi cũng như cam kết của từng cấp bậc hợp tác tại GC Nature.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-4 md:p-8 shadow-xl shadow-gray-200/50 mb-12">
            {/* Interactive Tab Selectors */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 p-1.5 bg-gray-50 rounded-2xl">
              {(Object.keys(tabsConfig) as Array<keyof typeof tabsConfig>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
                    activeTab === key
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25 scale-[1.01]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  }`}
                >
                  {tabsConfig[key].name}
                </button>
              ))}
            </div>

            {/* Selected Tab Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side (Col 1-7): Details */}
              <div className="lg:col-span-8 space-y-6">
                {/* Section 1: Điều kiện */}
                <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-6 md:p-8 space-y-4">
                  <h3 className="text-base font-bold text-teal-900 uppercase flex items-center gap-2.5 border-b border-gray-200/60 pb-3">
                    <ClipboardList className="w-5 h-5 text-teal-600" />
                    1. Tiêu chuẩn & Điều kiện đăng ký
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm pt-2">
                    <div className="md:col-span-4 font-bold text-gray-500">Tiêu chuẩn mặt bằng:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium whitespace-pre-line">{activeData.partnerStandard}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm border-t border-gray-200/40 pt-3">
                    <div className="md:col-span-4 font-bold text-gray-500">Hồ sơ cần cung cấp:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium whitespace-pre-line">{activeData.requiredDocs || "Thông tin liên hệ, Địa điểm kinh doanh"}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm border-t border-gray-200/40 pt-3">
                    <div className="md:col-span-4 font-bold text-gray-500">Định mức nhập hàng:</div>
                    <div className="md:col-span-8 text-teal-700 font-black whitespace-pre-line">{activeData.requiredImport}</div>
                  </div>
                </div>

                {/* Section 2: Hỗ trợ từ Hãng */}
                <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-6 md:p-8 space-y-4">
                  <h3 className="text-base font-bold text-teal-900 uppercase flex items-center gap-2.5 border-b border-gray-200/60 pb-3">
                    <Users className="w-5 h-5 text-teal-600" />
                    2. Quyền lợi & Chính sách Hỗ trợ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm pt-2">
                    <div className="md:col-span-4 font-bold text-gray-500">Phạm vi trực tuyến:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium">{activeData.onlineSale}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm border-t border-gray-200/40 pt-3">
                    <div className="md:col-span-4 font-bold text-gray-500">Độc quyền / Kinh doanh:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium">{activeData.exclusive}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm border-t border-gray-200/40 pt-3">
                    <div className="md:col-span-4 font-bold text-gray-500">Hỗ trợ sự kiện & y tế:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium">{activeData.csmSupport}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm border-t border-gray-200/40 pt-3">
                    <div className="md:col-span-4 font-bold text-gray-500">Tư liệu truyền thông:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium leading-relaxed">{activeData.mediaSupport}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm border-t border-gray-200/40 pt-3">
                    <div className="md:col-span-4 font-bold text-gray-500">Khóa học đào tạo:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium leading-relaxed">{activeData.training}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm border-t border-gray-200/40 pt-3">
                    <div className="md:col-span-4 font-bold text-gray-500">Nhận diện thương hiệu:</div>
                    <div className="md:col-span-8 text-gray-800 font-medium whitespace-pre-line">{activeData.branding}</div>
                  </div>
                </div>
              </div>

              {/* Right Side (Col 9-12): Financial highlights */}
              <div className="lg:col-span-4 space-y-6">
                {/* Financial Card */}
                <div className="bg-gradient-to-br from-teal-900 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 translate-x-8 -translate-y-8">
                    <Percent className="w-48 h-48" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div>
                      <span className="text-teal-300 text-xs font-bold uppercase tracking-wider block mb-1">Mức chiết khấu cố định</span>
                      <span className="text-5xl font-black tracking-tight">{activeData.discount}</span>
                    </div>
                    
                    <div className="border-t border-teal-800/60 pt-4">
                      <span className="text-teal-300 text-xs font-bold uppercase tracking-wider block mb-1.5">Hỗ trợ công nợ</span>
                      <p className="text-sm font-semibold">{activeData.debt}</p>
                    </div>

                    <div className="border-t border-teal-800/60 pt-4">
                      <span className="text-teal-300 text-xs font-bold uppercase tracking-wider block mb-1.5">Bao tiêu & Hỗ trợ đầu ra</span>
                      <p className="text-sm font-semibold">{activeData.revenueGuarantee}</p>
                    </div>
                  </div>
                </div>

                {/* Rewards Info Card */}
                <div className="bg-teal-50/50 border border-teal-100/50 rounded-3xl p-6 md:p-8">
                  <span className="text-teal-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    Thưởng doanh số bổ sung
                  </span>
                  <p className="text-gray-700 text-xs leading-relaxed font-medium whitespace-pre-line">
                    {activeData.bonus && activeData.bonus !== "Không" && activeData.bonus !== "Không áp dụng"
                      ? activeData.bonus 
                      : "Áp dụng theo chính sách khuyến khích nội bộ từng thời kỳ cho hệ thống đại lý chính hãng. Liên hệ chuyên viên tư vấn để nhận thông tin chi tiết."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor & Experts Special Support Section */}
        <section className="bg-teal-50/40 border-y border-teal-100/50 py-16">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image Left */}
              <div className="lg:col-span-5 relative order-last lg:order-first">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-cyan-500 rounded-3xl opacity-15 blur-xl rotate-3 scale-105" />
                <div className="relative border-4 border-white shadow-2xl rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto">
                  <img 
                    src="/banners/expert_support.png" 
                    className="w-full h-full object-cover" 
                    alt="GC Nature Skincare Dermatologist Support" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 to-transparent" />
                </div>
              </div>

              {/* Text Right */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-teal-200/40">
                  Chương trình Bác sĩ chuyên môn (BS)
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                  Đồng Hành Chuyên Môn Y Khoa &amp; Hỗ Trợ Tổ Chức Sự Kiện Da Liễu Hàng Tháng
                </h2>
                <div className="h-1 w-12 bg-teal-600 rounded-full" />
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  Đối với cấp đại lý **Nhà phân phối (NPP)** và **Bác sĩ chuyên môn (BS)**, GC Nature cung cấp đặc quyền hỗ trợ chuyên gia y tế, dược sĩ da liễu tham gia sự kiện trực tiếp hàng tháng tại địa điểm của đối tác.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 font-semibold">Tài trợ thiết bị soi phân tích da hiện đại trong sự kiện.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 font-semibold">Bác sĩ da liễu khám, tư vấn phác đồ và kê đơn trực tiếp.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 font-semibold">Cung cấp bộ tài liệu y khoa nghiên cứu lâm sàng của hãng.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 font-semibold">Đồng tổ chức talkshow, hội thảo da liễu thu hút khách địa phương.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Policy Details */}
        <section className="container py-16 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: General Rules */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
                Quy định Bảo vệ Thị trường
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-teal-900 text-sm mb-1">Chính sách chống phá giá</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Đại lý cam kết bán hàng đúng giá niêm yết do GC Nature quy định. Mọi hành vi phá giá, chiết khấu sai quy định trên các trang TMĐT hoặc cửa hàng sẽ bị ngắt nguồn cung cấp hàng và thu hồi chứng nhận phân phối ngay lập tức.
                  </p>
                </div>
                
                <div className="border-t border-gray-50 pt-4">
                  <h4 className="font-bold text-teal-900 text-sm mb-1">Quy định phân vùng khu vực</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    GC Nature quy định ranh giới địa lý kinh doanh rõ ràng giữa các Nhà phân phối cấp tỉnh để tối ưu lượng khách hàng và đảm bảo doanh số bền vững. Các cấp đại lý nhỏ hơn được hỗ trợ bán hàng đa kênh không giới hạn vị trí địa lý.
                  </p>
                </div>

                <div className="border-t border-gray-50 pt-4">
                  <h4 className="font-bold text-teal-900 text-sm mb-1">Môi trường kinh doanh mỹ phẩm sạch</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Hãng cam kết liên tục phối hợp với các cơ quan quản lý thị trường để xử lý các nguồn hàng xách tay trốn thuế, hàng cận date hoặc hàng giả mạo thương hiệu để bảo vệ uy tín và lợi ích kinh tế cho hệ thống đại lý chính hãng.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Exchange and Returns */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2.5 border-b border-gray-100 pb-3">
                <Truck className="w-6 h-6 text-teal-600" />
                Vận chuyển & Quy trình Đổi trả
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-teal-900 text-sm mb-1">Đổi trả sản phẩm lỗi & cận date</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Hỗ trợ 100% đổi mới sản phẩm bị lỗi vòi nhấn, rò rỉ bao bì từ phía nhà máy sản xuất hoặc hư hại trong quá trình vận chuyển. Hỗ trợ thu hồi đổi mã mới cho các sản phẩm có hạn sử dụng dưới 6 tháng mà đại lý chưa tiêu thụ hết.
                  </p>
                </div>

                <div className="border-t border-gray-50 pt-4">
                  <h4 className="font-bold text-teal-900 text-sm mb-1">Quy chế luân chuyển hàng hóa</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Đại lý được quyền yêu cầu luân chuyển các mã sản phẩm bán chậm sang các mã sản phẩm bán chạy hơn trong cùng phân khúc giá 1 lần mỗi quý, giúp tối ưu vòng quay vốn và ngăn ngừa tình trạng tồn kho đọng vốn.
                  </p>
                </div>

                <div className="border-t border-gray-50 pt-4">
                  <h4 className="font-bold text-teal-900 text-sm mb-1">Quy trình giao nhận & xử lý đơn</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Đơn hàng được đặt chính thức qua kênh chuyên viên hỗ trợ 24/7. GC Nature cam kết đóng gói theo quy chuẩn bảo quản mỹ phẩm chuyên sâu và giao tới kho của đại lý trong vòng 24 - 48 giờ kể từ khi xác nhận thanh toán/đơn hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic CMS Sections (if any configured by admin) */}
        {content && content.sections && content.sections.length > 1 && (
          <section className="container max-w-6xl pb-16">
            <div className="space-y-6">
              {content.sections.slice(1).map((sec, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-teal-500 pl-3">{sec.title}</h3>
                  <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Registration Form Section */}
        <section id="form-dang-ky" className="bg-[#f3f7f9] py-16 scroll-mt-20">
          <div className="container max-w-6xl">
            <div className="bg-white rounded-[2.5rem] border border-teal-100/40 shadow-xl overflow-hidden max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-teal-800 to-cyan-800 text-white p-8 text-center relative">
                <div className="absolute right-4 bottom-4 opacity-5">
                  <Building2 className="w-24 h-24" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">ĐĂNG KÝ HỢP TÁC ĐẠI LÝ LẦN ĐẦU</h2>
                <p className="text-teal-100 text-xs md:text-sm max-w-md mx-auto">
                  Để lại thông tin liên hệ chính xác, Giám đốc vùng phụ trách sẽ kết nối và gửi báo giá chiết khấu đại lý chi tiết nhất cho bạn trong vòng 24 giờ.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all bg-gray-50/30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0901234567"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all bg-gray-50/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-teal-600" />
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all bg-gray-50/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                      Khu vực mở đại lý (Tỉnh/Thành) *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all bg-gray-50/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    Cấp đại lý muốn đăng ký hợp tác *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all bg-white"
                  >
                    {Object.keys(tabsConfig).map((key) => (
                      <option key={key} value={key}>
                        {tabsConfig[key].name} - Chiết khấu khởi điểm: {tabsConfig[key].discount}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Kinh nghiệm &amp; Ghi chú thêm
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Vui lòng giới thiệu về kinh nghiệm bán hàng mỹ phẩm, quy mô shop online/offline hiện tại của bạn để chúng tôi dễ dàng hỗ trợ..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all resize-none bg-gray-50/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm uppercase tracking-widest transition-all active:scale-[0.99] disabled:opacity-60 shadow-lg shadow-teal-700/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Đang xử lý đăng ký..." : (
                    <>
                      Gửi thông tin đăng ký đại lý
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
}
