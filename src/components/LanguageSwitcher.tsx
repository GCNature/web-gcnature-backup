import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export const languages = [
  { code: "vi", label: "Tiếng Việt", flag: "https://flagcdn.com/w20/vn.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w20/gb.png" },
  { code: "zh-CN", label: "中文", flag: "https://flagcdn.com/w20/cn.png" },
  { code: "th", label: "ไทย", flag: "https://flagcdn.com/w20/th.png" },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect current language from cookie
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match) {
      const code = match[2].split("/").pop();
      const lang = languages.find((l) => l.code === code);
      if (lang) {
        setCurrentLang(lang);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    if (currentLang.code === langCode) {
      setIsOpen(false);
      return;
    }
    
    // Set cookie: /vi/targetLang
    const cookieString = langCode === "vi" ? "/vi/vi" : `/vi/${langCode}`;
    
    // Set for root domain and subdomains to ensure it works globally
    document.cookie = `googtrans=${cookieString}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${cookieString}; path=/;`;
    
    // Reload to apply translation via Google Script
    window.location.reload();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-700 hover:text-red-600 transition-colors bg-white hover:bg-gray-50 rounded border border-gray-100"
      >
        <img src={currentLang.flag} alt="flag" className="w-[18px] h-auto object-cover rounded-sm block" />
        <span className="hidden lg:inline-block">{currentLang.label}</span>
        <span className="lg:hidden uppercase">{currentLang.code.split("-")[0]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-red-50 text-left ${
                currentLang.code === lang.code ? "bg-red-50 text-red-600" : "text-gray-700 hover:text-red-600"
              }`}
            >
              <img src={lang.flag} alt="flag" className="w-[18px] h-auto object-cover rounded-sm block" />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
