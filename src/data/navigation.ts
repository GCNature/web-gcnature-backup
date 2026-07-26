export interface SubCategoryItem {
  name: string;
  href: string;
}

export interface CategoryGroup {
  groupName: string;
  items: SubCategoryItem[];
}

export interface MegaCategory {
  name: string;
  englishName: string;
  href: string;
  icon: string; // Representation for UI icons
  groups: CategoryGroup[];
}

export const categories = [
  { name: "SkinCare (Chăm sóc da)", hasSubmenu: true, href: "/shop/duong-da-mat" },
  { name: "HairCare (Chăm sóc tóc)", hasSubmenu: true, href: "/shop/cham-soc-toc" },
  { name: "BodyCare (Cơ thể)", hasSubmenu: true, href: "/shop/cham-soc-co-the" },
  { name: "MakeUp (Trang điểm)", hasSubmenu: true, href: "/shop/trang-diem" },
  { name: "SET Quà Tặng", hasSubmenu: true, href: "/shop/set-qua-tang" },
  { name: "Flash Sale", hasSubmenu: false, href: "/flash-sale" },
];

export const megaMenu: MegaCategory[] = [
  {
    name: "Chăm sóc da mặt",
    englishName: "SkinCare",
    href: "/shop/duong-da-mat",
    icon: "Sparkles",
    groups: [
      {
        groupName: "Làm sạch da",
        items: [
          { name: "Sữa rửa mặt", href: "/shop/sua-rua-mat" },
          { name: "Tẩy trang (Nước/Dầu/Sáp)", href: "/shop/tay-trang" },
          { name: "Tẩy tế bào chết da mặt", href: "/shop/tay-te-bao-chet-da-mat" },
          { name: "Toner / Nước hoa hồng", href: "/shop/toner-nuoc-hoa-hong" },
        ],
      },
      {
        groupName: "Đặc trị & Dưỡng sâu",
        items: [
          { name: "Serum / Tinh chất đặc trị", href: "/shop/serum-tinh-chat-dac-tri" },
          { name: "Ampoule / Siêu tinh chất", href: "/shop/ampoule-sieu-tinh-chat" },
          { name: "Mặt nạ (Giấy/Đất sét/Ngủ)", href: "/shop/mat-na" },
        ],
      },
      {
        groupName: "Dưỡng ẩm & Khóa ẩm",
        items: [
          { name: "Kem dưỡng / Gel dưỡng ẩm", href: "/shop/kem-duong-gel-duong-am" },
          { name: "Lotion / Emulsion (Sữa dưỡng)", href: "/shop/lotion-emulsion" },
          { name: "Xịt khoáng", href: "/shop/xit-khoang" },
        ],
      },
      {
        groupName: "Bảo vệ & Chăm sóc riêng",
        items: [
          { name: "Kem chống nắng da dầu/khô", href: "/shop/kem-chong-nang" },
          { name: "Kem / Serum dưỡng mắt", href: "/shop/kem-serum-duong-mat" },
          { name: "Dưỡng môi & Tẩy tế bào chết môi", href: "/shop/duong-moi" },
        ],
      },
    ],
  },
  {
    name: "Chăm sóc tóc & Da đầu",
    englishName: "HairCare",
    href: "/shop/cham-soc-toc",
    icon: "Scissors",
    groups: [
      {
        groupName: "Làm sạch & Xả",
        items: [
          { name: "Dầu gội đặc trị/kiềm dầu", href: "/shop?search=dau-goi" },
          { name: "Dầu xả phục hồi", href: "/shop?search=dau-xa" },
          { name: "Kem ủ / Mặt nạ cho tóc", href: "/shop?search=u-toc" },
        ],
      },
      {
        groupName: "Đặc trị da đầu",
        items: [
          { name: "Serum / Tinh chất mọc tóc", href: "/shop?search=tinh-chat-moc-toc" },
          { name: "Tẩy tế bào chết da đầu", href: "/shop?search=tay-te-bao-chet-da-dau" },
        ],
      },
      {
        groupName: "Dưỡng tóc & Tạo kiểu",
        items: [
          { name: "Dầu dưỡng / Xịt dưỡng tóc", href: "/shop?search=dau-duong-toc" },
          { name: "Gel / Sáp / Keo tạo kiểu", href: "/shop?search=tao-kieu" },
          { name: "Thuốc nhuộm tóc thảo dược", href: "/shop?search=nhuom-toc" },
        ],
      },
    ],
  },
  {
    name: "Chăm sóc cơ thể",
    englishName: "BodyCare",
    href: "/shop/cham-soc-co-the",
    icon: "Heart",
    groups: [
      {
        groupName: "Làm sạch cơ thể",
        items: [
          { name: "Sữa tắm dưỡng ẩm/trị mụn", href: "/shop?search=sua-tam" },
          { name: "Xà phòng tắm thảo dược", href: "/shop?search=xa-phong" },
          { name: "Tẩy tế bào chết cơ thể", href: "/shop?search=tay-da-chet-body" },
          { name: "Dung dịch vệ sinh Nam/Nữ", href: "/shop?search=dung-dich-ve-sinh" },
        ],
      },
      {
        groupName: "Dưỡng ẩm & Đặc trị",
        items: [
          { name: "Sữa dưỡng thể / Body Lotion", href: "/shop/sua-duong-the" },
          { name: "Dầu dưỡng thể (Body Oil)", href: "/shop/dau-duong-the" },
          { name: "Kem dưỡng da tay / da chân", href: "/shop/kem-duong-da-tay" },
          { name: "Giảm mỡ thon gọn", href: "/shop/giam-mo-thon-gon" },
        ],
      },
      {
        groupName: "Khử mùi & Chống nắng",
        items: [
          { name: "Lăn / Xịt khử mùi cơ thể", href: "/shop?search=khu-mui" },
          { name: "Xịt thơm toàn thân (Body Mist)", href: "/shop?search=body-mist" },
          { name: "Kem chống nắng toàn thân", href: "/shop?search=chong-nang-toan-than" },
        ],
      },
    ],
  },
  {
    name: "Trang điểm",
    englishName: "MakeUp",
    href: "/shop/trang-diem",
    icon: "Smile",
    groups: [
      {
        groupName: "Trang điểm mặt",
        items: [
          { name: "Kem lót (Primer)", href: "/shop?search=kem-lot" },
          { name: "Cushion / Phấn nước / Kem nền", href: "/shop?search=cushion" },
          { name: "Kem che khuyết điểm", href: "/shop?search=che-khuyet-diem" },
          { name: "Phấn phủ dạng bột/nén", href: "/shop?search=phan-phu" },
          { name: "Phấn má hồng / Tạo khối", href: "/shop?search=ma-hong" },
          { name: "Xịt khóa nền giữ lớp trang điểm", href: "/shop?search=khoa-nen" },
        ],
      },
      {
        groupName: "Trang điểm mắt",
        items: [
          { name: "Chì kẻ mày / Gel kẻ mày", href: "/shop?search=ke-may" },
          { name: "Phấn mắt nhũ / Lỳ", href: "/shop?search=phan-mat" },
          { name: "Kẻ mắt nước / Dạ (Eyeliner)", href: "/shop?search=ke-mat" },
          { name: "Mascara chuốt dài mi", href: "/shop?search=mascara" },
        ],
      },
      {
        groupName: "Trang điểm môi",
        items: [
          { name: "Son thỏi lỳ / satin", href: "/shop?search=son-thoi" },
          { name: "Son kem / Son tint Hàn Quốc", href: "/shop?search=son-kem" },
          { name: "Son bóng căng mọng môi", href: "/shop?search=son-bong" },
          { name: "Chì kẻ viền môi định hình", href: "/shop?search=ke-vien-moi" },
        ],
      },
    ],
  },
  {
    name: "SET Quà Tặng",
    englishName: "GiftSets",
    href: "/shop/set-qua-tang",
    icon: "Gift",
    groups: [
      {
        groupName: "Set Quà Dưỡng Da",
        items: [
          { name: "Set dưỡng da chống lão hóa", href: "/shop?search=set-duong-da" },
          { name: "Set dưỡng sáng da mờ thâm", href: "/shop?search=set-duong-sang-da" },
          { name: "Set phục hồi & cấp ẩm sâu", href: "/shop?search=set-phuc-hoi" },
        ],
      },
      {
        groupName: "Set Quà Trang Điểm",
        items: [
          { name: "Set son môi & phấn má", href: "/shop?search=set-son-moi" },
          { name: "Set trang điểm toàn diện", href: "/shop?search=set-trang-diem" },
        ],
      },
      {
        groupName: "Dịch vụ quà tặng",
        items: [
          { name: "Set quà tặng sinh nhật Nữ", href: "/shop?search=qua-tang-sinh-nhat" },
          { name: "Set quà tặng đối tác & VIP", href: "/shop?search=qua-tang-doi-tac" },
          { name: "Hộp quà & Thiệp handmade", href: "/shop?search=hop-qua" },
        ],
      },
    ],
  },
];

// Keep backward compatibility for pages that query productDropdown flat items
export const productDropdown = megaMenu.map(category => ({
  title: category.name,
  items: category.groups.flatMap(group => group.items),
}));
