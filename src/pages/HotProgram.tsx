import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { apiGet, apiPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Flame, Sparkles, Award, Play, AlertCircle, ShoppingBag, ArrowRight, Gift } from "lucide-react";

interface Reward {
  id: number;
  name: string;
  probability: number;
  type: string;
  discount?: number;
  minOrder?: number;
}

const DEFAULT_REWARDS: Reward[] = [
  { id: 1, name: "Liệu trình chăm sóc tại đối tác Spa GC Nature", probability: 5, type: "spa" },
  { id: 2, name: "Voucher giảm giá độc quyền 10K đơn từ 100K", probability: 10, type: "voucher" },
  { id: 3, name: "Voucher giảm giá độc quyền 20K đơn từ 200K", probability: 10, type: "voucher" },
  { id: 4, name: "Voucher giảm giá độc quyền 30K đơn từ 250K", probability: 10, type: "voucher" },
  { id: 5, name: "Voucher giảm giá độc quyền 40K đơn từ 350K", probability: 10, type: "voucher" },
  { id: 6, name: "Voucher giảm giá độc quyền 50K đơn từ 450K", probability: 10, type: "voucher" },
  { id: 7, name: "Voucher giảm giá độc quyền 100K đơn từ 900K", probability: 10, type: "voucher" },
  { id: 8, name: "Tặng 10 Mặt Nạ CICA COMPLEX GC Nature", probability: 5, type: "physical" },
  { id: 9, name: "Tặng 10 Mặt nạ HYALURONIC GC Nature", probability: 5, type: "physical" },
  { id: 10, name: "Tặng 10 Mặt nạ VITAMIN-C GC Nature", probability: 5, type: "physical" },
  { id: 11, name: "Tặng 1 Mặt Nạ CICA COMPLEX GC Nature", probability: 10, type: "physical" },
  { id: 12, name: "Tặng 1 Mặt nạ HYALURONIC GC Nature", probability: 10, type: "physical" },
  { id: 13, name: "Tặng 1 Mặt nạ VITAMIN-C GC Nature", probability: 10, type: "physical" },
  { id: 14, name: "Tặng chuyến du lịch Hàn Quốc 10.000.000đ", probability: 0, type: "other" }
];

const formatRewardName = (name: string) => {
  return name
    .replace(/GC NATURE/g, "")
    .replace(/GC Nature/g, "")
    .replace(/giảm giá độc quyền /g, "")
    .replace(/Liệu trình chăm sóc tại đối tác Spa/g, "Spa Care")
    .replace(/Tặng 10 Mặt Nạ CICA COMPLEX/g, "10 M.Nạ CICA")
    .replace(/Tặng 10 Mặt nạ HYALURONIC/g, "10 M.Nạ HYA")
    .replace(/Tặng 10 Mặt nạ VITAMIN-C/g, "10 M.Nạ VIT-C")
    .replace(/Tặng 1 Mặt Nạ CICA COMPLEX/g, "1 M.Nạ CICA")
    .replace(/Tặng 1 Mặt nạ HYALURONIC/g, "1 M.Nạ HYA")
    .replace(/Tặng 1 Mặt nạ VITAMIN-C/g, "1 M.Nạ VIT-C")
    .replace(/Tặng chuyến du lịch Hàn Quốc 10.000.000đ/g, "Tour Hàn Quốc")
    .trim();
};

const getWheelDisplayLines = (name: string): [string, string] => {
  const upper = name.toUpperCase();
  if (upper.includes("VOUCHER")) {
    const match = upper.match(/VOUCHER\s+(\d+K)/i);
    const amount = match ? match[1] : "";
    if (amount) {
      return [amount, "VOUCHER"];
    }
    const numMatch = upper.match(/(\d+)/);
    if (numMatch) {
      return [numMatch[1] + "K", "VOUCHER"];
    }
    return ["GIẢM GIÁ", "VOUCHER"];
  }
  if (upper.includes("SPA")) {
    return ["SPA", "CARE"];
  }
  if (upper.includes("HÀN QUỐC") || upper.includes("DU LỊCH")) {
    return ["TOUR", "HÀN QUỐC"];
  }
  if (upper.includes("MẶT NẠ") || upper.includes("M.NẠ") || upper.includes("CICA") || upper.includes("HYA") || upper.includes("VIT")) {
    const countMatch = upper.match(/(\d+)/);
    const count = countMatch ? countMatch[1] : "1";
    let type = "MẶT NẠ";
    if (upper.includes("CICA")) type = "CICA";
    else if (upper.includes("HYA") || upper.includes("HYALURONIC")) type = "HYA";
    else if (upper.includes("VIT") || upper.includes("VITAMIN")) type = "VIT-C";
    return [`${count} M.NẠ`, type];
  }
  return [name.substring(0, 10), ""];
};

