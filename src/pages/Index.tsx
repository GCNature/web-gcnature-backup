import { useState, useEffect } from "react";
import { Flame, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import FlashSaleSection from "@/components/FlashSaleSection";
import FeaturesBar from "@/components/FeaturesBar";
import CategorySuggestions from "@/components/CategorySuggestions";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewSection from "@/components/ReviewSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingContact from "@/components/FloatingContact";
import LivestreamBanner from "@/components/LivestreamBanner";
import SEOHead from "@/components/SEOHead";
import { SITE_URL, makeSiteUrl } from "@/lib/config";
import { apiGet } from "@/lib/api";

interface HomeSection {
  title: string;
  content: string;
}

interface HomePageData {
  title: string;
  desc: string;
  sections: HomeSection[];
}

const Index = () => {
  const [pageData, setPageData] = useState<HomePageData | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSettings, setPopupSettings] = useState<any>(null);

  useEffect(() => {
    apiGet<HomePageData>("/settings/page/page_home?_t=" + Date.now())
      .then(data => {
        if (data && typeof data === "object") {
          setPageData(data);
        }
      })
      .catch(err => {
        console.error("Failed to load home page dynamic settings:", err);
      });

    let timerId: NodeJS.Timeout;

    // Load lucky wheel settings for the popup image and target url
    apiGet<any>("/settings/page/page_lucky_wheel")
      .then(data => {
        const settings = data || {
          introTitle: "",
          introText: "/chuong-trinh-hot",
          popupDelay: 5,
          popupOpacity: 60
        };
        setPopupSettings(settings);
        const delayMs = (settings.popupDelay !== undefined ? Number(settings.popupDelay) : 5) * 1000;
        timerId = setTimeout(() => {
          setShowPopup(true);
        }, delayMs);
      })
      .catch(err => {
        console.error("Failed to load lucky wheel popup settings:", err);
        setPopupSettings({
          introTitle: "",
          introText: "/chuong-trinh-hot",
          popupDelay: 5,
          popupOpacity: 60
        });
        timerId = setTimeout(() => {
          setShowPopup(true);
        }, 5000);
      });

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GCnature",
    url: SITE_URL,
    description: pageData?.desc || "Thương hiệu mỹ phẩm Hàn Quốc nhập khẩu chính hãng số 1 Việt Nam",
    potentialAction: {
      "@type": "SearchAction",
      target: makeSiteUrl("/shop?q={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-[#f0f3f8] pb-16 md:pb-0">
      <SEOHead
        title={pageData?.title || "Trang chủ"}
        description={pageData?.desc || "GCnature - Sự chăm sóc toàn diện cho làn da Việt. Thương hiệu nhập khẩu và phân phối mỹ phẩm Hàn Quốc chính hãng 100%."}
        canonical={makeSiteUrl("/")}
        jsonLd={jsonLd}
      />
      <Header />
      <main>
        <HeroSection />
        
        {/* Render dynamic homepage sections from Admin Pages */}
        {pageData && pageData.sections && pageData.sections.length > 0 && (
          <div className="bg-white py-14 px-4 border-b border-gray-100">
            <div className="max-w-5xl mx-auto space-y-12">
              {pageData.sections.map((sec, idx) => (
                <section key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  {sec.title && (
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-950 font-serif relative pb-3">
                      {sec.title}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-cyan-600/60 rounded" />
                    </h2>
                  )}
                  {sec.content && (
                    <div 
                      className="text-stone-600 text-sm md:text-base leading-relaxed text-center max-w-3xl mx-auto font-light whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: sec.content }}
                    />
                  )}
                </section>
              ))}
            </div>
          </div>
        )}

        <StatsCounter />
        <FlashSaleSection />
        <CategorySuggestions />
        <FeaturesBar />
        <TestimonialsSection />
        <ReviewSection />

        <NewsSection />
      </main>
      <Footer />
      <FloatingContact />
      <LivestreamBanner />
          {showPopup && popupSettings && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${(popupSettings.popupOpacity !== undefined ? Number(popupSettings.popupOpacity) : 60) / 100})`,
            willChange: "opacity, backdrop-filter",
            transform: "translate3d(0, 0, 0)"
          }}
        >
          <div 
            className="relative w-full overflow-visible animate-in zoom-in-95 duration-300"
            style={{
              maxWidth: `${popupSettings.popupWidth !== undefined ? Number(popupSettings.popupWidth) : 500}px`,
              willChange: "transform, opacity",
              transform: "translate3d(0, 0, 0)"
            }}
          >
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 z-50 font-bold border-2 border-white"
              aria-label="Close popup"
            >
              ✕
            </button>
            
            <a 
              href={popupSettings.introText || "/chuong-trinh-hot"}
              onClick={() => setShowPopup(false)}
              className="block cursor-pointer overflow-hidden rounded-3xl"
            >
              <img 
                src={popupSettings.introTitle && (popupSettings.introTitle.startsWith('http') || popupSettings.introTitle.startsWith('/')) ? `${popupSettings.introTitle}?t=${Date.now()}` : "/popup_design.png"} 
                alt="Chương trình Hot"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = "/popup_design.png";
                }}
                className="w-full h-auto object-contain hover:brightness-105 transition-all duration-300 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              />
            </a>
          </div>
        </div>
      )}
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Index;
