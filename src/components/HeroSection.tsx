import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Scissors, Heart, Smile, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHeroBanner } from "@/pages/admin/AdminBanners";
import { getHeroBgSettings } from "@/pages/admin/AdminBanners";
import { getBanners } from "@/components/BannerSlider";
import { API_BASE_URL } from "@/lib/config";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ═══ Category data with localStorage persistence ═══
export interface CategoryItem {
  name: string;
  desc: string;
  iconName: string; // stored as string key for serialization
  gradient: string;
  lightBg: string;
  borderHover: string;
  image: string;
  count: number;
  link: string;
}

const CATEGORY_STORAGE_KEY = "gcnature_featured_categories";

export const defaultCategories: CategoryItem[] = [
  {
    name: "Chăm sóc da mặt", desc: "Sữa rửa mặt, chống nắng, cấp ẩm...", iconName: "Sparkles",
    gradient: "from-teal-500 via-cyan-500 to-emerald-500", lightBg: "from-teal-50 via-cyan-50 to-emerald-50",
    borderHover: "hover:border-teal-300", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80", count: 12,
    link: "/shop?category=duong-da-mat",
  },
  {
    name: "Chăm sóc tóc", desc: "Dầu gội, dầu xả, kem ủ, serum...", iconName: "Scissors",
    gradient: "from-purple-500 via-indigo-500 to-violet-500", lightBg: "from-purple-50 via-indigo-50 to-violet-50",
    borderHover: "hover:border-purple-300", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80", count: 8,
    link: "/shop?category=cham-soc-toc",
  },
  {
    name: "Chăm sóc cơ thể", desc: "Sữa tắm, tẩy tế bào chết, body lotion...", iconName: "Heart",
    gradient: "from-rose-500 via-pink-500 to-red-500", lightBg: "from-rose-50 via-pink-50 to-red-50",
    borderHover: "hover:border-rose-300", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80", count: 10,
    link: "/shop?category=cham-soc-co-the",
  },
  {
    name: "Trang điểm", desc: "Cushion, son lỳ, son tint, phấn má...", iconName: "Smile",
    gradient: "from-amber-500 via-orange-500 to-yellow-500", lightBg: "from-amber-50 via-orange-50 to-yellow-50",
    borderHover: "hover:border-amber-300", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80", count: 14,
    link: "/shop?category=trang-diem",
  },
  {
    name: "Combo & Quà Tặng", desc: "Hộp quà, combo dưỡng da/trang điểm...", iconName: "Gift",
    gradient: "from-blue-500 via-sky-500 to-cyan-500", lightBg: "from-blue-50 via-sky-50 to-cyan-50",
    borderHover: "hover:border-blue-300", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80", count: 5,
    link: "/shop?search=qua",
  },
];

export function getFeaturedCategories(): CategoryItem[] {
  try {
    const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultCategories;
}

export function saveFeaturedCategories(cats: CategoryItem[]) {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(cats));
}

const iconMap: Record<string, any> = { Sparkles, Scissors, Heart, Smile, Gift };
function getIcon(name: string) { return iconMap[name] || Sparkles; }

