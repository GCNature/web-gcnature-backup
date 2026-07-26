import { useState, useEffect, useMemo } from "react";
import { Eye, ArrowRight, Newspaper, Search, Folder, ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { apiGet } from "@/lib/api";
import type { Article } from "@/data/articles";

interface PostCategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

const FALLBACK_CATEGORIES: PostCategoryItem[] = [
  { id: "1", name: "Tin Tức", slug: "tin-tuc", parentId: null },
  { id: "2", name: "Review Hóa Mỹ Phẩm", slug: "review-hoa-my-pham", parentId: null },
  { id: "3", name: "Bí Kíp Chăm Sóc Da Mặt", slug: "bi-kip-cham-soc-da-mat", parentId: null },
  { id: "4", name: "Bí Kíp Chăm Cơ Thể", slug: "bi-kip-cham-co-the", parentId: null },
  { id: "5", name: "Bí Kíp Chăm Sóc Tóc", slug: "bi-kip-cham-soc-toc", parentId: null }
];

const FALLBACK_ARTICLES: Article[] = [
  {
    slug: "serum-rau-ma-phuc-hoi-da-cica-complex",
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=800&auto=format&fit=crop&q=60",
    date: "09",
    month: "Tháng 7",
    fullDate: "09/07/2026",
    title: "Serum Rau Má Phục Hồi Da CICA COMPLEX SERUM GC NATURE Chiết Xuất Rau Má Giảm Kích Ứng cho Da Nhạy Cảm",
    excerpt: "Serum Rau Má Phục Hồi Da CICA COMPLEX SERUM GC NATURE Chiết Xuất Rau Má Giảm Kích Ứng cho Da Nhạy Cảm đang là sản phẩm được các tín đồ làm đẹp săn đón nhờ khả năng phục hồi và giảm kích ứng tối ưu cho làn da.",
    content: "Nội dung bài viết đang được cập nhật...",
    views: 0,
    comments: 0,
    author: "GCnature Team",
    category: "Review Hóa Mỹ Phẩm"
  },
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
    category: "Bí Kíp Chăm Sóc Da Mặt"
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
    category: "Bí Kíp Chăm Sóc Da Mặt"
  }
];

const NewsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.05);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryTree, setCategoryTree] = useState<PostCategoryItem[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch articles
        const data = await apiGet('/articles');
        if (data && Array.isArray(data) && data.length > 0) {
          setArticlesList(data);
        } else {
          setArticlesList(FALLBACK_ARTICLES);
        }
      } catch (error) {
        console.error('Failed to fetch articles, using fallback:', error);
        setArticlesList(FALLBACK_ARTICLES);
      }

      try {
        // 2. Fetch categories
        const res = await apiGet<{ value: string | null }>("/settings/post-categories-tree");
        if (res?.value) {
          setCategoryTree(JSON.parse(res.value));
        } else {
          setCategoryTree(FALLBACK_CATEGORIES);
        }
      } catch (error) {
        console.error('Failed to fetch category tree, using fallback:', error);
        setCategoryTree(FALLBACK_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

  // Filter logic matching /news page
  const filteredArticles = useMemo(() => {
    return articlesList.filter((a) => {
      let matchCategory = false;
      if (activeCategorySlug === "all") {
        matchCategory = true;
      } else {
        const selectedCat = categoryTree.find(c => c.slug === activeCategorySlug);
        if (selectedCat) {
          if (!selectedCat.parentId) {
            // Include parent category + all its child categories
            const childrenNames = categoryTree
              .filter(c => c.parentId === selectedCat.id)
              .map(c => c.name);
            matchCategory = a.category === selectedCat.name || childrenNames.includes(a.category);
          } else {
            matchCategory = a.category === selectedCat.name;
          }
        } else {
          matchCategory = a.category?.toLowerCase() === activeCategorySlug.toLowerCase();
        }
      }

      const q = search.trim().toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || (a.excerpt || "").toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  }, [articlesList, activeCategorySlug, search, categoryTree]);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-gray-400 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
        Đang tải cẩm nang tin tức...
      </div>
    );
  }

  return (
    <section ref={ref} className="py-6 md:py-10 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page header replicated from /news page */}
        <div className={`mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 ring-1 ring-inset ring-teal-100 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Tin tức & Skincare</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5 font-medium">Khám phá cẩm nang làm đẹp và ưu đãi mới nhất từ GCnature</p>
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

        {/* Sidebar & Grid Layout replicated from /news page */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Categories Hierarchical Sidebar Navigation */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
              <Folder className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider">Danh mục cẩm nang</h3>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => { setActiveCategorySlug("all"); }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
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
                    onClick={() => { setActiveCategorySlug(parent.slug); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
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
                          onClick={() => { setActiveCategorySlug(child.slug); }}
                          className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
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
              <h3 className="font-extrabold text-gray-900 text-sm md:text-base flex items-center gap-2">
                <span>{activeCategoryName}</span>
                {filteredArticles.length > 0 && (
                  <span className="text-xs font-semibold text-gray-400">({filteredArticles.length} bài viết)</span>
                )}
              </h3>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                <Newspaper className="w-12 h-12 mb-3 opacity-20 text-gray-500" />
                <p className="font-semibold text-gray-900">Không tìm thấy bài viết nào</p>
                <p className="text-xs text-gray-400 mt-1">Vui lòng thử chọn danh mục hoặc từ khóa khác.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {filteredArticles.map((a) => (
                  <Link
                    key={a.slug}
                    to={`/news/${a.slug}`}
                    className={`bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
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
                        <h4 className="font-bold text-gray-900 text-xs md:text-sm lg:text-base leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors mb-1.5">
                          {a.title}
                        </h4>
                        <p className="text-[11px] md:text-xs text-gray-400 line-clamp-2 leading-relaxed font-medium">{a.excerpt}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] md:text-xs text-teal-600 font-extrabold mt-1 group-hover:gap-2 transition-all">
                        Đọc thêm <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsSection;
