import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { 
  Building2, 
  Sparkles, 
  FlaskConical, 
  MessageSquareCode, 
  FileCheck2,
  Cpu,
  Truck
} from "lucide-react";
import { toast } from "sonner";

export default function OemPolicy() {
  const [content, setContent] = useState<{
    title: string;
    desc: string;
    sections: { title: string; content: string }[];
    heroImage?: string;
    showroomImage?: string;
    koreaImage?: string;
    bannerImage?: string;
    updatedAt?: string;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    productType: "skincare",
    targetQty: "1000",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/settings/page/page_policy_oem?_t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.sections) {
          setContent(data);
        }
      })
      .catch(err => console.error("Load oem policy page error:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
      return;
    }

    const phoneRegex = /^(0[235789])[0-9]{8}$/;
    const cleanPhone = formData.phone.trim().replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 chữ số.");
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
          email: formData.email.trim() || `oem-${cleanPhone}@gcnature.com.vn`,
          city: 'Hợp tác OEM/ODM',
          country: 'Việt Nam',
          requestType: 'Tư vấn sản xuất OEM/ODM',
          message: `[YÊU CẦU GIA CÔNG OEM] Loại sản phẩm: ${formData.productType}. Số lượng dự kiến: ${formData.targetQty} sản phẩm. Lời nhắn: ${formData.message.trim() || 'Không có'}`
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        toast.success("Gửi yêu cầu tư vấn OEM thành công!", {
          description: "Đội ngũ nghiên cứu và đại diện nhà máy của GC Nature sẽ liên hệ lại với bạn trong vòng 24 giờ."
        });
        setFormData({
          name: "",
          phone: "",
          email: "",
          productType: "skincare",
          targetQty: "1000",
          message: ""
        });
      } else {
        toast.error(resData.message || "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("OEM registration error:", error);
      toast.error("Có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = content?.sections || [
    { title: "Giới thiệu dịch vụ gia công OEM/ODM", content: "" },
    { title: "Năng lực Nghiên cứu & Phát triển (R&D)", content: "" },
    { title: "Quy trình Đóng gói & Tiệt trùng nghiêm ngặt", content: "" }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-16 md:pb-0 font-sans">
      <SEOHead
        title={content?.seoTitle || content?.title || "Hợp tác sản xuất OEM/ODM Mỹ phẩm | GC Nature"}
        description={content?.seoDesc || content?.desc || "Dịch vụ gia công sản xuất mỹ phẩm OEM/ODM trọn gói chuẩn CGMP y khoa Hàn Quốc."}
        keywords={content?.seoKeywords || "gia công mỹ phẩm, oem mỹ phẩm, odm mỹ phẩm, gia công hàn quốc"}
        canonical={makeSiteUrl("/chinh-sach/oem")}
      />
      <Header />

      <main className="w-full">
        {/* Banner Section */}
        <section className="relative h-[380px] md:h-[500px] flex items-center justify-center overflow-hidden bg-teal-950">
          <div className="absolute inset-0">
            <img 
              src={content?.heroImage || "/banners/oem_factory_hero.png"} 
              className="w-full h-full object-cover opacity-60" 
              alt="Cosmetic Factory Hero" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/40 to-teal-950/20" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-400/30 shadow-lg mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Chuẩn CGMP Y khoa Hàn Quốc
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight mb-4 drop-shadow-md">
              {content?.title || "HỢP TÁC SẢN XUẤT OEM/ODM MỸ PHẨM"}
            </h1>
            <p className="text-emerald-300 font-semibold text-xs md:text-sm uppercase tracking-widest opacity-95 mb-6">
              {content?.desc || "GIẢI PHÁP GIA CÔNG MỸ PHẨM TRỌN GÓI ĐỘC QUYỀN CHUẨN CGMP Y KHOA"}
            </p>
            <div className="h-1 w-20 bg-emerald-400 mx-auto rounded-full mb-6" />
            <p className="text-gray-100 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              GC Nature cung cấp dịch vụ thiết kế công thức độc quyền, sản xuất khép kín tại tổ hợp nhà máy CGMP hiện đại và hỗ trợ đăng ký pháp lý trọn gói.
            </p>
            <a 
              href="#form-oem" 
              className="inline-block mt-8 bg-emerald-400 hover:bg-emerald-300 text-teal-950 font-extrabold text-sm uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Yêu cầu tư vấn sản xuất
            </a>
          </div>
        </section>

        {/* Brand Intro & Showroom / Laboratory row */}
        <section className="container py-16 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Gia công trọn gói
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                {sections[0]?.title || "Giới thiệu dịch vụ gia công OEM/ODM"}
              </h2>
              <div className="h-1 w-12 bg-emerald-600 rounded-full" />
              <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line font-light">
                {sections[0]?.content || "GC Nature tự hào là đối tác chiến lược hàng đầu tại Việt Nam liên kết trực tiếp với các tổ hợp nhà máy sản xuất CGMP y khoa hiện đại tại Bucheon, Gyeonggi-do, Hàn Quốc. Chúng tôi mang đến dịch vụ gia công mỹ phẩm OEM/ODM trọn gói chất lượng cao, giúp các thương hiệu Việt sở hữu những dòng mỹ phẩm chất lượng chuẩn Hàn Quốc, an toàn tuyệt đối và hiệu quả vượt trội lâm sàng."}
              </p>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-3xl opacity-10 blur-xl scale-105" />
              <div className="relative border-4 border-white shadow-2xl rounded-3xl overflow-hidden aspect-[4/3]">
                <img 
                  src={content?.showroomImage || "/banners/oem_laboratory_rd.png"} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  alt="Laboratory Research" 
                />
                <div className="absolute bottom-4 left-4 right-4 bg-teal-950/80 backdrop-blur-md text-white p-4 rounded-2xl border border-teal-500/20 z-10">
                  <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-0.5">Phòng R&D</p>
                  <p className="text-xs font-light text-gray-200">Nghiên cứu hoạt chất sinh học độc quyền theo xu hướng mỹ phẩm y tế</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* R&D & Sterile packaging row */}
        <section className="bg-gray-50/50 py-16 border-y border-gray-100">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Image */}
              <div className="lg:col-span-5 relative order-last lg:order-first">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-3xl opacity-10 blur-xl scale-105" />
                <div className="relative border-4 border-white shadow-2xl rounded-3xl overflow-hidden aspect-[4/3]">
                  <img 
                    src={content?.koreaImage || "/banners/oem_sterile_packaging.png"} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    alt="Sterile Packaging" 
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-teal-950/80 backdrop-blur-md text-white p-4 rounded-2xl border border-teal-500/20 z-10">
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-0.5">Chiết rót chân không</p>
                    <p className="text-xs font-light text-gray-200">Môi trường vô trùng phòng lạnh đảm bảo chất lượng dung dịch</p>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <FlaskConical className="w-3.5 h-3.5" />
                  Tiêu chuẩn quốc tế
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                  {sections[1]?.title || "Năng lực Nghiên cứu & Phát triển (R&D)"}
                </h2>
                <div className="h-1 w-12 bg-emerald-600 rounded-full" />
                <p className="text-gray-600 leading-relaxed text-sm md:text-base font-light mb-4 whitespace-pre-line">
                  {sections[1]?.content || "Chúng tôi sở hữu đội ngũ chuyên gia, tiến sĩ hóa dược hàng đầu Hàn Quốc liên tục nghiên cứu phát triển các công thức hoạt chất đột phá độc quyền. Tất cả các sản phẩm gia công đều trải qua quá trình thử nghiệm lâm sàng khắt khe trong phòng thí nghiệm vô trùng y khoa để đảm bảo tính ổn định và an toàn trước khi đi vào sản xuất đại trà."}
                </p>
                <h3 className="text-base font-bold text-gray-900">{sections[2]?.title || "Quy trình Đóng gói & Tiệt trùng nghiêm ngặt"}</h3>
                <p className="text-gray-600 leading-relaxed text-sm font-light whitespace-pre-line">
                  {sections[2]?.content || "Quy trình chiết rót và đóng gói được thực hiện hoàn toàn khép kín tự động trong môi trường phòng sạch cấp độ cao nhất. Mọi chai lọ, đặc biệt là các chai lọ thủy tinh đựng serum, ampoule đều được khử trùng tia cực tím, sấy tiệt trùng nhiệt độ cao nhằm đảm bảo sản phẩm đạt chất lượng 100% vô trùng khi xuất xưởng."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 Steps workflow */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Quy trình Hợp tác</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2 mb-3">QUY TRÌNH OEM/ODM TRỌN GÓI</h2>
              <p className="text-gray-500 text-sm">Chúng tôi đồng hành cùng bạn xuyên suốt toàn bộ quá trình đưa một thương hiệu mỹ phẩm mới ra thị trường.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-center relative hover:shadow-md transition-shadow">
                <span className="absolute top-2 right-4 text-emerald-50 text-4xl font-black select-none pointer-events-none font-serif">01</span>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <MessageSquareCode className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-2">1. Tư vấn &amp; Định vị</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed font-light">
                  Tiếp nhận yêu cầu, phân tích định vị sản phẩm phù hợp phân khúc thị trường Việt Nam.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-center relative hover:shadow-md transition-shadow">
                <span className="absolute top-2 right-4 text-emerald-50 text-4xl font-black select-none pointer-events-none font-serif">02</span>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-2">2. Nghiên cứu Công thức</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed font-light">
                  Phát triển công thức mẫu độc quyền tại lab y tế Hàn Quốc, gửi mẫu thử nghiệm hoàn toàn miễn phí.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-center relative hover:shadow-md transition-shadow">
                <span className="absolute top-2 right-4 text-emerald-50 text-4xl font-black select-none pointer-events-none font-serif">03</span>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-2">3. Đăng ký Pháp lý</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed font-light">
                  Hỗ trợ công bố kiểm định chất lượng sản phẩm, cấp giấy phép của Bộ Y tế và thủ tục hải quan.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-center relative hover:shadow-md transition-shadow">
                <span className="absolute top-2 right-4 text-emerald-50 text-4xl font-black select-none pointer-events-none font-serif">04</span>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-2">4. Sản xuất CGMP</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed font-light">
                  Sản xuất khép kín tại tổ hợp CGMP Hàn Quốc, sấy khô tiệt trùng và đóng chai vô trùng.
                </p>
              </div>

              {/* Step 5 */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-center relative hover:shadow-md transition-shadow">
                <span className="absolute top-2 right-4 text-emerald-50 text-4xl font-black select-none pointer-events-none font-serif">05</span>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 z-10 relative">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-2">5. Giao nhận &amp; Media</h3>
                <p className="text-gray-500 text-[11px] leading-relaxed font-light">
                  Giao nhận hàng tận kho, hỗ trợ thiết kế bao bì, cung cấp tư liệu hình ảnh quảng cáo cao cấp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OEM Request form */}
        <section id="form-oem" className="container py-8 max-w-2xl scroll-mt-20">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
            <div className="text-center space-y-2 mb-8">
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                Nhận Báo Giá Gia Công
              </span>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">ĐĂNG KÝ TƯ VẤN SẢN XUẤT OEM/ODM</h2>
              <p className="text-gray-500 text-xs max-w-md mx-auto">
                Điền thông tin yêu cầu gia công dưới đây, đội ngũ quản lý phát triển sản phẩm của GC Nature sẽ liên hệ lại ngay lập tức.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Họ và tên đối tác *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="VD: 0987654321"
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Loại sản phẩm cần gia công</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="skincare">Chăm sóc da mặt (Serum, Kem dưỡng, Nước hoa hồng...)</option>
                    <option value="sunscreen">Kem chống nắng (Sun cream, Sun gel...)</option>
                    <option value="bodycare">Chăm sóc cơ thể (Body lotion, Gel tắm...)</option>
                    <option value="makeup">Trang điểm cao cấp (Cushion, Son môi...)</option>
                    <option value="other">Các dòng sản phẩm chuyên sâu y khoa khác</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Số lượng dự kiến ban đầu</label>
                  <select
                    name="targetQty"
                    value={formData.targetQty}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="1000">Tối thiểu: 1.000 sản phẩm / lô</option>
                    <option value="5000">Trung bình: 5.000 sản phẩm / lô</option>
                    <option value="10000">Quy mô lớn: &gt; 10.000 sản phẩm / lô</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Địa chỉ Email nhận báo giá</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com (không bắt buộc)"
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Mô tả thêm yêu cầu đặc biệt</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Nhập loại hoạt chất mong muốn, thiết kế vỏ hộp hoặc các yêu cầu cụ thể khác..."
                  rows={4}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2 bg-gray-50/50 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                Gửi yêu cầu &amp; Đăng ký nhận mẫu thử
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
}
