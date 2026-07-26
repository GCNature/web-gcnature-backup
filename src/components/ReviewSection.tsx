import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Video, ExternalLink, Sparkles, Users } from "lucide-react";
import { API_BASE } from "@/lib/api";

export interface KOLVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail?: string;
}

export interface KOLInfo {
  id: string;
  tiktokUrl: string;
  channelName: string;
  followers: string;
  specialty: string;
  avatarUrl?: string;
  videos: KOLVideo[];
}

export const defaultKols: KOLInfo[] = [
  {
    id: "default-1",
    tiktokUrl: "https://www.tiktok.com/@mr.manhdora.macginhi",
    channelName: "mr.manhdora.macginhi",
    followers: "1.2M",
    specialty: "Mỹ phẩm & Chăm sóc da chuyên sâu",
    avatarUrl: "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/a699c2794eb84c9823e5950d60c49bcf~c5_100x100.jpeg?lk3s=30310797&nonce=31206&refresh_token=431e78a6ff607d79b97771ba82c94ca1&x-expires=1747310400&x-signature=8qH9Rn%2BvYnVrMeA%2FC8VJMGEQbhg%3D",
    videos: [
      { id: "v-1", videoId: "7616957685631683861", title: "Bí quyết dưỡng ẩm căng bóng Hàn Quốc" },
      { id: "v-2", videoId: "7616707469141740821", title: "Review kem chống nắng lọt top Olive Young" },
      { id: "v-3", videoId: "7616353847182675220", title: "Check var son kem lì GCnature" },
      { id: "v-4", videoId: "7578746935889104148", title: "Chu trình phục hồi da kích ứng mẩn đỏ" },
      { id: "v-5", videoId: "7578457567358192917", title: "Sữa rửa mặt dịu nhẹ thích hợp cho mọi loại da" }
    ]
  }
];

/**
 * Lazy-loaded TikTok video card.
 * Mounted only on click to optimize speed.
 */
