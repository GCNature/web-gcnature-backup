import { Phone, MessageSquare, Send, Globe, Mail, Gift, Heart, Sparkles, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { logHotlineClick } from "@/lib/hotline";

const iconMap: Record<string, any> = {
  Phone,
  MessageSquare,
  Send,
  Globe,
  Mail,
  Gift,
  Heart,
  Sparkles,
  HelpCircle,
};

const FloatingContact = () => {
  const [show, setShow] = useState(false);
  const { config } = useSiteConfig();

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const activeButtons = (config.floatingButtons || []).filter((btn) => btn.enabled !== false);

  return (
    <div
      className={`fixed bottom-[164px] md:bottom-24 right-4 md:right-6 z-40 flex flex-col items-end gap-2.5 md:gap-3 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {activeButtons.map((btn, i) => {
        const isUrlIcon = btn.icon?.startsWith("http") || btn.icon?.startsWith("/");
        const IconComponent = iconMap[btn.icon || ""] || MessageSquare;

        return (
          <a
            key={btn.id || i}
            href={btn.url}
            target={btn.url.startsWith("tel:") ? "_self" : "_blank"}
            rel="noopener noreferrer"
            onClick={() => {
              if (btn.url.startsWith("tel:")) {
                logHotlineClick(btn.url.replace("tel:", ""));
              }
            }}
            className="flex items-center gap-2 group relative"
          >
            <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute right-[60px]">
              {btn.title}
            </span>
            <div
              style={{ backgroundColor: btn.bgColor || "#5dc1d1" }}
              className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform float-pulse-teal border border-white/20 overflow-hidden"
            >
              {isUrlIcon ? (
                <img src={btn.icon} alt={btn.title} className="w-[36px] h-[36px] object-contain" />
              ) : (
                <IconComponent className="w-5 h-5 text-white" fill={btn.type === "call" ? "currentColor" : "none"} />
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default FloatingContact;
