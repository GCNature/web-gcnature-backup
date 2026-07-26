import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 400);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circumference = 2 * Math.PI * 18;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-28 md:bottom-8 right-4 md:right-6 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group ${
        show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-50 pointer-events-none'
      }`}
    >
      {/* Circular progress ring */}
      <svg className="absolute inset-0 -rotate-90 drop-shadow-lg" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" fill="hsl(0 78% 45%)" stroke="hsl(0 78% 55%)" strokeWidth="2" />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - scrollPercent)}
          className="transition-all duration-100"
        />
      </svg>
      <ArrowUp className="w-4 h-4 text-white relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
};

export default ScrollToTop;
