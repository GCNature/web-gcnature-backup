import { useState, useEffect, useMemo } from "react";
import { Menu, Search, ShoppingCart, User, X, ChevronDown, ChevronRight, Zap, Shield, Flame, Smartphone, Gift, Store, Package, Heart, Settings, LogOut, Phone, Mail, Newspaper, Sparkles, Scissors, Smile, Globe, Award, Leaf, Ticket } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LanguageSwitcher from "./LanguageSwitcher";
import { apiGet, API_BASE } from "@/lib/api";
import type { ProductData } from "@/data/products";
import { categories } from "@/data/navigation";
import { getBranding, BRANDING_UPDATED_EVENT, resolveBranding, fetchBrandingFromServer, type BrandingSettings } from "@/lib/branding";

const mainMenu = [
  { name: "Trang chủ", hasSubmenu: false, href: "/" },
  { name: "Sản phẩm", hasSubmenu: false, href: "/shop" },
  { name: "Tin tức", hasSubmenu: false, href: "/news" },
  { name: "Giới thiệu", hasSubmenu: false, href: "/about" },
];


// const trendingKeywords = ["Kính AI", "MCK 5.1", "Dịch thuật", "Camera POV 2K", "Robot AI"];

const promoLinks = [
  { icon: Zap, text: "Flashsale", color: "text-amber-500 fill-amber-500 animate-zap", href: "/flash-sale" },
  { icon: Globe, text: "Nhập khẩu Hàn Quốc Chính Hãng", color: "text-blue-600", href: "/#" },
  { icon: Award, text: "Đã Kiểm Định tại Việt Nam", color: "text-green-600", href: "/#" },
  { icon: Leaf, text: "Hoàn Toàn Tự Nhiên", color: "text-emerald-600", href: "/#" },
];

