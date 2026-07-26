import { MapPin, Phone, Clock, Facebook, Instagram, Youtube, Send, CheckCircle2, ArrowRight, Video, Hash, Image } from "lucide-react";
import { useState } from "react";

const aboutLinks = [
  { name: "Giới thiệu về GCnature", href: "/about" },
  { name: "Tin tức & Bài viết", href: "/news" },
  { name: "Tin tức khuyến mại", href: "/flash-sale" },
  { name: "Thông tin tuyển dụng", href: "/tuyen-dung" },
  { name: "Liên hệ hợp tác", href: "/lien-he" },
  { name: "Câu hỏi thường gặp", href: "/faq" },
];

const policyLinks = [
  { name: "Chính sách mua hàng", href: "/chinh-sach/mua-hang" },
  { name: "Chính sách bảo mật", href: "/chinh-sach/bao-mat" },
  { name: "Chính sách thanh toán", href: "/chinh-sach/thanh-toan" },
  { name: "Chính sách đại lý", href: "/chinh-sach/dai-ly" },
  { name: "Chính sách OEM", href: "/chinh-sach/oem" },
  { name: "Chính sách Affiliate", href: "/chinh-sach/affiliate" },
  { name: "Chính sách khách hàng thân thiết", href: "/chinh-sach/khach-hang-than-thiet" },
  { name: "Chính sách xử lý khiếu nại", href: "/chinh-sach/khieu-nai" },
];

