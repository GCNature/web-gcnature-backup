import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import FloatingContact from "@/components/FloatingContact";
import { Search, Eye, ArrowRight, Newspaper, Calendar, ChevronLeft, ChevronRight, Folder, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { Article } from "@/data/articles";
import { makeSiteUrl } from "@/lib/config";

const PAGE_SIZE = 12;

const FALLBACK_ARTICLES: Article[] = [
  {
    slug: "gcnature-ra-mat-affiliate-hoa-hong-cao",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop&q=60",
    date: "09",
    month: "Tháng 7",
    fullDate: "09/07/2026",
    title: "GCnature chính thức khởi chạy chương trình Affiliate - Tiếp thị liên kết với hoa hồng hấp dẫn",
    excerpt: "Chương trình tiếp thị liên kết chính thức ra mắt mang lại cơ hội gia tăng thu nhập đột phá cho các đối tác đam mê làm đẹp cùng các dòng mỹ phẩm Hàn Quốc chính hãng.",
    content: "Nội dung bài viết đang được cập nhật...",
    views: 1240,
    comments: 12,
    author: "GCnature Team",
    category: "Tin Tức"
  },
  {
    slug: "xu-huong-my-pham-thuan-chay-len-ngo",
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=800&auto=format&fit=crop&q=60",
    date: "08",
    month: "Tháng 7",
    fullDate: "08/07/2026",
    title: "Mỹ phẩm thuần chay Hàn Quốc: Xu hướng làm đẹp an toàn lên ngôi trong năm 2026",
    excerpt: "Làn da khỏe đẹp tự nhiên từ các thành phần hữu cơ lành tính đang là xu hướng hàng đầu được các tín đồ chăm sóc da đặc biệt săn đón và khuyên dùng.",
    content: "Nội dung bài viết đang được cập nhật...",
    views: 954,
    comments: 8,
    author: "GCnature Team",
    category: "Xu Hướng"
  },
  {
    slug: "oem-san-xuat-my-pham-han-quoc",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
    date: "07",
    month: "Tháng 7",
    fullDate: "07/07/2026",
    title: "OEM sản xuất mỹ phẩm Hàn Quốc trọn gói đạt tiêu chuẩn CGMP quốc tế",
    excerpt: "Dịch vụ OEM/ODM công nghệ cao chuyển giao trực tiếp từ Seoul giúp các doanh nghiệp xây dựng thương hiệu mỹ phẩm độc quyền chất lượng cao và uy tín.",
    content: "Nội dung bài viết đang được cập nhật...",
    views: 842,
    comments: 5,
    author: "GCnature Team",
    category: "Sản Xuất"
  },
  {
    slug: "bi-quyet-da-cang-bong-glass-skin",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=60",
    date: "06",
    month: "Tháng 7",
    fullDate: "06/07/2026",
    title: "Bí quyết sở hữu làn da căng bóng chuẩn Glass Skin từ các chuyên gia da liễu Seoul",
    excerpt: "Khám phá quy trình 5 bước skincare khoa học đơn giản tại nhà giúp bạn nhanh chóng cải thiện cấu trúc da, giữ ẩm sâu và đem lại làn da sáng mịn rạng ngời.",
    content: "Nội dung bài viết đang được cập nhật...",
    views: 1105,
    comments: 18,
    author: "GCnature Team",
    category: "Chăm Sóc Da"
  }
];

interface PostCategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

const News = () => {
  const { parentSlug, childSlug, slug } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryTree, setCategoryTree] = useState<PostCategoryItem[]>([]);
  
  // Set category filter from route parameters dynamically
  const activeCategorySlug = useMemo(() => {
    if (childSlug) return childSlug;
    if (slug) {
      const isParent = categoryTree.some(c => c.slug === slug && !c.parentId);
      if (isParent) return slug;
    }
    if (parentSlug) return parentSlug;
    return "all";
  }, [slug, parentSlug, childSlug, categoryTree]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    // 1. Fetch articles (already sorted newest first in backend router)
    apiGet<Article[]>("/articles")
      .then((data) => { 
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data); 
        } else {
          setArticles(FALLBACK_ARTICLES);
        }
      })
      .catch((err) => {
        console.error("Failed to load articles, using fallback", err);
        setArticles(FALLBACK_ARTICLES);
      })
      .finally(() => setLoading(false));

    // 2. Fetch public post categories tree
    apiGet<{ value: string | null }>("/settings/post-categories-tree")
      .then((res) => {
        if (res?.value) {
          setCategoryTree(JSON.parse(res.value));
        }
      })
      .catch((err) => console.error("Error loading category tree", err));
  }, []);

  // Compute nested category tree structure
  const categoriesList = useMemo(() => {
    const parents = categoryTree.filter(c => !c.parentId);
    return parents.map(parent => ({
      ...parent,
      children: categoryTree.filter(c => c.parentId === parent.id)
    }));
  }, [categoryTree]);

  // Map active category slug to display name
  const activeCategoryName = useMemo(() => {
    if (activeCategorySlug === "all") return "Tất cả bài viết";
    const found = categoryTree.find(c => c.slug === activeCategorySlug);
    return found ? found.name : "Tất cả bài viết";
  }, [activeCategorySlug, categoryTree]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      let matchCategory = false;
      if (activeCategorySlug === "all") {
        matchCategory = true;
      } else {
        const selectedCat = categoryTree.find(c => c.slug === activeCategorySlug);
        if (selectedCat) {
          if (!selectedCat.parentId) {
            // Clicking parent category: include parent itself + all children
            const childrenNames = categoryTree
              .filter(c => c.parentId === selectedCat.id)
              .map(c => c.name);
            matchCategory = a.category === selectedCat.name || childrenNames.includes(a.category);
          } else {
            // Clicking child category: isolate exactly
            matchCategory = a.category === selectedCat.name;
          }
        } else {
          // If no categories mapped in settings, match by string category name fallback
          matchCategory = a.category?.toLowerCase() === activeCategorySlug.toLowerCase();
        }
      }
      
      const q = search.trim().toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || (a.excerpt || "").toLowerCase().includes(q);
      
      return matchCategory && matchSearch;
    });
  }, [articles, activeCategorySlug, search, categoryTree]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [activeCategorySlug, search]);

  const handleCategorySelect = (selectedSlug: string) => {
    if (selectedSlug === "all") {
      navigate("/news");
      return;
    }
    const found = categoryTree.find(c => c.slug === selectedSlug);
    if (found) {
      if (found.parentId) {
        const parent = categoryTree.find(p => p.id === found.parentId);
        if (parent) {
          navigate(`/news/${parent.slug}/${found.slug}`);
        } else {
          navigate(`/news/${found.slug}`);
        }
      } else {
        navigate(`/news/${found.slug}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc]">
      <SEOHead
        title="Tin tức & Bài viết GCnature"
        description="Cập nhật tin tức làm đẹp, hướng dẫn skincare, đánh giá mỹ phẩm Hàn Quốc và ưu đãi mới nhất từ GCnature."
        canonical={makeSiteUrl("/news")}
      />
      <Header />

      <main className="container py-6 md:py-10">
        {/* Page header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                <li><Link to="/" className="hover:text-teal-600 transition-colors">Trang chủ</Link></li>
                <li className="text-gray-300">/</li>
                <li className="text-gray-900 font-semibold">Tin tức</li>
              </ol>
            </nav>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 ring-1 ring-inset ring-teal-100 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Tin tức & Skincare</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 font-medium">Khám phá cẩm nang làm đẹp và ưu đãi mới nhất từ GCnature</p>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm bài viết..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50 transition-all bg-white"
            />
          </div>
        </div>



        {/* Categories Sidebar & Post Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Categories Hierarchical Sidebar Navigation */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <Folder className="w-4 h-4 text-teal-600" />
              <h2 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Danh mục cẩm nang</h2>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleCategorySelect("all")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                  activeCategorySlug === "all"
                    ? "bg-teal-50 text-teal-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Tất cả bài viết
                <ChevronRight className={`w-4 h-4 transition-transform ${activeCategorySlug === "all" ? "translate-x-0.5" : "opacity-0"}`} />
              </button>

              {categoriesList.map((parent) => (
                <div key={parent.id} className="space-y-1 mt-1">
                  {/* Parent Category Button */}
                  <button
                    onClick={() => handleCategorySelect(parent.slug)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${
                      activeCategorySlug === parent.slug
                        ? "bg-teal-50 text-teal-700 shadow-sm border-l-4 border-teal-600 rounded-l-none pl-3"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{parent.name}</span>
                    {parent.children.length > 0 ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeCategorySlug === parent.slug ? "translate-x-0.5" : "opacity-0"}`} />
                    )}
                  </button>

                  {/* Child Categories Sub-list */}
                  {parent.children.length > 0 && (
                    <div className="pl-4 border-l border-gray-100 flex flex-col gap-1 mt-1.5 ml-2.5">
                      {parent.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleCategorySelect(child.slug)}
                          className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                            activeCategorySlug === child.slug
                              ? "text-teal-600 bg-teal-50/50"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {child.name}
                          <ChevronRight className={`w-3 h-3 ${activeCategorySlug === child.slug ? "opacity-100" : "opacity-0"}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Posts list panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-extrabold text-gray-900 text-base md:text-lg flex items-center gap-2">
                <span>{activeCategoryName}</span>
                {filtered.length > 0 && (
                  <span className="text-xs font-semibold text-gray-400">({filtered.length} bài viết)</span>
                )}
              </h2>
            </div>

            {loading ? (
              <div className="py-24 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                Đang tải bài viết cẩm nang...
              </div>
            ) : paginated.length === 0 ? (
              <div className="py-24 text-center text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 flex flex-col items-center">
                <Newspaper className="w-12 h-12 mb-3 opacity-20 text-gray-500" />
                <p className="font-semibold text-gray-900">Không tìm thấy bài viết nào</p>
                <p className="text-xs text-gray-400 mt-1">Vui lòng thử chọn danh mục hoặc từ khóa khác.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:gap-5">
                  {paginated.map((a) => (
                    <Link
                      key={a.slug}
                      to={`/news/${a.slug}`}
                      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                    >
                      <div className="aspect-[1.8/1] overflow-hidden bg-gray-50 relative shrink-0">
                        {a.image ? (
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Newspaper className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-gray-400 mb-1.5 font-semibold">
                            {a.category && (
                              <span className="bg-teal-50 text-teal-600 font-bold px-2 py-0.5 rounded-full text-[9px] md:text-[10px]">{a.category}</span>
                            )}
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {a.views || 0}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-xs md:text-sm lg:text-base leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors mb-1.5">
                            {a.title}
                          </h3>
                          <p className="text-[11px] md:text-xs text-gray-400 line-clamp-2 leading-relaxed font-medium">{a.excerpt}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] md:text-xs text-teal-600 font-extrabold mt-1 group-hover:gap-2 transition-all">
                          Đọc thêm <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-teal-600 hover:border-teal-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          p === page ? "bg-teal-600 text-white shadow-md shadow-teal-100" : "border border-gray-200 text-gray-500 hover:text-teal-600 hover:border-teal-300 bg-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-teal-600 hover:border-teal-300 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </main>

      <Footer />
      <FloatingContact />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default News;