import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [rawBranding, setRawBranding] = useState<BrandingSettings>(() => getBranding());
  const branding = useMemo(() => resolveBranding(rawBranding), [rawBranding]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [activeMegaTab, setActiveMegaTab] = useState(0);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<number | null>(null);
  const [megaMenu, setMegaMenu] = useState<any[]>([]);

  useEffect(() => {
    apiGet<any[]>(`/settings/mega-menu?_t=${Date.now()}`).then(data => {
      if (Array.isArray(data)) {
        setMegaMenu(data);
      }
    }).catch(err => {
      console.error("Failed to fetch mega menu:", err);
    });
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="w-4 h-4" />;
      case "Scissors": return <Scissors className="w-4 h-4" />;
      case "Heart": return <Heart className="w-4 h-4" />;
      case "Smile": return <Smile className="w-4 h-4" />;
      case "Gift": return <Gift className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [coopMenuOpen, setCoopMenuOpen] = useState(false);
  const { cartCount } = useShop();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Prefetch products for search functionality
    const fetchProducts = async () => {
      try {
        const data = await apiGet('/products');
        if (data && Array.isArray(data)) setAllProducts(data);
      } catch (err) { }
    };
    fetchProducts();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allProducts.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      (p as any).shortName?.toLowerCase().includes(q) || 
      p.sku?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery, allProducts]);

  const handleSearchSelect = (identifier: string | number) => {
    setSearchQuery("");
    setSearchFocused(false);
    navigate(`/product/${identifier}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Live-refresh logo when admin updates branding (same-tab via custom event, cross-tab via storage)
  useEffect(() => {
    const refresh = () => setRawBranding(getBranding());

    // Auto-clear logo overrides in localStorage on mount to use new asset files
    try {
      const saved = localStorage.getItem("gcnature_branding");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.logoLight || parsed.logoDark || parsed.logoLightMobile || parsed.logoDarkMobile) {
          parsed.logoLight = "";
          parsed.logoDark = "";
          parsed.logoLightMobile = "";
          parsed.logoDarkMobile = "";
          localStorage.setItem("gcnature_branding", JSON.stringify(parsed));
          refresh();
        }
      }
    } catch {}

    window.addEventListener(BRANDING_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    // Fetch branding from server on first mount so all devices see the same logo
    fetchBrandingFromServer().then(b => setRawBranding(b));
    return () => {
      window.removeEventListener(BRANDING_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Track responsive breakpoint to apply correct header height (Tailwind doesn't support
  // arbitrary `h-[var(--x)]` reliably, so we resolve the value in JS).
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : true
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const headerHeight = isDesktop ? branding.headerHeightDesktop : branding.headerHeightMobile;

  const logoLightMobile = branding.logoLightMobile;
  const logoDarkMobile = branding.logoDarkMobile;

  const openContactMail = (subject: string) => {
    const body = "Tên khách hàng: \n\nSố điện thoại: ";
    window.location.href = `mailto:gcnatureofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <header className="sticky top-0 z-50">
      <h1 className="sr-only">GC Nature</h1>
      {/* ═══ Main Cyan Header Bar ═══
      <div className="fpt-header-gradient">
       */}
      <div className="bg-[#5dc1d1]">
        <div
          className="container relative flex items-center gap-2 md:gap-5"
          style={{ height: `${headerHeight}px` }}
        >
          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2.5 text-white rounded-xl bg-white/10 active:scale-90 transition-transform z-10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile Catalog button */}
          <button
            onClick={() => navigate("/catalog")}
            className="md:hidden flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-90 transition-transform text-white px-2.5 py-2 rounded-xl font-bold text-xs backdrop-blur-sm whitespace-nowrap z-10"
          >
            Catalog
          </button>

          {/* Logo — centered on mobile, left-aligned on desktop */}
          <a href="/" className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 flex items-center justify-center shrink-0 group mr-1 md:mr-4 h-full min-w-[120px] md:min-w-[120px]">
            <span className="flex items-center justify-center">
              {/* Mobile logo */}
              <img
                src={logoLightMobile}
                alt="GCnature"
                style={{ height: branding.logoHeightMobile }}
                className="md:hidden w-auto object-contain dark:hidden"
              />
              <img
                src={logoDarkMobile}
                alt="GCnature"
                style={{ height: branding.logoHeightMobile }}
                className="md:hidden w-auto object-contain hidden dark:block"
              />
              {/* Desktop logo */}
              <img
                src={branding.logoLight}
                alt="GCnature"
                style={{ height: branding.logoHeightDesktop }}
                className="hidden md:block w-auto object-contain dark:hidden"
              />
              <img
                src={branding.logoDark}
                alt="GCnature"
                style={{ height: branding.logoHeightDesktop }}
                className="hidden md:dark:block w-auto object-contain"
              />
            </span>
          </a>

          {/* Category Button (desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 backdrop-blur-sm"
            >
              <Menu className="w-4 h-4" />
              <span>Danh mục</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-[820px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Left Side - Main Categories */}
                  <div className="w-[240px] bg-gray-50/80 border-r border-gray-100 p-3 flex flex-col gap-1 shrink-0">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                      Nhóm Danh Mục
                    </h4>
                    {megaMenu.map((cat, idx) => (
                      <button
                        key={idx}
                        className={`flex items-center justify-between w-full px-3 py-3 text-sm rounded-xl font-semibold transition-all text-left ${
                          activeMegaTab === idx
                            ? "bg-[#5dc1d1] text-white shadow-md shadow-cyan-100 scale-[1.02]"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        onMouseEnter={() => setActiveMegaTab(idx)}
                        onClick={() => {
                          setCatOpen(false);
                          navigate(cat.href);
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          {getCategoryIcon(cat.icon)}
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeMegaTab === idx ? "text-white translate-x-0.5" : "text-gray-300"}`} />
                      </button>
                    ))}
                    
                    <div className="mt-auto border-t border-gray-200/60 pt-3 px-1">
                      <button
                        onClick={() => {
                          setCatOpen(false);
                          navigate("/shop");
                        }}
                        className="flex items-center justify-center gap-2 w-full text-xs font-bold text-[#5dc1d1] hover:text-cyan-600 py-2.5 hover:bg-cyan-50 rounded-xl transition-all"
                      >
                        Tất cả sản phẩm →
                      </button>
                    </div>
                  </div>

                  {/* Right Side - Subcategories Grid */}
                  <div className="flex-1 p-6 bg-white grid grid-cols-2 gap-x-8 gap-y-6 max-h-[460px] overflow-y-auto custom-scrollbar">
                    {megaMenu[activeMegaTab]?.groups?.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-2.5">
                        <h5 className="text-[11px] font-bold text-[#5dc1d1] uppercase tracking-wider border-b border-cyan-50 pb-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5dc1d1]" />
                          {group.groupName}
                        </h5>
                        <ul className="flex flex-col gap-2">
                          {group.items?.map((item, iIdx) => (
                            <li key={iIdx}>
                              <button
                                onClick={() => {
                                  setCatOpen(false);
                                  navigate(item.href);
                                }}
                                className="text-xs text-gray-600 hover:text-[#5dc1d1] font-medium transition-colors hover:translate-x-0.5 transform duration-150 text-left w-full block"
                              >
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên sản phẩm, mỹ phẩm... cần tìm"
                className="flex-1 px-4 py-2.5 text-sm bg-white outline-none text-gray-800 placeholder:text-gray-400"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="px-2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="submit" className="bg-[#5dc1d1] hover:bg-[#4eb0c0] text-white px-4 h-[42px] flex items-center justify-center transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>
            {/* Search Results */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleSearchSelect(p.productId || p.id)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors"
                  >
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-teal-600 font-bold">{p.price.toLocaleString("vi-VN")}₫</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchFocused && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border z-50 p-4 text-center text-sm text-gray-500">
                Không tìm thấy sản phẩm nào
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* User icon / dropdown */}
            <div className="relative hidden md:block">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-white hover:bg-white/15 px-3 py-2 rounded-lg transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar.startsWith('/') ? `${API_BASE.replace('/api', '')}${user.avatar}` : user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-white/20" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/account"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <User className="w-4 h-4" /> Tài khoản của tôi
                          </button>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/orders"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <Package className="w-4 h-4" /> Đơn hàng của tôi
                          </button>
                          <button
                            onClick={() => { setUserMenuOpen(false); navigate("/wishlist"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <Heart className="w-4 h-4" /> Yêu thích
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => { setUserMenuOpen(false); navigate("/admin"); }}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors text-left"
                            >
                              <Settings className="w-4 h-4" /> Quản trị Admin
                            </button>
                          )}
                        </div>
                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={() => { setUserMenuOpen(false); logout(); toast.success("Đã đăng xuất"); navigate("/"); }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" /> Đăng xuất
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1.5 text-white hover:bg-white/15 px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* Catalog Button */}
            <button
              onClick={() => navigate("/catalog")}
              className="hidden md:flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 md:px-3.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs md:text-sm transition-all duration-200 active:scale-95 backdrop-blur-sm whitespace-nowrap"
            >
              <span>Catalog</span>
            </button>

            {/* Hợp tác Dropdown */}
            <div className="relative z-50">
              <button
                onClick={() => setCoopMenuOpen(!coopMenuOpen)}
                className="relative flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2.5 md:px-3.5 py-2 rounded-xl font-bold text-[11px] sm:text-xs md:text-sm transition-all duration-200 active:scale-95 backdrop-blur-sm whitespace-nowrap"
              >
                <span className="pulse-ring" />
                <span>Hợp tác</span>
                <ChevronDown className="w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-300" style={{ transform: coopMenuOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {coopMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCoopMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-44 md:w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200 py-1">
                    <button
                      onClick={() => { setCoopMenuOpen(false); navigate("/chinh-sach/dai-ly"); }}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors text-left font-bold border-b border-gray-50 uppercase tracking-wider"
                    >
                      Đại lý phân phối
                    </button>
                    <button
                      onClick={() => { setCoopMenuOpen(false); navigate("/chinh-sach/oem"); }}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors text-left font-bold border-b border-gray-50 uppercase tracking-wider"
                    >
                      OEM nhà máy
                    </button>
                    <button
                      onClick={() => { setCoopMenuOpen(false); navigate("/chinh-sach/affiliate"); }}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors text-left font-bold uppercase tracking-wider"
                    >
                      Affiliate
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cart Button */}
            <button
              id="header-cart-button"
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 bg-white text-[#5dc1d1] px-2.5 md:px-3 py-2 rounded-xl font-bold text-sm transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-[#5dc1d1] text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Promo Strip + Navigation (white bar, FPT style) ═══ */}
      <div className={`hidden md:block bg-white border-b border-gray-100 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="container flex items-center justify-between h-11">
          {/* Left: Sản phẩm đang giảm giá */}
          <div className="flex-initial flex items-center gap-2">
            <a href="/flash-sale" className="group flex items-center gap-1 text-xs xl:text-sm font-bold transition-all rounded-full bg-teal-50/80 px-2.5 py-0.5 shadow-sm border border-teal-100 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap -ml-2">
              <Zap className="w-4 h-4 xl:w-5 xl:h-5 text-amber-500 fill-amber-500 animate-zap drop-shadow-sm" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500 group-hover:from-teal-700 group-hover:to-teal-600">Flashsale</span>
            </a>
            <a
              href="/chuong-trinh-hot"
              className="group flex items-center gap-1 text-xs xl:text-sm font-bold transition-all rounded-full bg-orange-50 px-2.5 py-0.5 shadow-sm border border-orange-100 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-orange-600">Chương trình HOT</span>
            </a>
          </div>

          {/* Center: Bảo hành, Trả góp, Quà tặng */}
          <div className="flex-initial flex items-center gap-2.5 xl:gap-4 mx-2">
            {promoLinks.slice(1).map((link, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px] xl:text-xs font-semibold text-gray-700 whitespace-nowrap">
                <link.icon className={`w-3.5 h-3.5 xl:w-4.5 xl:h-4.5 ${link.color}`} />
                {link.text}
              </div>
            ))}
          </div>

          {/* Right links */}
          <div className="flex-initial flex items-center gap-2 xl:gap-3 shrink-0 ml-2 xl:ml-4">
            <a
              href="/vouchers"
              className="flex items-center gap-1 text-[11px] xl:text-xs font-bold text-red-500 hover:text-red-600 transition-colors whitespace-nowrap animate-pulse"
            >
              <Ticket className="w-3.5 h-3.5 text-red-500" />
              <span>Săn Voucher</span>
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/news"
              className="flex items-center gap-1 text-[11px] xl:text-xs font-semibold text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap"
            >
              <Newspaper className="w-3.5 h-3.5 text-teal-600" />
              <span>Tin tức</span>
            </a>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => setStoreModalOpen(true)} 
              className="flex items-center gap-1 text-[11px] xl:text-xs font-semibold text-gray-700 hover:text-teal-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-teal-600" />
              <span>Hệ thống cửa hàng</span>
            </button>
            <span className="text-gray-300">|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* ═══ Mobile Sidebar ═══ */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`md:hidden fixed top-0 left-0 z-[70] h-full w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile header — height matches the main red header bar so logos line up */}
        <div
          className={`flex items-center justify-between px-4 border-b ${branding.sidebarHeaderStyle === "white" ? "bg-white border-gray-100" : "bg-[#5dc1d1] border-transparent"}`}
          style={{ height: branding.headerHeightMobile }}
        >
          {branding.sidebarHeaderStyle === "white" ? (
            <>
              {/* Use the dark logo on white background so it's readable */}
              <img
                src={branding.logoDarkMobile}
                alt="GCnature"
                style={{ height: branding.logoHeightSidebar }}
                className="object-contain"
              />
              <button
                id="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition active:scale-90"
                aria-label="Đóng menu"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <img
                src={logoLightMobile}
                alt="GCnature"
                style={{ height: branding.logoHeightSidebar }}
                className="object-contain dark:hidden"
              />
              <img
                src={logoDarkMobile}
                alt="GCnature"
                style={{ height: branding.logoHeightSidebar }}
                className="object-contain hidden dark:block"
              />
              <button
                id="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition active:scale-90"
                aria-label="Đóng menu"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Mobile Search */}
          <div className="p-4">
            <form onSubmit={(e) => { handleSearchSubmit(e); setMenuOpen(false); }} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 rounded-xl outline-none text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-200 border border-gray-200"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                aria-label="Tìm kiếm sản phẩm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
            {searchFocused && searchResults.length > 0 && (
              <div className="mt-1 bg-white rounded-lg border shadow-lg overflow-hidden">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => { handleSearchSelect(p.productId || p.id); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-teal-50"
                  >
                    <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-teal-600 font-bold">{p.price.toLocaleString("vi-VN")}₫</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu + Categories */}
          <div className="px-4 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ngôn ngữ</h3>
              <LanguageSwitcher />
            </div>

            {/* Promo links in mobile — moved to top */}
            {promoLinks.slice(0, 1).map((link, i) => (
              <a key={i} href={link.href} className="flex items-center gap-3 py-3 text-[15px] text-gray-700 hover:text-red-600 border-b border-gray-100">
                <link.icon className={`w-5 h-5 ${link.color}`} />
                <span>{link.text}</span>
              </a>
            ))}
             <a href="/chuong-trinh-hot" className="flex items-center gap-3 py-3 text-[15px] text-orange-600 font-bold hover:text-orange-700 border-b border-gray-100">
               <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
               <span>Chương trình HOT 🔥</span>
             </a>
             <a href="/vouchers" className="flex items-center gap-3 py-3 text-[15px] text-red-500 font-bold hover:text-red-600 border-b border-gray-100 animate-pulse">
               <Ticket className="w-5 h-5 text-red-500" />
               <span>Săn Voucher</span>
             </a>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Menu</h3>
            {mainMenu.map((link, i) => (
              <a key={i} href={link.href} className="flex items-center justify-between py-3 text-[15px] font-medium text-gray-800 hover:text-red-600 border-b border-gray-100 last:border-0">
                <span>{link.name}</span>
                {link.hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </a>
            ))}
            
            {/* Danh mục sản phẩm — moved up above Tài khoản */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Danh mục sản phẩm</h3>
            <div className="flex flex-col">
              {megaMenu.map((cat, idx) => {
                const isExpanded = mobileActiveCategory === idx;
                return (
                  <div key={idx} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setMobileActiveCategory(isExpanded ? null : idx)}
                      className="flex items-center justify-between w-full py-3 text-[15px] font-semibold text-gray-700 hover:text-[#5dc1d1] text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {getCategoryIcon(cat.icon)}
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-[#5dc1d1]' : ''}`} />
                    </button>
                    
                    {isExpanded && (
                      <div className="pl-6 pb-3 pt-1 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                        {cat.groups.map((group, gIdx) => (
                          <div key={gIdx} className="space-y-1.5">
                            <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                              {group.groupName}
                            </h5>
                            <div className="grid grid-cols-1 gap-1">
                              {group.items.map((item, iIdx) => (
                                <button
                                  key={iIdx}
                                  onClick={() => {
                                    setMenuOpen(false);
                                    navigate(item.href);
                                  }}
                                  className="text-sm text-gray-600 hover:text-[#5dc1d1] py-1.5 text-left font-medium block w-full"
                                >
                                  {item.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>



            {/* Mobile User Menu — moved down below Danh mục sản phẩm */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Tài khoản</h3>
            {isAuthenticated ? (
              <>
                <button onClick={() => { setMenuOpen(false); navigate("/account"); }} className="flex items-center gap-3 w-full py-3 text-[15px] text-gray-700 hover:text-red-600 border-b border-gray-100 text-left">
                  {user?.avatar ? (
                    <img src={user.avatar.startsWith('/') ? `${API_BASE.replace('/api', '')}${user.avatar}` : user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-600">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span>{user?.name}</span>
                </button>
                <button onClick={() => { setMenuOpen(false); navigate("/orders"); }} className="flex items-center gap-3 w-full py-3 text-[15px] text-gray-700 hover:text-teal-600 border-b border-gray-100 text-left">
                  <Package className="w-5 h-5 text-gray-400" /> Đơn hàng của tôi
                </button>
                {isAdmin && (
                  <button onClick={() => { setMenuOpen(false); navigate("/admin"); }} className="flex items-center gap-3 w-full py-3 text-[15px] text-teal-600 font-semibold border-b border-gray-100 text-left">
                    <Settings className="w-5 h-5" /> Quản trị Admin
                  </button>
                )}
                <button onClick={() => { setMenuOpen(false); logout(); toast.success("Đã đăng xuất"); navigate("/"); }} className="flex items-center gap-3 w-full py-3 text-[15px] text-gray-700 hover:text-teal-600 border-b border-gray-100 text-left">
                  <LogOut className="w-5 h-5 text-gray-400" /> Đăng xuất
                </button>
              </>
            ) : (
              <button onClick={() => { setMenuOpen(false); navigate("/login"); }} className="flex items-center gap-3 w-full py-3 text-[15px] text-gray-700 hover:text-teal-600 border-b border-gray-100 text-left">
                <User className="w-5 h-5 text-gray-400" /> Đăng nhập / Đăng ký
              </button>
            )}

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Liên hệ nhanh</h3>
            <div className="grid grid-cols-2 gap-2">
              <a
                id="mobile-call-now"
                href="tel:0898273899"
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                <Phone className="w-4 h-4" /> Gọi ngay
              </a>
              <button
                id="mobile-email-contact"
                onClick={() => {
                  setMenuOpen(false);
                  openContactMail("Chăm Sóc Khách Hàng");
                }}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ═══ Store Modal ═══ */}
      {storeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={() => setStoreModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-teal-600 pl-3">Hệ thống cửa hàng GCnature</h3>
              <button onClick={() => setStoreModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CS HCM */}
              <div className="bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-teal-100 p-2 rounded-lg"><Store className="w-5 h-5 text-teal-600" /></div>
                  <h4 className="font-bold text-base text-gray-900">Cơ sở Hồ Chí Minh</h4>
                </div>
                <p className="text-xs text-gray-600 mb-4 pl-[42px] font-medium min-h-[40px] leading-relaxed">36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM</p>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5752795384906!2d106.7133077!3d10.843779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529f59df91493%3A0xb34323159917756c!2sGC%20Nature!5e0!3m2!1svi!2s!4v1784199843975!5m2!1svi!2s" className="w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
              
              {/* CS HN */}
              <div className="bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg"><Store className="w-5 h-5 text-blue-600" /></div>
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
    </header>
  );
};

export default Header;