const categoryLinks = [
  { name: "Mỹ phẩm Hàn Quốc", desc: "Nhập khẩu chính hãng 100%", href: "/danh-muc/my-pham-han-quoc" },
  { name: "Kem chống nắng", desc: "Bảo vệ da toàn diện, dịu nhẹ", href: "/danh-muc/kem-chong-nang" },
  { name: "Dưỡng da mặt", desc: "Cung cấp độ ẩm, làm sáng da", href: "/danh-muc/duong-da-mat" },
  { name: "Trang điểm", desc: "Tự nhiên, chuẩn phong cách Hàn", href: "/danh-muc/trang-diem" },
  { name: "Sữa rửa mặt", desc: "Sạch sâu, ngừa mụn, dịu nhẹ", href: "/danh-muc/sua-rua-mat" },
  { name: "Flash Sale", desc: "Sản phẩm đang giảm giá", href: "/flash-sale" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#111317] text-[#c8cbd2] text-[13px] border-t border-gray-800">
      {/* ═══ CTA & Newsletter Strip ═══ */}
      <div className="border-b border-gray-800 bg-[#16181d]">
        <div className="container py-6 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-white font-bold text-base mb-1">
              Liên hệ ngay để được <span className="font-extrabold text-[#5dc1d1]">tư vấn miễn phí</span>
            </h3>
            <p className="text-xs text-gray-400">
              Đội ngũ chuyên gia GCnature sẵn sàng tư vấn các dòng mỹ phẩm phù hợp nhất cho bạn (Phản hồi trong 15 phút)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
            <a
              href="tel:0898273899"
              className="flex items-center gap-2 bg-[#5dc1d1] hover:bg-[#4eb0c0] text-white px-6 py-2.5 rounded-full font-bold text-lg lg:text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5 animate-pulse" />
              0898.273.899
            </a>
          </div>
        </div>
      </div>

      {/* ═══ Main Footer Content ═══ */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Column 1: Brand & Hotline */}
          <div>
            <h3 className="text-2xl font-black text-white mb-1 tracking-wider">GCnature</h3>
            <p className="text-[#5dc1d1] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Sự chăm sóc toàn diện</p>

            <h4 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">Kết nối với GCnature</h4>
            <div className="flex flex-wrap gap-3 mb-5">
              {[
                { 
                  name: 'Fanpage', 
                  icon: Facebook, 
                  href: 'https://www.facebook.com/kinhthongminhmercy', 
                  color: '#1877F2',
                  isLucide: true
                },
                { 
                  name: 'Instagram', 
                  icon: Instagram, 
                  href: 'https://www.instagram.com/kinhthongminhmercy', 
                  color: '#E1306C',
                  isLucide: true
                },
                { 
                  name: 'TikTok', 
                  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
                  href: 'https://www.tiktok.com/@kinhthongminhmercy.vn', 
                  color: '#010101',
                  isLucide: false
                },
                { 
                  name: 'Threads', 
                  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/></svg>',
                  href: 'https://www.threads.com/@kinhthongminhmercy', 
                  color: '#000000',
                  isLucide: false
                },
                { 
                  name: 'Pinterest', 
                  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>',
                  href: 'https://www.pinterest.com/mercytechglobal/', 
                  color: '#E60023',
                  isLucide: false
                },
                { 
                  name: 'Youtube', 
                  icon: Youtube, 
                  href: 'https://www.youtube.com/@mercyglobalstore', 
                  color: '#FF0000',
                  isLucide: true
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: social.color }}
                  title={social.name}
                >
                  {social.isLucide ? (
                    <social.icon className="w-5 h-5" />
                  ) : (
                    <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: social.svg }} />
                  )}
                </a>
              ))}
            </div>

            <h4 className="font-bold text-white uppercase mb-3 text-xs">Tổng đài miễn phí</h4>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 leading-tight">Hotline:</p>
                <p className="font-bold text-white text-sm">0898.273.899</p>
              </div>
              <div className="flex gap-2 mt-2">
                <a href="https://zalo.me/0898273899" target="_blank" rel="noopener noreferrer" className="bg-[#0068ff] text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-semibold hover:bg-blue-700 border border-blue-600">
                  <Send className="w-3.5 h-3.5" /> Zalo
                </a>
                <a href="tel:0898273899" className="bg-[#1A1C21] border border-gray-700 text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-xs hover:border-gray-500">
                  <Phone className="w-3.5 h-3.5" /> Gọi điện
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: About */}
          <div>
            <h4 className="font-bold text-white uppercase mb-4 text-xs">Về chúng tôi</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
              <li><div className="flex items-center gap-2 mt-4 text-gray-400"><Clock className="w-4 h-4" /> <span>9:00 – 21:30 (T2 – CN)</span></div></li>
            </ul>
          </div>

          {/* Column 3: Category Products */}
          <div>
            <h4 className="font-bold text-white uppercase mb-4 text-xs">Danh mục sản phẩm</h4>
            <ul className="space-y-3">
              {categoryLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-white transition-colors group">
                    <span className="group-hover:text-white">{link.name}</span>
                    <span className="block text-[11px] text-gray-500 group-hover:text-gray-400 mt-0.5">{link.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Policy */}
          <div>
            <h4 className="font-bold text-white uppercase mb-4 text-xs">Chính sách</h4>
            <ul className="space-y-3">
              {policyLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Location & Payment */}
          <div>
            <h4 className="font-bold text-white uppercase mb-4 text-xs">Hệ thống cửa hàng</h4>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-white font-semibold text-xs mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#5dc1d1]" /> CS HCM:</p>
                <p className="text-gray-400 leading-relaxed text-xs pl-5">36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM</p>
              </div>
              <div>
                <p className="text-white font-semibold text-xs mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#5dc1d1]" /> CS HN:</p>
                <p className="text-gray-400 leading-relaxed text-xs pl-5">S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội</p>
              </div>
            </div>

            <h4 className="font-bold text-white uppercase mb-3 text-xs">Hỗ trợ thanh toán</h4>
            <div className="flex gap-2 mb-6 select-none">
              <div className="bg-[#0055a5] rounded h-8 w-14 flex items-center justify-center shrink-0 text-[10px] font-black text-white tracking-wide" title="Ngân hàng ACB">
                ACB
              </div>
              <div className="bg-white rounded border border-gray-200 h-8 w-14 flex items-center justify-center shrink-0 text-[10px] font-black text-emerald-600 tracking-wider" title="Thanh toán COD">
                COD
              </div>
            </div>
          </div>

        </div>
      </div>


    </footer>
  );
};

export default Footer;
