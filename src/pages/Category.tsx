import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesBar from "@/components/FeaturesBar";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import FloatingContact from "@/components/FloatingContact";
import { useShop } from "@/context/ShopContext";
import { Heart, RefreshCw, ShoppingCart, ChevronDown, ChevronLeft, ChevronRight, Home, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { apiGet } from "@/lib/api";
import { makeSiteUrl, SITE_URL } from "@/lib/config";
import { getCategoryBySlug, allCategories } from "@/data/seo-categories";
import { productDropdown, megaMenu } from "@/data/navigation";

const sortOptions = [
  { value: "default", label: "Sắp xếp mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "name", label: "Theo tên A-Z" },
];

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const category = slug ? getCategoryBySlug(slug) : null;

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useShop();

  useEffect(() => {
    setIsLoading(true);
    apiGet('/products').then(data => {
      if (Array.isArray(data)) {
        const mappedProducts = data.map((p: any) => ({
          ...p,
          images: typeof p.images === 'string' ? p.images.split(',') : (p.images || []),
        }));
        setProducts(mappedProducts);
      }
    }).catch(err => {
      console.error("Failed to fetch products:", err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  // SKU prefix → category mapping
  const skuPrefixCategory: Record<string, string> = {
    'MCK': 'Kính Thông Minh AI',
    'KDT': 'Kính Dịch Thuật',
    'POV': 'Kính Có Camera',
    'RB': 'Robot AI',
    'BD': 'Phụ Kiện',
  };

  // DB category name aliases → frontend category name
  const categoryAliases: Record<string, string> = {
    'Kính Mắt Thông Minh': 'Kính Thông Minh AI',
    'Kính Camera POV': 'Kính Có Camera',
    'Kính camera': 'Kính Có Camera',
  };

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (!category) return [];
    let result = products.filter(p => {
      // 1. Exact category match
      if (p.category === category.categoryName) return true;

      // 2. Alias match
      const normalized = categoryAliases[p.category];
      if (normalized === category.categoryName) return true;

      // 3. SKU prefix match
      const sku = p.sku || p.productId || '';
      for (const [prefix, cat] of Object.entries(skuPrefixCategory)) {
        if (sku.startsWith(prefix) && cat === category.categoryName) return true;
      }

      // 3. Fallback: check if category.categoryName is a parent category in megaMenu (by name or by category query parameter)
      const parentGroup = megaMenu.find(g => {
        if (g.name === category.categoryName) return true;
        const urlParams = new URLSearchParams(g.href.split('?')[1] || "");
        return urlParams.get("category") === category.categoryName;
      });

      if (parentGroup) {
        const subCatNames = parentGroup.groups.flatMap(grp => grp.items.map(item => item.name));
        if (subCatNames.includes(p.category)) return true;
      }
      return false;
    });

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return result;
  }, [products, category, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // 404 if invalid slug
  if (!category) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Header />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Danh mục không tồn tại</h2>
          <p className="text-muted-foreground mb-6">Danh mục bạn tìm không có trong hệ thống.</p>
          <Link to="/shop" className="text-primary hover:underline font-medium">← Quay lại cửa hàng</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // JSON-LD structured data for category page
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": makeSiteUrl(category.url),
        "url": makeSiteUrl(category.url),
        "name": category.title + " | GCnature",
        "description": category.metaDescription,
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "breadcrumb": { "@id": makeSiteUrl(category.url) + "#breadcrumb" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": makeSiteUrl(category.url) + "#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Cửa hàng", "item": makeSiteUrl("/shop") },
          { "@type": "ListItem", "position": 3, "name": category.title, "item": makeSiteUrl(category.url) },
        ],
      },
      {
        "@type": "ItemList",
        "name": category.title,
        "numberOfItems": filteredProducts.length,
        "itemListElement": filteredProducts.slice(0, 10).map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": makeSiteUrl(`/product/${p.productId || p.id}`),
          "name": p.name,
        })),
      }
    ],
  };

  const CatIcon = category.icon;

  // Other categories for cross-linking
  const otherCategories = allCategories.filter(c => c.slug !== slug);

  return (
    <div className="min-h-screen bg-[#f0f3f8] pb-16 md:pb-0">
      <SEOHead
        title={category.title}
        description={category.metaDescription}
        keywords={category.keywords}
        canonical={makeSiteUrl(category.url)}
        jsonLd={jsonLd}
      />
      <Header />

      <main>
        {/* ═══ Compact Category Header ═══ */}
        <section className="bg-white border-b border-gray-100">
          <div className="container py-5 md:py-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                <li>
                  <Link to="/" className="flex items-center gap-1 hover:text-red-600 transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>Trang chủ</span>
                  </Link>
                </li>
                <li className="text-gray-300">/</li>
                <li>
                  <Link to="/shop" className="hover:text-red-600 transition-colors">Cửa hàng</Link>
                </li>
                <li className="text-gray-300">/</li>
                <li className="text-gray-900 font-semibold">{category.title}</li>
              </ol>
            </nav>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${category.iconBg} ring-1 ring-inset ring-gray-200/70 flex items-center justify-center shadow-sm`}>
                  <CatIcon className={`w-5 h-5 ${category.iconColor}`} strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">{category.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5 hidden md:block">{category.shortDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {filteredProducts.length} sản phẩm
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Sort Bar ═══ */}
        <div className="container py-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-gray-600">
              Hiển thị {paginatedProducts.length} / {filteredProducts.length} sản phẩm
            </h2>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 cursor-pointer hover:border-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ═══ Product Grid ═══ */}
        <div className="container pb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="text-gray-500 text-lg mb-3">Chưa có sản phẩm nào trong danh mục này</p>
              <Link to="/shop" className="text-red-600 hover:underline font-medium">← Xem tất cả sản phẩm</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {paginatedProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <Link to={`/product/${product.productId || product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        width={600}
                        height={600}
                      />
                    </Link>

                    <Link to={`/product/${product.productId || product.id}`} className="block p-2.5 sm:p-4">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-800 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-red-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-baseline flex-wrap gap-1.5">
                        <span className="text-red-600 font-bold text-sm sm:text-base">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-gray-400 text-[10px] sm:text-xs line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="text-red-600 text-[9px] sm:text-[10px] font-bold bg-red-50 px-1 py-0.5 rounded">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          </>
                        )}
                      </div>
                    </Link>

                    <div className="flex items-center border-t border-gray-100">
                      <Link
                        to={`/product/${product.productId || product.id}`}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-[11px] sm:text-sm font-bold sm:font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        Đặt hàng ngay
                      </Link>
                      <button
                        onClick={() => {
                          const wasIn = isInWishlist(product.id);
                          toggleWishlist(product);
                          toast(wasIn ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích", { description: product.name });
                        }}
                        className={`flex-none p-2 sm:p-3 transition-all duration-200 border-l border-gray-100 ${isInWishlist(product.id) ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                        title="Yêu thích"
                      >
                        <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-red-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === page
                        ? "bg-red-600 text-white shadow-md"
                        : "border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-red-300"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-red-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ═══ SEO Description Block (visible text for Google) ═══ */}
        <div className="container pb-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{category.title} chính hãng tại GCnature</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{category.description}</p>
            <div className="flex flex-wrap gap-2">
              {category.keywords.split(", ").map((kw, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Other Categories (cross-linking for SEO) ═══ */}
        <div className="container pb-10">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Khám phá thêm danh mục</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {otherCategories.map((cat) => {
                const OtherIcon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    to={cat.url}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-lg ${cat.iconBg} ring-1 ring-inset ring-gray-200/70 flex items-center justify-center shrink-0`}>
                      <OtherIcon className={`w-5 h-5 ${cat.iconColor}`} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors truncate">{cat.title}</p>
                      <p className="text-xs text-gray-500 truncate">{cat.shortDesc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 ml-auto shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <FeaturesBar />
      <Footer />
      <FloatingContact />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Category;
