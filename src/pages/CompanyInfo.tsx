import { useParams } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { ContactModal } from "@/components/ContactModal";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Briefcase, Handshake, HelpCircle, MapPin, Phone, Mail, Clock, Users, Star, ChevronRight, CheckCircle, Heart, Target, Award, Zap } from "lucide-react";
import { makeSiteUrl } from "@/lib/config";

interface InfoSection {
  title: string;
  content: string[];
}

interface CompanyInfoData {
  title: string;
  icon: typeof Briefcase;
  desc: string;
  sections: InfoSection[];
}

const companyInfoData: Record<string, CompanyInfoData> = {
  "tuyen-dung": {
    title: "Thông tin tuyển dụng",
    icon: Briefcase,
    desc: "Gia nhập đội ngũ GCnature – Sự chăm sóc toàn diện cho làn da Việt",
    sections: [
      {
        title: "1. Về môi trường làm việc tại GCnature",
        content: [
          "GCnature là thương hiệu nhập khẩu và thương mại các dòng mỹ phẩm Hàn Quốc số 1 Việt Nam. Chúng tôi luôn đề cao sự sáng tạo, tinh thần chủ động và đam mê trong lĩnh vực chăm sóc sức khỏe & sắc đẹp.",
          "Tại GCnature, bạn sẽ được làm việc với các dòng sản phẩm làm đẹp hàng đầu từ Hàn Quốc (lọt TOP bán chạy tại Coupang, Olive Young, Naver), mang đến cơ hội tiếp cận xu hướng làm đẹp mới nhất thế giới.",
          "Môi trường làm việc mở, trẻ trung, năng động và tôn trọng cá tính riêng của mỗi thành viên – nơi ý tưởng của bạn luôn được lắng nghe.",
          "Đội ngũ hiện tại gồm những chuyên gia dày dặn kinh nghiệm và các bạn trẻ nhiệt huyết, sẵn sàng cùng bạn chinh phục những nấc thang nghề nghiệp mới.",
        ],
      },
      {
        title: "2. Quyền lợi khi làm việc tại GCnature",
        content: [
          "Mức lương cạnh tranh theo năng lực và thưởng doanh số, thưởng KPI hấp dẫn.",
          "Được trải nghiệm các dòng mỹ phẩm Hàn Quốc chính hãng miễn phí hoặc mua với giá ưu đãi đặc biệt.",
          "Cơ hội tham gia các khóa đào tạo chuyên sâu về kiến thức chăm sóc da, kỹ năng bán hàng chuyên nghiệp, digital marketing.",
          "Lộ trình thăng tiến rõ ràng, cơ hội làm việc trực tiếp với các đối tác và thương hiệu mỹ phẩm lớn từ Hàn Quốc.",
          "Chế độ bảo hiểm xã hội, bảo hiểm y tế đầy đủ, du lịch nghỉ dưỡng hàng năm.",
          "Thưởng lễ, Tết, lương tháng 13 và thưởng hiệu suất công việc xuất sắc.",
        ],
      },
      {
        title: "3. Các vị trí đang tuyển dụng",
        content: [
          "📌 Nhân viên Tư vấn Mỹ phẩm (Full-time/Part-time): Tư vấn sản phẩm chăm sóc da phù hợp cho khách hàng qua online hoặc trực tiếp tại cửa hàng.",
          "📌 Chuyên viên Marketing Online: Quản lý và vận hành các chiến dịch quảng cáo Facebook, TikTok, Google cho các dòng sản phẩm của thương hiệu.",
          "📌 Content Creator / KOC Coordinator: Sáng tạo nội dung hình ảnh/video về review mỹ phẩm, dưỡng da, liên hệ hợp tác với các KOL/KOC trong ngành làm đẹp.",
          "📌 Nhân viên E-commerce: Quản lý và tối ưu hóa các gian hàng trên Shopee, TikTok Shop, Lazada.",
          "📌 Thực tập sinh Tư vấn da / Marketing: Dành cho sinh viên yêu thích ngành làm đẹp muốn tích lũy kinh nghiệm thực tế.",
        ],
      },
      {
        title: "4. Yêu cầu chung",
        content: [
          "Yêu thích và đam mê ngành mỹ phẩm, chăm sóc sắc đẹp, chăm sóc khách hàng.",
          "Tinh thần học hỏi cao, năng động, trung thực và có tinh thần trách nhiệm.",
          "Ưu tiên ứng viên có kinh nghiệm trong ngành hóa mỹ phẩm, thời trang hoặc bán lẻ.",
        ],
      },
      {
        title: "5. Cách ứng tuyển",
        content: [
          "Gửi CV (hồ sơ cá nhân) qua email: gcnatureofficial@gmail.com",
          "Tiêu đề email: [Ứng tuyển] – Họ tên – Vị trí ứng tuyển",
          "Hoặc liên hệ trực tiếp qua Hotline: 0559.869.392",
          "Nhắn tin qua Fanpage: GCnature",
          "Thời gian phản hồi: GCnature sẽ liên hệ lại trong vòng 3–5 ngày làm việc sau khi nhận CV.",
        ],
      },
      {
        title: "6. Địa điểm làm việc",
        content: [
          "🏢 Cơ sở Hà Nội: S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội",
          "🏢 Cơ sở Hồ Chí Minh: 36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM",
        ],
      },
    ],
  },
  "lien-he-hop-tac": {
    title: "Liên hệ hợp tác",
    icon: Handshake,
    desc: "Cùng GCnature lan tỏa giải pháp chăm sóc da toàn diện",
    sections: [
      {
        title: "1. Các hình thức hợp tác",
        content: [
          "🤝 Đại lý phân phối / Sỉ: Trở thành đại lý chính thức của GCnature, phân phối các dòng mỹ phẩm Hàn Quốc nhập khẩu chính hãng với chiết khấu cực kỳ cạnh tranh.",
          "📱 Cộng tác viên bán hàng (Affiliate): Giới thiệu sản phẩm và nhận hoa hồng hấp dẫn cho mỗi đơn hàng thành công mà không cần bỏ vốn nhập hàng.",
          "🎬 Hợp tác KOL / KOC / Beauty Blogger: GCnature cung cấp sản phẩm mẫu miễn phí cho các nhà sáng tạo nội dung trải nghiệm và thực hiện review trên mạng xã hội.",
          "🏢 Hợp tác doanh nghiệp: Cung cấp các gói quà tặng mỹ phẩm cao cấp cho nhân viên, đối tác doanh nghiệp nhân các dịp lễ, sự kiện với chiết khấu cao.",
        ],
      },
      {
        title: "2. Quyền lợi đối tác đại lý & sỉ",
        content: [
          "Mức chiết khấu và thưởng doanh số hấp dẫn, hỗ trợ thu hồi sản phẩm theo quy định thỏa thuận.",
          "Cung cấp đầy đủ giấy tờ công bố, hóa đơn VAT chứng minh sản phẩm nhập khẩu chính ngạch 100% từ Hàn Quốc.",
          "Cung cấp bộ tài liệu marketing: hình ảnh sản phẩm chất lượng cao, video feedback, bài viết giới thiệu.",
          "Được tư vấn chuyên môn và giải pháp phát triển thị trường từ đội ngũ chuyên gia hơn 10 năm kinh nghiệm.",
        ],
      },
      {
        title: "3. Quy trình đăng ký hợp tác",
        content: [
          "Bước 1: Liên hệ qua email gcnatureofficial@gmail.com hoặc Hotline 0559.869.392.",
          "Bước 2: Gửi thông tin cá nhân/doanh nghiệp và hình thức hợp tác mong muốn.",
          "Bước 3: Đội ngũ GCnature đánh giá và phản hồi trong vòng 2 ngày làm việc.",
          "Bước 4: Thống nhất các chính sách chiết khấu, ký kết hợp đồng và tiến hành giao dịch.",
        ],
      },
      {
        title: "4. Thông tin liên hệ chính thức",
        content: [
          "📧 Email hợp tác: gcnatureofficial@gmail.com",
          "📞 Hotline: 0559.869.392 – Tư vấn hợp tác đại lý, sỉ, CTV",
          "💬 Zalo: 0559.869.392",
          "🏢 Địa chỉ Hà Nội: S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội",
          "🏢 Địa chỉ Hồ Chí Minh: 36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM",
        ],
      },
    ],
  },
  "cau-hoi-thuong-gap": {
    title: "Câu hỏi thường gặp (FAQ)",
    icon: HelpCircle,
    desc: "Giải đáp mọi thắc mắc về sản phẩm và dịch vụ của GCnature",
    sections: [
      {
        title: "1. Về chất lượng sản phẩm",
        content: [
          "❓ Sản phẩm của GCnature có phải chính hãng không?\n→ 100% chính hãng. GCnature chuyên nhập khẩu chính ngạch từ Hàn Quốc, đầy đủ tem phụ tiếng Việt, hóa đơn chứng từ và giấy công bố chất lượng từ Bộ Y tế.",
          "❓ Tại sao sản phẩm của GCnature liên tục lọt TOP bán chạy tại Hàn Quốc?\n→ Chúng tôi tuyển chọn những sản phẩm lọt TOP tìm kiếm nhiều nhất trên Coupang, Olive Young, Naver, được cộng đồng nghệ sĩ Hàn Quốc phản hồi thực tế và đánh giá uy tín.",
          "❓ Sản phẩm có phù hợp cho da nhạy cảm không?\n→ Đa số các dòng sản phẩm của GCnature đều có thành phần chiết xuất từ thiên nhiên, lành tính và được kiểm nghiệm da liễu. Bạn nên xem kỹ mô tả hoặc liên hệ chuyên viên để được tư vấn cụ thể cho từng loại da.",
        ],
      },
      {
        title: "2. Tư vấn và chăm sóc da",
        content: [
          "❓ Tôi có được tư vấn trước khi mua sản phẩm không?\n→ Có. Đội ngũ chuyên gia của GCnature với hơn 10 năm kinh nghiệm luôn sẵn sàng tư vấn miễn phí liệu trình chăm sóc da phù hợp nhất qua Hotline/Zalo: 0559.869.392.",
          "❓ Nếu da tôi bị kích ứng sau khi sử dụng thì sao?\n→ GCnature cam kết đồng hành cùng bạn. Nếu gặp tình trạng kích ứng da (trong vòng 7 ngày kể từ khi mua), vui lòng liên hệ ngay để chúng tôi hỗ trợ đổi trả sản phẩm hoặc hướng dẫn xử lý phục hồi da kịp thời.",
        ],
      },
      {
        title: "3. Đặt hàng và thanh toán",
        content: [
          "❓ Phương thức đặt hàng và thanh toán như thế nào?\n→ Bạn có thể đặt trực tiếp trên website. GCnature hỗ trợ thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng qua VietQR hoặc thanh toán trực tuyến.",
          "❓ Tôi có được kiểm tra hàng trước khi nhận không?\n→ Có. Bạn hoàn toàn được quyền mở hộp đồng kiểm ngoại quan sản phẩm (tem mác, số lượng, vỏ hộp) trước khi thanh toán cho nhân viên giao hàng.",
          "❓ Phí vận chuyển được tính như thế nào?\n→ GCnature miễn phí giao hàng toàn quốc cho mọi hóa đơn từ 500.000đ trở lên. Các đơn hàng dưới 500.000đ áp dụng phí vận chuyển đồng giá 30.000đ.",
        ],
      },
      {
        title: "4. Chính sách đổi trả & bảo hành",
        content: [
          "❓ Tôi có được đổi trả sản phẩm đã khui hộp không?\n→ GCnature chỉ áp dụng đổi trả cho sản phẩm chưa khui seal/hộp trong vòng 7 ngày (lỗi do vận chuyển hoặc giao sai hàng). Đối với trường hợp kích ứng da, chúng tôi sẽ xem xét dựa trên tình trạng da thực tế để có hướng giải quyết tốt nhất.",
          "❓ Làm thế nào để gửi yêu cầu bảo hành hoặc đổi trả?\n→ Vui lòng liên hệ Hotline 0559.869.392 hoặc gửi hình ảnh/video khui hàng về Zalo/Email của chúng tôi để được giải quyết nhanh nhất trong vòng 24h.",
        ],
      },
    ],
  },
};

const CompanyInfo = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const info = slug ? companyInfoData[slug] : null;

  if (!info) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy trang</h1>
          <p className="text-gray-500 mb-8">Trang bạn tìm không tồn tại.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
            Về trang chủ
          </a>
        </main>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title={info.title}
        description={info.desc}
        canonical={makeSiteUrl(`/ve-chung-toi/${slug}`)}
      />
      <Header />

      <main>
        {/* Content */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {info.sections.map((section, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 hover:shadow-md transition-shadow duration-300"
                >
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-extrabold shrink-0">
                      {i + 1}
                    </span>
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </h2>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-[15px] text-gray-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2.5 shrink-0" />
                        <span className="whitespace-pre-line">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* CTA */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bạn cần hỗ trợ thêm?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Liên hệ với chúng tôi để được tư vấn và giải đáp mọi thắc mắc
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:0559869392"
                    className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors active:scale-95"
                  >
                    📞 Gọi: 0559.869.392
                  </a>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    ✉️ Gửi Email hỗ trợ
                  </button>
                </div>
              </div>
              
              <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setIsContactOpen(false)}
                defaultRequestType="Tư vấn sản phẩm" 
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default CompanyInfo;
