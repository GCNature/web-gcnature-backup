import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { apiGet } from "@/lib/api";
import { Leaf, Award, Globe, Sparkles, BookOpen, ShoppingCart, ChevronLeft, ChevronRight, Calendar, ChevronDown } from "lucide-react";

interface Product {
  id: number;
  productId: string;
  sku?: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  category?: string;
  image?: string;
  images?: string;
  shortName?: string;
  brand?: string;
  featuresVn?: string;
  featuresEn?: string;
  productionYear?: number;
}

const COSMETIC_CATEGORIES = [
  { id: "serum", name: "Tinh chất & Serum" },
  { id: "mask", name: "Mặt nạ dưỡng da" },
  { id: "cream", name: "Kem dưỡng & Chống nắng" },
  { id: "spa", name: "Liệu trình Spa & Vi kim" },
  { id: "body", name: "Chăm sóc cơ thể (Body Care)" },
];

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const [cmsContent, setCmsContent] = useState<{
    title: string;
    desc: string;
    introTitle?: string;
    introText?: string;
    bannerImage?: string;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
  }>({
    title: "DIGITAL CATALOG - GC NATURE",
    desc: "Sự chăm sóc tự nhiên tinh túy chuẩn Hàn Quốc",
    introTitle: "Tinh Hoa Mỹ Phẩm Tự Nhiên Nhập Khẩu Hàn Quốc",
    introText: "Chào mừng bạn đến với cuốn Catalog điện tử của GC Nature. Tất cả sản phẩm của chúng tôi đều được tuyển chọn kỹ lưỡng từ các thương hiệu nội địa uy tín của Hàn Quốc, chiết xuất từ thiên nhiên lành tính, an toàn tuyệt đối và đã qua kiểm định nghiêm ngặt tại Việt Nam."
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load products with cache-busting timestamp to prevent obsolete CDN/browser response caches
        const prodsData = await apiGet<Product[]>(`/products?_t=${Date.now()}`);
        if (prodsData) setProducts(prodsData);

        // Load CMS Page configuration for catalog with cache-busting
        const cmsData = await apiGet<any>(`/settings/page/page_catalog?_t=${Date.now()}`);
        if (cmsData) {
          setCmsContent({
            title: cmsData.title || "DIGITAL CATALOG - GC NATURE",
            desc: cmsData.desc || "Sự chăm sóc tự nhiên tinh túy chuẩn Hàn Quốc",
            introTitle: cmsData.introTitle || "Tinh Hoa Mỹ Phẩm Tự Nhiên Nhập Khẩu Hàn Quốc",
            introText: cmsData.introText || "Chào mừng bạn đến với cuốn Catalog điện tử của GC Nature. Tất cả sản phẩm của chúng tôi đều được tuyển chọn kỹ lưỡng từ các thương hiệu nội địa uy tín của Hàn Quốc, chiết xuất từ thiên nhiên lành tính, an toàn tuyệt đối và đã qua kiểm định nghiêm ngặt tại Việt Nam.",
            bannerImage: cmsData.bannerImage || "",
            seoTitle: cmsData.seoTitle || "",
            seoDesc: cmsData.seoDesc || "",
            seoKeywords: cmsData.seoKeywords || ""
          });
        }
      } catch (error) {
        console.error("Load catalog error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Helper to map products into virtual cosmetics categories
  const getProductVirtualCategory = (p: Product): string => {
    const nameLower = p.name.toLowerCase();
    
    // Check masks first to prevent overlap (since some masks have "serum" in name)
    if (nameLower.includes("mặt nạ") || nameLower.includes("mask")) {
      return "mask";
    }
    if (nameLower.includes("serum") || nameLower.includes("ampoule") || nameLower.includes("tinh chất")) {
      return "serum";
    }
    if (nameLower.includes("kem") || nameLower.includes("cream") || nameLower.includes("chống nắng") || nameLower.includes("sun")) {
      return "cream";
    }
    if (nameLower.includes("body") || nameLower.includes("gel body") || nameLower.includes("vóc dáng")) {
      return "body";
    }
    if (nameLower.includes("kit") || nameLower.includes("spa") || nameLower.includes("vi kim")) {
      return "spa";
    }
    return "serum"; // Fallback to serum
  };

  // Format price helper
  const formatPrice = (val: string | number) => {
    const num = Number(val);
    if (isNaN(num) || num === 0) return "Liên hệ";
    return num.toLocaleString("vi-VN") + "đ";
  };

  // Filter products by virtual category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(p => getProductVirtualCategory(p) === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-16 md:pb-0">
      <SEOHead
        title={cmsContent.seoTitle || cmsContent.title}
        description={cmsContent.seoDesc || cmsContent.desc}
        keywords={cmsContent.seoKeywords || ""}
        canonical={makeSiteUrl("/catalog")}
      />
      <Header />

      <main className="container py-8 max-w-5xl">
        {/* Elegant Luxury Banner */}
        <div 
          className="bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden border border-emerald-800/30 bg-cover bg-center"
          style={cmsContent.bannerImage ? { backgroundImage: `linear-gradient(to bottom, rgba(6, 78, 59, 0.35), rgba(4, 47, 46, 0.55)), url(${cmsContent.bannerImage})` } : {}}
        >
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-400/20">
              <BookOpen className="w-3.5 h-3.5" /> GCnature Premium Catalog
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mt-2 mb-3 tracking-wide leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-50 via-teal-100 to-emerald-200">
              {cmsContent.title}
            </h1>
            <p className="text-emerald-100/90 font-medium text-sm md:text-base leading-relaxed max-w-2xl border-l-2 border-emerald-500/40 pl-4 py-1">
              {cmsContent.desc}
            </p>
          </div>
        </div>

        {/* Brand Philosophy Intro */}
        <div className="bg-white rounded-3xl border border-stone-100 p-6 md:p-10 mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50/60 rounded-full translate-x-16 -translate-y-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl md:text-2xl font-bold font-serif text-stone-900 tracking-wide">
                {cmsContent.introTitle}
              </h2>
              <p className="text-stone-600 leading-relaxed text-sm whitespace-pre-line font-light">
                {cmsContent.introText}
              </p>
            </div>
            
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/30 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">100% Hàn Quốc</span>
              </div>
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Chiết xuất Tự nhiên</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Kiểm định An toàn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar sticky top-[72px] z-30 bg-[#fafaf9]/85 backdrop-blur-md py-2 border-b border-stone-100">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 border uppercase tracking-wider ${
              selectedCategory === "all"
                ? "bg-emerald-950 text-white border-emerald-950 shadow-md"
                : "bg-white text-stone-600 border-stone-200 hover:border-emerald-800/40"
            }`}
          >
            Tất cả sản phẩm
          </button>
          {COSMETIC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 border uppercase tracking-wider ${
                selectedCategory === cat.id
                  ? "bg-emerald-950 text-white border-emerald-950 shadow-md"
                  : "bg-white text-stone-600 border-stone-200 hover:border-emerald-800/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Catalog Detailed List */}
        {loading ? (
          <div className="text-center py-24 text-stone-400 font-light">Đang đồng bộ danh mục sản phẩm từ Hàn Quốc...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-stone-500 bg-white rounded-3xl border border-stone-100 p-8 shadow-sm">
            <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-3 opacity-60" />
            <p className="font-light">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredProducts.map((prod, index) => {
              const virtualCat = COSMETIC_CATEGORIES.find(c => c.id === getProductVirtualCategory(prod))?.name || "Tinh chất";
              
              return (
                <ProductCatalogCard key={prod.id} prod={prod} index={index} virtualCat={virtualCat} formatPrice={formatPrice} />
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
}

// Separate component for clean state management of images in each product card
function ProductCatalogCard({ 
  prod, 
  index, 
  virtualCat, 
  formatPrice 
}: { 
  prod: Product; 
  index: number; 
  virtualCat: string; 
  formatPrice: (v: string | number) => string;
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Parse images from comma-separated string
  const parsedImages = useMemo(() => {
    if (prod.images) {
      const urls = prod.images.split(',').map(img => img.trim()).filter(Boolean);
      if (urls.length > 0) return urls;
    }
    if (prod.image) return [prod.image];
    return ["/placeholder.svg"];
  }, [prod.images, prod.image]);

  // Parse featuresVn
  const features = useMemo(() => {
    if (prod.featuresVn) {
      try {
        const parsed = JSON.parse(prod.featuresVn);
        if (Array.isArray(parsed)) return parsed.slice(0, 4);
      } catch {}
      
      const clean = prod.featuresVn.replace(/[\[\]"]/g, '');
      const list = clean.split('\n').map(s => s.trim()).filter(Boolean);
      if (list.length > 0) return list.slice(0, 4);
    }
    return [
      "Chiết xuất hoàn toàn tự nhiên lành tính",
      "Công nghệ sản xuất tiên tiến từ Hàn Quốc",
      "Dưỡng ẩm sâu và tái tạo hàng rào bảo vệ da"
    ];
  }, [prod.featuresVn]);

  return (
    <div 
      className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-md hover:shadow-xl hover:border-emerald-800/15 transition-all duration-300 p-6 md:p-8 flex flex-col gap-6 relative group"
    >
      {/* Dynamic Catalog Page Indicator / Index */}
      <div className="absolute top-4 right-4 bg-stone-50 border border-stone-200/50 text-stone-400 text-[10px] md:text-xs font-mono font-bold px-3 py-1 rounded-full shrink-0 select-none">
        PAGE {(index + 1).toString().padStart(2, '0')}
      </div>

      {/* Grid: Image on Left, Info on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Square Image Gallery (md:col-span-5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-square w-full bg-stone-50 rounded-2xl overflow-hidden relative border border-stone-100/60">
            <img 
              src={parsedImages[activeImgIdx]} 
              alt={prod.name}
              className="w-full h-full object-contain p-4 group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Swiper arrows */}
            {parsedImages.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImgIdx(prev => prev === 0 ? parsedImages.length - 1 : prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-1.5 rounded-full shadow transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveImgIdx(prev => prev === parsedImages.length - 1 ? 0 : prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-1.5 rounded-full shadow transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          {parsedImages.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar justify-center">
              {parsedImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-11 h-11 rounded-lg overflow-hidden border transition-all shrink-0 bg-stone-50 ${
                    activeImgIdx === idx ? "border-emerald-800 scale-95" : "border-stone-100 hover:border-emerald-800/30"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover p-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Title, Brand, Origin & Price (md:col-span-7) */}
        <div className="md:col-span-7 space-y-5 flex flex-col justify-between h-full min-h-[280px]">
          <div className="space-y-3">
            <span className="bg-emerald-950 text-emerald-200 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-800/20 w-fit block">
              {prod.brand || "GC Nature"}
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-stone-900 leading-snug tracking-wide group-hover:text-emerald-950 transition-colors">
              {prod.name}
            </h2>
            {prod.shortName && (
              <p className="text-xs text-emerald-800/80 font-bold uppercase tracking-wider">
                {prod.shortName}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Xuất xứ: <strong className="font-semibold text-stone-900">Hàn Quốc (Korea)</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Award className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Thương hiệu nhập khẩu: <strong className="font-semibold text-stone-900">{prod.brand || "GC Nature"}</strong></span>
            </div>
            {prod.productionYear && (
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Năm sản xuất: <strong className="font-semibold text-stone-900">{prod.productionYear}</strong></span>
              </div>
            )}
          </div>

          <div className="bg-[#fdfcfb] rounded-2xl p-4 border border-stone-100/60 relative space-y-2">
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Chương trình ưu đãi</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-700 text-sm font-black px-3.5 py-1.5 rounded-xl w-fit">
                <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Chiết khấu lên đến 60%</span>
              </div>

              <div className="relative shrink-0">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
                >
                  <span>Tham gia hợp tác</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <>
                    {/* Backdrop to close click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-2 w-56 bg-white rounded-xl border border-stone-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <a
                        href="/chinh-sach/dai-ly"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                        Tham gia đại lý
                      </a>
                      <a
                        href="/chinh-sach/oem"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                        OEM nhà máy
                      </a>
                      <a
                        href="/chinh-sach/affiliate"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full shrink-0" />
                        Tham gia Affiliate
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Key Benefits & Brand Commitment (Full width) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-100/70">
        
        {/* Left Bottom: Key Benefits */}
        <div className="bg-emerald-50/20 rounded-2xl p-5 border border-emerald-100/30 space-y-3">
          <span className="text-xs text-emerald-800 font-extrabold uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-100/40 pb-2">
            <Leaf className="w-4 h-4 text-emerald-700" /> Công dụng nổi bật của sản phẩm
          </span>
          <ul className="space-y-2 text-xs text-stone-600 font-medium">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-stone-100/30">
                <ChevronRight className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Bottom: Brand Info / Commitment */}
        <div className="bg-stone-50/30 rounded-2xl p-5 border border-stone-200/40 space-y-3">
          <span className="text-xs text-stone-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200/50 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-700" /> Cam kết chất lượng GC Nature
          </span>
          <div className="space-y-2 text-xs text-stone-600 font-light leading-relaxed">
            <p>🌟 Sản phẩm được nhập khẩu chính ngạch 100% từ các nhà máy sản xuất mỹ phẩm hàng đầu tại Hàn Quốc.</p>
            <p>🌿 Chiết xuất từ nguồn nguyên liệu thiên nhiên lành tính, đảm bảo an toàn tuyệt đối cho mọi loại da, kể cả da nhạy cảm nhất.</p>
            <p>🔬 Sản phẩm đã trải qua quy trình kiểm nghiệm chất lượng nghiêm ngặt và được cấp phép lưu hành đầy đủ tại thị trường Việt Nam.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
