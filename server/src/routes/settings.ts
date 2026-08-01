import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { isAdmin, isStaff } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ── Public endpoint: anyone can read branding settings ──
router.get('/branding', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'branding' } });
    if (setting?.value) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Get branding error:', error);
    res.json(null);
  }
});

// ── Public endpoint: anyone can read livestream settings ──
router.get('/livestream', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'livestream' } });
    if (setting?.value) {
      res.json({ value: JSON.parse(setting.value) });
    } else {
      res.json({ value: null });
    }
  } catch (error) {
    console.error('Get livestream error:', error);
    res.json({ value: null });
  }
});

// ── Public endpoint: anyone can read product policy setting ──
router.get('/product-policy', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'product_policy' } });
    res.json({ value: setting?.value || null });
  } catch (error) {
    console.error('Get product policy error:', error);
    res.json({ value: null });
  }
});

// ── Public endpoint: anyone can read hero banner setting ──
router.get('/hero-banner', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'hero_banner' } });
    if (setting?.value) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Get hero banner error:', error);
    res.json(null);
  }
});

// ── Public endpoint: anyone can read hero bg setting ──
router.get('/hero-bg-settings', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'hero_bg_settings' } });
    if (setting?.value) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Get hero bg error:', error);
    res.json(null);
  }
});

// ── Public endpoint: anyone can read promo banners setting ──
router.get('/promo-banners', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'promo_banners' } });
    if (setting?.value) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Get promo banners error:', error);
    res.json(null);
  }
});

// ── Public endpoint: anyone can read featured categories setting ──
router.get('/featured-categories', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'featured_categories' } });
    if (setting?.value) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Get featured categories error:', error);
    res.json(null);
  }
});

// Public endpoint: lấy dữ liệu trang tĩnh
router.get('/page/:key', async (req, res) => {
  try {
    const key = req.params.key;
    if (!key.startsWith('page_')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const setting = await prisma.settings.findUnique({ where: { key } });
    if (setting?.value) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Get page setting error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Public endpoint: lấy cây danh mục bài viết
router.get('/post-categories-tree', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'post_categories_tree' } });
    res.json({ value: setting?.value || null });
  } catch (error) {
    console.error('Get post categories tree error:', error);
    res.json({ value: null });
  }
});

