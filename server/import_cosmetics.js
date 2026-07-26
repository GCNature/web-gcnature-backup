const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockCategories = [
  { id: 1, name: "Mỹ phẩm Hàn Quốc", slug: "my-pham-han-quoc", sort_order: 1 },
  { id: 2, name: "Kem chống nắng", slug: "kem-chong-nang", sort_order: 2 },
  { id: 3, name: "Dưỡng da mặt", slug: "duong-da-mat", sort_order: 3 },
  { id: 4, name: "Trang điểm", slug: "trang-diem", sort_order: 4 },
  { id: 5, name: "Sữa rửa mặt", slug: "sua-rua-mat", sort_order: 5 },
];

const mockProducts = [
  {
    product_id: "KCN-MILD",
    sku: "KCN-MILD",
    name: "Kem Chống Nắng Vật Lý GCnature Mild Sunscreen SPF 50+/PA++++",
    short_name: "Mild Sunscreen SPF50+",
    category_id: 2,
    category_name: "Kem chống nắng",
    price: BigInt(380000),
    original_price: BigInt(480000),
    discount: 20,
    badge: "Bán chạy",
    rating: 5.0,
    sold: 120,
    stock: 500,
    brand: "GCnature",
    description: `Kem chống nắng vật lý GCnature Mild Sunscreen là sản phẩm bảo vệ da tối ưu hàng ngày với chỉ số chống nắng cực cao SPF 50+/PA++++. Công thức 100% màng lọc vật lý lành tính, phù hợp cho cả làn da nhạy cảm nhất và da đang trong quá trình điều trị (treatment).

Công dụng chính:
- Bảo vệ da hoàn hảo trước tia UVA, UVB và ánh sáng xanh có hại.
- Thành phần rau má và trà xanh giúp làm dịu da tức thì, ngăn ngừa mẩn đỏ do cháy nắng.
- Kiểm soát bã nhờn hiệu quả, giữ da khô thoáng mịn màng suốt 8 tiếng.
- Nâng tông nhẹ nhàng tự nhiên, có thể thay thế kem lót trang điểm hàng ngày.

Hướng dẫn sử dụng:
Thoa một lượng kem vừa đủ lên vùng da mặt và cổ trước khi ra ngoài 15-20 phút. Nên thoa lại sau mỗi 4 tiếng nếu hoạt động ngoài trời liên tục.`,
    seo_tags: "kem chống nắng, kem chống nắng vật lý, gcnature, kem chống nắng hàn quốc, sunscreen",
    shopee_url: "https://shopee.vn",
    tiktok_url: "https://tiktok.com",
    is_flash_sale: true,
    flash_sale_percent: 20,
    features_vn: "• Chỉ số SPF 50+/PA++++ bảo vệ tối đa\n• Màng lọc vật lý Zinc Oxide & Titanium Dioxide lành tính\n• Chiết xuất rau má làm dịu da\n• Kiềm dầu, chống trôi nước hiệu quả\n• Nâng tông trắng hồng tự nhiên",
    features_en: "• SPF 50+/PA++++ maximum protection\n• Gentle physical filters\n• Centella extract soothes skin\n• Oil control & water resistant\n• Natural pink tone-up effect",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "50ml" },
      { name: "Loại da phù hợp", value: "Mọi loại da, da nhạy cảm, da treatment" },
      { name: "Chỉ số chống nắng", value: "SPF 50+ / PA++++" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Lê Minh", text: "Kem chống nắng nâng tông nhẹ đẹp, kiềm dầu rất tốt. Thoa lên mướt mịn không bị vón.", rating: 5 },
      { name: "Thanh Hằng", text: "Sản phẩm lành tính, mình da nhạy cảm dùng thấy êm ru, không bị nổi mụn ẩn.", rating: 5 }
    ]
  },
  {
    product_id: "KCN-TONEUP",
    sku: "KCN-TONEUP",
    name: "Kem Chống Nắng Dịu Nhẹ Nâng Tông GCnature Tone-up Sunscreen",
    short_name: "Tone-up Sunscreen",
    category_id: 2,
    category_name: "Kem chống nắng",
    price: BigInt(420000),
    original_price: BigInt(520000),
    discount: 19,
    badge: "Mới",
    rating: 4.9,
    sold: 85,
    stock: 300,
    brand: "GCnature",
    description: `Kem chống nắng nâng tông GCnature mang lại hiệu ứng da trắng hồng rạng rỡ ngay lập tức. Với phức hợp vitamin và glutathione, sản phẩm không chỉ bảo vệ da khỏi tia cực tím mà còn dưỡng sáng da chuyên sâu từ bên trong.

Công dụng nổi bật:
- Hiệu ứng nâng tông trắng hồng tự nhiên, che khuyết điểm nhẹ nhàng.
- Cấp ẩm sâu với Hyaluronic Acid, tránh tình trạng mốc mặt (cakey) khi trang điểm.
- Công nghệ màng lọc thế hệ mới bảo vệ da bền bỉ dưới nắng gắt.

Hướng dẫn sử dụng:
Lấy một lượng vừa đủ thoa đều khắp mặt sau các bước dưỡng da buổi sáng.`,
    seo_tags: "kem chống nắng nâng tông, tone up sunscreen, gcnature, chống nắng hàn quốc",
    shopee_url: "https://shopee.vn",
    tiktok_url: "https://tiktok.com",
    features_vn: "• Nâng tông trắng hồng rạng rỡ\n• Phức hợp Glutathione dưỡng sáng da\n• Cấp ẩm vượt trội với Hyaluronic Acid\n• Kết cấu kem lỏng nhẹ, thấm nhanh",
    features_en: "• Radiantly brightens skin tone\n• Glutathione complex for brightening\n• Hyaluronic Acid hydration\n• Lightweight texture, fast absorption",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "50ml" },
      { name: "Loại da phù hợp", value: "Da xỉn màu, da thường, da khô" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Ngọc Trinh", text: "Nâng tông hồng hào tự nhiên như da thật, không bị trắng bệch. Dùng thay cushion đi học rất hợp lý.", rating: 5 }
    ]
  },
  {
    product_id: "CREAM-HA",
    sku: "CREAM-HA",
    name: "Kem Dưỡng Cấp Ẩm Chuyên Sâu GCnature Hyaluronic Cream",
    short_name: "Hyaluronic Cream 80ml",
    category_id: 3,
    category_name: "Dưỡng da mặt",
    price: BigInt(490000),
    original_price: BigInt(600000),
    discount: 18,
    badge: "Yêu thích",
    rating: 5.0,
    sold: 210,
    stock: 400,
    brand: "GCnature",
    description: `Kem dưỡng ẩm GCnature Hyaluronic Cream chứa 5 loại phân tử Hyaluronic Acid kích thước siêu nhỏ, có khả năng len lỏi sâu vào từng lớp tế bào da để cấp nước tức thì và khóa ẩm suốt 24 giờ.

Sản phẩm giải quyết triệt để các vấn đề:
- Da khô ráp, bong tróc do thiếu nước hoặc thời tiết hanh khô.
- Da đổ dầu nhiều do thiếu nước (cơ chế tự bù dầu).
- Da xỉn màu, mất độ đàn hồi căng bóng.

Hướng dẫn sử dụng:
Sử dụng vào buổi sáng và buổi tối ở bước cuối cùng của chu trình skincare.`,
    seo_tags: "kem dưỡng ẩm, hyaluronic cream, gcnature, cấp ẩm chuyên sâu, kem dưỡng da hàn quốc",
    shopee_url: "https://shopee.vn",
    features_vn: "• Chứa 5 loại Hyaluronic Acid cấp nước đa tầng\n• Khóa ẩm vượt trội suốt 24h\n• Kết cấu gel-cream mát lạnh, không gây bết rít\n• Phục hồi độ đàn hồi giúp da căng mướt",
    features_en: "• Multi-depth hydration with 5 HA types\n• 24-hour moisture lock\n• Cool gel-cream texture, non-sticky\n• Restores skin elasticity for glow",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "80ml" },
      { name: "Loại da phù hợp", value: "Da khô, da dầu thiếu nước, da thường" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Hương Giang", text: "Gel thấm siêu nhanh, mát lạnh da. Dùng tối hôm trước sáng hôm sau ngủ dậy da căng bóng cực thích.", rating: 5 }
    ]
  },
  {
    product_id: "SERUM-VITC",
    sku: "SERUM-VITC",
    name: "Serum Sáng Da Mờ Thâm Vitamin C GCnature Ampoule",
    short_name: "Vitamin C Ampoule",
    category_id: 3,
    category_name: "Dưỡng da mặt",
    price: BigInt(550000),
    original_price: BigInt(700000),
    discount: 21,
    badge: "Hot",
    rating: 4.8,
    sold: 145,
    stock: 250,
    brand: "GCnature",
    description: `Serum dưỡng sáng da GCnature Vitamin C Ampoule sở hữu công thức Vitamin C thế hệ mới ổn định cao, kết hợp cùng Niacinamide 5% và Arbutin giúp làm mờ nhanh các vết thâm mụn, tàn nhang và dưỡng sáng đều màu da rõ rệt sau 14 ngày.

Đặc tính vượt trội:
- Không bị oxy hóa nhanh như các dòng Vitamin C truyền thống.
- Độ pH dịu nhẹ 5.5, giảm thiểu tối đa cảm giác châm chích hay kích ứng da.
- Chống oxy hóa mạnh mẽ, bảo vệ da trước tác nhân gây lão hóa.

Hướng dẫn sử dụng:
Thoa 3-4 giọt lên da sạch vào buổi tối. Nếu dùng buổi sáng, bắt buộc phải thoa kèm kem chống nắng.`,
    seo_tags: "serum vitamin c, dưỡng sáng da, mờ thâm mụn, gcnature, serum hàn quốc",
    shopee_url: "https://shopee.vn",
    features_vn: "• Vitamin C tinh khiết thế hệ mới ổn định cao\n• Kết hợp Niacinamide 5% tăng hiệu quả mờ thâm\n• pH 5.5 an toàn cho da nhạy cảm\n• Dưỡng da đều màu sáng mịn sau 14 ngày",
    features_en: "• Highly stable next-gen Vitamin C\n• Niacinamide 5% for enhanced fading\n• pH 5.5 safe for sensitive skin\n• Brightens and evens tone in 14 days",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "30ml" },
      { name: "Loại da phù hợp", value: "Da xỉn màu, da có vết thâm sau mụn" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Khánh Linh", text: "Thâm mụn mới mờ đi rất nhanh. Đặc biệt serum không bị bết dính và không thấy châm chích như các loại vitamin C khác mình từng dùng.", rating: 5 }
    ]
  },
  {
    product_id: "CREAM-CENTELLA",
    sku: "CREAM-CENTELLA",
    name: "Kem Phục Hồi Dịu Da Chiết Xuất Rau Má GCnature Centella Cream",
    short_name: "Centella Cream 50ml",
    category_id: 3,
    category_name: "Dưỡng da mặt",
    price: BigInt(460000),
    original_price: BigInt(580000),
    discount: 20,
    badge: "Bán chạy",
    rating: 5.0,
    sold: 198,
    stock: 350,
    brand: "GCnature",
    description: `Kem rau má GCnature Centella Cream là giải pháp cấp cứu hoàn hảo cho làn da đang bị tổn thương, kích ứng hoặc mẩn đỏ. Chứa 72% chiết xuất từ rau má hữu cơ vùng Madagascar kết hợp Ceramides giúp củng cố hàng rào bảo vệ tự nhiên của da.

Đối tượng nên dùng:
- Làn da sau khi nặn mụn, peel da hoặc lăn kim.
- Da mẩn đỏ, châm chích do dị ứng thời tiết hoặc mỹ phẩm.
- Da yếu, mỏng nổi mạch máu.

Hướng dẫn sử dụng:
Thoa đều một lượng kem vừa đủ lên vùng da cần phục hồi vào buổi sáng và tối.`,
    seo_tags: "kem rau má, phục hồi da, centella cream, gcnature, dịu da nhạy cảm",
    shopee_url: "https://shopee.vn",
    features_vn: "• 72% chiết xuất rau má hữu cơ cô đặc\n• Ceramides giúp xây dựng hàng rào bảo vệ da\n• Giảm đỏ, làm dịu da tức thì sau 30 phút\n• Thích hợp cho da sau nặn mụn và điều trị",
    features_en: "• 72% organic centella extract\n• Ceramides reinforce skin barrier\n• Reduces redness and soothes in 30 mins\n• Ideal for post-treatment skin recovery",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "50ml" },
      { name: "Loại da phù hợp", value: "Da nhạy cảm, da tổn thương, da sau nặn mụn" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Thu Trang", text: "Kem làm dịu các vết mẩn đỏ rất nhanh. Mình bôi sau nặn mụn thấy vết thương khô và lành nhanh gấp đôi.", rating: 5 }
    ]
  },
  {
    product_id: "SERUM-B5",
    sku: "SERUM-B5",
    name: "Serum Phục Hồi Rau Má & Vitamin B5 GCnature B5 Ampoule",
    short_name: "B5 Ampoule 30ml",
    category_id: 3,
    category_name: "Dưỡng da mặt",
    price: BigInt(520000),
    original_price: BigInt(650000),
    discount: 20,
    badge: "Khuyên dùng",
    rating: 4.9,
    sold: 167,
    stock: 280,
    brand: "GCnature",
    description: `Serum GCnature B5 Ampoule kết hợp hoàn hảo giữa Vitamin B5 nồng độ cao (10% Panthenol) và chiết xuất rau má, mang đến sức mạnh phục hồi gấp 3 lần. Sản phẩm nhanh chóng phục hồi độ ẩm, chữa lành vết thương và tăng sức đề kháng tự nhiên cho da.

Công dụng:
- Xây dựng lại cấu trúc tế bào da bị tổn thương do mụn hoặc kem trộn.
- Cấp ẩm sâu, duy trì làn da mướt mịn.
- Kháng viêm nhẹ, ngăn chặn mụn quay trở lại.`,
    seo_tags: "serum b5, phục hồi da b5, b5 ampoule, gcnature, serum rau má b5",
    shopee_url: "https://shopee.vn",
    features_vn: "• Nồng độ Vitamin B5 (Panthenol) 10% cao cấp\n• Kết hợp rau má tăng hiệu quả kháng viêm\n• Phục hồi cấu trúc biểu bì da tổn thương\n• Thấm siêu nhanh, không bóng nhờn",
    features_en: "• High concentration 10% Vitamin B5 (Panthenol)\n• Combined with Centella for anti-inflammatory\n• Restores damaged skin structure\n• Quick absorption, non-greasy finish",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "30ml" },
      { name: "Loại da phù hợp", value: "Da yếu, mỏng, nhạy cảm, da sau mụn" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Nam Khánh", text: "Serum phục hồi da rất tốt, da mình trước hay bong tróc quanh mũi dùng em này là hết hẳn.", rating: 5 }
    ]
  },
  {
    product_id: "LIP-VELVET",
    sku: "LIP-VELVET",
    name: "Son Kem Lì Mịn Môi GCnature Velvet Lip Tint",
    short_name: "Velvet Lip Tint",
    category_id: 4,
    category_name: "Trang điểm",
    price: BigInt(290000),
    original_price: BigInt(380000),
    discount: 23,
    badge: "Trendy",
    rating: 4.8,
    sold: 340,
    stock: 600,
    brand: "GCnature",
    description: `Dòng son kem lì GCnature Velvet Lip Tint có kết cấu son mỏng mịn như nhung, lên màu chuẩn sắc chỉ sau một lần quẹt và giữ màu bền bỉ suốt 6 tiếng mà không hề gây khô hay lộ vân môi.

Bảng màu thời thượng:
- #01: Đỏ Cam Ấm (Warm Red)
- #02: Hồng Đất Tây (Rose Nude)
- #03: Cam Đất (Brick Orange)

Công thức bổ sung dầu hạt bơ giúp dưỡng môi mềm mại suốt cả ngày.`,
    seo_tags: "son kem lì, velvet lip tint, gcnature, son hàn quốc, son mịn môi",
    shopee_url: "https://shopee.vn",
    features_vn: "• Kết cấu son velvet mịn mướt như nhung\n• Lên màu chuẩn đét, giữ màu đến 6h\n• Bổ sung tinh dầu quả bơ dưỡng ẩm môi\n• Thiết kế sang trọng, cọ lấy son thông minh",
    features_en: "• Smooth velvet lip texture like cloud\n• High color payoff, stays up to 6h\n• Infused with avocado oil for hydration\n• Elegant design with smart applicator",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Trọng lượng", value: "4g" },
      { name: "Độ bền màu", value: "4 - 6 tiếng" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["#01 Đỏ Cam", "#02 Hồng Đất", "#03 Cam Đất"],
    reviews: [
      { name: "Minh Thư", text: "Màu 02 hồng đất xinh xỉu luôn á, chất son lỳ nhưng rất mướt, môi khô dùng vẫn ổn áp.", rating: 5 }
    ]
  },
  {
    product_id: "CUSHION-PERFECT",
    sku: "CUSHION-PERFECT",
    name: "Phấn Nước Cushion Che Phủ Hoàn Hảo GCnature Perfect Cushion SPF 50+",
    short_name: "Perfect Cushion",
    category_id: 4,
    category_name: "Trang điểm",
    price: BigInt(580000),
    original_price: BigInt(750000),
    discount: 22,
    badge: "Độc quyền",
    rating: 4.9,
    sold: 112,
    stock: 180,
    brand: "GCnature",
    description: `Phấn nước GCnature Perfect Cushion mang lại lớp nền hoàn hảo chuẩn Glass-skin Hàn Quốc. Độ che phủ cao giúp làm mờ hoàn toàn các vết thâm mụn, lỗ chân lông to nhưng vẫn giữ được lớp nền tự nhiên, nhẹ mặt.

Ưu điểm vượt trội:
- Kiềm dầu và giữ tông bền màu đến 12h, không trôi chảy lớp nền.
- Tích hợp chỉ số chống nắng SPF 50+ bảo vệ da.
- Chứa dưỡng chất cấp ẩm, ngăn ngừa mốc nền (cakey).

Phân loại tone màu:
- Tone 21: Da sáng (Light Beige)
- Tone 23: Da tự nhiên (Natural Beige)`,
    seo_tags: "phấn nước, cushion, perfect cushion, gcnature, trang điểm nền hàn quốc",
    shopee_url: "https://shopee.vn",
    features_vn: "• Lớp nền căng bóng chuẩn Glass-skin Hàn Quốc\n• Che phủ 95% khuyết điểm lỗ chân lông, thâm mụn\n• Bền màu suốt 12h không lo xỉn tông\n• Chỉ số chống nắng vật lý SPF 50+/PA+++",
    features_en: "• Radiant glass-skin finish\n• Conceals 95% of pores and acne marks\n• 12-hour longwear without fading\n• Physical SPF 50+/PA+++ sun protection",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Khối lượng", value: "15g" },
      { name: "Tone màu", value: "21 (Da sáng) / 23 (Da tự nhiên)" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Tone 21 - Da Sáng", "Tone 23 - Da Tự Nhiên"],
    reviews: [
      { name: "Hồng Nhung", text: "Cushion tệp da tốt, không bị dày mặt. Mình đi làm cả ngày tối về lớp nền vẫn đẹp căng bóng.", rating: 5 }
    ]
  },
  {
    product_id: "FOAM-DEEP",
    sku: "FOAM-DEEP",
    name: "Sữa Rửa Mặt Sạch Sâu Kiềm Dầu GCnature Deep Cleansing Foam",
    short_name: "Deep Cleansing Foam",
    category_id: 5,
    category_name: "Sữa rửa mặt",
    price: BigInt(220000),
    original_price: BigInt(280000),
    discount: 21,
    badge: "Bán chạy",
    rating: 5.0,
    sold: 289,
    stock: 450,
    brand: "GCnature",
    description: `Sữa rửa mặt GCnature Deep Cleansing Foam với công thức bọt mịn mật độ cao giúp hút sạch sâu bụi bẩn, dầu thừa tận sâu lỗ chân lông, ngăn chặn hình thành mụn cám, mụn đầu đen hiệu quả mà không làm mất độ ẩm tự nhiên của da.

Ưu điểm nổi bật:
- Chiết xuất đất sét trắng và tro núi lửa Jeju hút dầu thừa vượt trội.
- Công nghệ khóa ẩm độc quyền giữ da mềm mịn sau khi rửa, không hề gây cảm giác khô căng.
- Thích hợp sử dụng hàng ngày cho da dầu, da hỗn hợp thiên dầu.`,
    seo_tags: "sữa rửa mặt, deep cleansing foam, sữa rửa mặt kiềm dầu, gcnature, sữa rửa mặt sạch sâu",
    shopee_url: "https://shopee.vn",
    features_vn: "• Công thức bọt mịn hút dầu thừa sâu trong lỗ chân lông\n• Đất sét trắng Jeju ngăn ngừa mụn đầu đen\n• Không cồn, không paraben lành tính\n• Da sạch thoáng mềm mịn sau khi sử dụng",
    features_en: "• Rich whipped foam extracts sebum from pores\n• Jeju white clay prevents blackheads\n• Alcohol-free, paraben-free safe formula\n• Clean, fresh, and soft finish without tightness",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "150ml" },
      { name: "Loại da phù hợp", value: "Da dầu, da hỗn hợp, da mụn" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Lâm Hùng", text: "Bọt sữa rửa mặt rất mịn, rửa xong thấy mặt sạch bưng nhưng sờ da vẫn mềm chứ không bị căng rát khó chịu.", rating: 5 }
    ]
  },
  {
    product_id: "FOAM-TEATREE",
    sku: "FOAM-TEATREE",
    name: "Sữa Rửa Mặt Dịu Nhẹ Ngừa Mụn GCnature Tea Tree Cleanser",
    short_name: "Tea Tree Cleanser",
    category_id: 5,
    category_name: "Sữa rửa mặt",
    price: BigInt(240000),
    original_price: BigInt(300000),
    discount: 20,
    badge: "Khuyên dùng",
    rating: 4.9,
    sold: 154,
    stock: 220,
    brand: "GCnature",
    description: `Sữa rửa mặt dạng gel dịu nhẹ GCnature Tea Tree Cleanser được chiết xuất từ tinh dầu tràm trà và BHA tự nhiên, giúp làm sạch sâu nhẹ nhàng, kháng khuẩn, giảm sưng viêm mụn và ngăn ngừa mụn mới xuất hiện.

Thích hợp cho:
- Làn da đang bị mụn viêm, mụn mủ.
- Da mỏng, nhạy cảm dễ kích ứng.
- Có thể dùng làm sữa rửa mặt dịu nhẹ buổi sáng.`,
    seo_tags: "sữa rửa mặt tràm trà, tea tree cleanser, sữa rửa mặt dịu nhẹ, gcnature, gel rửa mặt ngừa mụn",
    shopee_url: "https://shopee.vn",
    features_vn: "• Chiết xuất tinh dầu tràm trà kháng khuẩn tốt\n• BHA tự nhiên làm sạch tế bào chết lỗ chân lông\n• Kết cấu gel dịu nhẹ, pH chuẩn 5.5\n• Giảm sưng mụn rõ rệt sau vài ngày",
    features_en: "• Antibacterial tea tree oil extract\n• Natural BHA exfoliates inside pores\n• Gentle gel texture with optimal pH 5.5\n• Reduces acne inflammation in days",
    footer_info: "GCnature - Nhập khẩu & phân phối mỹ phẩm Hàn Quốc chính hãng 100%. Hotline: 0559869392.",
    production_year: 2025,
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600"
    ],
    specs: [
      { name: "Xuất xứ", value: "Hàn Quốc" },
      { name: "Dung tích", value: "150ml" },
      { name: "Loại da phù hợp", value: "Da mụn, da nhạy cảm, da hỗn hợp" },
      { name: "Hạn sử dụng", value: "3 năm kể từ ngày sản xuất" }
    ],
    variants: ["Mặc định"],
    reviews: [
      { name: "Khánh Vy", text: "Gel mùi tràm trà rất dễ chịu. Da mụn viêm dùng sướng lắm, dịu cồi mụn nhanh và không hề rát.", rating: 5 }
    ]
  }
];

