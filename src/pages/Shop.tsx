import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesBar from "@/components/FeaturesBar";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import CartDrawer from "@/components/CartDrawer";
import CompareBar from "@/components/CompareBar";
import SEOHead from "@/components/SEOHead";
import { useShop } from "@/context/ShopContext";
import { Heart, RefreshCw, ShoppingCart, ChevronDown, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/data/products";
import { apiGet } from "@/lib/api";
import { productDropdown } from "@/data/navigation";
import { makeSiteUrl } from "@/lib/config";

const sortOptions = [
  { value: "default", label: "Sắp xếp mặc định" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "name", label: "Theo tên A-Z" },
];

const priceRanges = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 3 triệu", min: 0, max: 3000000 },
  { label: "3 - 5 triệu", min: 3000000, max: 5000000 },
  { label: "Trên 5 triệu", min: 5000000, max: Infinity },
];


const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const ITEMS_PER_PAGE = 9;
  const { addToCart, toggleWishlist, toggleCompare, isInWishlist, isInCompare } = useShop();
  const [megaMenu, setMegaMenu] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [categorySeo, setCategorySeo] = useState<any>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategoriesList(data);
      })
      .catch(console.error);
  }, []);

  const findMenuItemByHref = (menuItems: any[], href: string): any => {
    const normHref = href.toLowerCase().trim();
    for (const item of menuItems) {
      if (item.href && item.href.toLowerCase().trim() === normHref) {
        return item;
      }
      if (item.groups && Array.isArray(item.groups)) {
        for (const group of item.groups) {
          if (group.items && Array.isArray(group.items)) {
            for (const subItem of group.items) {
              if (subItem.href && subItem.href.toLowerCase().trim() === normHref) {
                return subItem;
              }
            }
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (!selectedCategory) {
      setCategorySeo(null);
      return;
    }

    const targetHrefs = [
      `/shop/${selectedCategory}`,
      `/shop/${selectedCategory.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`
    ];

    let foundMenuItem: any = null;
    if (megaMenu.length > 0) {
      for (const href of targetHrefs) {
        foundMenuItem = findMenuItemByHref(megaMenu, href);
        if (foundMenuItem) break;
      }
    }

    if (foundMenuItem && (foundMenuItem.seoTitle || foundMenuItem.seoDesc || foundMenuItem.seoKeywords)) {
      setCategorySeo({
        title: foundMenuItem.seoTitle || "",
        desc: foundMenuItem.seoDesc || "",
        keywords: foundMenuItem.seoKeywords || ""
      });
      return;
    }

    if (categoriesList.length === 0) {
      setCategorySeo(null);
      return;
    }

    const norm = selectedCategory.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const matched = categoriesList.find(c => c.slug === norm || c.slug === selectedCategory || c.name === selectedCategory);
    if (matched) {
      fetch(`/api/settings/category_seo_${matched.id}`)
        .then(res => res.json())
        .then(data => {
          if (data && typeof data === "object") {
            setCategorySeo(data);
          } else {
            setCategorySeo(null);
          }
        })
        .catch(() => setCategorySeo(null));
    } else {
      setCategorySeo(null);
    }
  }, [selectedCategory, categoriesList, megaMenu]);

  useEffect(() => {
    apiGet<any[]>(`/settings/mega-menu?_t=${Date.now()}`).then(data => {
      if (Array.isArray(data)) {
        setMegaMenu(data);
      }
    }).catch(err => {
      console.error("Failed to fetch mega menu in Shop:", err);
    });
  }, []);

  // Sync URL params with state
  useEffect(() => {
    const categoryParam = categoryName || searchParams.get("category");
    const searchParam = searchParams.get("search");
    const brandParam = searchParams.get("brand");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory(null);
    }
    if (searchParam) {
      setSearchFilter(searchParam);
    } else {
      setSearchFilter("");
    }
    if (brandParam) {
      setSelectedBrand(brandParam);
    } else {
      setSelectedBrand(null);
    }
    setCurrentPage(1);
  }, [searchParams, categoryName]);

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
      console.error("Failed to fetch products for shop:", err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);



  // SKU prefix → category mapping for reliable matching
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

  const normalizeCategoryName = (name: string): string => {
    if (!name) return "";
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-zA-Z0-9\s-]/g, " ")
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  };

  const checkMatchesCategory = (p: any, categoryTitle: string) => {
    if (!categoryTitle || categoryTitle === 'all') return true;

    const normTitle = normalizeCategoryName(categoryTitle);
    const prodCatRaw = p.category || "";
    const normProdCat = normalizeCategoryName(prodCatRaw);

    if (!normTitle || !normProdCat) return false;

    // 1. Exact category match after normalization
    if (normProdCat === normTitle) return true;

    // 2. Explicit slug shorthand mappings (URL slugs -> DB category names)
    if (normTitle === "mat na" && normProdCat.includes("mat na")) return true;
    if (normTitle === "serum" && normProdCat.includes("serum") && !normProdCat.includes("mat na")) return true;
    if (normTitle === "kem duong" && normProdCat.includes("kem duong")) return true;
    if (normTitle === "kem chong nang" && normProdCat.includes("chong nang")) return true;
    if (normTitle === "sua rua mat" && normProdCat.includes("sua rua mat")) return true;
    if (normTitle === "tay trang" && normProdCat.includes("tay trang")) return true;

    // 3. Substring containment match strictly on category field (NOT product name)
    if (normProdCat.includes(normTitle) || normTitle.includes(normProdCat)) {
      // Prevent cross-matching between serum and mask
      if (normTitle.includes("serum") && normProdCat.includes("mat na")) return false;
      if (normTitle.includes("mat na") && normProdCat.includes("serum")) return false;
      return true;
    }

    // 4. Parent group in megaMenu (e.g., "Chăm sóc da mặt")
    const parentGroup = megaMenu.find(g => {
      if (normalizeCategoryName(g.name) === normTitle) return true;
      const catVal = (g.href.split('/shop/')[1] || "").split('?')[0];
      return normalizeCategoryName(catVal) === normTitle;
    });

    if (parentGroup) {
      const subCatNames = parentGroup.groups.flatMap(grp => grp.items.map(item => normalizeCategoryName(item.name)));
      if (subCatNames.includes(normProdCat)) return true;
    }

    return false;
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory) {
      result = result.filter((p) => checkMatchesCategory(p, selectedCategory));
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand);
    }
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      result = result.filter((p) => 
        p.name?.toLowerCase().includes(q) || 
        p.shortName?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    const range = priceRanges[selectedPrice];
    result = result.filter((p) => p.price >= range.min && p.price < range.max);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return result;
  }, [selectedCategory, searchFilter, selectedPrice, sortBy, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset page when filters change
  const handleCategoryChange = (cat: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    newParams.delete("search");
    const query = newParams.toString() ? `?${newParams.toString()}` : "";
    if (cat) {
      navigate(`/shop/${cat.replace(/\s+/g, '-')}${query}`);
    } else {
      navigate(`/shop${query}`);
    }
  };
  const handleBrandChange = (brand: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (brand) {
      newParams.set("brand", brand);
    } else {
      newParams.delete("brand");
    }
    setSearchParams(newParams);
  };
  const handlePriceChange = (i: number) => { setSelectedPrice(i); setCurrentPage(1); };
  const handleSortChange = (val: string) => { setSortBy(val); setCurrentPage(1); };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast.success("Đã thêm vào giỏ hàng", { description: product.name });
  };

  const handleToggleWishlist = (product: typeof products[0]) => {
    const wasIn = isInWishlist(product.id);
    toggleWishlist(product);
    toast(wasIn ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích", { description: product.name });
  };

  const handleToggleCompare = (product: typeof products[0]) => {
    const wasIn = isInCompare(product.id);
    toggleCompare(product);
    toast(wasIn ? "Đã xoá khỏi so sánh" : "Đã thêm vào so sánh", { description: product.name });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSelectedPrice(0);
    setSelectedBrand(null);
    setCurrentPage(1);
  };

  const hasFilters = selectedCategory !== null || selectedPrice !== 0 || searchFilter !== "" || selectedBrand !== null;

  const brandsList = useMemo(() => {
    const brands = new Set<string>();
    const defaultBrands = ["GC Nature", "SL LEPORTS", "AEGAHOO", "DNEND", "Lienjang", "MEDIORGA"];
    defaultBrands.forEach(b => brands.add(b));
    products.forEach(p => {
      if (p.brand) {
        brands.add(p.brand);
      }
    });
    return Array.from(brands);
  }, [products]);

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Danh mục</h3>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${!selectedCategory && !searchFilter ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            Tất cả ({products.length})
          </button>
          
          {productDropdown.map((cat, idx) => {
            const isActiveCat = selectedCategory === cat.title;
            const catCount = products.filter((p) => checkMatchesCategory(p, cat.title)).length;
            const isExpanded = expandedCats.includes(cat.title);

            return (
              <div key={idx} className="flex flex-col mb-1">
                <div className="flex items-center gap-1 w-full">
                  <button
                    onClick={() => handleCategoryChange(cat.title)}
                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isActiveCat ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                  >
                    {cat.title} ({catCount})
                  </button>
                  <button 
                    onClick={() => setExpandedCats(prev => prev.includes(cat.title) ? prev.filter(c => c !== cat.title) : [...prev, cat.title])} 
                    className="p-2 transition-all hover:bg-muted/50 rounded-lg text-muted-foreground flex-shrink-0 flex items-center justify-center w-9 h-9"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {/* Accordion content */}
                <div 
                  className={`pl-4 space-y-1 border-l-2 border-muted ml-3 transition-all duration-300 overflow-hidden ${
                    isExpanded ? "max-h-[500px] mt-1 opacity-100" : "max-h-0 opacity-0 border-transparent m-0"
                  }`}
                >
                  {cat.items.map((item, itemIdx) => {
                    const queryParams = new URLSearchParams(item.href.split('?')[1] || "");
                    const searchParamValue = queryParams.get("search");
                    const categoryParamValue = queryParams.get("category");
                    const isActive = (searchParamValue && searchFilter === searchParamValue) ||
                                     (categoryParamValue && selectedCategory === categoryParamValue);
                    return (
                      <Link
                        key={itemIdx}
                        to={item.href}
                        className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Thương hiệu</h3>
        <div className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
          <button
            onClick={() => handleBrandChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${!selectedBrand ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            Tất cả thương hiệu ({products.length})
          </button>
          {brandsList.map((brand, i) => {
            const count = products.filter(p => p.brand === brand).length;
            return (
              <button
                key={i}
                onClick={() => handleBrandChange(brand)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedBrand === brand ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              >
                {brand} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Khoảng giá</h3>
        <div className="space-y-1">
          {priceRanges.map((range, i) => (
            <button
              key={i}
              onClick={() => handlePriceChange(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedPrice === i ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/5 transition-colors"
        >
          <X className="w-4 h-4" />
          Xoá bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title={categorySeo?.title || (selectedCategory ? `${selectedCategory}` : "Cửa hàng")}
        description={categorySeo?.desc || (selectedCategory ? `Khám phá các sản phẩm thuộc danh mục ${selectedCategory} tại GCnature.` : "Khám phá bộ sưu tập mỹ phẩm Hàn Quốc nhập khẩu chính hãng tại GCnature: kem chống nắng, dưỡng da mặt, trang điểm, sữa rửa mặt.")}
        keywords={categorySeo?.keywords || ""}
        canonical={selectedCategory ? makeSiteUrl(`/shop/${selectedCategory}`) : makeSiteUrl("/shop")}
      />
      <Header />

      {/* Page Header
      <section className="bg-muted/50 border-b border-border">
        <div className="container py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground italic" style={{ fontFamily: "Georgia, serif" }}>
            Shop
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>—</span>
            <span className="text-foreground">Sản phẩm</span>
          </div>
        </div>
      </section> */}

      {/* Sort Bar */}
      <div className="container py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground hover:border-primary/50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
            {hasFilters && <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">!</span>}
          </button>
          <div className="hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-foreground cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <span className="text-sm text-muted-foreground border border-border rounded-lg px-4 py-2.5 hidden sm:block">
              {filteredProducts.length} kết quả
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Grid */}
      <div className="container pb-12">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm phù hợp</p>
                <button onClick={clearFilters} className="mt-3 text-primary hover:underline text-sm font-medium">
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {paginatedProducts.map((product, i) => (
                    <div
                      key={product.id}
                      className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <Link to={`/product/${product.productId || product.id}`} className="block relative aspect-square overflow-hidden bg-muted/30">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          width={800}
                          height={800}
                        />
                      </Link>

                      <Link to={`/product/${product.productId || product.id}`} className="block p-2.5 sm:p-4">
                        <h3 className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-primary transition-colors duration-200">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex items-baseline flex-wrap gap-1.5">
                          <span className="text-primary font-bold text-sm sm:text-base">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <>
                              <span className="text-muted-foreground text-[10px] sm:text-xs line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                              <span className="text-red-500 text-[9px] sm:text-[10px] font-bold bg-red-50 px-1 py-0.5 rounded">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            </>
                          )}
                        </div>
                      </Link>

                      <div className="flex items-center border-t border-border">
                        <Link
                          to={`/product/${product.productId || product.id}`}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 text-[11px] sm:text-sm font-bold sm:font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                          Đặt hàng ngay
                        </Link>
                        <button
                          onClick={() => handleToggleWishlist(product)}
                          className={`flex-none p-2 sm:p-3 transition-all duration-200 border-l border-border ${isInWishlist(product.id) ? "text-red-500 bg-red-50" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                            }`}
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
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === page
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/40" onClick={() => setSidebarOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-[80%] max-w-[320px] bg-background shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Bộ lọc</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      <FeaturesBar />
      <Footer />
      <BottomNav />
      <ScrollToTop />
      <CartDrawer />
      <CompareBar />
    </div>
  );
};

export default Shop;