// Public endpoint: lấy cấu trúc Mega Menu
router.get('/mega-menu', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    let setting = await prisma.settings.findUnique({ where: { key: 'mega_menu' } });
    if (!setting) {
      // Khởi tạo dữ liệu mặc định ban đầu nếu chưa có trong DB
      const defaultMenu = [
        {
          "name": "Chăm sóc da mặt",
          "englishName": "SkinCare",
          "href": "/shop/duong-da-mat",
          "icon": "Sparkles",
          "groups": [
            {
              "groupName": "Làm sạch da",
              "items": [
                { "name": "Sữa rửa mặt", "href": "/shop/sua-rua-mat" },
                { "name": "Tẩy trang (Nước/Dầu/Sáp)", "href": "/shop/tay-trang" },
                { "name": "Tẩy tế bào chết da mặt", "href": "/shop/tay-te-bao-chet-da-mat" },
                { "name": "Toner / Nước hoa hồng", "href": "/shop/toner-nuoc-hoa-hong" }
              ]
            },
            {
              "groupName": "Đặc trị & Dưỡng sâu",
              "items": [
                { "name": "Serum / Tinh chất đặc trị", "href": "/shop/serum-tinh-chat-dac-tri" },
                { "name": "Ampoule / Siêu tinh chất", "href": "/shop/ampoule-sieu-tinh-chat" },
                { "name": "Mặt nạ (Giấy/Đất sét/Ngủ)", "href": "/shop/mat-na" }
              ]
            },
            {
              "groupName": "Dưỡng ẩm & Khóa ẩm",
              "items": [
                { "name": "Kem dưỡng / Gel dưỡng ẩm", "href": "/shop/kem-duong-gel-duong-am" },
                { "name": "Lotion / Emulsion (Sữa dưỡng)", "href": "/shop/lotion-emulsion" },
                { "name": "Xịt khoáng", "href": "/shop/xit-khoang" }
              ]
            },
            {
              "groupName": "Bảo vệ & Chăm sóc riêng",
              "items": [
                { "name": "Kem chống nắng da dầu/khô", "href": "/shop/kem-chong-nang" },
                { "name": "Kem / Serum dưỡng mắt", "href": "/shop/kem-serum-duong-mat" },
                { "name": "Dưỡng môi & Tẩy tế bào chết môi", "href": "/shop/duong-moi" }
              ]
            }
          ]
        },
        {
          "name": "Chăm sóc tóc & Da đầu",
          "englishName": "HairCare",
          "href": "/shop/cham-soc-toc",
          "icon": "Scissors",
          "groups": [
            {
              "groupName": "Làm sạch & Xả",
              "items": [
                { "name": "Dầu gội đặc trị/kiềm dầu", "href": "/shop?search=dau-goi" },
                { "name": "Dầu xả phục hồi", "href": "/shop?search=dau-xa" },
                { "name": "Kem ủ / Mặt nạ cho tóc", "href": "/shop?search=u-toc" }
              ]
            },
            {
              "groupName": "Đặc trị da đầu",
              "items": [
                { "name": "Serum / Tinh chất mọc tóc", "href": "/shop?search=tinh-chat-moc-toc" },
                { "name": "Tẩy tế bào chết da đầu", "href": "/shop?search=tay-te-bao-chet-da-dau" }
              ]
            },
            {
              "groupName": "Dưỡng tóc & Tạo kiểu",
              "items": [
                { "name": "Dầu dưỡng / Xịt dưỡng tóc", "href": "/shop?search=dau-duong-toc" },
                { "name": "Gel / Sáp / Keo tạo kiểu", "href": "/shop?search=tao-kieu" },
                { "name": "Thuốc nhuộm tóc thảo dược", "href": "/shop?search=nhuom-toc" }
              ]
            }
          ]
        },
        {
          "name": "Chăm sóc cơ thể",
          "englishName": "BodyCare",
          "href": "/shop/cham-soc-co-the",
          "icon": "Heart",
          "groups": [
            {
              "groupName": "Làm sạch cơ thể",
              "items": [
                { "name": "Sữa tắm dưỡng ẩm/trị mụn", "href": "/shop?search=sua-tam" },
                { "name": "Xà phòng tắm thảo dược", "href": "/shop?search=xa-phong" },
                { "name": "Tẩy tế bào chết cơ thể", "href": "/shop?search=tay-da-chet-body" },
                { "name": "Dung dịch vệ sinh Nam/Nữ", "href": "/shop?search=dung-dich-ve-sinh" }
              ]
            },
            {
              "groupName": "Dưỡng ẩm & Đặc trị",
              "items": [
                { "name": "Sữa dưỡng thể / Body Lotion", "href": "/shop/sua-duong-the" },
                { "name": "Dầu dưỡng thể (Body Oil)", "href": "/shop/dau-duong-the" },
                { "name": "Kem dưỡng da tay / da chân", "href": "/shop/kem-duong-da-tay" },
                { "name": "Giảm mỡ thon gọn", "href": "/shop/giam-mo-thon-gon" }
              ]
            },
            {
              "groupName": "Khử mùi & Chống nắng",
              "items": [
                { "name": "Lăn / Xịt khử mùi cơ thể", "href": "/shop?search=khu-mui" },
                { "name": "Xịt thơm toàn thân (Body Mist)", "href": "/shop?search=body-mist" },
                { "name": "Kem chống nắng toàn thân", "href": "/shop?search=chong-nang-toan-than" }
              ]
            }
          ]
        },
        {
          "name": "Trang điểm",
          "englishName": "MakeUp",
          "href": "/shop/trang-diem",
          "icon": "Smile",
          "groups": [
            {
              "groupName": "Trang điểm mặt",
              "items": [
                { "name": "Kem lót (Primer)", "href": "/shop?search=kem-lot" },
                { "name": "Cushion / Phấn nước / Kem nền", "href": "/shop?search=cushion" },
                { "name": "Kem che khuyết điểm", "href": "/shop?search=che-khuyet-diem" },
                { "name": "Phấn phủ dạng bột/nén", "href": "/shop?search=phan-phu" },
                { "name": "Phấn má hồng / Tạo khối", "href": "/shop?search=ma-hong" },
                { "name": "Xịt khóa nền giữ lớp trang điểm", "href": "/shop?search=khoa-nen" }
              ]
            },
            {
              "groupName": "Trang điểm mắt",
              "items": [
                { "name": "Chì kẻ mày / Gel kẻ mày", "href": "/shop?search=ke-may" },
                { "name": "Phấn mắt nhũ / Lỳ", "href": "/shop?search=phan-mat" },
                { "name": "Kẻ mắt nước / Dạ (Eyeliner)", "href": "/shop?search=ke-mat" },
                { "name": "Mascara chuốt dài mi", "href": "/shop?search=mascara" }
              ]
            },
            {
              "groupName": "Trang điểm môi",
              "items": [
                { "name": "Son thỏi lỳ / satin", "href": "/shop?search=son-thoi" },
                { "name": "Son kem / Son tint Hàn Quốc", "href": "/shop?search=son-kem" },
                { "name": "Son bóng căng mọng môi", "href": "/shop?search=son-bong" },
                { "name": "Chì kẻ viền môi định hình", "href": "/shop?search=ke-vien-moi" }
              ]
            }
          ]
        },
        {
          "name": "SET Quà Tặng",
          "englishName": "GiftSets",
          "href": "/shop/set-qua-tang",
          "icon": "Gift",
          "groups": [
            {
              "groupName": "Set Quà Dưỡng Da",
              "items": [
                { "name": "Set dưỡng da chống lão hóa", "href": "/shop?search=set-duong-da" },
                { "name": "Set dưỡng sáng da mờ thâm", "href": "/shop?search=set-duong-sang-da" },
                { "name": "Set phục hồi & cấp ẩm sâu", "href": "/shop?search=set-phuc-hoi" }
              ]
            },
            {
              "groupName": "Set Quà Trang Điểm",
              "items": [
                { "name": "Set son môi & phấn má", "href": "/shop?search=set-son-moi" },
                { "name": "Set trang điểm toàn diện", "href": "/shop?search=set-trang-diem" }
              ]
            },
            {
              "groupName": "Dịch vụ quà tặng",
              "items": [
                { "name": "Set quà tặng sinh nhật Nữ", "href": "/shop?search=qua-tang-sinh-nhat" },
                { "name": "Set quà tặng đối tác & VIP", "href": "/shop?search=qua-tang-doi-tac" },
                { "name": "Hộp quà & Thiệp handmade", "href": "/shop?search=hop-qua" }
              ]
            }
          ]
        }
      ];
      setting = await prisma.settings.create({
        data: {
          key: 'mega_menu',
          value: JSON.stringify(defaultMenu)
        }
      });
    }
    res.json(JSON.parse(setting.value || '[]'));
  } catch (error) {
    console.error('Get mega menu error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy menu' });
  }
});

