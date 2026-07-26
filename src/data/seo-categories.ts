import { Glasses as GlassesIcon, Camera, Languages, Bot, Package } from "lucide-react";

export interface CategorySEO {
  title: string;
  slug: string;
  description: string;
  metaDescription: string;
  shortDesc: string;
  url: string;
  icon: any;
  /** Solid Tailwind background utility, e.g. "bg-red-50" */
  iconBg: string;
  /** Solid Tailwind text utility, e.g. "text-red-600" */
  iconColor: string;
  /** @deprecated kept for backward compatibility, prefer iconBg + iconColor */
  gradient: string;
  /** @deprecated kept for backward compatibility */
  lightBg: string;
  image: string;
  keywords: string;
}

export const categorySEO: Record<string, CategorySEO> = {
  "Kính Thông Minh AI": {
    title: "Kính Thông Minh AI",
    slug: "kinh-thong-minh-ai",
    description: "Kính thông minh đa chức năng tích hợp AI: nghe nhạc bluetooth, gọi điện rảnh tay, trợ lý AI thông minh, chống nắng UV400. Thiết kế thời trang, pin trâu lên đến 8 giờ sử dụng liên tục.",
    metaDescription: "Mua kính thông minh AI chính hãng tại GCnature. Nghe nhạc bluetooth, gọi điện rảnh tay, trợ lý AI. Bảo hành 12 tháng, trả góp 0%. Giá tốt nhất thị trường.",
    shortDesc: "Nghe nhạc, gọi điện, trợ lý AI thông minh",
    url: "/danh-muc/kinh-thong-minh-ai",
    icon: GlassesIcon,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    gradient: "from-red-500 via-rose-500 to-pink-500",
    lightBg: "from-red-50 via-rose-50 to-pink-50",
    image: "/products/MCK5.0D-0.jpg",
    keywords: "kính thông minh, kính AI, kính bluetooth, kính nghe nhạc, smart glasses, MCK 5.0, MCK 5.1, MCK 6.0",
  },
  "Kính Có Camera": {
    title: "Kính Camera POV",
    slug: "kinh-camera",
    description: "Kính có camera quay phim POV chất lượng 2K, chụp ảnh 32MP sắc nét. Ghi lại mọi khoảnh khắc từ góc nhìn thứ nhất, lý tưởng cho TikToker, Vlogger và người sáng tạo nội dung.",
    metaDescription: "Mua kính có camera POV 2K chính hãng tại GCnature. Quay phim POV 2K, chụp ảnh 32MP. Bảo hành 12 tháng. Giá tốt nhất cho Content Creator.",
    shortDesc: "Quay POV 2K, chụp ảnh 32MP sắc nét",
    url: "/danh-muc/kinh-camera",
    icon: Camera,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-700",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    lightBg: "from-blue-50 via-indigo-50 to-violet-50",
    image: "/products/POV5.0D-0.jpg",
    keywords: "kính camera, kính quay phim, kính POV, camera glasses, kính chụp ảnh, POV 5.0, POV 5.1",
  },
  "Kính Dịch Thuật": {
    title: "Kính Dịch Thuật",
    slug: "kinh-dich-thuat",
    description: "Kính dịch thuật realtime hỗ trợ hơn 40 ngôn ngữ, dịch chính xác và tự nhiên trong thời gian thực. Lý tưởng cho du lịch, học ngoại ngữ, và giao tiếp quốc tế.",
    metaDescription: "Mua kính dịch thuật realtime 40+ ngôn ngữ tại GCnature. Dịch chính xác, tự nhiên. Bảo hành 12 tháng, trả góp 0%. Giá rẻ nhất thị trường.",
    shortDesc: "Dịch thuật realtime 40+ ngôn ngữ",
    url: "/danh-muc/kinh-dich-thuat",
    icon: Languages,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    lightBg: "from-emerald-50 via-teal-50 to-cyan-50",
    image: "/products/KDT5.0D-0.jpg",
    keywords: "kính dịch thuật, kính phiên dịch, translator glasses, kính dịch ngôn ngữ, KDT 5.0, KDT 5.1",
  },
  "Robot AI": {
    title: "Robot AI",
    slug: "robot-ai",
    description: "Robot AI thông minh tích hợp gia sư AI, mắt LED biểu cảm sinh động. Hỗ trợ học tập, giải trí và đồng hành cùng gia đình. Thiết kế đáng yêu với nhiều phiên bản: Capy, Gấu Trúc, Thỏ.",
    metaDescription: "Mua Robot AI thông minh chính hãng tại GCnature. Gia sư AI, mắt LED biểu cảm, hỗ trợ học tập. Bảo hành 12 tháng. Quà tặng ý nghĩa cho trẻ em.",
    shortDesc: "Gia sư AI, mắt LED biểu cảm",
    url: "/danh-muc/robot-ai",
    icon: Bot,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-700",
    gradient: "from-purple-500 via-violet-500 to-fuchsia-500",
    lightBg: "from-purple-50 via-violet-50 to-fuchsia-50",
    image: "/products/RBnu-capy-0.jpg",
    keywords: "robot AI, robot thông minh, gia sư AI, robot đồ chơi thông minh, robot học tập",
  },
  "Phụ Kiện": {
    title: "Phụ Kiện Thông Minh",
    slug: "phu-kien",
    description: "Phụ kiện thông minh chính hãng GCnature: balo đèn LED sáng tạo, bao da cao cấp, phụ kiện đi kèm kính thông minh. Ưu đãi lớn, giao hàng nhanh toàn quốc.",
    metaDescription: "Mua phụ kiện thông minh chính hãng tại GCnature. Balo đèn LED, bao da cao cấp. Ưu đãi lớn, giao hàng nhanh toàn quốc.",
    shortDesc: "Balo LED, bao da cao cấp, quà tặng",
    url: "/danh-muc/phu-kien",
    icon: Package,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    lightBg: "from-amber-50 via-orange-50 to-red-50",
    image: "/products/Bao-da-0.jpg",
    keywords: "phụ kiện kính thông minh, balo đèn LED, bao da kính, phụ kiện GCnature",
  },
};

// Get all categories as array
export const allCategories = Object.entries(categorySEO).map(([key, val]) => ({
  categoryName: key,
  ...val,
}));

// Find category by slug
export function getCategoryBySlug(slug: string): (CategorySEO & { categoryName: string }) | null {
  const entry = Object.entries(categorySEO).find(([, v]) => v.slug === slug);
  if (!entry) return null;
  return { categoryName: entry[0], ...entry[1] };
}

// All category slugs (for sitemap/routes)
export const categorySlugs = Object.values(categorySEO).map(c => c.slug);
