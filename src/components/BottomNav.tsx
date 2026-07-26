import { Home, Store, Phone, User, Heart, LogIn, X, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tapped, setTapped] = useState<number | null>(null);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const items = [
    { icon: Home, label: "Trang chủ", href: "/", action: () => navigate("/") },
    { icon: Store, label: "Cửa hàng", href: "#", action: () => setStoreModalOpen(true) },
    { icon: Phone, label: "Liên hệ", href: "#", action: () => setContactModalOpen(true) },
    { icon: isAuthenticated ? User : LogIn, label: isAuthenticated ? "Tài khoản" : "Đăng nhập", href: isAuthenticated ? "/account" : "/login", action: () => navigate(isAuthenticated ? "/account" : "/login") },
    { icon: Heart, label: "Yêu thích", href: "/wishlist", action: () => navigate("/wishlist") },
  ];

  const activeIndex = items.findIndex((item) => item.href === location.pathname);

  const handleTap = (i: number) => {
    setTapped(i);
    setTimeout(() => setTapped(null), 300);
    items[i].action();
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 pointer-events-none">
        <div className="pointer-events-auto relative mx-auto max-w-md overflow-hidden rounded-[24px] border border-white/70 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.22)] backdrop-blur-xl">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="grid grid-cols-5 items-center px-1.5 py-2">
            {items.map((item, i) => {
              const active = i === activeIndex;
              return (
                <button
                  id={`bottom-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  key={item.label}
                  onClick={() => handleTap(i)}
                  className={`relative flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 transition-all duration-300 ${
                    active ? "text-white" : "text-slate-500 hover:text-red-600"
                  }`}
                  aria-label={item.label}
                >
                  <span
                    className={`absolute inset-1 rounded-2xl bg-gradient-to-br from-[#e11d2e] to-[#a90015] shadow-[0_10px_24px_rgba(203,28,34,0.28)] transition-all duration-300 ${
                      active ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    }`}
                  />
                  <span className="relative">
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                        tapped === i ? "scale-125" : active ? "scale-110" : "scale-100"
                      }`}
                    />
                  </span>
                  <span className={`relative max-w-[62px] truncate text-center text-[10px] font-semibold leading-tight ${active ? "text-white" : "text-slate-500"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      {/* ═══ Store Modal ═══ */}
      {storeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setStoreModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 border-l-4 border-red-600 pl-3">Hệ thống cửa hàng</h3>
              <button onClick={() => setStoreModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CS HCM */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-red-100 p-2 rounded-lg"><Store className="w-5 h-5 text-red-600"/></div>
                  <h4 className="font-bold text-base text-gray-900">Cơ sở Hồ Chí Minh</h4>
                </div>
                <p className="text-xs text-gray-600 mb-4 pl-[42px] font-medium min-h-[40px] leading-relaxed">36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM</p>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5752795384906!2d106.7133077!3d10.843779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529f59df91493%3A0xb34323159917756c!2sGC%20Nature!5e0!3m2!1svi!2s!4v1784199843975!5m2!1svi!2s" className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>

              {/* CS HN */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg"><Store className="w-5 h-5 text-blue-600"/></div>
                  <h4 className="font-bold text-base text-gray-900">Cơ sở Vinsmart City</h4>
                </div>
                <p className="text-xs text-gray-600 mb-4 pl-[42px] font-medium min-h-[40px] leading-relaxed">S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội</p>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6029288439763!2d105.7375232!3d21.0085481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313453ed4cf0e709%3A0x31d5c0508cec86b4!2sGC%20Nature!5e0!3m2!1svi!2s!4v1784172944486!5m2!1svi!2s" className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ═══ Contact Modal (Mobile) ═══ */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setContactModalOpen(false)}>
          <div className="bg-white rounded-t-2xl shadow-2xl p-4 w-full max-w-md animate-in slide-in-from-bottom-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 ml-2">Liên Hệ</h3>
              <button onClick={() => setContactModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:text-red-600"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-3 pb-6">
              {["Đại Lý Nhập Hàng", "Hợp Tác Thương Hiệu", "Chăm Sóc Khách Hàng"].map(opt => (
                <button key={opt} onClick={() => {
                  setContactModalOpen(false);
                  const body = `Tên khách hàng: \n\nSố điện thoại: `;
                  window.location.href = `mailto:gcnatureofficial@gmail.com?subject=${encodeURIComponent(opt)}&body=${encodeURIComponent(body)}`;
                }} className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-teal-50 rounded-xl transition-colors group">
                  <span className="font-semibold text-gray-800 group-hover:text-teal-600">{opt}</span>
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-teal-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
