import { useEffect, useMemo, useState } from "react";
import { Zap, Clock, Filter, Hourglass } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { useFlashSale } from "@/hooks/useFlashSale";

const FlashSale = () => {
  const navigate = useNavigate();
  const {
    loading,
    visibleCampaigns,
    activeCampaigns,
    computeTiming,
    formatTabHeader,
  } = useFlashSale();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Auto-pick a campaign once data arrives
  useEffect(() => {
    if (visibleCampaigns.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId !== null && visibleCampaigns.some((c) => c.id === selectedId)) {
      return;
    }
    const running = activeCampaigns[0] || visibleCampaigns[0];
    setSelectedId(running.id);
  }, [visibleCampaigns, activeCampaigns, selectedId]);

  const selected = useMemo(
    () => visibleCampaigns.find((c) => c.id === selectedId) || null,
    [visibleCampaigns, selectedId]
  );

  const timing = selected ? computeTiming(selected) : null;

  // Categories for filter (within selected campaign)
  const categories = useMemo(() => {
    if (!selected) return ["all"];
    const cats = new Set<string>();
    for (const row of selected.products) {
      const cat = row.product?.category;
      if (cat) cats.add(cat);
    }
    return ["all", ...Array.from(cats)];
  }, [selected]);

  // Reset filter when switching campaigns
  useEffect(() => setFilter("all"), [selectedId]);

  const productRows = useMemo(() => {
    if (!selected) return [];
    return selected.products
      .filter((row) => row.product)
      .filter((row) => filter === "all" || row.product?.category === filter);
  }, [selected, filter]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Flash Sale"
        description="Flash Sale giảm giá cực sốc tại GCnature - Mỹ phẩm Hàn Quốc nhập khẩu chính hãng với ưu đãi tốt nhất"
        canonical={makeSiteUrl("/flash-sale")}
      />
      <Header />

      <main>
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-5 md:py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-red-600 fill-red-600" />
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Flash Sale
                </h1>
                <span className="text-sm text-gray-500 font-medium hidden md:inline">
                  – {selected?.description || "Deal Online Giảm Kịch Sàn"}
                </span>
              </div>

              {/* Countdown */}
              {timing && timing.status !== "ended" ? (
                <div className="flex items-center gap-2">
                  {timing.status === "upcoming" ? (
                    <Hourglass className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-semibold text-gray-600">
                    {timing.status === "upcoming" ? "Bắt đầu trong" : "Kết thúc trong"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { val: pad(timing.hours), label: "h" },
                      { val: pad(timing.minutes), label: "m" },
                      { val: pad(timing.seconds), label: "s" },
                    ].map((item, i) => (
                      <span key={i} className="flex items-center gap-1.5">
                        <span
                          className={`text-white font-bold text-sm px-2 py-1 rounded-md min-w-[32px] text-center ${
                            timing.status === "upcoming"
                              ? "bg-blue-600"
                              : "bg-red-600"
                          }`}
                        >
                          {item.val}
                        </span>
                        {i < 2 && (
                          <span className="text-gray-400 font-bold">:</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Campaign tabs */}
        {!loading && visibleCampaigns.length > 1 && (
          <section className="bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {visibleCampaigns.map((c) => {
                  const t = computeTiming(c);
                  const isActive = c.id === selectedId;
                  const isRunning = t.status === "running";
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border transition-all min-w-[140px] ${
                        isActive
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50/30"
                      }`}
                    >
                      <span className="text-sm font-bold">{formatTabHeader(c)}</span>
                      <span
                        className={`text-[10px] mt-0.5 font-medium ${
                          isRunning
                            ? "text-red-600"
                            : t.status === "upcoming"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        {isRunning
                          ? "Đang diễn ra"
                          : t.status === "upcoming"
                          ? "Sắp diễn ra"
                          : "Đã kết thúc"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Products area */}
        <section className="py-8 md:py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-16 text-gray-500">Đang tải...</div>
            ) : visibleCampaigns.length === 0 ? (
              <div className="text-center py-20">
                <Zap className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-lg font-medium">
                  Hiện không có chiến dịch Flash Sale nào
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Các deal hot sẽ được công bố sớm. Vui lòng quay lại sau!
                </p>
              </div>
            ) : (
              <>
                {/* Category filter */}
                {categories.length > 2 && (
                  <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
                    <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          filter === cat
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                        }`}
                      >
                        {cat === "all" ? "Tất cả" : cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Upcoming notice */}
                {timing?.status === "upcoming" && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                    <Hourglass className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        Chiến dịch chưa bắt đầu
                      </p>
                      <p className="text-xs text-blue-600">
                        Sản phẩm sẽ có giá Flash Sale khi đến giờ. Bạn có thể xem
                        trước danh sách bên dưới.
                      </p>
                    </div>
                  </div>
                )}

                {/* Product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {productRows.map((row) => {
                    const p = row.product!;
                    const orig = p.originalPrice || p.price;
                    const sale = row.salePrice || p.price;
                    const discount =
                      row.discountPercent ||
                      (orig > 0
                        ? Math.round(((orig - sale) / orig) * 100)
                        : 0);
                    const stockLimit =
                      row.stockLimit > 0 ? row.stockLimit : null;
                    const sold = row.soldCount || 0;
                    const soldPercent = stockLimit
                      ? Math.min(100, Math.round((sold / stockLimit) * 100))
                      : Math.min(95, ((p.id % 7) + 4) * 10);

                    const isUpcoming = timing?.status === "upcoming";
                    const activePrice = isUpcoming ? p.price : sale;
                    const activeOriginal = isUpcoming ? p.originalPrice : (orig > sale ? orig : null);
                    const activeDiscount = isUpcoming
                      ? (p.originalPrice && p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0)
                      : discount;

                    return (
                      <div
                        key={row.productId}
                        className="bg-white border border-gray-100 rounded-2xl overflow-hidden group cursor-pointer card-lift hover:border-red-200 hover:shadow-lg transition-all duration-300"
                        onClick={() => navigate(`/product/${p.productId || p.id}`)}
                      >
                        <div className="relative p-4 bg-gray-50">
                          <img
                            src={p.image || "/placeholder.svg"}
                            alt={p.name}
                            className="w-full h-36 md:h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {activeDiscount > 0 && (
                            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                              -{activeDiscount}%
                            </span>
                          )}
                          {isUpcoming && (
                            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                              Sắp bán
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-3 min-h-[40px] group-hover:text-red-600 transition-colors">
                            {p.name}
                          </h3>

                          <div className="sale-progress-bar mb-3">
                            <div
                              className="sale-progress-fill"
                              style={{ width: `${soldPercent}%` }}
                            />
                            <span className="sale-progress-text">
                              {soldPercent >= 70 ? "🔥 " : ""}
                              {stockLimit
                                ? `${sold}/${stockLimit}`
                                : `Đã bán ${soldPercent}%`}
                            </span>
                          </div>

                          <div className="flex items-end gap-2 flex-wrap">
                            <span className="text-red-600 font-extrabold text-lg">
                              {formatPrice(activePrice)}
                            </span>
                          </div>
                          {activeOriginal && activeOriginal > activePrice && (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-gray-400 text-xs line-through">
                                {formatPrice(activeOriginal)}
                              </p>
                              {activeDiscount > 0 && (
                                <span className="text-red-500 text-[10px] font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                  -{activeDiscount}%
                                </span>
                              )}
                            </div>
                          )}

                          {isUpcoming && (
                            <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded flex items-center gap-1.5 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              Giá Flash Sale: {formatPrice(sale)} (-{discount}%)
                            </div>
                          )}

                          <div className="mt-2 mb-1">
                            <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                              Trả góp 0%
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${p.productId || p.id}`);
                            }}
                            className="w-full mt-3 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors active:scale-95"
                          >
                            Xem chi tiết →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {productRows.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">
                      Không có sản phẩm trong danh mục này
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default FlashSale;
