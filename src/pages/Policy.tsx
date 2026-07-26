import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContactModal } from "@/components/ContactModal";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Shield, Lock, CreditCard, Heart, ShoppingBag, Headphones, Award, TrendingUp } from "lucide-react";
import { makeSiteUrl } from "@/lib/config";

interface PolicySection {
  title: string;
  content: string[];
}

interface PolicyInfo {
  title: string;
  icon: typeof Shield;
  desc: string;
  sections: PolicySection[];
  updatedAt?: string;
}

const policiesData: Record<string, PolicyInfo> = {
  "mua-hang": {
    title: "Chính sách mua hàng",
    icon: ShoppingBag,
    desc: "GCnature hướng dẫn quy trình đặt mua mỹ phẩm Hàn Quốc chính hãng trực tuyến an toàn, thuận tiện.",
    sections: [
      {
        title: "Điều 1: Quy trình đặt mua sản phẩm",
        content: [
          "1. Lựa chọn sản phẩm: Khách hàng truy cập website gcnature.com.vn để tìm kiếm và chọn lựa các sản phẩm theo nhu cầu (Kem chống nắng, dưỡng da, trang điểm, ampoule/siêu tinh chất...).",
          "2. Kiểm tra thông tin: Xem kỹ thông tin mô tả sản phẩm, giá bán niêm yết, chương trình khuyến mãi (Flash Sale nếu có) và thành phần của mỹ phẩm.",
          "3. Giỏ hàng và Thanh toán: Thêm sản phẩm vào giỏ hàng, điền đầy đủ thông tin giao hàng (Họ tên, Số điện thoại chính xác, Địa chỉ nhận hàng cụ thể) và tiến hành lựa chọn phương thức thanh toán.",
        ],
      },
      {
        title: "Điều 2: Xác nhận đơn hàng & Xử lý vận chuyển",
        content: [
          "1. Xác nhận tự động: Sau khi đặt hàng thành công, hệ thống sẽ gửi email hoặc liên hệ qua số điện thoại để xác nhận chi tiết đơn hàng.",
          "2. Đóng gói chuẩn y khoa: Sản phẩm mỹ phẩm của GCnature sẽ được bọc chống sốc cẩn thận, đóng gói kín nguyên seal và có kèm theo hóa đơn mua hàng cụ thể.",
          "3. Thời gian giao hàng: Giao hàng hỏa tốc trong 2h-4h tại khu vực nội thành TP.HCM và Hà Nội. Giao tiêu chuẩn toàn quốc trong vòng 2-4 ngày làm việc.",
        ],
      },
      {
        title: "Điều 3: Quy định nhận hàng (Không đồng kiểm)",
        content: [
          "1. Quy định không đồng kiểm: Nhằm đảm bảo tính bảo mật, nguyên vẹn và niêm phong của các dòng mỹ phẩm cao cấp trong quá trình vận chuyển, GCnature áp dụng chính sách KHÔNG ĐỒNG KIỂM khi nhận hàng.",
          "2. Quy trình nhận hàng: Khách hàng vui lòng thanh toán đơn hàng (đối với hình thức COD) hoặc ký xác nhận nhận kiện hàng nguyên vẹn niêm phong từ shipper trước khi khui mở.",
          "3. Quay video mở hộp: Sau khi nhận hàng thành công, khách hàng vui lòng quay video liên tục không cắt ghép trong suốt quá trình khui mở hộp giấy bên ngoài để kiểm tra số lượng và tình trạng sản phẩm dưỡng da bên trong. Đây là căn cứ duy nhất để GCnature hỗ trợ đổi trả/hoàn tiền nhanh chóng nếu có sự cố xảy ra.",
        ],
      },
    ],
  },
  "bao-mat": {
    title: "Chính sách bảo mật thông tin",
    icon: Lock,
    desc: "GCnature cam kết bảo vệ tối đa quyền riêng tư và thông tin cá nhân của khách hàng khi mua sắm tại hệ thống.",
    sections: [
      {
        title: "Điều 1: Mục đích thu thập thông tin",
        content: [
          "GCnature thu thập thông tin cá nhân (họ tên, số điện thoại, địa chỉ nhận hàng, email) nhằm:",
          "1. Xử lý đơn hàng, giao hàng tận nơi cho khách hàng.",
          "2. Tư vấn giải pháp chăm sóc da và giải đáp mọi thắc mắc của khách hàng.",
          "3. Cập nhật các ưu đãi, chương trình Flash Sale và tích lũy điểm thưởng thành viên.",
        ],
      },
      {
        title: "Điều 2: Cam kết bảo mật quyền riêng tư",
        content: [
          "1. Lưu trữ an toàn: Thông tin khách hàng được mã hóa và lưu trữ an toàn trên máy chủ bảo mật của GCnature, hạn chế tối đa các truy cập trái phép.",
          "2. Không chia sẻ bên thứ ba: Cam kết hoàn toàn không bán, trao đổi hay cung cấp thông tin của khách hàng cho bất kỳ bên thứ ba nào, ngoại trừ đối tác vận chuyển phục vụ cho việc chuyển phát đơn hàng.",
          "3. Giao dịch an toàn: Toàn bộ quá trình thanh toán trực tuyến đều được mã hóa qua cổng bảo mật SSL/TLS tiêu chuẩn quốc tế.",
        ],
      },
    ],
  },
  "thanh-toan": {
    title: "Chính sách thanh toán",
    icon: CreditCard,
    desc: "GCnature cung cấp đa dạng phương thức thanh toán an toàn, linh hoạt cho mọi khách hàng.",
    sections: [
      {
        title: "Điều 1: Phương thức thanh toán được chấp nhận",
        content: [
          "1. Thanh toán khi nhận hàng (COD): Khách hàng thanh toán tiền mặt trực tiếp cho shipper sau khi nhận kiện hàng nguyên vẹn niêm phong.",
          "2. Chuyển khoản ngân hàng qua VietQR: Chuyển khoản trực tiếp tới tài khoản ngân hàng của GCnature thông qua quét mã VietQR tự động điền sẵn số tiền và nội dung chuyển khoản trên hệ thống.",
          "3. Thanh toán qua ví điện tử MoMo hoặc thẻ Visa/Mastercard trực tuyến.",
        ],
      },
      {
        title: "Điều 2: Quy định bảo mật thanh toán",
        content: [
          "1. Hệ thống thanh toán trực tuyến tích hợp trên website đáp ứng tiêu chuẩn an toàn dữ liệu, mọi thông tin số thẻ tín dụng đều được xử lý mã hóa bảo mật và không được lưu trữ lại trên hệ thống của cửa hàng.",
          "2. Đối với các đơn hàng có giá trị lớn hoặc mua sỉ đại lý, khách hàng vui lòng thực hiện thanh toán chuyển khoản trước 100% để nhận được các mức chiết khấu ưu đãi tối đa theo quy định chính sách đại lý.",
        ],
      },
    ],
  },
  "khach-hang-than-thiet": {
    title: "Chính sách khách hàng thân thiết (GCnature Member)",
    icon: Heart,
    desc: "Chương trình tích điểm và ưu đãi đặc quyền dành riêng cho khách hàng đồng hành lâu dài cùng mỹ phẩm GCnature.",
    sections: [
      {
        title: "Điều 1: Cơ chế tích lũy điểm thưởng (GC Point)",
        content: [
          "1. Tỷ lệ quy đổi: Mỗi đơn hàng phát sinh, cứ mỗi 10.000đ thanh toán mua hàng thực tế sẽ được tích lũy 1 điểm GC Point.",
          "2. Giá trị quy đổi: 1 điểm GC Point tương đương với 100đ khi quy đổi sang mã giảm giá trực tiếp áp dụng cho các đơn hàng mua sắm kế tiếp.",
        ],
      },
      {
        title: "Điều 2: Phân hạng thành viên và đặc quyền",
        content: [
          "1. Hạng Bạc (Tích lũy dưới 500 điểm): Tích lũy điểm thưởng mặc định, nhận thông báo sớm nhất các chương trình Flash Sale hàng tháng.",
          "2. Hạng Vàng (Tích lũy từ 500 - 1500 điểm): Chiết khấu giảm trực tiếp 1% trên tổng hóa đơn mỗi khi mua hàng; nhận quà sinh nhật trị giá 200.000đ.",
          "3. Hạng Kim Cương (Tích lũy trên 1500 điểm): Chiết khấu giảm trực tiếp 3% trên tổng hóa đơn mua hàng; nhận quà sinh nhật trị giá 500.000đ; miễn phí giao hàng cho mọi đơn hàng không giới hạn giá trị tối thiểu; ưu tiên nhận hàng dùng thử (sample) của các dòng sản phẩm mới nhất từ Hàn Quốc.",
        ],
      },
    ],
  },
  "khieu-nai": {
    title: "Chính sách xử lý khiếu nại & Đổi trả",
    icon: Headphones,
    desc: "GCnature cam kết lắng nghe và xử lý mọi khiếu nại, sự cố đơn hàng một cách nhanh chóng, công bằng, bảo vệ quyền lợi tối đa của khách hàng.",
    sections: [
      {
        title: "Điều 1: Tiếp nhận khiếu nại",
        content: [
          "GCnature sẵn sàng tiếp nhận khiếu nại của khách hàng qua các kênh chính thức sau:",
          "1. Hotline / Zalo tiếp nhận: 0898.273.899 (Hỗ trợ từ 9:00 - 21:30 hàng ngày).",
          "2. Email tiếp nhận: gcnatureofficial@gmail.com",
          "3. Thời hạn khiếu nại: Trong vòng 7 ngày làm việc kể từ thời điểm nhận hàng thành công ghi nhận trên hệ thống vận chuyển.",
        ],
      },
      {
        title: "Điều 2: Các trường hợp được giải quyết đổi trả 100% miễn phí",
        content: [
          "1. Lỗi sản phẩm từ nhà sản xuất: Hộp bị vỡ màng co, dung dịch bị rò rỉ do nắp vặn lỏng, đầu xịt bị hỏng, sản phẩm hết hạn sử dụng hoặc có dị vật bên trong.",
          "2. Lỗi giao nhầm hàng: Giao sai sản phẩm mỹ phẩm so với đơn đặt hàng (nhầm dòng sản phẩm, nhầm dung tích, nhầm thương hiệu).",
          "3. Hỏng hóc do vận chuyển: Sản phẩm bị bẹp rúm, vỡ nứt chai lọ thủy tinh do lỗi vận chuyển của shipper.",
          "4. Trường hợp kích ứng da: Nếu khách hàng sử dụng sản phẩm và gặp hiện tượng nổi mẩn đỏ, dị ứng, ngứa rát (yêu cầu cung cấp hình ảnh thực tế biểu hiện da và chẩn đoán kích ứng da từ cơ sở da liễu uy tín). GCnature sẽ thu hồi sản phẩm đã khui nắp (hao hụt không quá 10%) và hỗ trợ đổi sản phẩm khác phù hợp hơn hoặc hoàn tiền 100% cho quý khách.",
        ],
      },
      {
        title: "Điều 3: Quy trình giải quyết khiếu nại",
        content: [
          "1. Tiếp nhận & Xác minh: Khách hàng cung cấp mã đơn hàng, hình ảnh hoặc video mở hộp sản phẩm lỗi. Bộ phận CSKH sẽ phản hồi xác minh thông tin trong vòng 24h làm việc.",
          "2. Xử lý đổi trả/hoàn tiền: GCnature hỗ trợ thu hồi sản phẩm lỗi miễn phí tận nhà. Sản phẩm mới đổi trả sẽ được gửi đi ngay sau khi nhận được hàng lỗi hoàn trả.",
          "3. Thời gian hoàn tiền: Trong trường hợp hoàn tiền, tiền sẽ được chuyển khoản trả lại vào tài khoản ngân hàng của quý khách trong vòng 24h - 48h làm việc.",
        ],
      },
    ],
  },
  "oem": {
    title: "Chính sách hợp tác OEM nhà máy",
    icon: Award,
    desc: "GCnature cung cấp dịch vụ sản xuất, thiết kế, đóng gói và gia công mỹ phẩm Hàn Quốc chính hãng trọn gói theo yêu cầu (OEM/ODM).",
    sections: [
      {
        title: "Điều 1: Quy trình hợp tác gia công mỹ phẩm OEM",
        content: [
          "1. Tiếp nhận và Phân tích yêu cầu: Khách hàng cung cấp thông tin chi tiết về sản phẩm cần gia công (Kem chống nắng, serum dưỡng da, son môi, mặt nạ, ampoule...), số lượng dự kiến và định hướng thương hiệu sản phẩm.",
          "2. Nghiên cứu và Phát triển (R&D): Đội ngũ chuyên gia R&D của GCnature phối hợp cùng các phòng Lab của nhà máy sản xuất hàng đầu Hàn Quốc phát triển công thức độc quyền, sản xuất mẫu thử (sample) và kiểm nghiệm tính an toàn.",
          "3. Thiết kế & Lựa chọn bao bì: Hỗ trợ trọn gói thiết kế bộ nhận diện thương hiệu sản phẩm, lựa chọn kiểu dáng chai lọ, bao bì hộp giấy cao cấp bắt kịp xu hướng thị trường làm đẹp tại Hàn Quốc và Việt Nam.",
          "4. Thủ tục pháp lý & Nhập khẩu: Hỗ trợ toàn bộ thủ tục pháp lý công bố mỹ phẩm, kiểm định chất lượng sản phẩm và thông quan nhập khẩu chính ngạch từ Hàn Quốc về Việt Nam bàn giao cho khách hàng.",
        ],
      },
      {
        title: "Điều 2: Tiêu chuẩn chất lượng sản xuất nhà máy",
        content: [
          "1. Đạt chuẩn CGMP quốc tế: Toàn bộ quá trình sản xuất và gia công mỹ phẩm được thực hiện trực tiếp tại các nhà máy đạt tiêu chuẩn thực hành tốt sản xuất mỹ phẩm (CGMP) hàng đầu tại Hàn Quốc.",
          "2. Nguồn nguyên liệu an toàn, lành tính: Cam kết 100% nguyên liệu sử dụng đều đạt chỉ số an toàn cao, có chứng nhận xuất xứ rõ ràng và được kiểm duyệt khắt khe bởi cơ quan y tế Hàn Quốc (KFDA).",
          "3. Công nghệ hiện đại bảo mật: Toàn bộ quy trình đóng gói, chiết rót tự động khép kín đảm bảo vô trùng hoàn toàn. Cam kết bảo mật tuyệt đối công thức và thông tin thương hiệu độc quyền của khách hàng.",
        ],
      },
    ],
  },
  "affiliate": {
    title: "Chính sách Affiliate (Tiếp thị liên kết)",
    icon: TrendingUp,
    desc: "Tham gia chương trình tiếp thị liên kết cùng GCnature để giới thiệu các sản phẩm mỹ phẩm Hàn Quốc chất lượng cao và nhận mức hoa hồng hấp dẫn.",
    sections: [
      {
        title: "Điều 1: Quy định tham gia tiếp thị liên kết",
        content: [
          "1. Đối tượng tham gia: Mọi cá nhân, đối tác truyền thông, KOL/KOC, Beauty Blogger hoặc chính khách hàng của GCnature đều có thể đăng ký tài khoản tham gia tiếp thị liên kết miễn phí.",
          "2. Tạo link tiếp thị liên kết (Affiliate Link): Sau khi tài khoản được kích hoạt trên hệ thống, đối tác có thể tự tạo mã giới thiệu hoặc link liên kết độc quyền cho từng sản phẩm của GCnature.",
          "3. Cách thức vận hành: Chia sẻ link tiếp thị của bạn lên các mạng xã hội (Facebook, TikTok, Zalo, Instagram, Youtube...) hoặc website cá nhân. Khi khách hàng nhấn vào link và phát sinh đơn hàng thành công, hệ thống sẽ tự động ghi nhận doanh thu cho bạn.",
        ],
      },
      {
        title: "Điều 2: Mức hoa hồng và Cơ chế thanh toán",
        content: [
          "1. Tỷ lệ hoa hồng vượt trội: Nhận mức chiết khấu hoa hồng hấp dẫn từ 10% đến 20% trên giá trị thanh toán thực tế của mỗi đơn hàng thành công thông qua link giới thiệu của bạn.",
          "2. Cơ chế lưu giữ Cookie (30 ngày): Hệ thống áp dụng cơ chế ghi nhận cookie trong vòng 30 ngày theo quy tắc Last Click (đơn hàng được tính cho link click cuối cùng trước khi mua hàng).",
          "3. Đối soát & Đối chiếu doanh số: Doanh thu và hoa hồng được thống kê tự động theo thời gian thực (Realtime) trên trang quản lý tài khoản của bạn để đảm bảo tính minh bạch tối đa.",
          "4. Lịch thanh toán định kỳ: Hoa hồng tích lũy sẽ được đối soát và chuyển khoản trực tiếp vào tài khoản ngân hàng của đối tác vào ngày 15 hàng tháng (khi số dư đạt mức tối thiểu 200.000đ).",
        ],
      },
    ],
  },
};

