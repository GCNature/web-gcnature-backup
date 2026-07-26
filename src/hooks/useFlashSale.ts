/**
 * Shared Flash Sale data hook.
 *
 * Loads all currently visible (active + not-ended) flash sale campaigns from
 * the backend and continuously recomputes status / countdown for the UI.
 */
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/api";

export interface FlashSaleProductRow {
  id: number;
  productId: string;
  salePrice: number;
  discountPercent: number;
  stockLimit: number;
  soldCount: number;
  sortOrder: number;
  product: {
    id: number;
    productId: string;
    sku: string;
    name: string;
    shortName?: string;
    category?: string;
    originalPrice: number;
    price: number;
    image?: string;
    stock?: number;
  } | null;
}

export interface FlashSaleCampaign {
  id: number;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  sortOrder: number;
  bannerUrl?: string;
  products: FlashSaleProductRow[];
}

export type CampaignStatus = "running" | "upcoming" | "ended";

export interface CampaignTiming {
  status: CampaignStatus;
  /** ms remaining until start (for upcoming) or end (for running). 0 if ended. */
  remainingMs: number;
  /** Countdown parts derived from remainingMs */
  hours: number;
  minutes: number;
  seconds: number;
}

export function useFlashSale() {
  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<number>(() => Date.now());

  // Load campaigns once and refresh every 60s
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      apiGet<FlashSaleCampaign[]>("/flash-sale")
        .then((data) => {
          if (cancelled) return;
          setCampaigns(Array.isArray(data) ? data : []);
          setError(null);
        })
        .catch((e) => {
          if (cancelled) return;
          setError(e.message || "Lỗi tải flash sale");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };
    load();
    const refresh = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  // Tick every second for countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const visibleCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => new Date(c.endAt).getTime() > now)
      .sort((a, b) => {
        const timeA = new Date(a.startAt).getTime();
        const timeB = new Date(b.startAt).getTime();
        if (timeA !== timeB) return timeA - timeB;
        return a.sortOrder - b.sortOrder;
      });
  }, [campaigns, now]);

  const activeCampaigns = useMemo(() => {
    return visibleCampaigns.filter(
      (c) => new Date(c.startAt).getTime() <= now && new Date(c.endAt).getTime() > now
    );
  }, [visibleCampaigns, now]);

  const upcomingCampaigns = useMemo(() => {
    return visibleCampaigns.filter((c) => new Date(c.startAt).getTime() > now);
  }, [visibleCampaigns, now]);

  const computeTiming = (c: FlashSaleCampaign): CampaignTiming => {
    const start = new Date(c.startAt).getTime();
    const end = new Date(c.endAt).getTime();
    let status: CampaignStatus;
    let remainingMs = 0;
    if (now < start) {
      status = "upcoming";
      remainingMs = start - now;
    } else if (now <= end) {
      status = "running";
      remainingMs = end - now;
    } else {
      status = "ended";
      remainingMs = 0;
    }
    const totalSec = Math.max(0, Math.floor(remainingMs / 1000));
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { status, remainingMs, hours, minutes, seconds };
  };

  /** "10:00, 16/05" style header for a campaign tab */
  const formatTabHeader = (c: FlashSaleCampaign): string => {
    const d = new Date(c.startAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  };

  return {
    loading,
    error,
    campaigns,
    visibleCampaigns,
    activeCampaigns,
    upcomingCampaigns,
    computeTiming,
    formatTabHeader,
    now,
  };
}

/**
 * Shared helper: find the currently running flash-sale row for a given productId.
 * Returns null if the product is not in any running campaign.
 */
export function useProductFlashSale(productId?: string | number | null) {
  const { activeCampaigns, computeTiming, now } = useFlashSale();

  return useMemo(() => {
    if (!productId) return null;
    const idStr = String(productId);
    for (const campaign of activeCampaigns) {
      const row = (campaign.products || []).find(
        (r) =>
          r.productId === idStr ||
          (r.product && (String(r.product.id) === idStr || r.product.productId === idStr || r.product.sku === idStr))
      );
      if (row) {
        const stockLeft = row.stockLimit > 0 ? Math.max(0, row.stockLimit - (row.soldCount || 0)) : null;
        if (row.stockLimit > 0 && stockLeft === 0) continue; // sold out, skip
        const timing = computeTiming(campaign);
        return {
          campaign,
          row,
          salePrice: row.salePrice,
          discountPercent: row.discountPercent,
          stockLeft,
          timing,
        };
      }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampaigns, productId, now]);
}