const HeroSection = () => {
  const navigate = useNavigate();
  const [hero, setHero] = useState<any>(getHeroBanner());
  const [bgSettings, setBgSettings] = useState<any>(getHeroBgSettings());
  const [promoBanners, setPromoBanners] = useState<any[]>(getBanners());
  const [bgUrl, setBgUrl] = useState(bgSettings.image);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gcnature_featured_categories");
      if (saved) {
        if (saved.includes("Kính") || saved.includes("Robot") || saved.includes("Phụ Kiện")) {
          localStorage.removeItem("gcnature_featured_categories");
          window.location.reload();
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Fetch latest from server
    fetch(`${API_BASE_URL}/settings/hero-banner`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === "object" && data.image) {
          localStorage.setItem("gcnature_hero_banner", JSON.stringify(data));
          setHero(data);
        }
      }).catch(() => {});

    fetch(`${API_BASE_URL}/settings/hero-bg-settings`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === "object" && data.image) {
          localStorage.setItem("gcnature_hero_bg_settings", JSON.stringify(data));
          setBgSettings(data);
          // Set the bgUrl correctly
          if (window.innerWidth < 768 && data.imageMobile) {
            setBgUrl(data.imageMobile);
          } else {
            setBgUrl(data.image);
          }
        }
      }).catch(() => {});

    fetch(`${API_BASE_URL}/settings/promo-banners`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data)) {
          localStorage.setItem("gcnature_promo_banners", JSON.stringify(data));
          setPromoBanners(data);
        }
      }).catch(() => {});

    fetch(`${API_BASE_URL}/settings/featured-categories`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          localStorage.setItem("gcnature_featured_categories", JSON.stringify(data));
          setCategoryItems(data);
        }
      }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && bgSettings.imageMobile) {
        setBgUrl(bgSettings.imageMobile);
      } else {
        setBgUrl(bgSettings.image);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bgSettings.image, bgSettings.imageMobile]);

  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>(getFeaturedCategories());

  return (
    <section id="hero-section" className="relative z-0">
      {/* Background — shown on all screen sizes */}
      <div
        className="absolute inset-x-0 top-0 h-screen -z-10"
        style={{
          backgroundImage: `url('${bgUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ═══ Hero Banner – FPT Shop style: full-width ═══ */}
      <div className="w-full">
        <div className="md:container pt-1 md:pt-2">
          <a href={hero.link} className="block cursor-pointer">
            <picture key={`${hero.image}-${hero.imageMobile}`}>
              {hero.imageMobile && <source media="(max-width: 767px)" srcSet={hero.imageMobile} />}
              <img
                src={hero.image}
                alt={hero.alt || "GCnature Promotion"}
                className="w-full h-auto object-contain drop-shadow-sm md:rounded-xl"
                loading="eager"
              />
            </picture>
          </a>
        </div>
      </div>

      {/* ═══ Promo Banners – compact on mobile, dual on desktop ═══ */}
      {promoBanners.length > 0 && (
        <div className="container py-2 md:py-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full relative group"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {(promoBanners.length === 2 ? [...promoBanners, ...promoBanners] : promoBanners).map((banner, i) => (
                <CarouselItem key={`${banner.id || 'banner'}-${i}`} className="pl-2 md:pl-4 basis-full md:basis-1/2">
                  <button
                    onClick={(e) => {
                      navigate(banner.link);
                    }}
                    className="w-full relative rounded-xl overflow-hidden group/banner hover:shadow-md transition-all duration-200 active:scale-[0.98] bg-white border border-gray-100 block"
                  >
                    <div className="w-full rounded-xl overflow-hidden">
                      <picture key={`${banner.image}-${banner.imageMobile}`}>
                        {banner.imageMobile && <source media="(max-width: 767px)" srcSet={banner.imageMobile} />}
                        <img
                          src={banner.image}
                          alt={banner.alt}
                          className="w-full h-auto object-contain group-hover/banner:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                        />
                      </picture>
                    </div>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            {promoBanners.length >= 2 && (
              <>
                <CarouselPrevious className="-left-3 md:-left-5 bg-white/95 hover:bg-white shadow-md border border-gray-100 text-gray-800 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <CarouselNext className="-right-3 md:-right-5 bg-white/95 hover:bg-white shadow-md border border-gray-100 text-gray-800 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* ═══════════ Featured Categories – FPT Shop style icon grid on mobile ═══════════ */}
      <div className="container pb-3 md:pb-5">
        <div className="bg-white rounded-2xl p-4 md:p-7 border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div>
              <h2 className="text-base md:text-xl font-bold text-gray-900">Danh mục nổi bật</h2>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="text-xs font-semibold text-[#5dc1d1] hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              Xem tất cả →
            </button>
          </div>

          {/* Category Carousel — smooth auto-sliding from right to left */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full relative"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {categoryItems.map((cat, i) => (
                <CarouselItem key={i} className="pl-3 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/5">
                  <CategoryCard cat={cat} navigate={navigate} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};



// Shared category card component
const CategoryCard = ({ cat, navigate }: { cat: CategoryItem; navigate: any }) => {
  const IconComp = getIcon(cat.iconName);
  return (
  <button
    onClick={() => navigate(cat.link)}
    className="group relative overflow-hidden rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] text-left w-full"
  >
    {/* Product image — square ratio to prevent cropping */}
    <div className="relative overflow-hidden aspect-square">
      <img
        src={cat.image}
        alt={cat.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        loading="lazy"
      />
      {/* Gradient overlay — strong for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Product count badge */}
      <div className="absolute top-2 right-2 md:top-2.5 md:right-2.5">
        <span className="text-[10px] font-bold text-white px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/25">
          {cat.count} SP
        </span>
      </div>

      {/* Category info on image — solid background bar for readability */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-3 py-2.5 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-white/30 backdrop-blur-md flex items-center justify-center ring-1 ring-white/50">
              <IconComp className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
            </div>
            <h3 className="text-[13px] md:text-sm font-bold text-white drop-shadow-md">{cat.name}</h3>
          </div>
          <p className="text-[10px] md:text-[11px] pl-8 md:pl-9 text-white/95 font-semibold line-clamp-1">{cat.desc}</p>
        </div>
      </div>
    </div>

    {/* Animated bottom accent line */}
    <div className="h-[2px] bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
  </button>
  );
};

export default HeroSection;
