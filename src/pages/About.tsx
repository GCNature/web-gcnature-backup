import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { SITE_URL, makeSiteUrl } from "@/lib/config";
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Building, 
  Activity, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail,
  FlaskConical,
  ArrowRight,
  Globe,
  Settings,
  Calendar,
  Layers,
  Heart
} from "lucide-react";

// Real image assets from factory and homepage
const IMAGES = {
  hero: "https://cdn.imweb.me/thumbnail/20240723/9c344679c9e86.jpg",
  partnership: "https://cdn.imweb.me/thumbnail/20240723/c0e8710e36377.jpg",
  factoryBg: "https://cdn.imweb.me/thumbnail/20240725/dd9a1d9f9786d.jpg",
  // Production Facility Gallery (from page /19)
  facilityPackaging: "https://cdn.imweb.me/thumbnail/20191115/7732e33bf07cb.png",
  facilityMachinery: "https://cdn.imweb.me/thumbnail/20190507/5cd114b5db169.jpg",
  facilityLabResearchers: "https://cdn.imweb.me/thumbnail/20190507/5cd114b6a9060.jpg",
  facilityLabEquipment: "https://cdn.imweb.me/thumbnail/20190507/5cd114b7c461a.jpg"
};

// 14 Real certificates from gallery
const CERTIFICATES = [
  "https://cdn.imweb.me/thumbnail/20211101/2c0e806c873ee.jpg",
  "https://cdn.imweb.me/thumbnail/20230711/62d4fbf443d4d.jpg",
  "https://cdn.imweb.me/thumbnail/20220117/79ef75e40c55b.jpg",
  "https://cdn.imweb.me/thumbnail/20180129/5a6ed5ab70d67.jpg",
  "https://cdn.imweb.me/thumbnail/20191118/d1e059f3e24e5.png",
  "https://cdn.imweb.me/thumbnail/20230711/41f7363814d0f.jpg",
  "https://cdn.imweb.me/thumbnail/20230831/14fa1f2027c95.jpg",
  "https://cdn.imweb.me/thumbnail/20230831/f53dcfd1c5775.jpg",
  "https://cdn.imweb.me/thumbnail/20230901/831152d793e17.jpg",
  "https://cdn.imweb.me/thumbnail/20230901/14a50fca6ed94.jpg",
  "https://cdn.imweb.me/thumbnail/20240527/8ef43485f4fd1.jpeg",
  "https://cdn.imweb.me/thumbnail/20240527/91d4383c61c01.jpeg",
  "https://cdn.imweb.me/thumbnail/20240527/d3aaf29ac93f8.jpeg",
  "https://cdn.imweb.me/thumbnail/20240527/2125f45a06bf9.jpeg"
];

// Factory development timeline based on /18 (History)
const HISTORY_TIMELINE = [
  {
    year: "2024",
    items: [
      "Hoàn thành cấp phép sản phẩm chống nắng vật lý hữu cơ đạt chuẩn SPF50+ PA++++.",
      "Thành lập chi nhánh văn phòng đại diện chính thức tại Hà Nội, Việt Nam để xúc tiến thương mại."
    ]
  },
  {
    year: "2023",
    items: [
      "Cập nhật cấp phép các dòng sản phẩm giảm thiểu rụng tóc chứa Caffeine hoạt tính (Dầu gội, xịt dưỡng).",
      "Cập nhật cấp phép cushion chống nắng lai vật lý hóa học đạt chuẩn SPF50+ PA++++."
    ]
  },
  {
    year: "2021",
    items: [
      "Chính thức thành lập Viện Nghiên Cứu Phát Triển Doanh Nghiệp (R&D Corporate Research Institute).",
      "Đạt chứng nhận Doanh nghiệp Công nghệ cao - Đổi mới sáng tạo (Venture Enterprise)."
    ]
  },
  {
    year: "2019",
    items: [
      "Di dời và mở rộng sang tổ hợp nhà máy mới chuẩn CGMP y khoa tại Dodang-dong, Bucheon, Hàn Quốc.",
      "Đạt thỏa thuận phân phối độc quyền tại Thái Lan, Campuchia, Indonesia và Philippines.",
      "Đạt 4 chứng nhận vệ sinh nhập khẩu chính ngạch từ Bộ Y tế Trung Quốc."
    ]
  },
  {
    year: "2018",
    items: [
      "Đạt chứng chỉ Hệ thống quản lý chất lượng ISO 9001:2015 & Hệ thống quản lý môi trường ISO 14001:2015.",
      "Thành lập chi nhánh Trung Quốc tại Thâm Quyến và ký kết hợp đồng xuất khẩu quy mô lớn với đối tác Đông Nam Á."
    ]
  },
  {
    year: "2017",
    items: [
      "Đạt tiêu chuẩn vàng quốc tế Thực hành tốt sản xuất mỹ phẩm ISO 22716:2007 (CGMP)."
    ]
  },
  {
    year: "2015",
    items: [
      "Chuyển đổi cơ cấu thành pháp nhân cổ phần, chính thức đổi tên thành Tập đoàn Mỹ phẩm chuyên nghiệp.",
      "Đăng ký bằng sáng chế công thức độc quyền cho các dòng chăm sóc da nhạy cảm."
    ]
  },
  {
    year: "2013",
    items: [
      "Thành lập cơ sở nghiên cứu và sản xuất mỹ phẩm đầu tiên tại thành phố Bucheon, Gyeonggi-do, Hàn Quốc."
    ]
  }
];

