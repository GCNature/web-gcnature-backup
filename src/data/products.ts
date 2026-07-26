// Product data enriched from official GCnature product catalog
export interface ProductData {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  flashSalePrice?: number;
  image: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  features?: string[];
  category: string;
  sku: string;
  warranty?: string;
  shopeeUrl?: string;
  tiktokUrl?: string;
  year?: number;
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";

// Key features shared across smart glasses
const glassesFeatures = [
  "Trợ lý AI cá nhân (điều khiển giọng nói)",
  "Dịch thuật REALTIME đa ngôn ngữ",
  "Loa âm thanh 3D định hướng",
  "Micro kép khử ồn AI",
  "Quay video 2K POV (12 phút)",
  "Camera 32MP chống rung",
  "Ghi âm 1 chạm",
  "Nhận dạng hình ảnh AI",
  "Pin 270mAh (6–12 giờ)",
  "Chống nước IP65",
  "Thay tròng kính linh hoạt",
];

const glassesSpecs = [
  { label: "Camera", value: "32MP chống rung EIS" },
  { label: "Video", value: "2K POV (lên đến 12 phút)" },
  { label: "Pin", value: "270mAh" },
  { label: "Thời lượng", value: "6–12 giờ liên tục" },
  { label: "Chống nước", value: "IP65" },
  { label: "Loa", value: "3D định hướng" },
  { label: "Micro", value: "Kép khử ồn AI" },
  { label: "Trọng lượng", value: "35g" },
  { label: "Chất liệu", value: "ABS chống trầy xước" },
  { label: "Thương hiệu", value: "GCnature" },
  { label: "Bảo hành", value: "15 ngày (mở rộng lên 12 tháng)" },
];

const warrantyInfo = "Bảo hành mặc định: 15 ngày | BH 3 Tháng: +550k | BH 6 Tháng: +650k | BH 12 Tháng: +900k";

export const products: ProductData[] = [
  // Bypassed: Local Mock Data is disabled. Fetch from /api/products instead.
  /*
  // ═══════════════════════════════════
  // MCK Series - Kính Thông Minh Bluetooth
  // ... omitted mock payloads
  */
];
