import { useState, useMemo } from "react";
import { formatPrice } from "@/data/products";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { ShoppingCart, Eye } from "lucide-react";
import { productDropdown } from "@/data/navigation";

// Dynamic categories helper based on productDropdown categories
const matchesCategory = (p: any, categoryTitle: string) => {
  if (p.category === categoryTitle) return true;

  const group = productDropdown.find(g => g.title === categoryTitle);
  if (group) {
    if (group.items.some(item => p.category === item.name || (p.category && item.name.toLowerCase().includes(p.category.toLowerCase())))) return true;
  }

  const lowercaseCat = (p.category || '').toLowerCase();
  const lowercaseTitle = categoryTitle.toLowerCase();
  if (lowercaseCat.includes(lowercaseTitle) || lowercaseTitle.includes(lowercaseCat)) return true;

  if (categoryTitle === "Chăm sóc da mặt" && (lowercaseCat.includes("skin") || lowercaseCat.includes("da mặt") || lowercaseCat.includes("serum"))) return true;
  if (categoryTitle === "Chăm sóc tóc & Da đầu" && (lowercaseCat.includes("hair") || lowercaseCat.includes("tóc"))) return true;
  if (categoryTitle === "Chăm sóc cơ thể" && (lowercaseCat.includes("body") || lowercaseCat.includes("cơ thể"))) return true;
  if (categoryTitle === "Trang điểm" && (lowercaseCat.includes("makeup") || lowercaseCat.includes("trang điểm") || lowercaseCat.includes("son"))) return true;
  if (categoryTitle === "SET Quà Tặng" && (lowercaseCat.includes("set") || lowercaseCat.includes("quà tặng"))) return true;

  return false;
};

const CategorySuggestions = () => {
  const navigate = useNavigate();
  const { addToCart, products } = useShop();
  const [activeTab, setActiveTab] = useState("all");

  // Dynamically build category tabs from the productDropdown definitions
  const categoryTabs = useMemo(() => {
    return [
      { label: "Tất cả", value: "all" },
      ...productDropdown.map(group => ({
        label: group.title,
        value: group.title
      }))
    ];
  }, []);

  // Filter products based on active tab
  const displayProducts = useMemo(() => {
    const filtered = activeTab === "all"
      ? products
      : products.filter(p => matchesCategory(p, activeTab));
    return filtered.slice(0, 12);
  }, [activeTab, products]);

  // Show loading skeleton when products haven't loaded yet
  if (products.length === 0) {
    return (
      <section className="py-4 md:py-6">
        <div className="container">
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Gợi ý cho bạn</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-2.5 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 md:py-6">
      <div className="container">
        {/* White card wrapper */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Gợi ý cho bạn</h2>
            <a href="/shop" className="text-sm font-semibold text-[#5dc1d1] hover:underline">
              Xem tất cả →
            </a>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  activeTab === tab.value
                    ? "bg-[#5dc1d1] text-white border-[#5dc1d1] shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-teal-50 hover:text-[#5dc1d1] hover:border-[#5dc1d1]/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
            {displayProducts.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden group cursor-pointer card-lift hover:border-[#5dc1d1]/30 flex flex-col justify-between"
                  onClick={() => navigate(`/product/${product.productId || product.id}`)}
                >
                  {/* Image */}
                  <div className="relative bg-gray-50 aspect-square overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Hover actions */}
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

                  {/* Info */}
                  <div className="p-2.5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-[11px] font-medium text-gray-700 line-clamp-2 mb-2 min-h-[32px] group-hover:text-[#5dc1d1] transition-colors leading-tight">
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
        </div>
      </div>
    </section>
  );
};

export default CategorySuggestions;