// ── Public endpoint: site config for header, footer, social, and floating buttons ──
router.get('/site-config', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({ where: { key: 'site_config' } });
    if (setting?.value) {
      res.json({ success: true, data: JSON.parse(setting.value) });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error('Get site config error:', error);
    res.json({ success: false, data: null });
  }
});

// All remaining settings routes require staff authentication
router.use(isStaff);

// ── Admin endpoint: save site config ──
router.put('/site-config', async (req, res) => {
  try {
    const siteConfigData = req.body;
    await prisma.settings.upsert({
      where: { key: 'site_config' },
      update: { value: JSON.stringify(siteConfigData), updated_at: new Date() },
      create: { key: 'site_config', value: JSON.stringify(siteConfigData) }
    });
    res.json({ success: true, message: 'Đã lưu cấu hình Header, Footer & Floating Buttons' });
  } catch (error) {
    console.error('Update site config error:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lưu cấu hình' });
  }
});

// ── Public endpoint: anyone can read active bank payment method ──
router.get('/active-payment-method', async (_req, res) => {
  try {
    const active = await prisma.payment_methods.findFirst({
      where: { is_active: true },
      orderBy: { updated_at: 'desc' }
    });
    if (active) {
      return res.json({
        success: true,
        bankCode: active.bank_code,
        bankName: active.bank_name || active.bank_code,
        accountNumber: active.account_number,
        accountName: active.account_name,
      });
    }

    // Fallback to latest payment method if none marked active
    const latest = await prisma.payment_methods.findFirst({
      orderBy: { created_at: 'desc' }
    });
    if (latest) {
      return res.json({
        success: true,
        bankCode: latest.bank_code,
        bankName: latest.bank_name || latest.bank_code,
        accountNumber: latest.account_number,
        accountName: latest.account_name,
      });
    }

    // Fallback default
    res.json({
      success: true,
      bankCode: 'ACB',
      bankName: 'Ngân hàng Á Châu',
      accountNumber: '20952888',
      accountName: 'HOANG THI KIM CHI',
    });
  } catch (error) {
    console.error('Get active payment method error:', error);
    res.json({
      success: true,
      bankCode: 'ACB',
      bankName: 'Ngân hàng Á Châu',
      accountNumber: '20952888',
      accountName: 'HOANG THI KIM CHI',
    });
  }
});

