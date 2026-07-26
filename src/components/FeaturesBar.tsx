import { Shield, Truck, Headphones, Sparkles, Users, Store } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Shield,
    title: "Thương hiệu Chính hãng",
    desc: "Cam kết chính hãng 100%, nguồn gốc rõ ràng",
    iconBg: "bg-teal-50 text-[#5dc1d1]",
  },
  {
    icon: Sparkles,
    title: "Cam kết chất lượng",
    desc: "Sản phẩm chính hãng, kiểm định nghiêm ngặt",
    iconBg: "bg-teal-50 text-[#5dc1d1]",
  },
  {
    icon: Users,
    title: "Được cộng đồng KOLs KOCs đánh giá",
    desc: "Chất lượng sản phẩm đáng mong đợi",
    iconBg: "bg-teal-50 text-[#5dc1d1]",
  },
  {
    icon: Store,
    title: "Hệ thống cửa hàng, đại lý toàn quốc",
    desc: "",
    iconBg: "bg-teal-50 text-[#5dc1d1]",
  },
  {
    icon: Headphones,
    title: "Tư vấn 24/7",
    desc: "Trải nghiệm khách hàng là ưu tiên hàng đầu",
    iconBg: "bg-teal-50 text-[#5dc1d1]",
  },
  {
    icon: Truck,
    title: "Giao hàng tận nơi",
    desc: "Miễn phí vận chuyển toàn quốc, giao nhanh 2h nội thành",
    iconBg: "bg-teal-50 text-[#5dc1d1]",
  },
];

const FeaturesBar = () => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="py-2 md:py-6">
      <div className="container">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-8">
          {/* Section Header */}
          <div className="text-center mb-5 md:mb-8">
            <h2 className="text-base md:text-xl font-bold text-gray-900">
              Lý do GCnature được khách hàng tin tưởng
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              GCnature mang đến sự an tâm thông qua sản phẩm chất lượng và dịch vụ chuyên nghiệp
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group text-center p-3 md:p-5 rounded-xl border border-gray-50 hover:border-teal-100 hover:shadow-sm transition-all duration-300 bg-white flex flex-col justify-start"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-lg md:rounded-xl ${f.iconBg} flex items-center justify-center mb-2 md:mb-3 transition-transform duration-200 group-hover:scale-105 shadow-sm shrink-0`}
                >
                  <f.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>

                {/* Text */}
                <h3 className="font-bold text-xs md:text-sm text-gray-900 mb-1 leading-tight min-h-[32px] flex items-center justify-center">
                  {f.title}
                </h3>
                {f.desc && (
                  <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed mt-1">
                    {f.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