const About = () => {
  const [dbContent, setDbContent] = useState<{
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
  } | null>(null);

  useEffect(() => {
    fetch(`/api/settings/page/page_about?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setDbContent(data);
        }
      })
      .catch(err => console.error("Load about page settings error:", err));
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GCnature",
    "url": SITE_URL,
    "logo": "https://gcnature.com.vn/logo.png",
    "description": "GC Nature (GC 네이처) là thương hiệu kinh doanh chính hãng các dòng mỹ phẩm tốt nhất, an toàn và hiệu quả với sự uy tín, tận tâm làm cơ sở cốt lõi.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "84 Jeongju-ro, Bucheon-si, Gyeonggi-do",
      "addressRegion": "Gyeonggi-do",
      "addressCountry": "KR"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0 font-sans text-slate-800 antialiased">
      <SEOHead
        title={dbContent?.seoTitle || "Giới Thiệu GC Nature | Sự Chăm Sóc Toàn Diện"}
        description={dbContent?.seoDesc || "GC Nature - Sự chăm sóc toàn diện là thương hiệu mỹ phẩm chính hãng Hàn Quốc uy tín, tận tâm, được bảo trợ bởi hệ thống nhà máy sản xuất CGMP y khoa hiện đại tại Bucheon."}
        keywords={dbContent?.seoKeywords || "về gc nature, giới thiệu gc nature, nhà máy gc nature, nhà máy sản xuất mỹ phẩm, oem odm mỹ phẩm hàn quốc, chứng nhận cgmp y khoa"}
        canonical={makeSiteUrl("/about")}
        jsonLd={jsonLd}
      />
      <Header />
      <ScrollToTop />

      <main className="overflow-hidden">
        {/* SECTION 1: HERO SLIDER BANNER (Replicating Homepage Hero) */}
        <section 
          className="relative min-h-[550px] md:min-h-[700px] flex items-center justify-center bg-cover bg-center text-white"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.65)), url(${dbContent?.bannerImage || IMAGES.hero})` }}
        >
          {/* Grid lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          
          <div className="relative container mx-auto px-6 text-center max-w-4xl space-y-8 py-20">
            <div className="inline-flex items-center gap-2.5 bg-teal-500/25 backdrop-blur-md border border-teal-400/40 px-5 py-2 rounded-full text-xs md:text-sm font-extrabold uppercase tracking-widest text-teal-300">
              <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
              주식회사 지씨네이처
            </div>
            
            <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight uppercase">
              HỆ THỐNG SẢN XUẤT & PHÁT TRIỂN <br />
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-100 bg-clip-text text-transparent">
                MỸ PHẨM CHUYÊN NGHIỆP HÀN QUỐC
              </span>
            </h1>

            <div className="h-1 w-24 bg-teal-400 mx-auto rounded-full" />
            
            <p className="text-sm md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
              원료를 꼼꼼하게 따져 우수한 제품만 생산합니다. <br />
              <span className="text-teal-300">Tuyển chọn nghiêm ngặt nguyên liệu, chỉ sản xuất sản phẩm vượt trội.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a 
                href="#facilities" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5"
              >
                Tham Quan Nhà Xưởng <ArrowRight className="w-4 h-4" />
              </a>
              <div className="text-[11px] md:text-xs text-slate-300/80 font-bold uppercase tracking-widest px-4 py-2 border border-slate-500/30 rounded-xl bg-slate-900/40 backdrop-blur-sm">
                Best Quality & Best Product
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.5: BRAND INTRODUCTION (GC Nature Brand Story at the Top) */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-black text-teal-600 uppercase tracking-widest block">GIỚI THIỆU THƯƠNG HIỆU</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    GC Nature - Sự Chăm Sóc Toàn Diện <br />
                    <span className="text-teal-600 font-black text-2xl md:text-3xl block mt-1 font-mono">GC 네이처 - 온전한 케어</span>
                  </h2>
                </div>
                <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-4 font-medium">
                  <p className="whitespace-pre-line">
                    <strong>GC Nature (GC 네이처)</strong> tự hào là đơn vị kinh doanh và phân phối chính hãng các dòng sản phẩm mỹ phẩm tốt nhất tại thị trường Việt Nam. Lấy sự uy tín và tận tâm làm cơ sở cốt lõi, chúng tôi mang tới những giải pháp chăm sóc làn da trọn vẹn, dịu nhẹ và tối ưu hóa hiệu quả thực tế cho người tiêu dùng Việt.
                  </p>
                  <p>
                    Để đảm bảo chất lượng vượt trội nhất, phía sau GC Nature là hệ thống nhà máy sản xuất hiện đại bậc nhất đạt tiêu chuẩn quốc tế y khoa đặt tại <strong>Bucheon, Gyeonggi-do, Hàn Quốc</strong>. Dưới sự bảo trợ khoa học của viện nghiên cứu R&D có lịch sử phát triển lâu đời, toàn bộ chu trình khép kín: từ chọn lọc nguyên liệu thảo dược tự nhiên tinh khiết đạt chuẩn hữu cơ ECOCERT đến chiết rót robot vô trùng và đóng gói chân không bảo vệ hoạt tính đều được kiểm soát nghiêm ngặt.
                  </p>
                  <p>
                    Sự uy tín trong từng thành phần và công thức sinh học tiên tiến (Microbiome, Peptides) cam kết đem đến sự bảo vệ tốt nhất, an tâm nhất cho những làn da nhạy cảm nhất.
                  </p>
                </div>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-3 bg-teal-50 border border-teal-100 p-4 rounded-2xl">
                    <Heart className="w-8 h-8 text-teal-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-teal-900 uppercase">Sứ mệnh cốt lõi</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Mang đến sự chăm sóc an toàn, dịu nhẹ và uy tín tuyệt đối cho làn da bạn.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                  <img 
                    src={IMAGES.partnership} 
                    alt="GC Nature Skincare Laboratory" 
                    className="w-full h-[320px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <span className="bg-teal-600/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      GC Nature Quality Standard
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: ABOUT US (Replicating Homepage About Us Column layout) */}
        <section className="py-20 md:py-28 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-black text-teal-600 uppercase tracking-widest">ABOUT US</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Trụ Cột Cốt Lõi Của Nhà Máy Phía Sau</h2>
              <div className="h-0.5 w-12 bg-teal-500 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: PRODUCTION */}
              <div className="flex flex-col p-8 rounded-3xl border border-slate-200/50 bg-white hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">PRODUCTION</h3>
                <span className="text-[11px] font-bold text-slate-400 block mb-4 uppercase">기초 / 기능성 / 헤어 / 바디 생산</span>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                  Năng lực sản xuất toàn diện các dòng sản phẩm: dưỡng da cơ bản, sản phẩm chuyên sâu (chức năng), chăm sóc tóc chuyên nghiệp và cơ thể. Quy trình chiết rót tự động khép kín.
                </p>
              </div>

              {/* Column 2: R&D */}
              <div className="flex flex-col p-8 rounded-3xl border border-slate-200/50 bg-white hover:border-emerald-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-6">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">R&D</h3>
                <span className="text-[11px] font-bold text-slate-400 block mb-4 uppercase">풍부한 연구 개발 경험과 원료 특허</span>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                  Viện nghiên cứu R&D với các chuyên gia hóa sinh chuyên sâu sở hữu hàng ngàn công thức cải tiến. Tập trung nghiên cứu ứng dụng công nghệ sinh học như Microbiome và Peptides.
                </p>
              </div>

              {/* Column 3: FACTORY */}
              <div className="flex flex-col p-8 rounded-3xl border border-slate-200/50 bg-white hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform mb-6">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">FACTORY</h3>
                <span className="text-[11px] font-bold text-slate-400 block mb-4 uppercase">대량생산 물적, 인적 인프라</span>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                  Tổ hợp nhà xưởng lớn tại Bucheon trang bị robot tự động hóa hoàn toàn. Đội ngũ kỹ sư chuyên sâu vận hành quy trình vòi vắt đạt sản lượng lớn 10.000.000 sản phẩm/năm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: COOPERATOR (Replicating Partners section copy) */}
        <section 
          className="relative py-24 bg-cover bg-center text-white"
          style={{ backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)), url(${IMAGES.partnership})` }}
        >
          <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
            <span className="text-xs font-black text-teal-400 uppercase tracking-widest">[COOPERATOR]</span>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              Đồng Hành Kiến Tạo Giá Trị Bền Vững
            </h2>
            <div className="h-0.5 w-16 bg-teal-400 mx-auto" />
            <p className="text-slate-300 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
              주식회사 지씨네이처는 협력사 및 고객과의 상생관계를 통해 다양한 아이템 개발과 부가가치 창출에 앞장서고 있습니다. <br />
              <span className="text-teal-300 block mt-2 text-xs md:text-sm font-semibold">
                (GC Nature đi đầu trong việc thúc đẩy phát triển sản phẩm mới và kiến tạo giá trị gia tăng vượt trội cho đối tác qua mối quan hệ hợp tác toàn diện cùng các thương hiệu lớn toàn cầu).
              </span>
            </p>
          </div>
        </section>

        {/* SECTION 4: CERTIFICATED (Replicating Infinite Marquee Slider) */}
        <section className="py-20 bg-slate-50 border-b border-slate-100 overflow-hidden">
          <div className="container mx-auto px-6 max-w-5xl space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-black text-teal-600 uppercase tracking-widest">[CERTIFICATED]</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Chứng Nhận Chất Lượng Quốc Tế Phía Sau</h2>
              <div className="h-0.5 w-12 bg-teal-500 mx-auto" />
              <p className="text-slate-500 text-xs md:text-sm font-semibold uppercase pt-1">
                Chứng nhận ISO 22716 (CGMP), ISO 9001:2015, ISO 14001:2015 & Giấy đăng ký sáng chế R&D của hệ thống sản xuất
              </p>
            </div>

            {/* Continuous Marquee Track */}
            <div className="relative w-full overflow-hidden py-4 bg-white border border-slate-200/60 rounded-3xl shadow-sm">
              {/* Fade masks */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div className="animate-marquee flex gap-8 items-center">
                {/* List 1 */}
                {CERTIFICATES.map((url, i) => (
                  <div 
                    key={`cert1-${i}`} 
                    className="w-44 h-60 shrink-0 bg-slate-50 border border-slate-100 p-2.5 rounded-xl hover:shadow-md hover:border-teal-400 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 bg-white"
                  >
                    <img 
                      src={url} 
                      alt={`Certificate ${i + 1}`} 
                      className="max-w-full max-h-full object-contain mix-blend-multiply" 
                      loading="lazy"
                    />
                  </div>
                ))}
                {/* Duplicate List 2 for seamless loop */}
                {CERTIFICATES.map((url, i) => (
                  <div 
                    key={`cert2-${i}`} 
                    className="w-44 h-60 shrink-0 bg-slate-50 border border-slate-100 p-2.5 rounded-xl hover:shadow-md hover:border-teal-400 transition-all duration-300 flex items-center justify-center overflow-hidden border-2 bg-white"
                  >
                    <img 
                      src={url} 
                      alt={`Certificate ${i + 1} clone`} 
                      className="max-w-full max-h-full object-contain mix-blend-multiply" 
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: PRODUCTION FACILITIES GALLERY (Replicating Facilities page gallery) */}
        <section id="facilities" className="py-20 md:py-28 bg-white border-b border-slate-100">
          <div className="container mx-auto px-6 max-w-5xl space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-black text-teal-600 uppercase tracking-widest">FACILITIES & R&D AREA</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Thiết Bị & Nhà Xưởng Chuẩn CGMP</h2>
              <div className="h-0.5 w-12 bg-teal-500 mx-auto" />
              <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-md mx-auto leading-relaxed">
                Hệ thống phòng sạch vô trùng y tế Class 10.000 cùng các trang thiết bị chế tạo, chiết rót, đóng gói tự động hóa phía sau GC Nature.
              </p>
            </div>

            {/* Grid structure matching high-end layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Highlight Item - Big Image (Main Factory Exterior) */}
              <div className="md:col-span-8 relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-96 group">
                <img 
                  src={IMAGES.factoryBg} 
                  alt="Tổ hợp nhà máy CGMP Hàn Quốc" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="bg-teal-500 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    PRODUCTION COMPLEX
                  </span>
                  <h4 className="font-extrabold text-lg">Hệ thống nhà máy sản xuất CGMP phía sau GC Nature</h4>
                  <p className="text-xs text-slate-300 font-medium">84 Jeongju-ro, Bucheon-si, Gyeonggi-do, South Korea</p>
                </div>
              </div>

              {/* Side Item 1 (Machinery) */}
              <div className="md:col-span-4 relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-96 group">
                <img 
                  src={IMAGES.facilityMachinery} 
                  alt="Hệ thống bồn nhũ hóa chân không" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="bg-emerald-500 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    EQUIPMENT
                  </span>
                  <h4 className="font-extrabold text-sm md:text-base">Hệ thống khuấy trộn bán thành phẩm</h4>
                  <p className="text-[10px] text-slate-300 font-medium">Công nghệ nhũ hóa bồn phun chân không vô trùng</p>
                </div>
              </div>

              {/* Row 2: 3 equal columns for Cleanroom, Researchers & Lab Equipment */}
              <div className="md:col-span-4 relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-80 group">
                <img 
                  src={IMAGES.facilityPackaging} 
                  alt="Dây chuyền chiết rót robot tự động" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="bg-teal-500 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    PRODUCTION LINE
                  </span>
                  <h4 className="font-extrabold text-sm">Chiết rót chân không tự động</h4>
                  <p className="text-[10px] text-slate-300 font-medium">Bảo toàn hoạt chất sinh học, tránh oxy hóa</p>
                </div>
              </div>

              <div className="md:col-span-4 relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-80 group">
                <img 
                  src={IMAGES.facilityLabResearchers} 
                  alt="Đội ngũ nghiên cứu R&D" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="bg-emerald-500 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    R&D TEAM
                  </span>
                  <h4 className="font-extrabold text-sm">Viện nghiên cứu R&D</h4>
                  <p className="text-[10px] text-slate-300 font-medium">Hội tụ tiến sĩ, chuyên gia da liễu hàng đầu</p>
                </div>
              </div>

              <div className="md:col-span-4 relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-80 group">
                <img 
                  src={IMAGES.facilityLabEquipment} 
                  alt="Thiết bị đo đạc và phân tích" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="bg-teal-500 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                    ANALYSIS LAB
                  </span>
                  <h4 className="font-extrabold text-sm">Phòng Lab kiểm tra vi sinh & QA</h4>
                  <p className="text-[10px] text-slate-300 font-medium">Đảm bảo độ tương thích sinh học và độ an toàn da liễu</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: HISTORY TIMELINE (Replicating History) */}
        <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-100">
          <div className="container mx-auto px-6 max-w-4xl space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-black text-teal-600 uppercase tracking-widest">HISTORY</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Lịch Sử & Cột Mốc Phát Triển Của Hệ Thống Sản Xuất</h2>
              <div className="h-0.5 w-12 bg-teal-500 mx-auto" />
              <p className="text-slate-500 text-xs md:text-sm font-semibold uppercase">
                Hành trình từ năm 2013 đến vị thế dẫn đầu công nghệ sản xuất mỹ phẩm sạch phía sau GC Nature
              </p>
            </div>

            {/* Clean, premium vertical timeline */}
            <div className="relative border-l border-teal-200/80 ml-4 md:ml-32 space-y-12">
              {HISTORY_TIMELINE.map((h, i) => (
                <div key={i} className="relative pl-8 md:pl-12 group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white bg-teal-500 shadow-md group-hover:scale-125 transition-transform" />
                  
                  {/* Year display on left side for desktop */}
                  <div className="hidden md:block absolute -left-32 top-0.5 w-24 text-right">
                    <span className="text-2xl font-black text-teal-600 tracking-wider font-mono">{h.year}</span>
                  </div>

                  <div className="space-y-3">
                    {/* Mobile year display */}
                    <div className="md:hidden">
                      <span className="text-xl font-black text-teal-600 tracking-wider font-mono">{h.year}</span>
                    </div>
                    <ul className="space-y-2.5">
                      {h.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs md:text-sm text-slate-600 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: HEADQUARTERS & CONTACT OF KOREAN FACTORY */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-14 text-white shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 text-teal-500/10 pointer-events-none">
                <Globe className="w-56 h-56" />
              </div>

              <div className="space-y-8 relative">
                <div className="space-y-3">
                  <span className="text-xs font-black text-teal-400 uppercase tracking-widest">CONTACT INFO</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hệ Thống Nhà Máy & Văn Phòng</h3>
                  <div className="h-0.5 w-12 bg-teal-400" />
                </div>

                <div className="space-y-6">
                  {/* Factory Headquarters */}
                  <div className="flex gap-4 items-start">
                    <Building className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-extrabold text-[11px] text-teal-300 uppercase tracking-widest">Hệ thống nhà máy sản xuất (Hàn Quốc)</h5>
                      <p className="text-xs text-slate-200 mt-1 font-semibold">84 Jeongju-ro, Bucheon-si, Gyeonggi-do, South Korea</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">경기도 부천시 정주로 84</p>
                    </div>
                  </div>

                  {/* Representative Hanoi Office */}
                  <div className="flex gap-4 items-start">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-extrabold text-[11px] text-teal-300 uppercase tracking-widest">Văn phòng Đại diện Miền Bắc (Việt Nam)</h5>
                      <p className="text-xs text-slate-200 mt-1 font-semibold">S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội</p>
                    </div>
                  </div>

                  {/* Representative HCM Office */}
                  <div className="flex gap-4 items-start">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-extrabold text-[11px] text-teal-300 uppercase tracking-widest">Văn phòng Đại diện Miền Nam (Việt Nam)</h5>
                      <p className="text-xs text-slate-200 mt-1 font-semibold">36 đường số 5 KĐT Vạn Phúc, Thủ Đức, TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a 
                    href="mailto:gcnatureofficial@gmail.com" 
                    className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all animate-pulse"
                  >
                    <Mail className="w-4 h-4" /> Email liên hệ
                  </a>
                  <a 
                    href="tel:0898273899" 
                    className="flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-800 text-slate-200 font-extrabold py-2.5 px-6 rounded-xl text-xs transition-all float-pulse-teal"
                  >
                    <Phone className="w-4 h-4 text-teal-400" /> 0898.273.899
                  </a>
                </div>
              </div>

              {/* R&D core philosophy */}
              <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl flex flex-col justify-between relative">
                <div className="space-y-4">
                  <div className="bg-teal-500 text-white w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm">
                    GC
                  </div>
                  <h4 className="font-extrabold text-lg text-slate-100">Cam Kết Từ GC Nature</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    GC Nature cam kết mang đến những giải pháp chăm sóc sức khỏe làn da tốt nhất bằng cách kết hợp khoa học da liễu hiện đại và dây chuyền tự động hóa chuẩn CGMP Hàn Quốc. Chúng tôi đảm bảo mọi lô sản phẩm xuất xưởng đều đồng đều chất lượng 100% tinh khiết và an toàn cho người sử dụng.
                  </p>
                </div>
                <div className="pt-8">
                  <a 
                    href="/shop" 
                    className="inline-flex items-center gap-2 text-teal-400 font-bold text-xs hover:text-teal-300 group transition-colors"
                  >
                    Khám Phá Các Dòng Sản Phẩm <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default About;
