import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface BannerItem {
  id: number;
  image: string;
  imageMobile?: string;
  alt: string;
  link: string;
}

const defaultBanners: BannerItem[] = [
  { id: 1, image: "/banners/banner/1.png", alt: "Banner 1", link: "/shop" },
  { id: 2, image: "/banners/banner/2.png", alt: "Banner 2", link: "/shop?category=Robot+AI" },
  { id: 3, image: "/banners/banner/3.png", alt: "Banner 3", link: "/shop?category=Kính+Thông+Minh+AI" },
  { id: 4, image: "/banners/banner/4.png", alt: "Banner 4", link: "/shop?category=Phụ+Kiện" },
];

export function getBanners(): BannerItem[] {
  // Read from localStorage (synced with Admin panel)
  try {
    const saved = localStorage.getItem("gcnature_promo_banners");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultBanners;
}

const BannerSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /*
  // Clear stale localStorage banners that contain old placeholder images
  useEffect(() => {
    try {
      const saved = localStorage.getItem("gcnature_banners");
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasOldPlaceholders = parsed.some((b: any) =>
          typeof b.image === "string" && (b.image.includes("banner-1.") || b.image.includes("banner-2.") || b.image.includes("banner-3.") || b.image.includes("banner-4.") || b.image.includes("data:"))
        );
        if (hasOldPlaceholders) {
          localStorage.removeItem("gcnature_banners");
        }
      }
    } catch {}
  }, []);
  */

  const [banners, setBanners] = useState(getBanners());

  useEffect(() => {
    const handleStorage = () => setBanners(getBanners());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-4">
        {/* FPT-style white card wrapper */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
          <div className="relative group">
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {banners.map((b) => (
                <button
                  key={b.id}
                  onClick={() => navigate(b.link)}
                  className="snap-start flex-shrink-0 w-[55vw] sm:w-[38vw] md:w-[28vw] lg:w-[22vw] rounded-xl overflow-hidden hover:shadow-md transition-shadow active:scale-[0.98] bg-white"
                >
                  <img
                    src={b.image}
                    alt={b.alt}
                    loading="lazy"
                    width={1080}
                    height={1080}
                    className="w-full h-auto object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
