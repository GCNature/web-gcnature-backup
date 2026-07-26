import { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 600);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-opacity duration-600 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Spinner */}
      <div className="w-20 h-20 rounded-full border-[3px] border-border border-t-primary animate-spin mb-8" />

      {/* GCnature Logo */}
      <h1
        className="text-4xl md:text-5xl font-extrabold tracking-tight"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <span className="text-[#5dc1d1]">GC</span>
        <span className="text-gray-800">nature</span>
      </h1>

      {/* LOADING text */}
      <p className="text-primary text-xs md:text-sm tracking-[0.35em] font-semibold mt-3 uppercase">
        Loading
      </p>
    </div>
  );
};

export default LoadingScreen;
