import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { Ticket, Copy, Check, ShoppingBag, Gift, ShieldAlert, Sparkles, UserPlus } from "lucide-react";
import { apiGet } from "@/lib/api";
import { formatPrice } from "@/data/products";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Voucher {
  id: number;
  code: string;
  name: string;
  discount_amount: number;
  min_order_value: number;
  expires_at: string | null;
}

const Vouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await apiGet("/vouchers/active");
        if (Array.isArray(data)) {
          // Only show indefinite vouchers (expires_at is null)
          const indefiniteVouchers = data.filter(v => v.expires_at === null);
          setVouchers(indefiniteVouchers);
        }
      } catch (err) {
        console.error("Failed to load vouchers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <SEOHead
        title="Chương trình Voucher Khuyến Mãi"
        description="Tổng hợp tất cả mã giảm giá, voucher khuyến mãi mới nhất từ GCnature. Nhận ngay trọn bộ voucher khi đăng ký tài khoản."
        canonical={makeSiteUrl("/vouchers")}
      />
      <Header />
      <ScrollToTop />

      <main className="container py-8 max-w-5xl mx-auto px-4">
        {/* Banner Chương Trình */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 text-white p-8 md:p-12 shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Animated backgrounds */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,#fff_1px,transparent_1px)] bg-[length:16px_16px]" />
          
          <div className="relative space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Đặc quyền thành viên
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              KHO VOUCHER KHỦNG <br />
              <span className="text-yellow-300">TỰ ĐỘNG ÁP DỤNG</span>
            </h1>
            <p className="text-sm md:text-base opacity-90 font-medium">
              Chỉ cần đăng ký tài khoản bằng Email hoặc Số điện thoại, hệ thống sẽ tự động gán toàn bộ 5 voucher mặc định vào ví của bạn. Không lo quên áp mã - chúng tôi sẽ tự chọn mức giảm tốt nhất tại trang thanh toán!
            </p>
            
            {!isAuthenticated && (
              <div className="pt-2">
                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-teal-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto md:mx-0"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký nhận mã ngay
                </button>
              </div>
            )}
          </div>

          <div className="relative shrink-0 flex items-center justify-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 w-48 h-48 md:w-56 md:h-56">
            <Ticket className="w-24 h-24 md:w-32 md:h-32 text-yellow-300 animate-pulse" />
          </div>
        </section>

        {/* Thể lệ chương trình */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: Gift,
              title: "Tự động kích hoạt",
              desc: "Mọi tài khoản mới tạo đều được tặng trọn bộ 5 voucher mặc định."
            },
            {
              icon: Ticket,
              title: "Tối ưu chi phí",
              desc: "Hệ thống tự động đề xuất và chọn mã giảm cao nhất theo giá trị giỏ hàng."
            },
            {
              icon: ShieldAlert,
              title: "Một mã mỗi đơn",
              desc: "Mỗi đơn hàng được áp dụng tối đa 1 voucher. Không giới hạn số lần sử dụng cho tài khoản khác nhau."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Danh sách voucher */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-teal-600" />
            Danh sách mã giảm giá đang hoạt động
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Đang tải danh sách voucher...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              Chưa có chương trình voucher nào hoạt động lúc này. Hãy quay lại sau!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex relative hover:shadow-md transition-shadow group"
                >
                  {/* Left Ticket cutouts */}
                  <div className="w-32 bg-gradient-to-br from-teal-500 to-cyan-500 flex flex-col items-center justify-center text-white shrink-0 relative p-4 border-r border-dashed border-white/30">
                    <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gray-50" />
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-gray-50" />
                    
                    <Ticket className="w-8 h-8 opacity-90 mb-2" />
                    <span className="text-xs font-bold opacity-80 uppercase tracking-widest">GCnature</span>
                    <span className="text-[10px] opacity-75 mt-1">Voucher</span>
                  </div>

                  {/* Right Details */}
                  <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="font-mono font-bold text-base bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded">
                          {v.code}
                        </code>
                        <span className="text-xs text-gray-400 font-semibold">
                          {v.expires_at ? `HSD: ${new Date(v.expires_at).toLocaleDateString("vi-VN")}` : "Không thời hạn"}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm truncate">{v.name}</h3>
                      <p className="text-xs text-green-600 font-bold">
                        Giảm {formatPrice(v.discount_amount)}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Áp dụng cho đơn hàng từ <strong className="text-gray-700">{formatPrice(v.min_order_value)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleCopy(v.code)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 hover:border-teal-500 rounded-xl text-xs font-bold text-gray-600 hover:text-teal-600 bg-white transition-colors"
                      >
                        {copiedCode === v.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            Đã chép
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Sao chép mã
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => navigate("/shop")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-xs font-bold text-white transition-colors shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Dùng ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Vouchers;
