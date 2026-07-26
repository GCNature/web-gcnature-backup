import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Khánh Linh",
    role: "Beauty Blogger",
    company: "TikTok @linhbeauty99",
    rating: 5,
    content:
      "Kem chống nắng của GCnature kiềm dầu siêu đỉnh, nâng tông nhẹ tự nhiên mà không hề bị vón. Mình dùng cả mùa hè mà da vẫn thông thoáng, không lên mụn tí nào.",
    avatar: "https://ui-avatars.com/api/?name=NKL&background=5dc1d1&color=fff&bold=true&size=128",
  },
  {
    id: 2,
    name: "Trần Thu Trang",
    role: "Nhân viên văn phòng",
    company: "Hà Nội",
    rating: 5,
    content:
      "Mình da nhạy cảm cực kỳ, nhưng dùng dòng serum phục hồi rau má của GCnature thì êm ru. Da khỏe lên trông thấy, các vết mẩn đỏ dịu nhanh sau 3 ngày.",
    avatar: "https://ui-avatars.com/api/?name=TTT&background=ec4899&color=fff&bold=true&size=128",
  },
  {
    id: 3,
    name: "Lê Hoài Nam",
    role: "KOL / Model",
    company: "TP. Hồ Chí Minh",
    rating: 5,
    content:
      "GCnature nhập khẩu toàn mỹ phẩm chuẩn Olive Young Hàn Quốc nên chất lượng khỏi bàn. Giao hàng cực nhanh, tư vấn da chu đáo. Sẽ ủng hộ lâu dài!",
    avatar: "https://ui-avatars.com/api/?name=LHN&background=8b5cf6&color=fff&bold=true&size=128",
  },
  {
    id: 4,
    name: "Phạm Minh Thư",
    role: "Trang điểm tự do",
    company: "M.T Makeup",
    rating: 5,
    content:
      "Son kem lì của GCnature lên màu chuẩn đét, mịn mướt môi và không hề gây khô môi. Khách hàng của mình ai cũng khen tông màu tự nhiên chuẩn Hàn Quốc.",
    avatar: "https://ui-avatars.com/api/?name=PMT&background=f59e0b&color=fff&bold=true&size=128",
  },
  {
    id: 5,
    name: "Hoàng Mỹ Hạnh",
    role: "Sinh viên",
    company: "Đại học Ngoại Thương",
    rating: 5,
    content:
      "Sữa rửa mặt GCnature rửa xong da ẩm mướt, sạch sâu mà không hề có cảm giác khô căng. Giá học sinh sinh viên cực kỳ hợp lý cho một sản phẩm chính hãng Hàn Quốc.",
    avatar: "https://ui-avatars.com/api/?name=HMH&background=10b981&color=fff&bold=true&size=128",
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Show 1 on mobile, 3 on desktop
  const visibleCount = typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1;
  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlay, maxIndex]);

  const goPrev = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goNext = () => {
    setIsAutoPlay(false);
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section ref={ref} className="py-4 md:py-6">
      <div className="container">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-8 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Phản hồi từ khách hàng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hơn 16,000+ khách hàng đã tin tưởng và hài lòng với sản phẩm của chúng tôi
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Nav Buttons */}
            <button
              onClick={goPrev}
              className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="overflow-hidden mx-6 md:mx-8">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${current * (100 / visibleCount)}%)`,
                }}
              >
                {testimonials.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 px-2"
                    style={{
                      width: `${100 / visibleCount}%`,
                    }}
                  >
                    <div className="bg-white border border-gray-100 rounded-xl p-5 md:p-6 h-full relative hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                      {/* Quote icon */}
                      <Quote className="w-8 h-8 text-teal-100 absolute top-4 right-4" />

                      {/* Stars */}
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: item.rating }).map((_, si) => (
                          <Star
                            key={si}
                            className="w-4 h-4 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3 md:line-clamp-none italic">
                        "{item.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.role} • {item.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={goNext}
              className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  setIsAutoPlay(false);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-teal-500 w-6"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
