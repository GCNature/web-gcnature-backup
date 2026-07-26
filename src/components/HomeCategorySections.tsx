import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { Eye, ShoppingCart, Gift, Zap, Sparkles, Scissors, Heart, Smile, Image as ImageIcon } from "lucide-react";

// Inline helper for currency formatting
const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";

const HomeCategorySections = () => {
  const navigate = useNavigate();
  const { addToCart, products } = useShop();

  // Helper to filter products for each category
  const getCategoryProducts = (sectionType: string) => {
    let filtered = [];
    switch (sectionType) {
      case "flash-sale":
        filtered = products.filter(p => p.isFlashSale || p.is_flash_sale || (p.discount && p.discount > 0));
        break;
      case "skin":
        filtered = products.filter(p => {
          const cat = (p.category || "").toLowerCase();
          return cat.includes("da") || cat.includes("skin") || cat.includes("serum") || cat.includes("tẩy trang") || cat.includes("sữa rửa mặt");
        });
        break;
      case "hair":
        filtered = products.filter(p => {
          const cat = (p.category || "").toLowerCase();
          return cat.includes("tóc") || cat.includes("hair") || cat.includes("gội") || cat.includes("xả");
        });
        break;
      case "body":
        filtered = products.filter(p => {
          const cat = (p.category || "").toLowerCase();
          return cat.includes("cơ thể") || cat.includes("body") || cat.includes("tắm");
        });
        break;
      case "makeup":
        filtered = products.filter(p => {
          const cat = (p.category || "").toLowerCase();
          return cat.includes("trang điểm") || cat.includes("makeup") || cat.includes("son") || cat.includes("phấn");
        });
        break;
      case "set":
        filtered = products.filter(p => {
          const cat = (p.category || "").toLowerCase();
          return cat.includes("set") || cat.includes("quà tặng") || cat.includes("gift");
        });
        break;
      default:
        filtered = [];
    }
    // Limit to maximum 5 products per section
    return filtered.slice(0, 5);
  };

  const sections = useMemo(() => {
    return [
      {
        id: "flash-sale",
        title: "⚡ Flash Sale - Giá Sốc Hôm Nay",
        type: "flash-sale",
        hasBanner: false,
        icon: Zap,
        color: "from-amber-500 to-orange-600",
        bgLight: "bg-amber-50/50",
      },
      {
        id: "skin",
        title: "🌿 Chăm Sóc Da Mặt",
        type: "skin",
        hasBanner: true,
        icon: Sparkles,
        bannerTitle: "Skincare đặc trị",
        bannerDesc: "Combo phục hồi & sáng mịn da vượt trội",
        bannerColor: "from-teal-400/80 to-cyan-500/80",
        iconColor: "text-teal-600",
        bgLight: "bg-teal-50/30",
      },
      {
        id: "hair",
        title: "💆 Chăm Sóc Tóc & Da Đầu",
        type: "hair",
        hasBanner: true,
        icon: Scissors,
        bannerTitle: "Mái tóc bồng bềnh",
        bannerDesc: "Tinh chất bưởi nuôi dưỡng nang tóc sâu",
        bannerColor: "from-purple-400/80 to-indigo-500/80",
        iconColor: "text-purple-600",
        bgLight: "bg-purple-50/30",
      },
      {
        id: "body",
        title: "🛀 Chăm Sóc Cơ Thể",
        type: "body",
        hasBanner: true,
        icon: Heart,
        bannerTitle: "Body thơm mịn",
        bannerDesc: "Sữa tắm cánh hoa cấp ẩm chuyên sâu",
        bannerColor: "from-emerald-400/80 to-teal-500/80",
        iconColor: "text-emerald-600",
        bgLight: "bg-emerald-50/30",
      },
      {
        id: "makeup",
        title: "💄 Trang Điểm Chuyên Nghiệp",
        type: "makeup",
        hasBanner: true,
        icon: Smile,
        bannerTitle: "Rạng rỡ mỗi ngày",
        bannerDesc: "Phấn nước Cushion & Son kem lì lâu trôi",
        bannerColor: "from-rose-400/80 to-pink-500/80",
        iconColor: "text-rose-600",
        bgLight: "bg-rose-50/30",
      },
      {
        id: "set",
        title: "🎁 SET Quà Tặng Sang Trọng",
        type: "set",
        hasBanner: true,
        icon: Gift,
        bannerTitle: "Hộp quà yêu thương",
        bannerDesc: "Trọn vẹn tình cảm, trao tặng người thương",
        bannerColor: "from-cyan-400/80 to-blue-500/80",
        iconColor: "text-cyan-600",
        bgLight: "bg-cyan-50/30",
      },
    ];
  }, [products]);

  // If no products loaded yet, don't render or show skeletons
  if (products.length === 0) return null;

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      {sections.map((section) => {
        const sectionProducts = getCategoryProducts(section.type);
        if (sectionProducts.length === 0) return null;

        return (
          <section key={section.id} className="container">
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-50/80 p-4 md:p-5 hover:shadow-md transition-shadow duration-300`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <section.icon className={`w-5 h-5 text-[#5dc1d1]`} />
                  <h2 className="text-sm md:text-lg font-bold text-gray-900">{section.title}</h2>
                </div>
                <button
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(section.id === "skin" ? "Dưỡng da mặt" : section.id === "hair" ? "Chăm sóc tóc" : section.id === "body" ? "Chăm sóc cơ thể" : section.id === "makeup" ? "Trang điểm" : section.id === "set" ? "Set quà tặng" : "")}`)}
                  className="text-xs font-bold text-[#5dc1d1] hover:text-cyan-600 transition-colors"
                >
                  Xem tất cả →
                </button>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5">
                {/* Left side: Products (takes 4 columns on desktop if banner exists, else 5 columns) */}
                <div className={`${section.hasBanner ? "lg:col-span-4" : "lg:col-span-5"} order-2 lg:order-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4`}>
                  {sectionProducts.map((product) => {
                    const discount = product.originalPrice
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;

                    return (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-100/80 rounded-xl overflow-hidden group cursor-pointer card-lift hover:border-[#5dc1d1]/30 flex flex-col justify-between"
                        onClick={() => navigate(`/product/${product.productId || product.id}`)}
                      >
                        {/* Image area */}
                        <div className="relative bg-gray-50/50 aspect-square overflow-hidden shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${product.productId || product.id}`);
                              }}
                              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#5dc1d1] hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
                              }}
                              className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#5dc1d1] hover:text-white transition-colors"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Text info */}
                        <div className="p-2 md:p-3 flex flex-col justify-between flex-grow">
                          <div>
                            <h3 className="text-[11px] font-semibold text-gray-700 line-clamp-2 mb-2 min-h-[32px] group-hover:text-[#5dc1d1] transition-colors leading-tight">
                              {product.name}
                            </h3>
                          </div>
                          <div>
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-[#5dc1d1] font-extrabold text-sm">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-red-500 text-[9px] font-bold bg-red-50 px-1 py-0.2 rounded">
                                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                              )}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-gray-400 text-[10px] line-through mt-0.5">
                                {formatPrice(product.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right side: Square Banner (hidden on mobile, visible on desktop) */}
                {section.hasBanner && <div className="lg:col-span-1 block h-full min-h-[220px]">
                    <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${section.bannerColor} border border-cyan-100/50 flex flex-col items-center justify-center p-5 text-center shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer`}>
                      {/* Decorative elements */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform" />
                      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform" />

                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-inner">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      
                      <h4 className="text-sm font-extrabold text-white tracking-wide uppercase drop-shadow-sm">
                        {section.bannerTitle}
                      </h4>
                      <p className="text-[10px] text-white/90 font-medium mt-1 max-w-[140px] leading-relaxed drop-shadow-sm">
                        {section.bannerDesc}
                      </p>
                      
                      <div className="mt-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-cyan-800 text-[9px] font-bold rounded-full shadow-sm group-hover:bg-white transition-colors">
                        Cập nhật trong admin
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomeCategorySections;
