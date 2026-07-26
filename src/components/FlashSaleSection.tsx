import { useMemo, useState, useEffect } from "react";
import { formatPrice } from "@/data/products";
import { useNavigate } from "react-router-dom";
import { useFlashSale, type FlashSaleCampaign } from "@/hooks/useFlashSale";

/**
 * Homepage Flash Sale section.
 *
 * Renders real campaigns from /api/flash-sale with:
 *  - One tab per upcoming/active campaign (label = "HH:mm, DD/MM")
 *  - Live countdown to start (upcoming) or end (running)
 *  - Real product list with sale price computed from the campaign slot,
 *    not the product's static is_flash_sale flag.
 *
 * Returns null when there is nothing to show.
 */
const FlashSaleSection = () => {
  const navigate = useNavigate();
  const { loading, visibleCampaigns, computeTiming, formatTabHeader } = useFlashSale();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Auto-select the first running campaign or the soonest upcoming one
  useEffect(() => {
    if (visibleCampaigns.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId !== null && visibleCampaigns.some((c) => c.id === selectedId)) {
      return; // keep current selection if still valid
    }
    const running = visibleCampaigns.find(
      (c) => computeTiming(c).status === "running"
    );
    setSelectedId(running ? running.id : visibleCampaigns[0].id);
  }, [visibleCampaigns, selectedId, computeTiming]);

  const selected = useMemo(
    () => visibleCampaigns.find((c) => c.id === selectedId) || null,
    [visibleCampaigns, selectedId]
  );

  // Show up to 5 campaigns as tabs (running first, then upcoming)
  const tabs = useMemo(() => visibleCampaigns.slice(0, 5), [visibleCampaigns]);

  if (loading) {
    return (
      <section className="py-4 md:py-6">
        <div className="container">
          <div className="bg-[#DC2B33] rounded-2xl overflow-hidden shadow-sm">
            <div className="w-full">
              <img
                src="/border/dealonline.png"
                alt="Deal Online"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="px-2 pb-2 md:px-3 md:pb-3">
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Đang tải Flash Sale...
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (visibleCampaigns.length === 0) {
    // No campaign currently scheduled — hide the section instead of showing fake
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-4 md:py-6">
      <div className="container">
        <div className="bg-[#DC2B33] rounded-2xl overflow-hidden shadow-sm">
          {/* Header banner */}
          <div className="w-full">
            <img
              src="/border/dealonline.png"
              alt="Deal Online"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="px-2 pb-2 md:px-3 md:pb-3">
            <div className="bg-white rounded-xl overflow-hidden flex flex-col">
              {/* Timeline tabs (real campaigns) */}
              <div className="flex items-stretch border-b border-gray-200 overflow-x-auto hide-scrollbar">
                {tabs.map((c) => {
                  const t = computeTiming(c);
                  const isActive = c.id === selectedId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`flex-none w-[180px] md:flex-[1.5] py-2.5 px-2 text-center transition-colors ${
                        isActive
                          ? "border-b-2 border-[#DC2B33] bg-red-50"
                          : "border-b-2 border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm md:text-base font-bold text-gray-900">
                        {formatTabHeader(c)}
                      </div>
                      {t.status === "running" ? (
                        <div className="text-xs mt-1 flex items-center justify-center gap-1.5 text-gray-800">
                          <span className="font-medium text-[11px] md:text-xs">
                            Kết thúc sau:
                          </span>
                          <CountdownChips
                            h={t.hours}
                            m={t.minutes}
                            s={t.seconds}
                          />
                        </div>
                      ) : t.status === "upcoming" ? (
                        <div className="text-xs mt-1 flex items-center justify-center gap-1.5 text-gray-800">
                          <span className="font-medium text-[11px] md:text-xs">
                            Bắt đầu sau:
                          </span>
                          <CountdownChips
                            h={t.hours}
                            m={t.minutes}
                            s={t.seconds}
                          />
                        </div>
                      ) : (
                        <div className="text-xs mt-1 font-medium text-gray-400">
                          Đã kết thúc
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Products area for selected campaign */}
              <div className="p-3 md:p-4">
                {selected ? (
                  <CampaignProducts campaign={selected} navigate={navigate} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function CountdownChips({ h, m, s }: { h: number; m: number; s: number }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-0.5">
      <span className="bg-[#DC2B33] text-white text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">
        {pad(h)}
      </span>
      <span className="text-[#DC2B33] font-bold text-[10px]">:</span>
      <span className="bg-[#DC2B33] text-white text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">
        {pad(m)}
      </span>
      <span className="text-[#DC2B33] font-bold text-[10px]">:</span>
      <span className="bg-[#DC2B33] text-white text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">
        {pad(s)}
      </span>
    </div>
  );
}

function CampaignProducts({
  campaign,
  navigate,
}: {
  campaign: FlashSaleCampaign;
  navigate: (path: string) => void;
}) {
  const { computeTiming } = useFlashSale();
  const timing = computeTiming(campaign);
  const items = (campaign.products || [])
    .filter((row) => row.product)
    .slice(0, 8);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Khung giờ này chưa có sản phẩm
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((row) => {
        const p = row.product!;
        const orig = p.originalPrice || p.price;
        const sale = row.salePrice || p.price;
        const discount =
          row.discountPercent ||
          (orig > 0 ? Math.round(((orig - sale) / orig) * 100) : 0);
        const stockLimit = row.stockLimit > 0 ? row.stockLimit : null;
        const sold = row.soldCount || 0;
        const soldPercent =
          stockLimit && stockLimit > 0
            ? Math.min(100, Math.round((sold / stockLimit) * 100))
            : Math.min(95, ((p.id % 7) + 4) * 10);

        const isUpcoming = timing.status === "upcoming";
        const activePrice = isUpcoming ? p.price : sale;
        const activeOriginal = isUpcoming ? p.originalPrice : (orig > sale ? orig : null);
        const activeDiscount = isUpcoming
          ? (p.originalPrice && p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0)
          : discount;

        return (
          <div
            key={row.productId}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden group cursor-pointer card-lift hover:border-red-200"
            onClick={() => navigate(`/product/${p.productId || p.id}`)}
          >
            <div className="relative bg-gray-50 aspect-square overflow-hidden">
              <img
                src={p.image || "/placeholder.svg"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {activeDiscount > 0 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  -{activeDiscount}%
                </span>
              )}
              {isUpcoming && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Sắp bán
                </span>
              )}
            </div>

            <div className="p-3">
              <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-2 min-h-[32px] group-hover:text-red-600 transition-colors">
                {p.name}
              </h3>

              <div className="sale-progress-bar mb-2">
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
                <span className="text-red-600 font-extrabold text-base">
                  {formatPrice(activePrice)}
                </span>
              </div>
              {activeOriginal && activeOriginal > activePrice && (
                <div className="flex items-center gap-2 mt-0.5">
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
                <div className="mt-1.5 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                  <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                  Flash Sale: {formatPrice(sale)} (-{discount}%)
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
                className="w-full mt-2 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-colors active:scale-95"
              >
                Xem chi tiết →
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FlashSaleSection;