const Policy = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [content, setContent] = useState<{
    title: string;
    desc: string;
    sections: { title: string; content: string }[];
    updatedAt?: string;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
  } | null>(null);

  useEffect(() => {
    if (!slug) return;
    setContent(null);
    fetch(`/api/settings/page/page_policy_${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.sections && data.sections.length > 0) {
          setContent(data);
        }
      })
      .catch(err => console.error("Load policy page error:", err));
  }, [slug]);

  const defaultInfo = slug ? policiesData[slug] : null;

  const info = content
    ? {
        title: content.title,
        desc: content.desc,
        icon: defaultInfo?.icon || Shield,
        updatedAt: content.updatedAt,
        seoTitle: content.seoTitle,
        seoDesc: content.seoDesc,
        seoKeywords: content.seoKeywords,
        sections: content.sections.map(sec => ({
          title: sec.title,
          content: sec.content.split('\n').filter(p => p.trim() !== '')
        }))
      }
    : (defaultInfo
        ? {
            ...defaultInfo,
            seoTitle: undefined,
            seoDesc: undefined,
            seoKeywords: undefined
          }
        : null);

  if (!info) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy trang chính sách</h2>
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
        title={info.seoTitle || info.title}
        description={info.seoDesc || info.desc}
        keywords={info.seoKeywords || ""}
        canonical={makeSiteUrl(`/chinh-sach/${slug}`)}
      />
      <Header />

      <main>
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{info.title}</h2>
                <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">{info.desc}</p>
                {info.updatedAt && (
                  <p className="text-xs text-teal-600 font-semibold mt-3">
                    Cập nhật ngày: {new Date(info.updatedAt).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>

              {info.sections.map((section, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 hover:shadow-md transition-shadow duration-300"
                >
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-extrabold shrink-0">
                      {i + 1}
                    </span>
                    {section.title}
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

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bạn cần hỗ trợ thêm?</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Đội ngũ chăm sóc khách hàng GCnature luôn sẵn sàng phục vụ
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:0898273899"
                    className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    📞 Hotline: 0898.273.899
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

export default Policy;