export default function HotProgram() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [luckySpinsCount, setLuckySpinsCount] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<any>(null);
  const [rewardsList, setRewardsList] = useState<Reward[]>(DEFAULT_REWARDS);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load status and rewards configuration
  const loadData = async () => {
    try {
      // 1. Fetch spin status (authenticated or guest)
      let isAuthenticatedUser = false;
      try {
        const statusRes = await apiGet<any>("/lucky-wheel/status");
        if (statusRes && statusRes.authenticated) {
          setLuckySpinsCount(statusRes.luckySpinsCount);
          isAuthenticatedUser = true;
        }
      } catch (err) {
        console.error("Failed to fetch spin status:", err);
      }

      // 2. Fetch config rewards
      try {
        const settingRes = await apiGet<any>("/settings/page/page_lucky_wheel");
        if (settingRes && settingRes.tabsConfig) {
          setRewardsList(settingRes.tabsConfig);
        } else {
          setRewardsList(DEFAULT_REWARDS);
        }
      } catch (err) {
        console.error("Failed to load custom rewards configuration, using defaults:", err);
        setRewardsList(DEFAULT_REWARDS);
      }

      // 3. Fetch won rewards history if logged in
      if (isAuthenticatedUser) {
        try {
          const historyRes = await apiGet<any[]>("/lucky-wheel/my-rewards");
          if (historyRes) setSpinHistory(historyRes);
        } catch (err) {
          console.error("Failed to load spin history:", err);
        }
      }
    } catch (err) {
      console.error("Load lucky wheel data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  // Color palette for the wheel slices
  const sliceColors = [
    "#dc2626", // Red 600
    "#d97706", // Amber 600
    "#059669", // Emerald 600
    "#2563eb", // Blue 600
    "#7c3aed", // Violet 600
    "#db2777", // Pink 600
    "#0891b2", // Cyan 600
  ];

  const handleSpin = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tham gia quay thưởng!");
      navigate("/login");
      return;
    }
    if (luckySpinsCount <= 0) {
      toast.error("Bạn đã hết lượt quay. Hãy mua thêm đơn hàng để nhận thêm lượt!");
      return;
    }
    if (spinning) return;

    setSpinning(true);
    setWonReward(null);

    try {
      const res = await apiPost<any>("/lucky-wheel/spin", {});
      if (res && res.success) {
        // Find index of winning item in the rewardsList
        const winIdx = rewardsList.findIndex(r => r.id === res.reward.id);
        const totalSlices = rewardsList.length;
        const degreePerSlice = 360 / totalSlices;

        // To point winIdx to the top pointer (12 o'clock):
        // We rotate the wheel counter-clockwise by (winIdx * degreePerSlice) degrees.
        const targetWheelAngle = 360 - (winIdx * degreePerSlice);

        // finalRotation = 5 full spins (1800 deg) + targetWheelAngle
        const finalRotation = rotation + 1800 + targetWheelAngle - (rotation % 360);

        setRotation(finalRotation);

        setTimeout(() => {
          setSpinning(false);
          setWonReward(res.reward);
          setLuckySpinsCount(res.luckySpinsCount);
          toast.success(`Chúc mừng! Bạn đã trúng giải: ${res.reward.name}`);
          
          // Re-fetch history
          apiGet<any[]>("/lucky-wheel/my-rewards").then(hist => {
            if (hist) setSpinHistory(hist);
          });
        }, 5000); // 5 seconds match the transition duration
      }
    } catch (err: any) {
      setSpinning(false);
      toast.error(err.message || "Không thể thực hiện quay. Vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0f2fe] via-[#ecfeff] to-[#f0f9ff] pb-16 md:pb-0 relative overflow-hidden">
      {/* Background Fireworks, Sparkles & Golden Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Sunburst / Light beams */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.7)_0%,transparent_70%)] opacity-80" />

        {/* Soft, gorgeous clouds */}
        <div className="absolute top-10 left-[5%] w-72 h-20 bg-white/40 blur-2xl rounded-full" />
        <div className="absolute top-28 right-[5%] w-96 h-28 bg-white/35 blur-3xl rounded-full" />
        <div className="absolute bottom-32 left-[-10%] w-96 h-36 bg-white/30 blur-3xl rounded-full" />
        <div className="absolute bottom-16 right-[-5%] w-[450px] h-40 bg-white/25 blur-3xl rounded-full" />

        {/* 3D Flying Voucher 1 */}
        <div 
          className="absolute top-24 left-[8%] w-20 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-md border border-white/50 shadow-[0_10px_20px_rgba(30,64,175,0.25)] flex flex-col items-center justify-center font-black select-none pointer-events-none"
          style={{
            transform: 'rotate(-25deg) scale(0.9)',
            filter: 'blur(0.5px) drop-shadow(0 4px 6px rgba(0,0,0,0.15))'
          }}
        >
          <span className="text-[6px] tracking-widest text-blue-200 uppercase font-black">GC NATURE</span>
          <span className="text-[10px] tracking-tight -mt-0.5">VOUCHER</span>
        </div>

        {/* 3D Flying Voucher 2 (Large, near screen) */}
        <div 
          className="absolute top-48 right-[8%] w-24 h-13 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-lg border border-white/60 shadow-[0_15px_30px_rgba(30,64,175,0.3)] flex flex-col items-center justify-center font-black select-none pointer-events-none"
          style={{
            transform: 'rotate(35deg) scale(1.15)',
            filter: 'blur(1px) drop-shadow(0 8px 12px rgba(0,0,0,0.2))'
          }}
        >
          <span className="text-[7px] tracking-widest text-indigo-100 uppercase font-black">GIẢM NGAY</span>
          <span className="text-[11px] tracking-tight -mt-0.5">15% OFF</span>
        </div>

        {/* 3D Flying Voucher 3 */}
        <div 
          className="absolute bottom-52 left-[5%] w-22 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-md border border-white/50 shadow-[0_10px_20px_rgba(30,64,175,0.25)] flex flex-col items-center justify-center font-black select-none pointer-events-none"
          style={{
            transform: 'rotate(15deg) scale(0.95)',
            filter: 'blur(0.7px) drop-shadow(0 4px 6px rgba(0,0,0,0.15))'
          }}
        >
          <span className="text-[6px] tracking-widest text-blue-200 uppercase font-black">QUÀ KHỦNG</span>
          <span className="text-[10px] tracking-tight -mt-0.5">500.000đ</span>
        </div>

        {/* 3D Flying Voucher 4 */}
        <div 
          className="absolute bottom-36 right-[7%] w-18 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-md border border-white/45 shadow-[0_8px_16px_rgba(30,64,175,0.2)] flex flex-col items-center justify-center font-black select-none pointer-events-none"
          style={{
            transform: 'rotate(-12deg) scale(0.85)',
            filter: 'blur(0.4px) drop-shadow(0 3px 5px rgba(0,0,0,0.12))'
          }}
        >
          <span className="text-[6px] tracking-widest text-indigo-200 uppercase font-black">QUAY LÀ TRÚNG</span>
          <span className="text-[9px] tracking-tight -mt-0.5">MỸ PHẨM</span>
        </div>

        {/* Firework Left */}
        <div className="absolute top-20 left-10 w-48 h-48 opacity-20 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-pink-400">
            <circle cx="50" cy="50" r="1.5" fill="currentColor" />
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              return (
                <line 
                  key={i} 
                  x1="50" y1="50" 
                  x2={50 + 38 * Math.cos(angle)} y2={50 + 38 * Math.sin(angle)} 
                  stroke="currentColor" strokeWidth="0.6" strokeDasharray="2,3" 
                />
              );
            })}
          </svg>
        </div>
        {/* Firework Right */}
        <div className="absolute top-32 right-12 w-64 h-64 opacity-15 pointer-events-none select-none animate-[spin_120s_linear_infinite]" style={{ willChange: 'transform' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400">
            {[...Array(16)].map((_, i) => {
              const angle = (i * 22.5 * Math.PI) / 180;
              return (
                <line 
                  key={i} 
                  x1="50" y1="50" 
                  x2={50 + 44 * Math.cos(angle)} y2={50 + 44 * Math.sin(angle)} 
                  stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,4" 
                />
              );
            })}
          </svg>
        </div>
        {/* Glowing Gold Sparkles */}
        <div className="absolute top-[45%] right-[15%] w-10 h-10 opacity-40 pointer-events-none select-none">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-500 fill-yellow-400">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
        </div>
        <div className="absolute top-[28%] left-[18%] w-8 h-8 opacity-30 pointer-events-none select-none">
          <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-400 fill-yellow-300">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
        </div>
      </div>

      <SEOHead
        title="Vòng Quay May Mắn - Chương Trình HOT GC Nature"
        description="Tham gia quay vòng quay may mắn rinh ngập tràn giải thưởng lớn từ GC Nature."
        canonical={makeSiteUrl("/chuong-trinh-hot")}
      />
      <Header />

      <main className="container py-4 max-w-5xl relative z-10">
        {/* Elegant Event Header Banner */}
        <div className="text-center mb-6 mt-1 relative z-10">
          <h2 className="text-xs sm:text-sm font-black text-blue-900 tracking-widest uppercase bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-2.5 rounded-full w-fit mx-auto shadow-[0_4px_15px_rgba(59,130,246,0.35)] border border-blue-400/30 animate-pulse">
            CHẠM VÒNG QUAY - RINH NGAY QUÀ TẶNG
          </h2>
        </div>

        {/* Lucky Wheel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* LEFT: The Lucky Wheel (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white/60 backdrop-blur-md rounded-3xl border border-blue-200/40 p-4 md:p-6 shadow-md flex flex-col items-center justify-center relative overflow-hidden min-h-[580px]">
            {/* The Lucky Wheel Casing (Royal Blue + Rich Gold Bevel Bezel / Frame Block) */}
            <div className="flex flex-col items-center relative z-10">
              <div className="relative w-80 h-80 sm:w-[460px] sm:h-[460px] shrink-0 flex items-center justify-center bg-blue-900 rounded-full border-[14px] border-amber-400 outline outline-[6px] outline-amber-500 outline-offset-0 shadow-[0_25px_60px_rgba(245,158,11,0.45),inset_0_0_30px_rgba(180,83,9,0.6)]">
                
                {/* Spinning Wheel Board */}
                <div 
                  className="w-[98.5%] h-[98.5%] rounded-full overflow-hidden relative z-10 bg-stone-950"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? "transform 5s cubic-bezier(0.15, 0.85, 0.15, 1)" : "none",
                    willChange: "transform",
                  }}
                >
                  <svg viewBox="0 0 600 600" className="w-full h-full">
                    <defs>
                      {/* Heavy realistic solid gold metallic gradient */}
                      <linearGradient id="solidGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF2B2" />
                        <stop offset="20%" stopColor="#D1A13B" />
                        <stop offset="40%" stopColor="#F9E493" />
                        <stop offset="60%" stopColor="#B8860B" />
                        <stop offset="80%" stopColor="#E6C65A" />
                        <stop offset="100%" stopColor="#8A640F" />
                      </linearGradient>
                    </defs>

                    {/* Slices mapping */}
                    {rewardsList.map((item, idx) => {
                      const total = rewardsList.length;
                      const deg = 360 / total;
                      const startAngle = idx * deg - 90;
                      const endAngle = (idx + 1) * deg - 90;
                      
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      
                      const cx = 300, cy = 300, r = 290;
                      const x1 = cx + r * Math.cos(startRad);
                      const y1 = cy + r * Math.sin(startRad);
                      const x2 = cx + r * Math.cos(endRad);
                      const y2 = cy + r * Math.sin(endRad);
                      
                      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
                      
                      // Alternating White and Royal Blue slices
                      const color = idx % 2 === 0 ? "#ffffff" : "#1e40af";
                      
                      // Text lines
                      const [line1, line2] = getWheelDisplayLines(item.name);
                      const isWon = wonReward && wonReward.id === item.id;
                      const midAngle = startAngle + deg / 2;

                      // Text color: Deep blue on White slices, White on Blue slices
                      const txtColor = idx % 2 === 0 ? "#0f172a" : "#ffffff";
                      // Small text color
                      const subTxtColor = idx % 2 === 0 ? "#2563eb" : "#fef08a";

                      // Check type for custom SVG icons inside slices
                      const isVoucher = item.type === "voucher";
                      const isSpa = item.type === "spa";
                      const isPhysical = item.type === "physical";

                      return (
                        <g key={item.id}>
                          <path 
                            d={pathData} 
                            fill={color} 
                            stroke="url(#solidGoldGrad)" 
                            strokeWidth="1.5"
                          />
                          
                          {/* Radial Text & Vector Icon Layout (No -90 rotation to keep texts horizontal/perpendicular to midline) */}
                          <g transform={`rotate(${midAngle + 90}, ${cx}, ${cy})`}>
                            {/* Value (Big text near rim, y = 68px) */}
                            <text
                              x={cx}
                              y={cx - r + 68}
                              textAnchor="middle"
                              style={{
                                fontSize: '15px',
                                fontWeight: 900,
                                fill: txtColor,
                                textShadow: idx % 2 === 0 ? '0 1px 2px rgba(255,255,255,0.8)' : '0 2px 4px rgba(0,0,0,0.5)',
                                letterSpacing: '0.3px',
                              }}
                              className="select-none pointer-events-none uppercase font-serif"
                            >
                              {line1}
                            </text>

                            {/* Label (Small text near center, y = 104px) */}
                            {line2 && (
                              <text
                                x={cx}
                                y={cx - r + 104}
                                textAnchor="middle"
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 800,
                                  fill: subTxtColor,
                                  textShadow: idx % 2 === 0 ? 'none' : '0 1px 2px rgba(0,0,0,0.4)',
                                  letterSpacing: '0.5px',
                                }}
                                className="select-none pointer-events-none uppercase"
                              >
                                {line2}
                              </text>
                            )}

                            {/* Vector Illustration Icons (placed at y = 138px/radius 138 closer to center) */}
                            <g transform={`translate(${cx - 15}, ${cx - r + 138})`}>
                              {isVoucher ? (
                                <g>
                                  {/* Ticket Icon */}
                                  <rect x="0" y="0" width="30" height="20" rx="3" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
                                  <circle cx="0" cy="10" r="3" fill={color} />
                                  <circle cx="30" cy="10" r="3" fill={color} />
                                  <line x1="8" y1="10" x2="22" y2="10" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="1.5,1.5" />
                                </g>
                              ) : isSpa ? (
                                <g>
                                  {/* Pink Flower Icon */}
                                  <path d="M 15 2 C 7 10 15 20 15 20 C 15 20 23 10 15 2 Z" fill="#ec4899" />
                                  <path d="M 15 5 C 10 12 15 20 15 20 C 15 20 20 12 15 5 Z" fill="#f472b6" />
                                </g>
                              ) : isPhysical ? (
                                <g>
                                  {/* Skincare Jar / Gift Icon */}
                                  <rect x="2" y="5" width="26" height="15" fill="#ef4444" rx="2" />
                                  <rect x="0" y="2" width="30" height="5" fill="#f87171" rx="1" />
                                  <rect x="13" y="2" width="4" height="18" fill="#fbbf24" />
                                  <rect x="0" y="8" width="30" height="4" fill="#fbbf24" />
                                  <path d="M 15 2 C 12 -2 8 -2 11 2 Z" fill="#fbbf24" />
                                  <path d="M 15 2 C 18 -2 22 -2 19 2 Z" fill="#fbbf24" />
                                </g>
                              ) : (
                                <g>
                                  {/* Golden Star Icon */}
                                  <path d="M 15 0 L 19 9 L 29 11 L 22 18 L 24 28 L 15 23 L 6 28 L 8 18 L 1 11 L 11 9 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.5" />
                                </g>
                              )}
                            </g>
                          </g>
                        </g>
                      );
                    })}

                    {/* Outer Gold Rings representing solid gold frame block bezel */}
                    <circle cx="300" cy="300" r="294" fill="none" stroke="url(#solidGoldGrad)" strokeWidth="12" />
                    <circle cx="300" cy="300" r="288" fill="none" stroke="#8A640F" strokeWidth="1.5" />
                    <circle cx="300" cy="300" r="286" fill="none" stroke="#FFF2B2" strokeWidth="1.5" />

                    {/* Concentric gold dashed circles acting as radial geometric background patterns */}
                    <circle cx="300" cy="300" r="255" fill="none" stroke="url(#solidGoldGrad)" strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
                    <circle cx="300" cy="300" r="200" fill="none" stroke="url(#solidGoldGrad)" strokeWidth="1" strokeDasharray="4,4" opacity="0.25" />
                    <circle cx="300" cy="300" r="140" fill="none" stroke="url(#solidGoldGrad)" strokeWidth="1" strokeDasharray="2,2" opacity="0.3" />

                    {/* Mandala Gold Starburst in the center background of the wheel */}
                    <g opacity="0.2">
                      {[...Array(14)].map((_, i) => {
                        const angle = (i * (360 / 14) * Math.PI) / 180;
                        return (
                          <line 
                            key={i} 
                            x1="300" y1="300" 
                            x2={300 + 130 * Math.cos(angle)} y2={300 + 130 * Math.sin(angle)} 
                            stroke="url(#solidGoldGrad)" strokeWidth="1" 
                          />
                        );
                      })}
                    </g>

                    {/* Outer precision dial tick marks (Vành chia độ của đồng hồ Thụy Sĩ) */}
                    {[...Array(72)].map((_, i) => {
                      const angle = (i * 5 * Math.PI) / 180;
                      const x1 = 300 + 282 * Math.cos(angle);
                      const y1 = 300 + 282 * Math.sin(angle);
                      const x2 = 300 + 286 * Math.cos(angle);
                      const y2 = 300 + 286 * Math.sin(angle);
                      return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#solidGoldGrad)" strokeWidth="1" opacity="0.45" />
                      );
                    })}

                    {/* Gold studs along the solid gold rim */}
                    {[...Array(24)].map((_, i) => {
                      const angle = (i * 15 * Math.PI) / 180;
                      const x = 300 + 288 * Math.cos(angle);
                      const y = 300 + 288 * Math.sin(angle);
                      return (
                        <circle key={i} cx={x} cy={y} r="5" fill="url(#solidGoldGrad)" stroke="#8A640F" strokeWidth="1" className="shadow-sm" />
                      );
                    })}
                  </svg>
                </div>

                {/* Central Golden Pointer Needle & Center Cap (Static Overlay SVG for 100% smooth positioning) */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                  <svg viewBox="0 0 600 600" className="w-full h-full">
                    <defs>
                      <linearGradient id="goldNeedleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF2B2" />
                        <stop offset="30%" stopColor="#F9E493" />
                        <stop offset="50%" stopColor="#D1A13B" />
                        <stop offset="70%" stopColor="#B8860B" />
                        <stop offset="100%" stopColor="#8A640F" />
                      </linearGradient>
                      <radialGradient id="goldButtonGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF8D6" />
                        <stop offset="30%" stopColor="#FFF2B2" />
                        <stop offset="70%" stopColor="#D1A13B" />
                        <stop offset="100%" stopColor="#8A640F" />
                      </radialGradient>
                    </defs>

                    {/* The Needle pointer pointing straight up (12 o'clock) */}
                    <path d="M 300 135 L 316 220 L 306 300 L 294 300 L 284 220 Z" fill="url(#goldNeedleGrad)" stroke="#8A640F" strokeWidth="1.5" />
                    <path d="M 300 135 L 300 300" stroke="#FFF2B2" strokeWidth="1" opacity="0.4" />

                    {/* Center cap cover */}
                    <circle cx="300" cy="300" r="54" fill="url(#goldButtonGrad)" stroke="#8A640F" strokeWidth="3" />
                    <circle cx="300" cy="300" r="48" fill="none" stroke="#FFF2B2" strokeWidth="1" />
                  </svg>
                </div>

                {/* Interactive QUAY Button */}
                <button 
                  onClick={handleSpin}
                  disabled={spinning || (isAuthenticated && luckySpinsCount <= 0)}
                  className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center z-30 transition-all duration-200"
                  style={{
                    background: 'radial-gradient(circle, #FFF2B2 0%, #D1A13B 60%, #8A640F 100%)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.4)',
                    border: '3px solid #FFF2B2'
                  }}
                >
                  <Play className={`w-6 h-6 sm:w-8 sm:h-8 fill-blue-900 text-blue-900 ${spinning ? 'opacity-30' : ''}`} />
                  <span className="text-[10px] sm:text-[12px] font-black text-blue-950 uppercase tracking-widest -mt-0.5">QUAY</span>
                </button>
              </div>

              {/* Glowing 3D Neon Podium / Stand Base */}
              <div className="w-56 h-7 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 rounded-[100%] shadow-[0_10px_25px_rgba(6,182,212,0.5),0_-3px_10px_rgba(6,182,212,0.3)] border-t border-cyan-300 relative z-0 mt-[-14px] flex items-center justify-center">
                <div className="w-48 h-5 bg-gradient-to-r from-blue-600 via-cyan-300 to-blue-700 rounded-[100%] border-t border-white/40" />
              </div>

              {/* Decorative blue gift boxes with gold ribbons under the base */}
              <div className="flex gap-16 mt-6 z-10 select-none pointer-events-none">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg shadow-lg rotate-12 flex items-center justify-center border-t-2 border-blue-400">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2.5 bg-amber-400" />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 bg-amber-400" />
                </div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-lg shadow-xl -rotate-12 flex items-center justify-center border-t-2 border-blue-500">
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3 bg-amber-400" />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results & Info (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6 relative z-10">
            {/* Spin status & CTA */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-stone-100 p-6 md:p-8 shadow-sm flex flex-col justify-between flex-1 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" /> Lượt quay của bạn
                </h3>
                
                {isAuthenticated ? (
                  <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 text-center space-y-2">
                    <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">Bạn đang có</span>
                    <span className="text-4xl font-black text-amber-600 block">{luckySpinsCount}</span>
                    <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">lượt quay trúng thưởng</span>
                  </div>
                ) : (
                  <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 text-center space-y-3">
                    <div className="flex items-center justify-center gap-1.5 text-rose-700 text-sm font-bold">
                      <AlertCircle className="w-4 h-4" /> Bạn chưa đăng nhập
                    </div>
                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                      Để tham gia vòng quay may mắn rinh quà, vui lòng đăng ký tài khoản mới hoặc đăng nhập tài khoản hiện tại.
                    </p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-sm transition-all active:scale-95 w-full justify-center"
                    >
                      Đăng ký tài khoản tham gia <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {wonReward && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="text-xs text-green-700 font-extrabold uppercase tracking-wide flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-green-600 animate-spin" /> Bạn đã quay trúng giải
                  </span>
                  <p className="text-sm font-bold text-stone-900 leading-snug">{wonReward.name}</p>
                  {wonReward.code && (
                    <div className="bg-white border border-green-200 rounded-lg p-2.5 mt-2 font-mono text-xs font-bold text-green-700 select-all shadow-sm w-fit mx-auto">
                      Code: {wonReward.code}
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated && luckySpinsCount <= 0 && (
                <div className="bg-amber-50/30 border border-amber-100/50 rounded-2xl p-4 flex gap-3 items-start">
                  <ShoppingBag className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-normal text-stone-600">
                    Bạn đã hết lượt quay. Mỗi đơn hàng bạn mua và hoàn thành thành công sẽ tự động cộng thêm <strong className="font-bold text-amber-700">1 lượt quay</strong>!
                    <Link to="/shop" className="text-amber-700 font-bold block mt-1 hover:underline">Mua sắm ngay &rarr;</Link>
                  </div>
                </div>
              )}
            </div>

            {/* History rewards list */}
            <div className="bg-white rounded-3xl border border-stone-100 p-6 md:p-8 shadow-sm flex flex-col justify-between flex-1 gap-4 max-h-[300px] overflow-hidden">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Lịch sử trúng quà của bạn</h3>
              
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
                {!isAuthenticated ? (
                  <div className="text-center py-10 text-stone-400 text-xs font-light">Đăng nhập để xem lịch sử trúng quà</div>
                ) : spinHistory.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 text-xs font-light">Bạn chưa tham gia quay thưởng nào.</div>
                ) : (
                  spinHistory.map((item) => (
                    <div key={item.id} className="bg-stone-50/50 rounded-xl p-3 border border-stone-100 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-stone-800">{item.reward_name}</p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {new Date(item.created_at).toLocaleDateString("vi-VN")} {new Date(item.created_at).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      {item.code && (
                        <span className="bg-green-50 border border-green-100 text-green-700 font-mono text-[9px] font-bold px-2 py-0.5 rounded shrink-0">
                          {item.code.substring(0, 12)}...
                        </span>
                      )}
                    </div>
                  ))
                )}
            </div>
          </div>

          </div>
        </div>

        {/* BOTTOM: Rules and Conditions */}
        <div className="bg-white rounded-3xl border border-stone-100 p-6 md:p-10 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-serif text-stone-900 tracking-wide flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" /> Thể lệ chương trình
          </h2>
          <div className="space-y-3 text-sm text-stone-600 leading-relaxed font-light">
            <p>1. 👤 <strong className="font-bold text-stone-850">Đối tượng tham gia</strong>: Khách hàng đã đăng ký tài khoản thành công trên website GC Nature.</p>
            <p>2. 🎟️ <strong className="font-bold text-stone-850">Nhận lượt quay</strong>:
              <br />&bull; Khách hàng mới <strong className="font-bold text-stone-850">đăng ký tài khoản lần đầu</strong> sẽ được tặng ngay <strong className="font-bold text-stone-850">1 lượt quay miễn phí</strong>.</p>
              <p>&bull; Để nhận thêm lượt quay, khách hàng tiến hành mua sắm. Với <strong className="font-bold text-stone-850">mỗi đơn hàng được hoàn thành</strong> thành công (Trạng thái đơn hàng: Đã giao hàng), tài khoản của bạn sẽ tự động được cộng thêm <strong className="font-bold text-stone-850">1 lượt quay</strong> không giới hạn số lượng đơn.</p>
            <p>3. 🎁 <strong className="font-bold text-stone-850">Cơ chế phần thưởng</strong>:
              <br />&bull; Giải thưởng Voucher: Voucher sẽ tự động liên kết trực tiếp với Ví Voucher của tài khoản. Khi bạn mua hàng và tiến hành thanh toán, hệ thống sẽ <strong className="font-bold text-stone-850">tự động đề xuất áp dụng voucher có giá trị giảm sâu nhất</strong> đáp ứng điều kiện đơn hàng. Quy tắc chỉ áp dụng tối đa <strong className="font-bold text-stone-850">1 voucher cho 1 đơn hàng</strong>.</p>
              <p>&bull; Giải thưởng Hiện vật & Liệu trình Spa: Khách hàng trúng giải vui lòng liên hệ Bộ phận hỗ trợ khách hàng hoặc Hotline của GC Nature để được xác minh, hướng dẫn và nhận phần quà trực tiếp.</p>
            <p>4. ⚖️ <strong className="font-bold text-stone-850">Quy định chung</strong>: GC Nature bảo lưu quyền hủy bỏ hoặc thu hồi giải thưởng đối với các hành vi gian lận hoặc vi phạm các quy định chính sách bảo mật/sử dụng của website.</p>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
}
