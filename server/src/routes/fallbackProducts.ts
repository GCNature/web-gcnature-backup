export interface MappedProduct {
  id: number;
  sku: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  image: string;
  images: string;
  productId: string;
  shortName: string;
  discount: number;
  rating: number;
  sold: number;
  stock: number;
  isFlashSale: boolean;
  flashSalePercent: number;
  shopeeUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  featuresVn: string;
  featuresEn: string;
  footerInfo: string;
  productionYear: number;
  clearancePrice: number;
  dailySalePrice: number;
  campaignPrice: number;
  offPlatformPrice: number;
  warrantyData: string;
  brand: string;
}

export const fallbackProducts: MappedProduct[] = [
  {
    id: 999,
    sku: 'TCPHD',
    brand: 'GC Nature',
    name: 'Serum Rau Má Phục Hồi Da CICA COMPLEX SERUM GC NATURE Chiết Xuất Rau Má Giảm Kích Ứng cho Da Nhạy Cảm Hàn Quốc',
    price: 280000,
    originalPrice: 400000,
    description: `Serum Phục Hồi Da CICA COMPLEX SERUM Chiết Xuất Rau Má Dịu Da Giảm Kích Ứng cho Da Nhạy Cảm

Vì sao bạn sẽ thích
Da bạn dễ ửng đỏ châm chích khi đổi thời tiết hay nổi mụn ẩn vì hàng rào bảo vệ yếu. ANELY Cica Complex Serum đến từ Hàn Quốc chính là vệ sĩ dịu nhẹ mà làn da nhạy cảm đang cần. Kết cấu gel serum xanh trong mỏng nhẹ thẩm thấu tức thì để lại cảm giác mát lạnh ẩm mượt và êm dịu ngay từ lần đầu sử dụng.

ƯU ĐIỂM NỔI BẬT
🌿 Bộ tự Rau Má vàng Asiaticoside Madecassoside Axit Asiatic Axit Madecassic làm dịu nhanh vùng da kích ứng đỏ rát
🌿 Chiết xuất Centella Asiatica + Keo Ong tăng cường hàng rào ẩm hỗ trợ phục hồi da yếu sau mụn
💧 Niacinamide + Beta-Glucan giúp da sáng đều màu mờ vết thâm sau mụn se khít lỗ chân lông
💧 Sodium Hyaluronate + Panthenol + Allantoin cấp ẩm sâu giữ da căng mọng suốt ngày dài
🍃 Bổ sung loạt chiết xuất thực vật: lô hội tảo bẹ hoa tím rễ cây du rễ khoai lang nuôi dưỡng và làm mát da
✅ Không cồn khô không paraben dịu nhẹ an toàn cho da nhạy cảm bà bầu có thể tham khảo

THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc trên Coupang Olive Young TOP tìm kiếm trên Naver được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam

THÀNH PHẦN CHÍNH
Dipropylene glycol glycerin niacinamide 1,2-hexanediol dầu thầu dầu hydro hóa PEG-60 chlorphenesin caprylyl glycol carbomer trietanolamine panthenol betaine allantoin adenosine xanthan gum disodium EDTA hương thơm butylene glycol Natri hyaluronate chiết xuất lá lô hội chiết xuất tảo bẹ chiết xuất hoa tím chiết xuất rễ cây du chiết xuất rễ khoai lang beta-glucan chiết xuất Centella Asiatica số màu vàng 4 số màu xanh 1 chiết xuất keo ong asiaticoside axit asiatic madecassoside axit madecassic

HƯỚNG DẪN SỬ DỤNG
Bước 1 Làm sạch da với sữa rửa mặt sau đó cân bằng bằng toner
Bước 2 Lấy 2-3 giọt serum chấm đều lên 5 điểm: trán mũi cằm và hai má
Bước 3 Vỗ nhẹ từ trong ra ngoài đến khi serum thẩm thấu hoàn toàn
Bước 4 Tiếp tục với kem dưỡng ẩm đừng quên kem chống nắng vào buổi sáng
👉 Dùng đều đặn 2 lần mỗi ngày sáng tối để cảm nhận da dịu mềm mượt rõ rệt

HƯỚNG DẪN BẢO QUẢN
Để nơi khô thoáng tránh ánh nắng trực tiếp và nhiệt độ cao trên 30 độ C
Đậy kín nắp sau mỗi lần dùng để giữ trọn dưỡng chất
Không dùng tay bẩn hoặc dụng cụ không sạch tiếp xúc trực tiếp với serum
Để xa tầm tay trẻ em`,
    category: 'Serum / Tinh chất đặc trị',
    image: '/products/TCPHD.1.jpg',
    images: '/products/TCPHD.1.jpg,/products/TCPHD.2.jpg,/products/TCPHD.3.jpg,/products/TCPHD.4.jpg,/products/TCPHD.5.jpg,/products/TCPHD.6.jpg,/products/TCPHD.7.jpg,/products/TCPHD.8.jpg,/products/TCPHD.9.jpg',
    productId: 'TCPHD',
    shortName: 'Serum Rau Má CICA GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: true,
    flashSalePercent: 30,
    shopeeUrl: 'https://s.shopee.vn/5VTJbcYtHN',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wrq4NUJv-Ultvr/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Làm dịu rát đỏ tức thì với tinh chất Cica rau má cô đặc",
      "Phục hồi hàng rào bảo vệ da yếu sau mụn hoặc peel da",
      "Cấp ẩm sâu suốt 24h ngừa khô ráp và bong tróc",
      "Không chứa cồn khô paraben hương liệu tổng hợp độc hại"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 998,
    sku: 'TCCA',
    brand: 'GC Nature',
    name: 'Serum Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC GC NATURE Cấp Nước Đa Tầng Căng Bóng Da Hàn Quốc',
    price: 280000,
    originalPrice: 400000,
    description: `Serum Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC GC NATURE Cấp Nước Đa Tầng Căng Bóng Da Hàn Quốc

Vì sao bạn sẽ thích
Da khô căng bong tróc lớp trang điểm dễ mốc cám và xuống tông. Serum SKIN BALANCING HYALURONIC là ly nước thần cho làn da thiếu ẩm với 8 dạng Hyaluronic Acid phân tử khác nhau thẩm thấu sâu vào từng lớp biểu bì khoá ẩm bền lâu suốt 24 giờ. Kết hợp Niacinamide Panthenol cùng dịch ốc sên và chiết xuất thảo mộc Hàn Quốc sản phẩm giúp da căng mọng mềm mịn sáng khoẻ rạng rỡ ngay từ những lần đầu dùng.

ƯU ĐIỂM NỔI BẬT
🌿 Cấp nước đa tầng da căng bóng tức thì nhờ 8 dạng Hyaluronic Acid
🌿 Làm sáng đều màu mờ vết thâm sạm nhờ Niacinamide
🌿 Làm dịu da nhạy cảm giảm mẩn đỏ nhờ Panthenol & Allantoin
🌿 Phục hồi làm mềm mượt bề mặt da nhờ tinh chất Ốc Sên Hàn Quốc Snail Filtrate
🌿 Tăng độ đàn hồi ngăn ngừa lão hoá sớm nhờ Beta-Glucan & Adenosine
🌿 Nuôi dưỡng da từ sâu bên trong bởi 7 chiết xuất thảo dược Hàn sắn dây cỏ ba lá lựu đương quy
🌿 Kết cấu lỏng nhẹ thấm nhanh không nhờn rít phù hợp mọi loại da kể cả da dầu mụn

THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc trên Coupang Olive Young TOP tìm kiếm trên Naver được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam

THÀNH PHẦN CHÍNH
Water Glycerin Dipropylene Glycol Glycereth-26 Niacinamide Betaine 1,2-Hexanediol PEG-60 Hydrogenated Castor Oil Chlorphenesin Acrylates C10-30 Alkyl Acrylate Crosspolymer Triethanolamine Caprylyl Glycol Panthenol Xanthan Gum Hydroxyethylcellulose Fragrance Allantoin Adenosine Disodium EDTA Sodium Polyacrylate Butylene Glycol Sodium Hyaluronate Snail Secretion Filtrate Beta-Glucan Pentylene Glycol Soy Isoflavones Pueraria Lobata Root Extract Pueraria Mirifica Root Extract Polygonum Cuspidatum Root Extract Cimicifuga Racemosa Root Extract Sodium Hyaluronate Crosspolymer Hydrolyzed Hyaluronic Acid Trifolium Pratense Clover Flower Extract Punica Granatum Fruit Extract Angelica Polymorpha Sinensis Root Extract CI 42090 Hyaluronic Acid Sodium Acetylated Hyaluronate Hydroxypropyltrimonium Hyaluronate Hydrolyzed Sodium Hyaluronate

HƯỚNG DẪN SỬ DỤNG
Bước 1 Làm sạch da với sữa rửa mặt cân bằng bằng toner
Bước 2 Lấy 2-3 giọt serum ra lòng bàn tay
Bước 3 Vỗ nhẹ đều khắp mặt và cổ ưu tiên vùng khô
Bước 4 Đợi 30 giây rồi dùng tiếp kem dưỡng và kem chống nắng
👉 Dùng đều đặn sáng và tối để cảm nhận làn da căng mịn rõ rệt

HƯỚNG DẪN BẢO QUẢN
Để nơi khô ráo thoáng mát tránh ánh nắng trực tiếp và nhiệt độ cao
Đậy kín nắp ngay sau khi sử dụng để giữ chất lượng tinh chất
Để xa tầm tay trẻ em
Ngưng dùng và rửa sạch với nước nếu xuất hiện dấu hiệu khó chịu`,
    category: 'Serum / Tinh chất đặc trị',
    image: '/products/TCCA.1.jpeg',
    images: '/products/TCCA.1.jpeg,/products/TCCA.2.jpeg,/products/TCCA.3.jpeg',
    productId: 'TCCA',
    shortName: 'Serum Cấp Ẩm Hyaluronic GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/3LOp3cBoBe',
    tiktokUrl: 'https://vt.tiktok.com/ZS965T7PXBPV6-Y08Dv/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Cấp ẩm đa tầng tức thì với 8 loại phân tử Hyaluronic Acid",
      "Da căng mịn, mọng mượt, ngăn ngừa hiện tượng mốc phấn",
      "Làm dịu rát và mẩn đỏ với Panthenol và dịch nhầy ốc sên",
      "Thấm thấu cực nhanh, không gây bít tắc chân lông sinh mụn"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 997,
    sku: 'TCDT',
    brand: 'GC Nature',
    name: 'Serum Dưỡng Trắng DA VITAMIN-C GC NATURE  Mờ Thâm Nám Chống Oxy Hóa Hồi Phục Da Hàn Quốc',
    price: 280000,
    originalPrice: 400000,
    description: `Serum Dưỡng Trắng Da VITAMIN-C GC NATURE Mờ Thâm Nám Chống Oxy Hoá Hồi Phục Da

✨ Vì sao bạn sẽ thích?
Da xỉn màu, nhiều đốm thâm sau mụn, tone da không đều và thiếu sức sống? Serum VITAMIN-C GC NATURE chính là ly nước cam ép cho làn da mệt mỏi, với bộ ba dưỡng chất Vitamin C - Vitamin E - Sea Buckthorn giúp da sáng dần đều màu, mờ thâm và lấy lại vẻ rạng rỡ tự nhiên. Kết cấu serum mỏng nhẹ, thấm nhanh, không gây bí da, phù hợp dùng cả sáng lẫn tối để cảm nhận làn da tươi tắn, mịn màng theo từng ngày.

✨ ƯU ĐIỂM NỔI BẬT
- Da sáng đều màu một cách an toàn nhờ Sodium Ascorbyl Phosphate SAP - dẫn xuất Vitamin C bền vững, dịu nhẹ
- Chống oxy hoá và mờ thâm sạm nhờ Tocopherol Vitamin E - bộ đôi song kiếm hợp bích cùng Vitamin C
- Làm dịu da đỏ và phục hồi da khoẻ: Hippophae Rhamnoides tinh dầu tắc biển - giàu vitamin tự nhiên
- Làm sáng, kiềm dầu, dưỡng ẩm và nuôi dưỡng da mềm mịn từ Niacinamide và Panthenol
- Cấp ẩm tức thì, giữ da căng mọng suốt ngày dài từ Hyaluronic Acid
- Kết cấu lỏng nhẹ, thấm nhanh, không bết dính - phù hợp mọi loại da, kể cả da dầu mụn

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
Water, Glycerin, Dipropylene Glycol, Niacinamide, Sodium Ascorbyl Phosphate SAP - dẫn xuất Vitamin C, Betaine, 1,2-Hexanediol, Tocopherol Vitamin E, Hippophae Rhamnoides Fruit Extract Sea Buckthorn, Panthenol, Allantoin, Adenosine, Sodium Hyaluronate, Hydrolyzed Hyaluronic Acid, Beta-Glucan, Caprylyl Glycol, Xanthan Gum, Hydroxyethylcellulose, Acrylates C10-30 Alkyl Acrylate Crosspolymer, Triethanolamine, Disodium EDTA, Chlorphenesin, Butylene Glycol, Pentylene Glycol, Fragrance.

✨ HƯỚNG DẪN SỬ DỤNG
Một nghi thức nhỏ cho làn da rạng rỡ mỗi sáng và tối:
Bước 1: Làm sạch nhẹ nhàng để da như tờ giấy trắng chờ nét bút
Bước 2: Lấy 3-4 giọt serum thoa khi da còn hơi ẩm, xoa đều rồi vỗ nhẹ để đánh thức làn da
Bước 3: Đợi khoảng 1 phút cho serum thấm trọn vẹn
Bước 4: Khoá ẩm bằng kem dưỡng để niêm phong dưỡng chất
Bước 5: Ban ngày nhớ thoa kem chống nắng - Vitamin C thích ánh sáng, nhưng da thì không

💡 Lưu ý nhỏ: - Da nhạy cảm nên dùng cách ngày, 3-4 lần mỗi tuần rồi tăng dần - Tránh thoa lên vùng da có vết thương hở - Đang dùng AHA BHA Retinol thì tách buổi hoặc dùng xen kẽ để da không bị quá tải

✨ HƯỚNG DẪN BẢO QUẢN
- Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao
- Đậy kín nắp ngay sau khi sử dụng để giữ Vitamin C không bị oxy hoá
- Để xa tầm tay trẻ em
- Ngưng dùng và rửa sạch với nước nếu xuất hiện dấu hiệu khó chịu`,
    category: 'Serum / Tinh chất đặc trị',
    image: '/products/TCDT.1.jpeg',
    images: '/products/TCDT.1.jpeg,/products/TCDT.2.jpeg,/products/TCDT.3.jpeg',
    productId: 'TCDT',
    shortName: 'Serum Trắng Da Vitamin C GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/3g1fUbPCLo',
    tiktokUrl: 'https://vt.tiktok.com/ZS965w2aKVj2N-DJyVX/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Dưỡng trắng và sáng đều màu da an toàn với dẫn xuất Vitamin C (SAP) dịu nhẹ",
      "Chống oxy hóa vượt trội và làm mờ thâm sạm nhờ bộ đôi Vitamin C & Vitamin E",
      "Làm dịu nhanh tình trạng mẩn đỏ, phục hồi da khỏe từ tinh chất Tắc Biển",
      "Kiềm dầu thừa, dưỡng ẩm sâu và làm mịn bề mặt da với Niacinamide & HA"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 996,
    sku: 'KDNTTU',
    brand: 'GC Nature',
    name: 'Kem Dưỡng Nâng Tone MOISTURE TONE UP CREAM GC NATURE Bật Tông Tự Nhiên Thay Thế Kem Lót Hàn Quốc',
    price: 273000,
    originalPrice: 390000,
    description: `Kem Dưỡng Nâng Tone GC NATURE MOISTURE TONE UP CREAM Bật Tông Tự Nhiên Thay Thế Kem Lót

✨ Vì sao bạn sẽ thích?
Vừa dưỡng ẩm sâu, vừa nâng tone tức thì cho làn da sáng mịn tự nhiên như vừa ngủ đủ giấc. Chất kem mỏng nhẹ, thấm nhanh, không bết dính, có thể dùng thay kem lót để lớp trang điểm bám lâu và mượt hơn. Phù hợp cho nàng bận rộn, muốn ra đường nhanh mà vẫn rạng rỡ.

✨ ƯU ĐIỂM NỔI BẬT
- Nâng tông tự nhiên, không trắng bệch, không lộ mảng
- Cấp ẩm chuyên sâu nhờ Hyaluronic Acid, Glycerin, DNA cá hồi
- Làm sáng và đều màu da với Niacinamide, Glutathione, Vitamin C
- Hỗ trợ chống nắng nhẹ với Titanium Dioxide, Zinc Oxide
- Làm dịu da nhạy cảm nhờ chiết xuất rau má Centella Asiatica, cam thảo, hoa cúc
- Chống oxy hóa với Vitamin E, Adenosine giúp da căng mịn
- Kết cấu mỏng nhẹ, thay thế hoàn hảo cho kem lót
- Hương thơm dịu, dễ chịu

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
- DNA cá hồi Salmon DNA: phục hồi, cấp ẩm sâu, làm da căng bóng
- Niacinamide và Glutathione: làm sáng, mờ thâm, đều màu da
- Sodium Hyaluronate: giữ ẩm, da mềm mịn cả ngày
- Titanium Dioxide và Zinc Oxide: nâng tông, chống nắng vật lý
- Centella Asiatica rau má: làm dịu, giảm kích ứng
- Chiết xuất lựu, dâu tằm, bạch quả, cam thảo, trà xanh: chống oxy hóa, dưỡng da khỏe
- Vitamin C Ascorbic Acid và Vitamin E Tocopherol: sáng da, chống lão hóa
- Adenosine: giảm dấu hiệu lão hóa, da săn chắc
- Cyclopentasiloxane, Beeswax: tạo lớp màng mịn, nâng tông tự nhiên

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Làm sạch da, dùng toner cân bằng độ ẩm
Bước 2: Lấy lượng vừa đủ cỡ hạt đậu
Bước 3: Chấm 5 điểm lên trán, mũi, cằm, hai má
Bước 4: Tán đều theo chiều từ trong ra ngoài, vỗ nhẹ để kem thấm
Bước 5: Có thể dùng thay kem lót trước khi đánh nền

👉 Dùng được sáng và tối, kết hợp kem chống nắng khi ra ngoài.

✨ HƯỚNG DẪN BẢO QUẢN
- Đậy kín nắp sau khi sử dụng
- Bảo quản nơi khô thoáng, tránh ánh nắng trực tiếp
- Nhiệt độ lý tưởng: dưới 30 độ C
- Tránh để gần nguồn nhiệt hoặc nơi ẩm ướt
- Dùng tốt nhất trong 12 tháng sau khi mở nắp`,
    category: 'Toner / Nước hoa hồng',
    image: '/products/KDNTTU.1.png',
    images: '/products/KDNTTU.1.png,/products/KDNTTU.2.png,/products/KDNTTU.3.png,/products/KDNTTU.4.png,/products/KDNTTU.5.png,/products/KDNTTU.6.png,/products/KDNTTU.7.png,/products/KDNTTU.8.png,/products/KDNTTU.9.png',
    productId: 'KDNTTU',
    shortName: 'Kem Dưỡng Nâng Tone GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/6Aj0UM08kC',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wJBTjNSV-W6mLu/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Nâng tông tự nhiên, không lộ mảng trắng, có thể thay thế cho kem lót trang điểm",
      "Cấp ẩm chuyên sâu từ bên trong với DNA cá hồi, Hyaluronic Acid & Glycerin",
      "Dưỡng da sáng khỏe, mờ thâm sạm nhờ hoạt chất Niacinamide & Glutathione",
      "Chống oxy hóa mạnh mẽ và làm dịu kích ứng da với chiết xuất Rau Má & Trà Xanh"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 995,
    sku: 'MMC',
    brand: 'GC Nature',
    name: 'Mặt Nạ Tinh Chất Phục Hồi & Làm Dịu Da Chuyên Sâu SKIN BALANCING CICA COMPLEX SERUM MASK GC NATURE Hàn Quốc',
    price: 224000,
    originalPrice: 320000,
    description: `Mặt Nạ Tinh Chất Phục Hồi & Làm Dịu Da Chuyên Sâu GC NATURE SKIN BALANCING CICA COMPLEX SERUM MASK

✨ Vì sao bạn sẽ thích?
Làn da đang khô căng, mẩn đỏ, mệt mỏi sau một ngày dài tiếp xúc nắng, bụi và máy lạnh? GC NATURE Cica Complex Serum Mask chính là "miếng dán cứu nguy" bạn cần. Mỗi miếng mặt nạ thấm đẫm 23g tinh chất Cica giàu dưỡng chất, ôm sát từng đường nét gương mặt, mang lại cảm giác mát dịu tức thì và làn da căng mọng, mềm mại chỉ sau 15 phút thư giãn.

✨ ƯU ĐIỂM NỔI BẬT
- Làm sáng đều màu da, mờ thâm sạm, se khít lỗ chân lông nhờ Niacinamide 2% hỗ trợ
- Làm dịu da nhạy cảm, đỏ rát hiệu quả bằng bộ tứ Cica chuẩn Hàn Asiaticoside, Madecassoside, Madecassic Acid, Asiatic Acid
- Cấp ẩm sâu, khóa ẩm bền lâu nhờ Glycerin 12%, Sodium Hyaluronate và Beta-Glucan
- Nuôi dưỡng da khỏe từ bên trong từ bộ 10+ chiết xuất thực vật Lotus, Aloe Vera, Pumpkin, Pomegranate, Mume...
- Giúp da đàn hồi, phục hồi hàng rào bảo vệ tự nhiên nhờ Adenosine và Panthenol
- Kết cấu serum lỏng nhẹ, thẩm thấu nhanh, không bết dính
- Không cần rửa lại với nước - tiện dụng mọi lúc

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
- Cica Complex Centella Asiatica + Asiaticoside + Madecassoside + Madecassic Acid + Asiatic Acid: làm dịu, giảm kích ứng, củng cố da yếu
- Niacinamide 2%: dưỡng sáng, đều màu da, kiểm soát dầu
- Sodium Hyaluronate + Beta-Glucan + Glycerin: cấp - giữ ẩm đa tầng
- Panthenol B5 và Allantoin: dịu da, làm mềm và phục hồi
- Adenosine: nâng đỡ độ săn chắc, giảm dấu hiệu lão hóa
- Tinh chất hoa và thảo mộc: Hoa Sen, Lựu, Mơ, Bí Đỏ, Lô Hội, Tảo Bẹ Nhật, Xương Rồng, Propolis... nuôi dưỡng da rạng rỡ

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Làm sạch da và cân bằng bằng toner
Bước 2: Mở gói, đắp mặt nạ lên mặt, vuốt nhẹ cho ôm sát da
Bước 3: Thư giãn 15-20 phút, gỡ mặt nạ ra
Bước 4: Vỗ nhẹ lượng tinh chất còn lại để da hấp thu hoàn toàn
- Không cần rửa lại với nước. Dùng 2-3 lần/tuần để có hiệu quả tốt nhất.

✨ HƯỚNG DẪN BẢO QUẢN
Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao. Dùng ngay sau khi mở gói. Bảo quản trong ngăn mát tủ lạnh để có cảm giác mát dịu hơn khi sử dụng.`,
    category: 'Mặt nạ (Giấy/Đất sét/Ngủ)',
    image: '/products/MMC.1.jpeg',
    images: '/products/MMC.1.jpeg,/products/MMC.2.jpeg,/products/MMC.3.jpeg,/products/MMC.4.jpeg,/products/MMC.5.jpeg,/products/MMC.6.jpeg,/products/MMC.7.jpeg,/products/MMC.8.jpeg,/products/MMC.9.jpeg',
    productId: 'MMC',
    shortName: 'Mặt Nạ Cica GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/4Axw6ioSg0',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wkdNPMrW-ko6DG/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Làm dịu tức thì tình trạng da khô ráp, kích ứng đỏ rát với bộ tứ Cica cô đặc",
      "Nuôi dưỡng da sáng khỏe, mờ thâm sạm và se khít lỗ chân lông từ Niacinamide 2%",
      "Cấp ẩm sâu đa tầng nhờ Glycerin 12%, Sodium Hyaluronate & Beta-Glucan",
      "Tinh chất thảo mộc đa dạng giúp da khỏe mạnh, phục hồi hàng rào ẩm tự nhiên"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 994,
    sku: 'MMH',
    brand: 'GC Nature',
    name: 'Mặt nạ Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC SERUM MASK GC NATURE Hàn Quốc',
    price: 224000,
    originalPrice: 320000,
    description: `Mặt Nạ Tinh Chất Cấp Ẩm Chuyên Sâu GC NATURE SKIN BALANCING HYALURONIC SERUM MASK

✨ Vì sao bạn sẽ thích?
Làn da đang khô căng, mất nước, mệt mỏi sau một ngày dài tiếp xúc nắng, bụi và máy lạnh? GC NATURE HYALURONIC Serum Mask chính là "miếng dán cứu nguy" bạn cần. Mỗi miếng mặt nạ thấm đẫm 23g tinh chất Hyaluronic Acid giàu dưỡng chất, ôm sát từng đường nét gương mặt, mang lại cảm giác mát dịu tức thì và làn da căng mọng, mềm mại chỉ sau 15 phút thư giãn.

✨ ƯU ĐIỂM NỔI BẬT
- Cấp nước đa tầng, da căng bóng tức thì nhờ 8 dạng Hyaluronic Acid
- Làm sáng đều màu, mờ vết thâm sạm nhờ Niacinamide
- Làm dịu da nhạy cảm, giảm mẩn đỏ nhờ Panthenol và Allantoin
- Phục hồi, làm mềm mượt bề mặt da nhờ tinh chất Ốc Sên Hàn Quốc Snail Filtrate
- Tăng độ đàn hồi, ngăn ngừa lão hoá sớm nhờ Beta-Glucan và Adenosine
- Nuôi dưỡng da từ sâu bên trong bởi 7 chiết xuất thảo dược Hàn sắn dây, cỏ ba lá, lựu, đương quy...
- Kết cấu lỏng nhẹ, thấm nhanh, không nhờn rít - phù hợp mọi loại da, kể cả da dầu mụn
- Không cần rửa lại với nước - tiện dụng mọi lúc

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
- 8 dạng Hyaluronic Acid: cấp nước đa tầng, dưỡng ẩm sâu, cho da căng bóng tức thì
- Niacinamide: dưỡng sáng, đều màu da, hỗ trợ se khít lỗ chân lông
- Panthenol B5 và Allantoin: làm dịu, giảm mẩn đỏ, phục hồi hàng rào bảo vệ da
- Tinh chất Ốc sên Snail Filtrate: làm mềm mượt da, phục hồi tế bào yếu tổn thương
- Beta-Glucan và Adenosine: tăng độ đàn hồi, chống lão hóa sớm, săn chắc da
- 7 chiết xuất thảo dược Hàn sắn dây, cỏ ba lá, lựu, đương quy...: nuôi dưỡng da khỏe mạnh rạng rỡ

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Làm sạch da và cân bằng bằng toner
Bước 2: Mở gói, đắp mặt nạ lên mặt, vuốt nhẹ cho ôm sát da
Bước 3: Thư giãn 15-20 phút, gỡ mặt nạ ra
Bước 4: Vỗ nhẹ lượng tinh chất còn lại để da hấp thu hoàn toàn
- Không cần rửa lại với nước. Dùng 2-3 lần/tuần để có hiệu quả tốt nhất.

✨ HƯỚNG DẪN BẢO QUẢN
Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao. Dùng ngay sau khi mở gói. Bảo quản trong ngăn mát tủ lạnh để có cảm giác mát dịu hơn khi sử dụng.`,
    category: 'Mặt nạ (Giấy/Đất sét/Ngủ)',
    image: '/products/MMH.1.jpeg',
    images: '/products/MMH.1.jpeg,/products/MMH.2.jpeg,/products/MMH.3.jpeg,/products/MMH.4.jpeg,/products/MMH.5.jpeg',
    productId: 'MMH',
    shortName: 'Mặt Nạ Cấp Ẩm Hyaluronic GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/50X39U7Cnj',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wX8LSxdN-K0FKT/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Cấp ẩm chuyên sâu đa tầng tức thì nhờ chứa 8 dạng Hyaluronic Acid khác nhau",
      "Phục hồi hàng rào ẩm và làm dịu kích ứng nhạy cảm từ Panthenol & Allantoin",
      "Tăng cường độ đàn hồi và làm mượt bề mặt da với dịch lọc Ốc Sên cô đặc",
      "Dưỡng sáng mịn màng da và hỗ trợ thu nhỏ lỗ chân lông hiệu quả nhờ Niacinamide"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 993,
    sku: 'MVC',
    brand: 'GC Nature',
    name: 'Mặt nạ Dưỡng Trắng DA VITAMIN-C SERUM MASK GC NATURE Hàn Quốc',
    price: 224000,
    originalPrice: 320000,
    description: `Mặt Nạ Tinh Chất Dưỡng Trắng DA GC NATURE SKIN BALANCING VITAMIN-C SERUM MASK

✨ Vì sao bạn sẽ thích?
Làn da đang xỉn màu, nhiều đốm thâm mụn, tone da không đều và thiếu sức sống? GC NATURE VITAMIN-C Serum Mask chính là "miếng dán cứu nguy" bạn cần. Mỗi miếng mặt nạ thấm đẫm 23g tinh chất Vitamin C và Vitamin E giàu dưỡng chất, ôm sát từng đường nét gương mặt, mang lại cảm giác tươi mát tức thì và làn da sáng hồng, mềm mại chỉ sau 15 phút thư giãn.

✨ ƯU ĐIỂM NỔI BẬT
- Da sáng đều màu một cách an toàn nhờ Sodium Ascorbyl Phosphate SAP - dẫn xuất Vitamin C bền vững, dịu nhẹ
- Chống oxy hoá và mờ thâm sạm nhờ Tocopherol Vitamin E - bộ đôi song kiếm hợp bích cùng Vitamin C
- Làm dịu da đỏ và phục hồi da khoẻ từ tinh dầu Tắc Biển Sea Buckthorn giàu vitamin tự nhiên
- Làm sáng, kiềm dầu, dưỡng ẩm và nuôi dưỡng da mềm mịn từ Niacinamide và Panthenol
- Cấp ẩm tức thì, giữ da căng mọng suốt ngày dài từ Hyaluronic Acid
- Kết cấu lỏng nhẹ, thấm nhanh, không bết dính - phù hợp mọi loại da, kể cả da dầu mụn
- Không cần rửa lại với nước - tiện dụng mọi lúc

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
- Sodium Ascorbyl Phosphate SAP dẫn xuất Vitamin C: dưỡng trắng da an toàn, bền vững, mờ vết thâm mụn hiệu quả
- Tocopherol Vitamin E và Tinh dầu Tắc Biển Sea Buckthorn: chống oxy hóa mạnh mẽ, giảm sạm nám, dưỡng da khỏe mạnh
- Niacinamide và Panthenol B5: làm sáng da, kiểm soát dầu thừa, dưỡng ẩm và làm dịu da nhạy cảm
- Sodium Hyaluronate: cấp ẩm sâu đa tầng, giữ nước cho làn da căng mọng mịn màng
- Adenosine và Allantoin: chống lão hóa sớm, tăng độ đàn hồi, làm mềm mịn bề mặt da

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Làm sạch da và cân bằng bằng toner
Bước 2: Mở gói, đắp mặt nạ lên mặt, vuốt nhẹ cho ôm sát da
Bước 3: Thư giãn 15-20 phút, gỡ mặt nạ ra
Bước 4: Vỗ nhẹ lượng tinh chất còn lại để da hấp thu hoàn toàn
- Không cần rửa lại với nước. Dùng 2-3 lần/tuần để có hiệu quả tốt nhất.

✨ HƯỚNG DẪN BẢO QUẢN
Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao. Dùng ngay sau khi mở gói. Bảo quản trong ngăn mát tủ lạnh để có cảm giác mát dịu hơn khi sử dụng.`,
    category: 'Mặt nạ (Giấy/Đất sét/Ngủ)',
    image: '/products/MVC.1.jpeg',
    images: '/products/MVC.1.jpeg,/products/MVC.2.jpeg,/products/MVC.3.jpeg,/products/MVC.4.jpeg,/products/MVC.5.jpeg',
    productId: 'MVC',
    shortName: 'Mặt Nạ Vitamin C GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: '',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wn6HF8mW-8kJM9/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Dưỡng da trắng sáng và đều màu an toàn từ dẫn xuất Vitamin C (SAP) dịu nhẹ",
      "Mờ vết thâm sạm và chống oxy hóa vượt trội cùng bộ đôi Vitamin C & Vitamin E",
      "Làm dịu da và nuôi dưỡng da khỏe từ tinh dầu Tắc Biển Sea Buckthorn giàu vitamin",
      "Cấp nước giữ ẩm sâu và kiểm soát dầu thừa hiệu quả nhờ Niacinamide & HA"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 992,
    sku: 'TCDD',
    brand: 'GC Nature',
    name: 'Tinh Chất Dưỡng Trắng Mịn Da SPI-PDRN AMPOULE GC NATURE Tăng Cường Độ Đàn Hồi Cho Làn Da Hàn Quốc',
    price: 980000,
    originalPrice: 1400000,
    description: `Tinh Chất Dưỡng Trắng Mịn Da SPI-PDRN AMPOULE GC NATURE Tăng Cường Độ Đàn Hồi Cho Làn Da

✨ Vì sao bạn sẽ thích?
Bạn đang tìm kiếm một sản phẩm tinh chất đa năng giúp cải thiện tình trạng da xỉn màu, thiếu sức sống và bắt đầu xuất hiện những rãnh nhăn li ti? GC Nature Spi-Pdrn Ampoule chính là chìa khóa giúp bạn đánh thức vẻ đẹp rạng rỡ của làn da. Với công thức dưỡng da chuyên sâu, sản phẩm không chỉ cung cấp độ ẩm tức thì mà còn hỗ trợ làm sáng da và củng cố độ đàn hồi, mang lại vẻ ngoài trẻ trung, mịn màng và tràn đầy sức sống.

✨ Ưu điểm nổi bật
- Sáng tông da, cải thiện tình trạng da không đều màu. Với công thức tập trung giúp dưỡng da chuyên sâu
- Tăng cường độ đàn hồi: Hỗ trợ nuôi dưỡng làn da săn chắc, giúp bề mặt da trở nên mịn màng và tươi trẻ hơn
- Không gây nhờn rít hay cảm giác nặng mặt với kết cấu thẩm thấu tối ưu: Tinh chất dạng Ampoule cô đặc nhưng dễ dàng hấp thụ sâu vào da
- Phù hợp cho mọi loại da: Công thức dịu nhẹ, hỗ trợ tái tạo vẻ đẹp tự nhiên của da mà không gây bít tắc lỗ chân lông

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ Thành phần chính
- Hoạt chất dưỡng trắng: Hỗ trợ làm sáng da, giúp mờ dần các vùng da sạm màu
- Hoạt chất tăng cường đàn hồi PDRN: Nuôi dưỡng da từ sâu bên trong, hỗ trợ làm giảm các dấu hiệu lão hóa sớm
- Phức hợp dưỡng ẩm: Giúp cấp nước, khóa ẩm, duy trì làn da luôn mềm mại và căng bóng suốt ngày dài
- Các chiết xuất thiên nhiên: Cung cấp nguồn dưỡng chất dồi dào, giúp da thư giãn và phục hồi sức sống

✨ Hướng dẫn sử dụng
Đối tượng phù hợp: Mọi loại da, đặc biệt là da xỉn màu, da có dấu hiệu lão hóa sớm, da khô hoặc da mất đi độ đàn hồi tự nhiên.
Cách dùng:
Bước 1: Sau khi làm sạch da và dùng nước hoa hồng toner, lấy một lượng tinh chất vừa đủ ra lòng bàn tay hoặc nhỏ trực tiếp lên mặt.
Bước 2: Thoa đều tinh chất khắp khuôn mặt và vùng cổ.
Bước 3: Nhẹ nhàng massage và vỗ nhẹ bằng các đầu ngón tay để dưỡng chất thẩm thấu sâu vào da.

✨ Hướng dẫn bảo quản
- Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp hoặc nơi có nhiệt độ cao.
- Đậy kín nắp sau khi sử dụng để giữ chất lượng sản phẩm.
- Để xa tầm tay trẻ em.`,
    category: 'Ampoule / Siêu tinh chất',
    image: '/products/TCDD.1.jpeg',
    images: '/products/TCDD.1.jpeg,/products/TCDD.2.jpeg,/products/TCDD.3.jpeg,/products/TCDD.4.jpeg',
    productId: 'TCDD',
    shortName: 'Tinh Chất PDRN GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/5q6A98MRpB',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wuT7WdGc-IiXG1/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Dưỡng trắng da chuyên sâu, cải thiện tình trạng da sạm màu và không đều màu",
      "Tái tạo độ đàn hồi và săn chắc cho da với hoạt chất sinh học SPI-PDRN độc đáo",
      "Thẩm thấu tối ưu, không gây nhờn rít hay cảm giác nặng nề trên gương mặt",
      "Chiết xuất thiên nhiên phong phú nuôi dưỡng da khỏe mạnh và giảm nếp nhăn"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 991,
    sku: 'TCTT',
    brand: 'MEDIORGA',
    name: 'Tinh Chất Tái Tạo & Dưỡng Trắng Da Chuyên Sâu MEDI - PDRN WHITE AMPOULE SHOT GC NATURE Hàn Quốc',
    price: 1295000,
    originalPrice: 1850000,
    description: `Tinh Chất Tái Tạo Dưỡng Trắng Da Chuyên Sâu MEDI - PDRN WHITE AMPOULE SHOT GC NATURE Hàn Quốc - Đánh Thức Làn Da Trắng Mịn, Căng Mọng Từ Sâu Bên Trong

✨ Vì sao bạn sẽ thích?
Bạn đang mệt mỏi vì làn da xỉn màu, kém sức sống và ngày càng xuất hiện nhiều nếp nhăn li ti, vùng da kém đều màu sau những ngày dài tiếp xúc nắng, ô nhiễm và căng thẳng? GC Nature Medi-PDRN White Ampoule Shot chính là liều dưỡng cô đặc giúp bạn lấy lại vẻ đẹp rạng rỡ vốn có. Với công thức Ampoule chuyên sâu kết hợp tinh chất DNA từ cá hồi cùng chuỗi peptide quý giá, sản phẩm cấp ẩm tức thì, hỗ trợ làm sáng da và nâng cao độ đàn hồi, mang đến làn da mịn màng, căng bóng và tràn đầy sức sống chỉ sau vài tuần sử dụng đều đặn.

✨ Ưu điểm nổi bật
- Dưỡng trắng chuyên sâu, đều màu da: Bộ đôi Niacinamide 2% kết hợp các chiết xuất quý giúp làm sáng tông da tự nhiên, hỗ trợ mờ dần các vùng da sạm màu, mang lại vẻ ngoài rạng rỡ
- Tái tạo và phục hồi từ sâu bên trong: Tinh chất DNA chiết xuất từ cá hồi cùng Peptide cao cấp nuôi dưỡng làn da khỏe khoắn, hỗ trợ làm dịu các dấu hiệu lão hóa sớm như nếp nhăn, da chùng nhão
- Tăng cường độ đàn hồi, săn chắc da: Adenosine kết hợp cùng phức hợp tế bào gốc thực vật Nhân Sâm, Hoa Hồng Damascena, Nho giúp da săn chắc, mịn màng và tươi trẻ hơn từng ngày
- Cấp ẩm sâu, khóa ẩm bền lâu: Sodium Hyaluronate, Squalane, Ceramide NP cùng Glycerin tạo nên màng ẩm đa tầng, giúp da căng mọng suốt ngày dài mà không bí bách
- Kết cấu Ampoule cô đặc nhưng thẩm thấu nhanh: Không nhờn rít, không gây nặng mặt, dễ dàng lan đều trên da và phù hợp cho cả lớp dưỡng ban ngày lẫn ban đêm
- Phù hợp cho mọi loại da: Công thức dịu nhẹ, không cồn khô, lành tính cho cả làn da nhạy cảm

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ Thành phần chính
- Hoạt chất tái tạo cao cấp DNA - Salmon, Peptide, Hydrolyzed Placental Extract: Hỗ trợ phục hồi cấu trúc da, làm chậm dấu hiệu lão hóa, mang lại làn da mịn màng và tươi trẻ
- Hoạt chất dưỡng trắng Niacinamide 2%, chiết xuất Cam Thảo, Dâu Tằm, Mẫu Đơn: Làm sáng tông da, hỗ trợ làm mờ dần các vùng da sạm và giúp da đều màu hơn
- Phức hợp tế bào gốc thực vật Nhân Sâm, Hoa Hồng Damascena, Nho, Salicornia: Nuôi dưỡng da từ sâu bên trong, tăng cường sức sống và độ đàn hồi cho làn da
- Phức hợp dưỡng ẩm chuyên sâu Sodium Hyaluronate, Ceramide NP, Squalane, Glycerin, Betaine: Cấp - khóa ẩm đa tầng, duy trì làn da mềm mại, căng bóng suốt cả ngày
- Tinh chất thiên nhiên dịu da Rau Má, Lô Hội, Trà Xanh, Hoa Nhài, Hoa Oải Hương, Tràm Trà: Làm dịu da, mang lại cảm giác thư giãn và nâng đỡ vẻ đẹp tự nhiên

✨ Hướng dẫn sử dụng
Đối tượng phù hợp: Mọi loại da, đặc biệt là da xỉn màu, da không đều màu, da khô, da có dấu hiệu lão hóa sớm hoặc da đang cần phục hồi sau những tổn thương do nắng và môi trường.
Cách dùng:
Bước 1: Sau khi làm sạch da và dùng nước hoa hồng toner, lấy 4-5 giọt tinh chất ra lòng bàn tay hoặc nhỏ trực tiếp lên mặt.
Bước 2: Thoa đều tinh chất khắp khuôn mặt và vùng cổ, tránh vùng mắt.
Bước 3: Vỗ nhẹ bằng các đầu ngón tay để dưỡng chất thẩm thấu sâu vào da.
Bước 4: Tiếp tục các bước dưỡng tiếp theo kem dưỡng, kem chống nắng vào ban ngày. Sử dụng 1-2 lần ngày sáng và tối để đạt hiệu quả tối ưu.

✨ Hướng dẫn bảo quản
- Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp hoặc nơi có nhiệt độ cao.
- Đậy kín nắp sau khi sử dụng để giữ trọn vẹn dưỡng chất.
- Để xa tầm tay trẻ em.`,
    category: 'Ampoule / Siêu tinh chất',
    image: '/products/TCTT.1.jpeg',
    images: '/products/TCTT.1.jpeg,/products/TCTT.2.jpeg,/products/TCTT.3.jpeg,/products/TCTT.4.jpeg,/products/TCTT.5.jpeg',
    productId: 'TCTT',
    shortName: 'Tinh Chất Medi-PDRN GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/9AMc7IUfpv',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wuc8tUVW-7PdBl/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Dưỡng da trắng hồng rạng rỡ và làm đều màu da chuyên sâu nhờ Niacinamide 2%",
      "Tái tạo và phục hồi tế bào da từ sâu bên trong bằng tinh chất DNA cá hồi cao cấp",
      "Nâng cơ trẻ hóa, săn chắc da với phức hợp tế bào gốc thực vật quý hiếm",
      "Cấp và giữ nước đa tầng ưu việt với Ceramide NP, Squalane & Hyaluronic Acid"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 990,
    sku: 'TCTCT',
    brand: 'MEDIORGA',
    name: 'Tinh Chất Tăng Cường Tái Tạo & Phục Hồi Da MEDI - PDRN SKIN BOOSTER AMPOULE GC NATURE Hàn Quốc',
    price: 682500,
    originalPrice: 975000,
    description: `Tinh Chất Tăng Cường Tái Tạo & Phục Hồi Da MEDI - PDRN SKIN BOOSTER AMPOULE GC NATURE Hàn Quốc

✨ Vì sao bạn sẽ thích?
Tinh chất ampoule cô đặc với bộ đôi quyền lực PDRN Sodium DNA từ tinh trùng cá hồi kết hợp Salmon Egg Extract, mang công nghệ skin booster đình đám Hàn Quốc về đến từng bước skincare hằng ngày. Làn da được nâng niu sâu, đầy sức sống, căng mịn và rạng rỡ tự nhiên.
- Bảng thành phần đa tầng với hơn 90 hoạt chất quý: PDRN, Salmon Egg, 3 loại Collagen, 20+ Peptide Copper Tripeptide-1, Acetyl Hexapeptide-8, Palmitoyl Pentapeptide-4..., Niacinamide, Retinol, Adenosine, Panthenol, Allantoin, Squalane, Hyaluronic Acid đa phân tử và phức hợp Vitamin A, B, C, E.
- Đậm đặc 64,95% nước Rau Má Centella Asiatica dịu nhẹ, làm dịu da nhạy cảm, hỗ trợ phục hồi hàng rào bảo vệ.
- Kết cấu ampoule thẩm thấu nhanh, không bết dính, dùng được cho mọi loại da kể cả da dầu mụn.

✨ ƯU ĐIỂM NỔI BẬT
- PDRN Skin Booster giúp tăng sinh, tái tạo tế bào, làm dày khoẻ làn da mỏng yếu
- Bộ ba Collagen + Peptide nâng tone, làm mờ vết nhăn nhỏ, da săn chắc đàn hồi
- Niacinamide + Sodium Ascorbyl Phosphate làm sáng đều màu, mờ thâm sạm, đốm nâu
- Hyaluronic Acid 6 phân tử cấp ẩm chuyên sâu, da căng bóng glass-skin
- Cica + Allantoin + Panthenol làm dịu mẩn đỏ, kích ứng, da sau mụn
- Lên makeup mượt mà, da bắt sáng tự nhiên ngay sau 1 lần dùng

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네i처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
- PDRN Sodium DNA từ tinh trùng cá hồi, Salmon Egg Extract: tái tạo, phục hồi da chuyên sâu
- Centella Asiatica Leaf Water 64,95%: làm dịu, phục hồi da nhạy cảm
- Niacinamide, Sodium Ascorbyl Phosphate: dưỡng sáng da, mờ thâm
- 3 loại Collagen + 20+ Peptide cao cấp: giúp da săn chắc, đàn hồi tốt
- Adenosine, Retinol, Panthenol, Allantoin, Squalane: chống lão hoá sớm, nuôi dưỡng sâu
- Hyaluronic Acid đa phân tử: cấp ẩm, khoá nước hiệu quả
- Phức hợp Vitamin: dưỡng da khoẻ từ sâu bên trong
- Chiết xuất thảo dược Hàn Quốc: Hoàng liên, Bách Nhật, Liễu trắng, Quế, Húng quế, Bạch truật

✨ HƯỚNG DẪN SỬ DỤNG
- Sau bước toner, lấy 2-3 giọt ampoule ra lòng bàn tay hoặc trực tiếp lên da.
- Vỗ nhẹ đều khắp mặt và cổ, massage đến khi tinh chất thấm hoàn toàn.
- Tiếp tục các bước serum/kem dưỡng. Dùng 2 lần ngày sáng - tối để cảm nhận hiệu quả tối ưu.

✨ HƯỚNG DẪN BẢO QUẢN
Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao. Đậy kín nắp sau khi sử dụng. Tránh xa tầm tay trẻ em.`,
    category: 'Ampoule / Siêu tinh chất',
    image: '/products/TCTCT.1.jpeg',
    images: '/products/TCTCT.1.jpeg,/products/TCTCT.2.jpeg,/products/TCTCT.3.jpeg,/products/TCTCT.4.jpeg',
    productId: 'TCTCT',
    shortName: 'Tinh Chất Skin Booster GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/AAF9JAD8Pz',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wNPgTTkT-YaTwW/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Tăng sinh và tái tạo tế bào da mỏng yếu cực tốt nhờ PDRN & Salmon Egg",
      "Da săn chắc, đàn hồi và mờ nếp nhăn nhỏ với bộ ba Collagen & Peptide",
      "Dưỡng da sáng hồng, đều màu da hiệu quả cùng Niacinamide & Vitamin C (SAP)",
      "Làm dịu da mẩn đỏ tức thì nhờ chứa tới 64.95% chiết xuất nước lá Rau Má"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 989,
    sku: 'GGC',
    brand: 'GC Nature',
    name: 'Gel Body Săn Chắc & Định Hình Vóc Dáng Balance Active PPC Body Gel GC Nature Hàn Quốc',
    price: 315000,
    originalPrice: 450000,
    description: `Gel Săn Chắc & Định Hình Vóc Dáng GC Nature Balance Active PPC Body Gel (150ml)

✨ Vì sao bạn sẽ thích?
Bạn đang tìm kiếm một giải pháp hỗ trợ vóc dáng tại nhà, an toàn và tiện lợi? GC Nature Balance Active PPC Body Gel là sản phẩm lý tưởng giúp bạn chăm sóc những vùng cơ thể khó chiều như vùng bụng, đùi, bắp tay.

✨ ƯU ĐIỂM NỔI BẬT
- Săn chắc và Định hình Firm & Defined: Hỗ trợ cải thiện độ đàn hồi cho da, giúp các vùng da chùng nhão trở nên săn chắc và gọn gàng hơn
- Giảm tình trạng da sần sùi, kém sắc
- Làm mịn da Smooth: Cung cấp độ ẩm cần thiết giúp bề mặt da luôn mềm mại
- Hỗ trợ quy trình chăm sóc vóc dáng, tạo cảm giác tự tin hơn khi diện trang phục ôm sát
- Thẩm thấu nhanh: Chất gel mỏng nhẹ, không gây bết dính, phù hợp sử dụng hàng ngày hoặc kết hợp trong các liệu trình massage body

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
- PPC Phosphatidylcholine: giúp hỗ trợ cải thiện độ đàn hồi và cấu trúc bề mặt da
- Các dưỡng chất thực vật: Giúp làm dịu và nuôi dưỡng làn da khỏe mạnh

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Vệ sinh sạch sẽ vùng da cần chăm sóc bụng, đùi, bắp tay... và lau khô.
Bước 2: Lấy một lượng gel vừa đủ ra lòng bàn tay.
Bước 3: Thoa đều lên vùng da mục tiêu, kết hợp massage theo chuyển động tròn hoặc vuốt ngược từ dưới lên trên cho đến khi gel thẩm thấu hoàn toàn.
Bước 4: Để đạt hiệu quả tốt nhất, nên sử dụng đều đặn 1-2 lần ngày sáng và tối.

✨ HƯỚNG DẪN BẢO QUẢN
- Kết hợp vận động: Sản phẩm đạt hiệu quả tối ưu nhất khi kết hợp với chế độ ăn uống khoa học và luyện tập thể dục thể thao đều đặn.
- Cảm giác trên da: Sản phẩm có thể gây cảm giác mát lạnh hoặc nóng nhẹ tùy thuộc vào cơ chế hoạt động của hoạt chất trên da đây là hiện tượng bình thường.
- Bảo quản: Để nơi khô ráo, thoáng mát, tránh ánh nắng mặt trời trực tiếp. Đậy kín nắp sau khi sử dụng.
- Đối tượng: Không dùng cho vùng da có vết thương hở hoặc người mẫn cảm với bất kỳ thành phần nào của sản phẩm.`,
    category: 'Giảm mỡ thon gọn',
    image: '/products/GGC.1.jpeg',
    images: '/products/GGC.1.jpeg,/products/GGC.2.jpeg,/products/GGC.3.jpeg',
    productId: 'GGC',
    shortName: 'Gel Body Săn Chắc GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/6ffHD8ctNf',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wyxtscXH-gRPGC/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Hỗ trợ cải thiện độ đàn hồi, giúp săn chắc vùng da chùng nhão hiệu quả",
      "Hoạt chất PPC (Phosphatidylcholine) cải thiện cấu trúc bề mặt da mịn màng",
      "Giảm thiểu tình trạng da sần sùi (cellulite), cấp ẩm nuôi dưỡng sâu",
      "Chất gel mỏng nhẹ, thẩm thấu nhanh, không bết dính, tiện dụng massage body"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 990,
    sku: 'TCVKTT',
    brand: 'GC Nature',
    name: 'Kit SPA Tinh Chất Vi Kim Tái Tạo Da Chuyên Sâu GC NATURE SPI-MEDI PDRN MINI KIT Se Khít Lỗ Chân Lông Hàn Quốc',
    price: 437500,
    originalPrice: 625000,
    description: `Kit Tinh Chất Vi Kim Tái Tạo Da Chuyên Sâu GC NATURE SPI-MEDI PDRN MINI KIT Se Khít Lỗ Chân Lông Hàn Quốc

✨ Vì sao bạn sẽ thích?
Bộ kit vi kim tại nhà đến từ GC Nature — kết hợp hoàn hảo giữa Ampoule PDRN cấp ẩm chuyên sâu và Spicule Cream đẩy dưỡng chất thấm sâu vào da. Chỉ cần vài bước đơn giản mỗi tối, lỗ chân lông se khít, da mịn đều, căng bóng và sáng rõ rệt — không cần đến spa, không cần thiết bị phức tạp. Được bảo hộ sáng chế số 10-2333688 tại Hàn Quốc, công thức được kiểm chứng lâm sàng về hiệu quả bảo vệ, nuôi dưỡng và phục hồi da.

✨ ƯU ĐIỂM NỔI BẬT
- Bộ đôi hiệp lực: Ampoule PDRN (8ml) + Spicule Cream (3g) phối hợp — kem vi kim mở đường, ampoule thấm sâu, tối ưu hóa hấp thu dưỡng chất
- PDRN (axit nucleic): cung cấp năng lượng cho tế bào da, hỗ trợ da khoẻ mạnh và săn chắc từ bên trong
- Vi kim Spicule sinh học: kích hoạt bề mặt da, giúp các hoạt chất thấm sâu hiệu quả hơn
- Làm sáng và mờ thâm với Niacinamide hàm lượng cao trong cả hai sản phẩm
- Hỗ trợ giảm nếp nhăn nhỏ — đạt chứng nhận mỹ phẩm chức năng kép Hàn Quốc: Làm sáng và Chống nhăn
- Bộ phức hệ Peptide đa tầng: Copper Tripeptide-1, Acetyl Hexapeptide, Palmitoyl Pentapeptide-4, Palmitoyl Tripeptide-1... kết hợp tăng độ đàn hồi, cải thiện cấu trúc da
- Phức hệ Centel: Asiaticoside, Asiatic Acid, Madecassic Acid, Madecassoside — làm dịu, phục hồi và củng cố hàng rào bảo vệ da
- Hơn 30 chiết xuất thực vật và tế bào gốc: nhân sâm, hoa hồng Damask, nho, mật ong, bơ, dâu tây, cùng hàng loạt chiết xuất hoa và thảo mộc — nuôi dưỡng da toàn diện
- Fullerene (chống oxy hoá mạnh): trung hòa gốc tự do từ tia UV và bụi mịn, bảo vệ da khỏi stress môi trường
- Bảo hộ sáng chế công nghệ số 10-2333688 — Hàn Quốc

✨ THÔNG TIN THƯƠNG HIỆU
GC Nature GC 네이처 là thương hiệu mỹ phẩm đến từ Hàn Quốc, nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Các dòng sản phẩm đã bán chạy TOP đầu tại Hàn Quốc, trên Coupang, Olive Young, TOP tìm kiếm trên Naver, được cộng đồng nghệ sỹ Hàn Quốc dùng và feedback uy tín. Sản phẩm được sản xuất bởi CELLCOCO.CO.LTD, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH

① Ampoule PDRN (8ml)
- PDRN (axit nucleic): nuôi dưỡng và hỗ trợ phục hồi tế bào da
- Niacinamide: làm sáng, mờ thâm, đều tông da
- Squalane, Jojoba Oil, Tocopherol: dưỡng ẩm sâu, chống oxy hóa
- Hơn 20 chiết xuất thực vật và tế bào gốc: nhân sâm, hoa hồng Damask, nho, mật ong, bơ, hoa nhài, oải hương, trà xanh, lô hội

② Spicule Cream (3g)
- Spicule (Hydrolyzed Marine Sponge): vi kim sinh học mở đường thấm dưỡng chất
- Bộ 14 Peptide: Copper Tripeptide-1, Palmitoyl Pentapeptide-4, Acetyl Hexapeptide-8... — săn chắc, chống nhăn
- Phức hệ Centel: Asiaticoside, Asiatic Acid, Madecassoside — phục hồi, làm dịu da
- Fullerene: chống oxy hóa, bảo vệ da khỏi tác hại môi trường
- Propolis, Sialylactose: kháng khuẩn nhẹ, nuôi dưỡng

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Làm sạch da và cân bằng toner như thông thường.
Bước 2: Thoa Spicule Cream lên toàn mặt, vỗ nhẹ đến khi thấm — cảm giác tê râm nhẹ là bình thường.
Bước 3: Sau 2-3 phút, thoa Ampoule PDRN lên toàn mặt, vỗ nhẹ đến khi thấm hoàn toàn.
Bước 4: Khoá ẩm bằng kem dưỡng. Buổi sáng dùng kèm kem chống nắng SPF 30+.
Tần suất: 2-3 lần mỗi tuần hoặc hàng ngày tuỳ độ nhạy cảm của da. Tuần đầu nên thử cách ngày để da thích nghi.

✨ HƯỚNG DẪN BẢO QUẢN
- Để nơi thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao
- Đậy kín nắp sau mỗi lần dùng
- Tránh xa tầm tay trẻ em
- Hạn dùng 36 tháng kể từ NSX, 12 tháng sau khi mở nắp`,
    category: 'Ampoule / Siêu tinh chất',
    image: '/products/TCVKTT.1.jpeg',
    images: '/products/TCVKTT.1.jpeg,/products/TCVKTT.2.jpeg,/products/TCVKTT.3.jpeg,/products/TCVKTT.4.jpeg',
    productId: 'TCVKTT',
    shortName: 'Kit Vi Kim SPI-MEDI PDRN GC NATURE',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://s.shopee.vn/5fmk1KxDOt',
    tiktokUrl: 'https://vt.tiktok.com/ZS965wRK51DRj-ozCeo/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Bộ đôi hiệp lực: Ampoule PDRN (8ml) + Spicule Cream (3g) — vi kim mở đường, tinh chất thấm sâu tối ưu",
      "PDRN (axit nucleic) cung cấp năng lượng tế bào, hỗ trợ da khoẻ mạnh săn chắc từ bên trong",
      "Bộ 14 Peptide đa tầng + Fullerene chống oxy hoá — cải thiện đàn hồi, chống nhăn chuyên sâu",
      "Se khít lỗ chân lông, làm sáng mờ thâm nhờ Niacinamide + Phức hệ Centel phục hồi da"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 991,
    sku: 'KCNCN.SL',
    brand: 'SL LEPORTS',
    name: 'Kem Chống Nắng Nâng Tone SPF 50+ PA++++ WATER-FULL SUN CREAM SL LEPORTS Lâu Trôi Kháng Nước Hàn Quốc',
    price: 294000,
    originalPrice: 420000,
    description: `Kem Chống Nắng Nâng Tone SPF 50+ PA++++ SL LEPORTS WATER-FULL SUN CREAM Lâu Trôi Kháng Nước Hàn Quốc

✨ Vì sao bạn sẽ thích?
Một tuýp kem - nhiều công năng: chống nắng phổ rộng, nâng tone tự nhiên, cấp ẩm mướt mịn và bám lâu suốt ngày dài. Công thức Water-Full giàu nước, mát lạnh tức thì, không bí da, không vệt trắng. Đi biển, chơi thể thao, đi học hay đi làm văn phòng đều dùng được.

✨ ƯU ĐIỂM NỔI BẬT
- Chỉ số chống nắng cao SPF 50+ và PA++++, bảo vệ da khỏi tia UVA - UVB suốt ngày dài
- Giảm kích ứng hiệu quả nhờ kết hợp màng lọc vật lý và hóa học, dịu nhẹ
- Kháng nước - kháng mồ hôi, lâu trôi khi bơi lội, vận động ngoài trời
- Nâng tone tức thì, da sáng tự nhiên, che mờ khuyết điểm nhẹ
- Kết cấu mỏng nhẹ, thẩm thấu nhanh, không bóng dầu, không vón mảng
- Cấp ẩm sâu, làm dịu da nhờ chiết xuất thực vật và dịch lên men

✨ THÔNG TIN THƯƠNG HIỆU
SMILE LEADER là thương hiệu mỹ phẩm đến từ Hàn Quốc, được bão review từ TOP người nổi tiếng Hàn Quốc chia sẻ trên Coupang, Olive Young, TOP tìm kiếm trên Naver. Nổi tiếng với các dòng sản phẩm chăm sóc da chuyên sâu và công nghệ Hàn Quốc hiện đại. Sản phẩm được sản xuất bởi SL Cosmetic Co., Ltd, được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ THÀNH PHẦN CHÍNH
- Bộ lọc UV phổ rộng: Ethylhexyl Methoxycinnamate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Titanium Dioxide, Zinc Oxide, Isoamyl p-Methoxycinnamate, Terephthalylidene Dicamphor Sulfonic Acid (Mexoryl SX)
- Sodium Hyaluronate: cấp và giữ ẩm sâu, da căng mịn
- Lactobacillus/Soybean Ferment Extract: dịch lên men giúp da khỏe, mượt
- Milk Protein Extract: nuôi dưỡng da mềm mại
- Tocopherol và Tocopheryl Acetate (Vitamin E): chống oxy hóa, làm dịu
- Chiết xuất Hinoki, Quế, Oregano, Rau sam, Vỏ liễu trắng, Hoàng cầm: làm dịu da, giảm cảm giác khó chịu do nắng - gió
- Limnanthes Alba (Meadowfoam) Seed Oil: khóa ẩm, da mướt không bí

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Dùng ở bước cuối cùng trong chu trình dưỡng da buổi sáng, sau kem dưỡng và trước trang điểm.
Bước 2: Lấy lượng vừa đủ (khoảng 1 đồng xu), chấm 5 điểm lên mặt và cổ.
Bước 3: Tán đều theo chiều từ trong ra ngoài, vỗ nhẹ để kem thẩm thấu.
Bước 4: Thoa lại sau mỗi 2-3 giờ khi hoạt động ngoài trời, đi biển hoặc đổ nhiều mồ hôi.
Bước 5: Tẩy trang sạch vào cuối ngày để da luôn thông thoáng.

✨ HƯỚNG DẪN BẢO QUẢN
- Đậy kín nắp sau khi dùng, để nơi khô ráo, thoáng mát
- Tránh ánh nắng trực tiếp và nhiệt độ cao trên 30°C
- Để xa tầm tay trẻ em
- Nên dùng hết trong 12 tháng kể từ ngày mở nắp`,
    category: 'Kem chống nắng da dầu/khô',
    image: '/products/KCNCN.SL.1.png',
    images: '/products/KCNCN.SL.1.png,/products/KCNCN.SL.2.png,/products/KCNCN.SL.3.png,/products/KCNCN.SL.4.png,/products/KCNCN.SL.5.png,/products/KCNCN.SL.6.png,/products/KCNCN.SL.7.png,/products/KCNCN.SL.8.png,/products/KCNCN.SL.9.png',
    productId: 'KCNCN.SL',
    shortName: 'Kem Chống Nắng SL LEPORTS SPF50+',
    discount: 30,
    rating: 5.0,
    sold: 928,
    stock: 836,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: 'https://shopee.vn/Kem-Ch%E1%BB%91ng-N%E1%BA%AFng-N%C3%A2ng-Tone-SPF-50-PA-SL-LEPORTS-WATER-FULL-SUN-CREAM-GC-Nature-i.1684181829.52012676969',
    tiktokUrl: 'https://vt.tiktok.com/ZS965TVL67fNd-U0wqq/',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "SPF 50+ PA++++ bảo vệ tối đa khỏi UVA-UVB, kháng nước - kháng mồ hôi cả ngày dài",
      "Nâng tone tức thì, da sáng tự nhiên không vệt trắng, không bóng dầu",
      "Công thức Water-Full giàu nước, mát lạnh tức thì, thẩm thấu nhanh không bít lỗ chân lông",
      "Sodium Hyaluronate + Dịch lên men + Vitamin E cấp ẩm sâu và làm dịu da hiệu quả"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 992,
    sku: 'TCDTD50',
    brand: 'AEGAHOO',
    name: 'Serum Dưỡng Trắng Da AEGAHOO CHEON JI YOOL WHITENING ESSENCE Mờ Thâm Nám Đều Màu Da Hàn Quốc',
    price: 819200,
    originalPrice: 1024000,
    description: `Serum Dưỡng Trắng Da AEGAHOO CHEON JI YOOL WHITENING ESSENCE Mờ Thâm Nám Đều Màu Da

✨ Vì sao bạn sẽ thích?
Bạn đang tìm một em serum vừa lành tính vừa dưỡng trắng da và mờ thâm? AEGAHOO CHEON JI YOOL chính là lựa chọn đáng yêu dành cho bạn. Với 62% nước rễ nhân sâm Panax kết hợp 5% Niacinamide, sản phẩm nâng niu làn da theo cách rất Hàn Quốc: dịu nhẹ, thẩm thấu nhanh, không bết dính, nhưng hiệu quả thấy rõ sau từng ngày sử dụng.

✨ THÔNG TIN THƯƠNG HIỆU
AEGAHOO là thương hiệu mỹ phẩm chăm sóc da chuyên sâu từ nguyên liệu thuần thiên nhiên nội địa Hàn Quốc, nổi bật với vị thế là lựa chọn tin cậy cho các liệu trình dưỡng trắng da tại nhà, thường xuyên lọt vào danh sách Top-rated trên các nền tảng thương mại điện tử uy tín như Coupang, Olive Young, TOP tìm kiếm trên Naver. Được cộng đồng làm đẹp Hàn Quốc đặc biệt săn đón. Kết hợp hài hòa giữa các chiết xuất thảo mộc truyền thống cùng công nghệ tinh chế hoạt chất tiên tiến, AEGAHOO theo đuổi triết lý Luminous Radiance, tập trung tối ưu hóa các thành phần dưỡng sáng chuyên biệt như Niacinamide, Adenosine và các phức hợp thực vật giúp làm mờ thâm nám, khôi phục sắc diện làn da đều màu từ sâu bên trong mang đậm dấu ấn nhân sâm Hàn Quốc đặc trưng. Mọi dòng sản phẩm đều được kiểm định nghiêm ngặt về độ tinh khiết và khả năng thẩm thấu, đảm bảo hiệu quả làm sáng bền vững mà vẫn giữ được sự dịu nhẹ cho mọi nền da, kể cả làn da nhạy cảm nhất. Sản phẩm được nhập khẩu và phân phối chính hãng độc quyền bởi GC Nature tại Việt Nam.

✨ ƯU ĐIỂM NỔI BẬT
🌿 Hỗ trợ làm sáng da, đều màu, mờ thâm sạm và vết thâm sau mụn
🌿 Cấp ẩm sâu, giúp da căng mọng, mềm mịn tức thì
🌿 Hỗ trợ cải thiện nếp nhăn li ti, tăng độ săn chắc và đàn hồi
🌿 Nuôi dưỡng da khỏe từ bên trong nhờ tinh chất nhân sâm quý
🌿 Kết cấu lỏng nhẹ, thấm nhanh, không gây nhờn rít
🌿 Phù hợp với mọi loại da, kể cả da nhạy cảm

✨ THÀNH PHẦN CHÍNH
- Nước rễ nhân sâm Panax 62%: Thành phần quý giá giúp phục hồi sức sống, nuôi dưỡng làn da khỏe mạnh từ sâu bên trong
- Niacinamide 5%: Hoạt chất vàng trong việc hỗ trợ làm trắng, làm sáng và cải thiện sắc tố da
- Tri-Vitasome 1%: Công nghệ giúp tăng cường khả năng hấp thụ dưỡng chất, tối ưu hóa hiệu quả chăm sóc da
- Adenosine: Hoạt chất hỗ trợ cải thiện nếp nhăn, giúp da săn chắc và tăng cường độ đàn hồi
- Chiết xuất thảo mộc (lá oregano, lá cây bách, vỏ cây trắng...): Làm dịu, bổ sung dưỡng chất tự nhiên cho làn da

✨ HƯỚNG DẪN SỬ DỤNG
Bước 1: Làm sạch da với sữa rửa mặt, sau đó cân bằng bằng toner.
Bước 2: Lấy 2-3 giọt serum ra lòng bàn tay hoặc trực tiếp lên mặt.
Bước 3: Vỗ nhẹ để dưỡng chất thẩm thấu đều khắp gương mặt và cổ.
Bước 4: Tiếp tục các bước kem dưỡng ẩm và kem chống nắng vào buổi sáng.
Tần suất: Dùng đều đặn 2 lần mỗi ngày sáng và tối để cảm nhận làn da sáng mịn rõ rệt.

✨ HƯỚNG DẪN BẢO QUẢN
- Đậy kín nắp sau khi sử dụng
- Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và nhiệt độ cao
- Để xa tầm tay trẻ em`,
    category: 'Serum / Tinh chất đặc trị',
    image: '/products/TCDTD50.1.png',
    images: '/products/TCDTD50.1.png,/products/TCDTD50.2.png,/products/TCDTD50.3.png,/products/TCDTD50.4.png,/products/TCDTD50.5.png,/products/TCDTD50.6.png,/products/TCDTD50.7.png,/products/TCDTD50.8.png',
    productId: 'TCDTD50',
    shortName: 'Serum Dưỡng Trắng AEGAHOO CHEON JI YOOL',
    discount: 20,
    rating: 5.0,
    sold: 928,
    stock: 0,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "62% nước rễ nhân sâm Panax + 5% Niacinamide — dưỡng trắng, mờ thâm nám chuyên sâu",
      "Tri-Vitasome 1% tăng cường hấp thụ dưỡng chất, tối ưu hiệu quả chăm sóc da",
      "Adenosine cải thiện nếp nhăn li ti, da săn chắc và đàn hồi từ bên trong",
      "Kết cấu lỏng nhẹ, thẩm thấu nhanh, không nhờn rít — phù hợp mọi loại da kể cả da nhạy cảm"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 991,
    sku: 'DMRRMP',
    brand: 'GC Nature',
    name: 'Dầu Trái Cây Tẩy Trang Rửa Mặt Tự Nhiên GC NATURE Fruit Cleansing Oil Hàn Quốc',
    price: 310000,
    originalPrice: 420000,
    description: `Dầu Trái Cây Tẩy Trang Rửa Mặt Tự Nhiên GC NATURE Fruit Cleansing Oil
Làm sạch bụi bẩn, kem chống nắng và lớp trang điểm chống nước dịu nhẹ không gây rát da. Chiết xuất quả tự nhiên giàu vitamin dưỡng da mịn màng tươi sáng.`,
    category: 'Sữa rửa mặt',
    image: '/products/DMRRMP1.png',
    images: '/products/DMRRMP1.png,/products/DMRRMP2.png,/products/DMRRMP3.png,/products/DMRRMP4.png,/products/DMRRMP5.png,/products/DMRRMP6.png',
    productId: 'DMRRMP',
    shortName: 'Dầu Trái Cây Tẩy Trang GC NATURE',
    discount: 26,
    rating: 5.0,
    sold: 412,
    stock: 500,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Làm sạch sâu bụi mịn, kem chống nắng và son lì waterproof",
      "Chiết xuất 100% dầu hoa quả thuần thiên nhiên dịu nhẹ",
      "Không nhũ hóa gây bít tắc lỗ chân lông, giữ độ ẩm tự nhiên",
      "Nhập khẩu chính ngạch Hàn Quốc chuẩn chứng nhận an toàn"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 990,
    sku: 'LUSAFRSC',
    brand: 'GC Nature',
    name: 'Kem Dưỡng Phục Hồi Dịu Da LUSA Fruit Repair Skin Cream GC NATURE Hàn Quốc',
    price: 390000,
    originalPrice: 520000,
    description: `Kem Dưỡng Phục Hồi Dịu Da LUSA Fruit Repair Skin Cream GC NATURE Hàn Quốc
Dưỡng ẩm chuyên sâu, phục hồi làn da bị hư tổn, bong tróc hoặc sau liệu trình thẩm mỹ. Tăng cường hàng rào bảo vệ da căng bóng hồng hào.`,
    category: 'Dưỡng da mặt',
    image: '/products/LUSAFRSC1.png',
    images: '/products/LUSAFRSC1.png,/products/LUSAFRSC2.png,/products/LUSAFRSC3.png,/products/LUSAFRSC4.png,/products/LUSAFRSC5.png,/products/LUSAFRSC6.png',
    productId: 'LUSAFRSC',
    shortName: 'Kem Dưỡng Phục Hồi LUSA GC NATURE',
    discount: 25,
    rating: 5.0,
    sold: 310,
    stock: 350,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Phục hồi tức thì làn da khô ráp, bong tróc mỏng yếu",
      "Bổ sung dưỡng chất trái cây & Ceramide củng cố hàng rào da",
      "Thấm nhanh, thoáng nhẹ, không làm bí bách lỗ chân lông",
      "Phù hợp cho mọi loại da kể cả da nhạy cảm kích ứng"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  },
  {
    id: 989,
    sku: 'DM',
    brand: 'GC Nature',
    name: 'Dầu Tẩy Trang Làm Sạch Sâu Mịn Da GC NATURE Cleansing Oil Hàn Quốc',
    price: 295000,
    originalPrice: 380000,
    description: `Dầu Tẩy Trang Làm Sạch Sâu Mịn Da GC NATURE Cleansing Oil Hàn Quốc
Cuốn trôi nhanh chóng lớp makeup đậm, dầu thừa và sợi bã nhờn mà vẫn duy trì làn da mướt mịn tự nhiên.`,
    category: 'Sữa rửa mặt',
    image: '/products/DM1.png',
    images: '/products/DM1.png,/products/DM2.png,/products/DM3.png,/products/DM4.png,/products/DM5.png',
    productId: 'DM',
    shortName: 'Dầu Tẩy Trang Cleansing Oil GC NATURE',
    discount: 22,
    rating: 5.0,
    sold: 520,
    stock: 600,
    isFlashSale: false,
    flashSalePercent: 0,
    shopeeUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    featuresVn: JSON.stringify([
      "Đánh bay mascara, son lì và kem nền lâu trôi",
      "Nhũ hóa cực nhanh với nước, dễ dàng rửa sạch không nhờn dính",
      "Nuôi dưỡng da mịn màng, làm sạch mụn đầu đen hiệu quả"
    ]),
    featuresEn: '',
    footerInfo: 'Nhập khẩu chính ngạch Hàn Quốc bởi GCnature Việt Nam',
    productionYear: 2026,
    clearancePrice: 0,
    dailySalePrice: 0,
    campaignPrice: 0,
    offPlatformPrice: 0,
    warrantyData: ''
  }
];