// GET all settings
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value || '';
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT update settings (batch) — protected by isStaff middleware
router.put('/', isStaff, async (req, res) => {
  try {
    const updates = req.body; // { key1: value1, key2: value2, ... }
    const role = (req.user as any)?.role;

    // Check key-level permissions
    for (const key of Object.keys(updates)) {
      if (role === 'editor') {
        const allowedKeys = ['post_categories_tree', 'post_categories_map'];
        if (!allowedKeys.includes(key)) {
          return res.status(403).json({ message: `Biên tập viên không có quyền thay đổi cấu hình key "${key}"` });
        }
      } else if (role === 'shop_manager') {
        const forbiddenKeys = ['branding', 'database_connection'];
        if (forbiddenKeys.includes(key)) {
          return res.status(403).json({ message: `Quản lý cửa hàng không có quyền thay đổi cấu hình key "${key}"` });
        }
      } else if (role !== 'admin') {
        return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
      }
    }
    
    for (const [key, value] of Object.entries(updates)) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: value as string, updated_at: new Date() },
        create: { key, value: value as string }
      });
    }

    res.json({ message: 'Đã lưu cấu hình thành công' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET single setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: req.params.key }
    });
    res.json({ value: setting?.value || null });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE setting by key — protected by isStaff middleware
router.delete('/:key', isStaff, async (req, res) => {
  try {
    const key = req.params.key;
    const role = (req.user as any)?.role;

    // Check key-level permissions for delete
    if (role === 'editor') {
      const allowedKeys = ['post_categories_tree', 'post_categories_map'];
      if (!allowedKeys.includes(key)) {
        return res.status(403).json({ message: 'Biên tập viên không có quyền xóa cấu hình này' });
      }
    } else if (role === 'shop_manager') {
      const forbiddenKeys = ['branding', 'database_connection'];
      if (forbiddenKeys.includes(key)) {
        return res.status(403).json({ message: 'Quản lý cửa hàng không có quyền xóa cấu hình này' });
      }
    } else if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.settings.delete({ where: { key } });
    res.json({ message: 'Đã xóa cấu hình thành công' });
  } catch (error: any) {
    console.error('Delete setting error:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa cấu hình' });
  }
});

export default router;
