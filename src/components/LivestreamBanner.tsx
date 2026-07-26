import { useState, useEffect } from "react";
import { Radio, X } from "lucide-react";

/**
 * LivestreamBanner — a floating "Săn Deal hời trên Live" button.
 *
 * It reads two settings from the public settings API:
 *   • livestreamTiktokUrl  — TikTok Live link
 *   • livestreamShopeeUrl  — Shopee Live link
 *
 * When both are empty the component renders nothing.
 * When the admin fills in at least one link, a pulsing LIVE button
 * appears in the bottom-right area (above the FloatingContact stack).
 * Tapping it opens a small popup with the active link(s).
 */
const LivestreamBanner = () => {
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Poll every 60 s so the button appears / disappears near-realtime
  useEffect(() => {
    const fetchLivestreamSettings = async () => {
      try {
        const res = await fetch("/api/settings/livestream");
        if (res.ok) {
          const data = await res.json();
          setTiktokUrl(data.value?.tiktokUrl || "");
          setShopeeUrl(data.value?.shopeeUrl || "");
        }
      } catch {
        // silent
      }
    };
    fetchLivestreamSettings();
    const interval = setInterval(fetchLivestreamSettings, 60_000);
    return () => clearInterval(interval);
  }, []);

  const hasLive = !!(tiktokUrl || shopeeUrl);

  if (!hasLive || dismissed) return null;

  return (
    <>
      {/* Floating LIVE button */}
      <div className="fixed bottom-[280px] md:bottom-44 right-4 md:right-6 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white font-bold pl-3 pr-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(220,43,51,0.4)] hover:shadow-[0_6px_24px_rgba(220,43,51,0.55)] hover:scale-105 active:scale-95 transition-all animate-bounce-slow"
        >
          {/* Pulsing live dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <Radio className="w-4 h-4" />
          <span className="text-sm whitespace-nowrap">Săn Deal trên Live</span>
        </button>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 rounded-full bg-gray-800/60 text-white flex items-center justify-center hover:bg-gray-800 transition-colors absolute -top-2 -left-2"
          title="Ẩn"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Popup with links */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                </span>
                <h2 className="font-bold text-lg">🔥 Đang LIVE</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Tham gia live ngay để săn deal hời!
              </p>
              <p className="text-xs text-gray-400 text-center mb-2">
                🕐 Lịch live: 20h - 00h mỗi ngày
              </p>

              {shopeeUrl && (
                <a
                  href={shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l.867 12.143a2 2 0 0 0 2 1.857h10.276a2 2 0 0 0 2 -1.857l.867 -12.143h-16z" /><path d="M8.5 7c0 -1.653 1.5 -4 3.5 -4s3.5 2.347 3.5 4" /><path d="M9.5 17c.413 .462 1 1 2.5 1s2.5 -.897 2.5 -2s-1 -1.5 -2.5 -2s-2 -1.47 -2 -2c0 -1.104 1 -2 2 -2s1.5 0 2.5 1" /></svg>
                  Xem Live trên Shopee
                </a>
              )}

              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-black hover:to-gray-800 shadow-md"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.86a8.28 8.28 0 0 0 4.76 1.5V6.83a4.83 4.83 0 0 1-1-.14z" />
                  </svg>
                  Xem Live trên TikTok
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LivestreamBanner;