const TikTokVideoCard = ({ item }: { item: KOLVideo }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liveThumbnail, setLiveThumbnail] = useState<string | null>(() => {
    try { return localStorage.getItem(`tiktok_thumb_${item.videoId}`); } catch { return null; }
  });

  useEffect(() => {
    let cancelled = false;
    const fetchThumbnail = async () => {
      try {
        const res = await fetch(`${API_BASE}/tiktok/oembed/${item.videoId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.thumbnail_url) {
          setLiveThumbnail(data.thumbnail_url);
          try { localStorage.setItem(`tiktok_thumb_${item.videoId}`, data.thumbnail_url); } catch {}
        }
      } catch {}
    };
    if (!liveThumbnail && !item.thumbnail) {
      fetchThumbnail();
    }
    return () => { cancelled = true; };
  }, [item.videoId, liveThumbnail, item.thumbnail]);

  const displayThumb = liveThumbnail || item.thumbnail || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=60";

  return (
    <div
      key={item.id}
      className="snap-start flex-shrink-0 w-[170px] sm:w-[190px] md:w-[210px] aspect-[9/16]"
    >
      <div className="relative w-full h-full bg-gray-900 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isPlaying ? (
          <iframe
            src={`https://www.tiktok.com/player/v1/${item.videoId}?autoplay=1&music_info=0&description=0`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={item.title}
          />
        ) : (
          <button
            onClick={() => setIsPlaying(true)}
            className="w-full h-full relative flex flex-col items-center justify-center cursor-pointer group/play overflow-hidden"
            aria-label={`Phát video: ${item.title}`}
          >
            <img
              src={displayThumb}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover group-hover/play:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70 group-hover/play:via-black/20 group-hover/play:to-black/55 transition-all" />
            
            {/* Tiny Play Icon */}
            <div className="relative z-10 w-11 h-11 md:w-13 md:h-13 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center mb-2 group-hover/play:scale-110 group-hover/play:bg-teal-600/80 group-hover/play:border-teal-400 transition-all duration-300 shadow-lg">
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
            
            <p className="relative z-10 text-white text-xs font-semibold px-3 text-center leading-snug line-clamp-3 drop-shadow-md">
              {item.title}
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

const ReviewSection = () => {
  const [kols, setKols] = useState<KOLInfo[]>([]);
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch('/api/settings/page/page_reviews')
      .then(res => res.json())
      .then(data => {
        if (data && data.kols && data.kols.length > 0) {
          setKols(data.kols);
        } else {
          setKols(defaultKols);
        }
      })
      .catch(() => {
        setKols(defaultKols);
      });
  }, []);

  const scroll = (kolId: string, dir: "left" | "right") => {
    const el = scrollRefs.current[kolId];
    if (!el) return;
    const amount = el.offsetWidth * 0.7;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (kols.length === 0) return null;

  return (
    <section className="py-8 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Góc Review của KOLs</h2>
              <p className="text-xs text-gray-500">Xem các dòng chia sẻ và review từ các nhà sáng tạo uy tín</p>
            </div>
          </div>
        </div>

        {/* KOL Rows */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {kols.map((kol) => (
            <div
              key={kol.id}
              className="bg-white rounded-3xl border border-gray-100 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              
              {/* Left Column: KOL Card Profile */}
              <div
                className={`lg:col-span-3 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm relative overflow-hidden min-h-[260px] justify-center ${
                  kol.coverUrl
                    ? "bg-cover bg-center border border-gray-900/10 shadow-md text-white"
                    : "bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-inner"
                }`}
                style={kol.coverUrl ? { backgroundImage: `url(${kol.coverUrl})` } : undefined}
              >
                {/* Dark overlay if coverUrl is present */}
                {kol.coverUrl && <div className="absolute inset-0 bg-black/45 z-0" />}

                {/* Avatar */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-teal-500 shadow-md mb-3 z-10 bg-white flex items-center justify-center">
                  {kol.avatarUrl ? (
                    <img
                      src={kol.avatarUrl}
                      alt={kol.channelName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-50 text-teal-600 font-bold flex items-center justify-center text-xl uppercase">
                      {kol.channelName.substring(0, 2)}
                    </div>
                  )}
                </div>

                {/* Name & Channel Link */}
                <h3 className={`font-extrabold text-base line-clamp-1 z-10 ${kol.coverUrl ? "text-white drop-shadow-md" : "text-gray-900"}`}>
                  @{kol.channelName}
                </h3>
                
                {/* Followers Badge */}
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mt-2 border z-10 ${
                    kol.coverUrl
                      ? "bg-white/10 text-teal-200 border-white/20 backdrop-blur-sm"
                      : "bg-teal-50 text-teal-700 border-teal-100"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{kol.followers} Followers</span>
                </div>

                {/* Specialty */}
                <p className={`text-xs font-medium mt-2 max-w-[200px] leading-relaxed z-10 ${kol.coverUrl ? "text-white/80 drop-shadow-sm" : "text-gray-500"}`}>
                  {kol.specialty}
                </p>

                {/* Open in TikTok Button */}
                {kol.tiktokUrl && (
                  <a
                    href={kol.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors mt-4 px-3 py-1.5 rounded-lg border z-10 ${
                      kol.coverUrl
                        ? "bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm"
                        : "bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-600"
                    }`}
                  >
                    <span>Xem Kênh TikTok</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Right Column: Horizontally Scrollable Video list */}
              <div className="lg:col-span-9 relative group">
                {kol.videos.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-xs border border-dashed rounded-2xl bg-gray-50">
                    Chưa có video review nào được nạp cho KOL này.
                  </div>
                ) : (
                  <>
                    {/* Left Scroll Button */}
                    <button
                      onClick={() => scroll(kol.id, "left")}
                      className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-700" />
                    </button>

                    {/* Scroll Container */}
                    <div
                      ref={(el) => { scrollRefs.current[kol.id] = el; }}
                      className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 select-none"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {kol.videos.map((vid) => (
                        <TikTokVideoCard key={vid.id} item={vid} />
                      ))}
                    </div>

                    {/* Right Scroll Button */}
                    <button
                      onClick={() => scroll(kol.id, "right")}
                      className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewSection;