async function main() {
  console.log("🧹 Clear existing tables...");
  await prisma.flash_sale_products.deleteMany({});
  await prisma.product_reviews.deleteMany({});
  await prisma.product_variants.deleteMany({});
  await prisma.product_specs.deleteMany({});
  await prisma.product_images.deleteMany({});
  await prisma.products.deleteMany({});
  await prisma.categories.deleteMany({});

  console.log("🌱 Seed categories...");
  await prisma.categories.createMany({ data: mockCategories });

  console.log("🌱 Seed products, images, specs, reviews...");
  for (const item of mockProducts) {
    const { images, specs, variants, reviews, ...prodData } = item;
    
    // Create product
    const product = await prisma.products.create({
      data: prodData
    });
    
    console.log(`   Created product: ${product.product_id} (${product.name})`);

    // Create images
    if (images && images.length > 0) {
      await prisma.product_images.createMany({
        data: images.map((url, i) => ({
          product_id: product.product_id,
          image_url: url,
          sort_order: i
        }))
      });
    }

    // Create specs
    if (specs && specs.length > 0) {
      await prisma.product_specs.createMany({
        data: specs.map((spec, i) => ({
          product_id: product.product_id,
          spec_name: spec.name,
          spec_value: spec.value,
          sort_order: i
        }))
      });
    }

    // Create variants
    if (variants && variants.length > 0) {
      await prisma.product_variants.createMany({
        data: variants.map(v => ({
          product_id: product.product_id,
          variant_name: v,
          is_active: true
        }))
      });
    }

    // Create reviews
    if (reviews && reviews.length > 0) {
      await prisma.product_reviews.createMany({
        data: reviews.map((r, i) => ({
          product_id: product.product_id,
          reviewer_name: r.name,
          avatar_letter: r.name.substring(0, 1),
          avatar_color: i % 2 === 0 ? "bg-teal-500" : "bg-blue-500",
          rating: r.rating,
          review_date: "2026-06-25",
          is_verified: true,
          review_text: r.text,
          helpful_count: i + 1,
          image_url: "",
          is_active: true,
          sort_order: i
        }))
      });
    }
  }

  // Double check categories mapping for general "Mỹ phẩm Hàn Quốc" category 1
  // Add some products from all categories as also belonging/visible under catalog 1 (or we can just query it in code)
  console.log("✅ Seed database success!");
}

main()
  .catch(e => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
