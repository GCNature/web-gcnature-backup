import express from 'express';
import { PrismaClient } from '@prisma/client';
import { fallbackProducts } from './fallbackProducts';

const router = express.Router();
const prisma = new PrismaClient();

export const detectBrand = (name: string): string => {
  const n = name.toUpperCase();
  if (n.includes("GC NATURE")) return "GC Nature";
  if (n.includes("SL LEPORTS")) return "SL LEPORTS";
  if (n.includes("AEGAHOO")) return "AEGAHOO";
  if (n.includes("DNEND")) return "DNEND";
  if (n.includes("LIENJANG")) return "Lienjang";
  if (n.includes("MEDIORGA")) return "MEDIORGA";
  return "GC Nature"; // Default fallback
};

// GET all active products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    });
    const allImages = await prisma.product_images.findMany({ orderBy: { sort_order: 'asc' } });
    const imageMap: Record<string, string[]> = {};
    for (const img of allImages) {
      if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
      imageMap[img.product_id].push(img.image_url);
    }
    
    const mapped = products.map(p => {
      const imgs = imageMap[p.product_id] || [];
      return {
        id: p.id,
        sku: p.sku || p.product_id,
        name: p.name,
        price: Number(p.price),
        originalPrice: Number(p.original_price),
        description: p.description || '',
        category: p.category_name || '',
        image: imgs[0] || '',
        images: imgs.join(','),
        productId: p.product_id,
        shortName: p.short_name,
        discount: p.discount,
        rating: 5.0,
        sold: p.sold || 0,
        stock: p.stock || 0,
        brand: (p.brand && p.brand !== 'Mercy Tech Global') ? p.brand : detectBrand(p.name),
        isFlashSale: p.is_flash_sale,
        flashSalePercent: p.flash_sale_percent,
        shopeeUrl: p.shopee_url,
        tiktokUrl: p.tiktok_url,
        youtubeUrl: p.youtube_url,
        featuresVn: p.features_vn || '',
        featuresEn: p.features_en || '',
        footerInfo: p.footer_info || '',
        productionYear: p.production_year,
        clearancePrice: Number(p.clearance_price || 0),
        dailySalePrice: Number(p.daily_sale_price || 0),
        campaignPrice: Number(p.campaign_price || 0),
        warrantyData: p.warranty_data || '',
        origin: p.origin || '',
        volume: p.volume || '',
        ingredients: p.ingredients || '',
      };
    });
    res.json(mapped);
  } catch (error) {
    console.error('Get products error (falling back to static mock data):', error);
    res.json(fallbackProducts);
  }
});

// GET all brands distinct
router.get('/brands', async (req, res) => {
  try {
    const products = await prisma.products.findMany({ select: { brand: true }, distinct: ['brand'], where: { is_active: true } });
    const brands = products.map(p => p.brand).filter(Boolean);
    res.json(brands);
  } catch (error) {
    res.status(500).json([]);
  }
});

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await prisma.categories.findMany({ where: { is_active: true }, orderBy: { sort_order: 'asc' } });
    const mapped = cats.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon || '',
      parentId: c.parent_id
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json([]);
  }
});

// GET Google Merchant Center RSS 2.0 Feed
router.get('/google-feed', async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    });

    const allImages = await prisma.product_images.findMany({ orderBy: { sort_order: 'asc' } });
    const imageMap: Record<string, string[]> = {};
    for (const img of allImages) {
      if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
      imageMap[img.product_id].push(img.image_url);
    }

    const siteUrl = process.env.FRONTEND_URL || 'https://gcnature.com.vn';

    let xml = `<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>GCnature - Mỹ phẩm Hàn Quốc chính hãng</title>
    <link>${siteUrl}</link>
    <description>Mỹ phẩm nội địa Hàn Quốc nhập khẩu chính hãng tốt nhất</description>
`;

    for (const p of products) {
      const sku = p.sku || p.product_id;
      const imgs = imageMap[p.product_id] || [];
      const primaryImg = imgs[0] || '';
      
      const fullProductUrl = `${siteUrl}/product/${p.product_id}`;
      const fullImageUrl = primaryImg.startsWith('http') ? primaryImg : `${siteUrl}${primaryImg}`;
      
      // Clean HTML tags from description
      let cleanDesc = p.description || '';
      cleanDesc = cleanDesc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanDesc.length > 5000) {
        cleanDesc = cleanDesc.substring(0, 4997) + '...';
      }
      if (!cleanDesc) {
        cleanDesc = p.name;
      }

      const escapeXml = (str: string) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      const availability = p.stock && p.stock > 0 ? 'in_stock' : 'out_of_stock';
      const brand = p.brand || detectBrand(p.name);
      
      let googleCategory = 'Health &amp; Beauty &gt; Personal Care &gt; Cosmetics &gt; Skin Care';
      const catName = (p.category_name || '').toLowerCase();
      if (catName.includes('kính') || catName.includes('glasses')) {
        googleCategory = 'Apparel &amp; Accessories &gt; Eye Wear &gt; Sunglasses';
      } else if (catName.includes('robot')) {
        googleCategory = 'Toys &amp; Games &gt; Toys';
      }

      let additionalImagesXml = '';
      if (imgs.length > 1) {
        for (let i = 1; i < imgs.length; i++) {
          const img = imgs[i];
          if (img && !img.toLowerCase().includes('chứng-nhận') && !img.toLowerCase().includes('chung-nhan') && !img.toLowerCase().includes('giấy-phép')) {
            const fullAddImgUrl = img.startsWith('http') ? img : `${siteUrl}${img}`;
            additionalImagesXml += `      <g:additional_image_link>${escapeXml(fullAddImgUrl)}</g:additional_image_link>\n`;
          }
        }
      }

      xml += `    <item>
      <g:id>${escapeXml(sku)}</g:id>
      <title>${escapeXml(p.name)}</title>
      <description>${escapeXml(cleanDesc)}</description>
      <link>${escapeXml(fullProductUrl)}</link>
      <g:image_link>${escapeXml(fullImageUrl)}</g:image_link>
${additionalImagesXml}      <g:availability>${availability}</g:availability>
      <g:price>${p.price} VND</g:price>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:condition>new</g:condition>
    </item>\n`;
    }

    xml += `  </channel>
</rss>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (error) {
    console.error('Generate google feed error:', error);
    res.status(500).send('Error generating feed');
  }
});

// GET Google Merchant Center Promotions RSS 2.0 Feed
router.get('/google-promotions', async (req, res) => {
  try {
    const vouchers = await prisma.vouchers.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' }
    });

    const siteUrl = process.env.FRONTEND_URL || 'https://gcnature.com.vn';

    let xml = `<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>GCnature - Chương trình khuyến mãi</title>
    <link>${siteUrl}</link>
    <description>Mã giảm giá và chương trình khuyến mãi của GCnature</description>
`;

    const escapeXml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    for (const v of vouchers) {
      const start = v.start_date ? new Date(v.start_date).toISOString() : new Date().toISOString();
      const end = v.end_date ? new Date(v.end_date).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      
      const formatIso = (iso: string) => iso.split('.')[0] + 'Z';
      const effectiveDates = `${formatIso(start)}/${formatIso(end)}`;

      let title = v.description || `Mã giảm giá ${v.code}`;
      if (title.length > 80) {
        title = title.substring(0, 77) + '...';
      }

      let couponValueType = 'MONEY_OFF';
      let valueXml = '';
      if (v.discount_type === 'percentage') {
        couponValueType = 'PERCENT_OFF';
        valueXml = `      <g:percent_off>${v.discount_amount}</g:percent_off>\n`;
      } else {
        couponValueType = 'MONEY_OFF';
        valueXml = `      <g:money_off_amount>${v.discount_amount} VND</g:money_off_amount>\n`;
      }

      xml += `    <item>
      <g:promotion_id>${escapeXml(v.code)}</g:promotion_id>
      <g:target_country>VN</g:target_country>
      <g:content_language>vi</g:content_language>
      <title>${escapeXml(title)}</title>
      <g:redemption_channel>online</g:redemption_channel>
      <g:promotion_destination>free_listings</g:promotion_destination>
      <g:promotion_destination>shopping_ads</g:promotion_destination>
      <g:promotion_effective_dates>${effectiveDates}</g:promotion_effective_dates>
      <g:offer_type>generic_code</g:offer_type>
      <g:generic_redemption_code>${escapeXml(v.code)}</g:generic_redemption_code>
      <g:product_applicability>ALL_PRODUCTS</g:product_applicability>
      <g:coupon_value_type>${couponValueType}</g:coupon_value_type>
${valueXml}    </item>\n`;
    }

    xml += `  </channel>
</rss>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (error) {
    console.error('Generate promotions feed error:', error);
    res.status(500).send('Error generating promotions feed');
  }
});

// GET single product by ID or SKU
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let product;

    // Try finding by ID first if it's a number
    if (!isNaN(Number(identifier))) {
      product = await prisma.products.findUnique({ where: { id: Number(identifier) } });
    }

    // If not found, try finding strictly by product_id
    if (!product) {
      product = await prisma.products.findFirst({
        where: { product_id: identifier }
      });
    }

    if (!product || product.is_active === false) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const [images, specs, variants, reviews] = await Promise.all([
      prisma.product_images.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_specs.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_variants.findMany({ where: { product_id: product.product_id }, where: { is_active: true } }),
      prisma.product_reviews.findMany({ where: { product_id: product.product_id, is_active: true }, orderBy: { sort_order: 'asc' } }),
    ]);

    res.json({
      id: product.id,
      productId: product.product_id,
      sku: product.sku || product.product_id,
      name: product.name,
      shortName: product.short_name || '',
      categoryId: product.category_id,
      categoryName: product.category_name || '',
      price: Number(product.price),
      originalPrice: Number(product.original_price),
      discount: product.discount || 0,
      badge: product.badge || '',
      rating: 5.0,
      sold: product.sold || 0,
      stock: product.stock || 0,
      brand: (product.brand && product.brand !== 'Mercy Tech Global') ? product.brand : detectBrand(product.name),
      description: product.description || '',
      seoTags: product.seo_tags || '',
      shopeeUrl: product.shopee_url || '',
      tiktokUrl: product.tiktok_url || '',
      youtubeUrl: product.youtube_url || '',
      isFlashSale: product.is_flash_sale || false,
      flashSalePercent: product.flash_sale_percent || 0,
      isActive: product.is_active !== false,
      featuresVn: product.features_vn || '',
      featuresEn: product.features_en || '',
      footerInfo: product.footer_info || '',
      productionYear: product.production_year,
      clearancePrice: Number(product.clearance_price || 0),
      dailySalePrice: Number(product.daily_sale_price || 0),
      campaignPrice: Number(product.campaign_price || 0),
      offPlatformPrice: Number(product.off_platform_price || 0),
      warrantyData: product.warranty_data || '',
      origin: product.origin || '',
      volume: (product as any).volume || '',
      ingredients: (product as any).ingredients || '',
      image: images.length > 0 ? images[0].image_url : '',
      images: images.map(img => img.image_url), // simplified for frontend
      specs: specs.map(s => ({ id: s.id, label: s.spec_name, value: s.spec_value })),
      variants: variants.map(v => ({ id: v.id, name: v.variant_name })),
      reviews: reviews.map(r => ({ id: r.id, name: r.reviewer_name, avatarLetter: r.avatar_letter, avatarColor: r.avatar_color, rating: 5, date: r.review_date, verified: r.is_verified, text: r.review_text, helpful: r.helpful_count, imageUrl: r.image_url })),
    });
  } catch (error) {
    console.error('Get product detail error (falling back to static mock):', error);
    const identifier = req.params.identifier;
    const fallback = fallbackProducts.find(p => p.sku === identifier || p.productId === identifier || String(p.id) === identifier);
    if (fallback) {
      const mockReviews = fallback.sku === 'TCPHD' ? [
        { id: 1, name: 'Huyền My', avatarLetter: 'M', avatarColor: 'bg-emerald-500', rating: 5, date: '22/06/2026', verified: true, text: 'Serum xài rất mát, thấm nhanh, da mình nhạy cảm dễ ửng đỏ mà bôi em này lên thấy dịu hẳn luôn. Sẽ mua lại!', helpful: 12, imageUrl: '' },
        { id: 2, name: 'Trần Hưng', avatarLetter: 'H', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Sản phẩm chất lượng tốt, lành tính, không cồn không hương liệu hóa học nồng nặc. Phục hồi da mụn cực ổn.', helpful: 8, imageUrl: '' },
        { id: 3, name: 'Ngọc Anh', avatarLetter: 'A', avatarColor: 'bg-cyan-500', rating: 5, date: '25/06/2026', verified: true, text: 'Chất gel mát lạnh, bôi lên da thấm liền không bị bết rít. Mình dùng sau khi peel da thấy hồi phục rất nhanh.', helpful: 15, imageUrl: '' },
        { id: 4, name: 'Lê Thu', avatarLetter: 'T', avatarColor: 'bg-blue-500', rating: 5, date: '26/06/2026', verified: true, text: 'Giao hàng nhanh, đóng gói cẩn thận. Serum cấp ẩm tốt, da đỡ khô ráp hơn nhiều.', helpful: 6, imageUrl: '' }
      ] : fallback.sku === 'TCCA' ? [
        { id: 1, name: 'Minh Thư', avatarLetter: 'T', avatarColor: 'bg-[#5dc1d1]', rating: 5, date: '23/06/2026', verified: true, text: 'Serum dưỡng ẩm siêu đỉnh luôn á, bôi lên da mát mát, căng mịn tức thì luôn. Rất đáng tiền!', helpful: 9, imageUrl: '' },
        { id: 2, name: 'Hoàng Oanh', avatarLetter: 'O', avatarColor: 'bg-emerald-500', rating: 5, date: '24/06/2026', verified: true, text: 'Da khô ráp dùng em này cấp nước quá tuyệt. Mình hay bị mốc nền khi makeup bôi em này lót trước là mịn cả ngày.', helpful: 14, imageUrl: '' },
        { id: 3, name: 'Hải Đăng', avatarLetter: 'Đ', avatarColor: 'bg-teal-500', rating: 5, date: '25/06/2026', verified: true, text: 'Kết cấu thấm nhanh không bết dính. Da đủ nước nhìn căng bóng khỏe mạnh hơn nhiều.', helpful: 7, imageUrl: '' },
        { id: 4, name: 'Thanh Hà', avatarLetter: 'H', avatarColor: 'bg-blue-500', rating: 5, date: '26/06/2026', verified: true, text: 'Giao hàng nhanh, chai thủy tinh dày dặn cầm chắc tay. Cấp ẩm ổn, mùi dịu nhẹ.', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'TCDT' ? [
        { id: 1, name: 'Minh Hạnh', avatarLetter: 'H', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Serum xài mướt mát cực kỳ, mùi cam nhè nhẹ dễ chịu. Mình dùng được hơn 2 tuần thấy mấy vết thâm mụn mới mờ đi rõ rệt, da cũng sáng và đều màu hơn.', helpful: 10, imageUrl: '' },
        { id: 2, name: 'Kim Chi', avatarLetter: 'C', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Vitamin C dạng SAP này êm ru luôn nha, da nhạy cảm như mình bôi lên không hề bị châm chích hay đỏ rát gì cả. Serum thấm nhanh, không bết rít.', helpful: 8, imageUrl: '' },
        { id: 3, name: 'Thanh Trúc', avatarLetter: 'T', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Sản phẩm đóng gói rất cẩn thận, chai thủy tinh sẫm màu bảo quản tốt. Mình dùng kết hợp kem chống nắng ban ngày thấy da căng mịn và nâng tông rõ hơn.', helpful: 12, imageUrl: '' },
        { id: 4, name: 'Hồng Ngọc', avatarLetter: 'N', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Mua đúng đợt sale giá tốt quá trời. Serum lỏng nhẹ, cấp ẩm tốt, kiềm dầu ổn định. Dùng rất thích!', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'KDNTTU' ? [
        { id: 1, name: 'Minh Vy', avatarLetter: 'V', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Kem dưỡng nâng tông siêu tự nhiên luôn nha, không hề bị lộ vân kem hay bị vón cục tí nào. Mình hay dùng em này thay kem lót trước khi makeup thấy nền mịn đẹp cả ngày.', helpful: 9, imageUrl: '' },
        { id: 2, name: 'Ngọc Diệp', avatarLetter: 'D', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Chất kem mềm mịn, dễ tán, nâng tông sáng hồng nhẹ nhàng nhìn rất tự nhiên chứ không bị trắng bệch. Đặc biệt là có chứa DNA cá hồi dưỡng da căng bóng thích lắm.', helpful: 14, imageUrl: '' },
        { id: 3, name: 'Thùy Trang', avatarLetter: 'T', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Cấp ẩm rất tốt, da mềm mượt cả ngày không bị khô mốc. Mùi thơm hoa cúc dịu nhẹ dễ chịu lắm. Rất ưng ý sản phẩm này của hãng.', helpful: 7, imageUrl: '' },
        { id: 4, name: 'Bảo Trâm', avatarLetter: 'B', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Đã nhận hàng, đóng gói cẩn thận. Kem thấm nhanh, không gây nhờn rít, nâng tông nhẹ nhàng hợp đi làm đi học hàng ngày. Sẽ ủng hộ shop tiếp.', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'MMC' ? [
        { id: 1, name: 'Thu Thảo', avatarLetter: 'T', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Mặt nạ đắp siêu thích luôn á, ôm khít mặt cực kỳ. Tinh chất nhiều dã man, bôi thêm được cả cổ với tay nữa. Đắp xong da căng mướt, dịu đỏ hẳn.', helpful: 12, imageUrl: '' },
        { id: 2, name: 'Hồng Vân', avatarLetter: 'V', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Da nhạy cảm như mình đắp em này êm ru. Cấp ẩm tốt, mỏng nhẹ, không bị bết dính tí nào. Mình hay bỏ ngăn mát tủ lạnh đắp phê thôi rồi.', helpful: 8, imageUrl: '' },
        { id: 3, name: 'Quỳnh Chi', avatarLetter: 'C', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Mặt nạ chất liệu ôm khít mặt, đắp mát lạnh thư giãn cực kỳ. Cấp ẩm sâu, sáng hôm sau ngủ dậy da vẫn mọng mượt không bị đổ dầu nhiều.', helpful: 14, imageUrl: '' },
        { id: 4, name: 'Lan Anh', avatarLetter: 'A', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Giao hàng nhanh, đóng gói cẩn thận. Đắp xong da mềm mịn căng bóng thích lắm nha mọi người. Đã mua lại lần 2.', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'MMH' ? [
        { id: 1, name: 'Thu Hương', avatarLetter: 'H', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Đắp miếng mặt nạ này xong thấy da mướt mát căng mọng tức thì luôn á. Da khô ráp thiếu nước đắp em này cực kỳ hợp lý.', helpful: 14, imageUrl: '' },
        { id: 2, name: 'Ngọc Mai', avatarLetter: 'M', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Chất mask mỏng nhẹ ôm khít mặt, tinh chất HA thấm rất tốt không bị dính nhớp nháp. Sáng dậy da căng bóng mịn màng.', helpful: 9, imageUrl: '' },
        { id: 3, name: 'Hương Giang', avatarLetter: 'G', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Cấp nước siêu đỉnh, làm dịu da cháy nắng nhanh cực kỳ. Mùi thơm thảo mộc dịu nhẹ, đắp thư giãn lắm.', helpful: 10, imageUrl: '' },
        { id: 4, name: 'Phương Vy', avatarLetter: 'V', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Mặt nạ dùng rất tốt, giá cả hợp lý so với chất lượng. Da đủ ẩm nhìn căng mượt hẳn lên. Sẽ tiếp tục mua ủng hộ hãng.', helpful: 6, imageUrl: '' }
      ] : fallback.sku === 'MVC' ? [
        { id: 1, name: 'Khánh Linh', avatarLetter: 'L', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Mặt nạ đắp cực thích luôn, da sáng mịn thấy rõ sau vài lần đắp. Các vết thâm mụn cũng mờ nhanh hơn hẳn.', helpful: 11, imageUrl: '' },
        { id: 2, name: 'Tuyết Mai', avatarLetter: 'M', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Mùi vitamin C dịu nhẹ thơm mát, đắp xong da mướt mát không bị châm chích hay khó chịu chút nào. Cấp ẩm tốt nữa.', helpful: 7, imageUrl: '' },
        { id: 3, name: 'Phương Thảo', avatarLetter: 'T', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Chất mặt nạ mỏng nhẹ bám khít da mặt, đắp rất sướng. Dùng xong da căng bóng và đều màu hơn. Sẽ tiếp tục mua.', helpful: 13, imageUrl: '' },
        { id: 4, name: 'Ngọc Trinh', avatarLetter: 'T', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Hàng chính hãng đóng gói cẩn thận. Đắp mặt nạ xong vỗ nhẹ tinh chất thấm hết không bị bết rít. Đánh giá 5 sao cho shop.', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'TCDD' ? [
        { id: 1, name: 'Minh Tú', avatarLetter: 'T', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Ampoule dùng cực đỉnh luôn, da căng bóng sờ vào mướt mịn thích lắm. Tinh chất thấm nhanh, không hề bị dính hay nặng mặt tí nào.', helpful: 15, imageUrl: '' },
        { id: 2, name: 'Thanh Vân', avatarLetter: 'V', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Sản phẩm cao cấp, đáng đồng tiền bát gạo. Da đàn hồi tốt hơn hẳn, sáng khỏe mịn màng lên thấy rõ sau 2 tuần sử dụng.', helpful: 8, imageUrl: '' },
        { id: 3, name: 'Kim Oanh', avatarLetter: 'O', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Mùi hương sang trọng dịu nhẹ. Da khô ráp xài em này phục hồi cấp ẩm cực tốt, lỗ chân lông cũng được cải thiện.', helpful: 10, imageUrl: '' },
        { id: 4, name: 'Thùy Lâm', avatarLetter: 'L', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Đóng gói đẹp, giao nhanh. Tinh chất PDRN hỗ trợ chống lão hoá và nâng cơ mặt rất hiệu quả. Rất khuyên dùng!', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'TCTT' ? [
        { id: 1, name: 'Hồng Đào', avatarLetter: 'Đ', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Tinh chất Medi-PDRN này xài siêu thích nha, da sáng mịn màng và căng bóng rõ rệt. Cực kỳ lành tính, không châm chích.', helpful: 12, imageUrl: '' },
        { id: 2, name: 'Mai Phương', avatarLetter: 'P', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Hàng xịn xò chuẩn Hàn Quốc luôn. Da căng mướt đủ ẩm suốt cả ngày, các nếp nhăn li ti khoé mắt cũng được cải thiện rất nhiều.', helpful: 7, imageUrl: '' },
        { id: 3, name: 'Bảo Trâm', avatarLetter: 'T', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Chất serum thấm nhanh cực kỳ, da đều màu và sáng hẳn lên sau khi dùng hết 1 chai. Sẽ tiếp tục mua ủng hộ GC Nature.', helpful: 9, imageUrl: '' },
        { id: 4, name: 'Kiều Trang', avatarLetter: 'T', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Shop giao nhanh, đóng gói cẩn thận. Ampoule tinh chất cá hồi xài đáng đồng tiền lắm mọi người ơi, da săn chắc căng mọng.', helpful: 4, imageUrl: '' }
      ] : fallback.sku === 'TCTCT' ? [
        { id: 1, name: 'Hoàng Yến', avatarLetter: 'Y', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Chất skin booster ampoule đắp lên da thẩm thấu siêu nhanh, làm dịu các nốt mẩn đỏ tức thì. Da căng bóng chuẩn Hàn luôn.', helpful: 14, imageUrl: '' },
        { id: 2, name: 'Bích Thủy', avatarLetter: 'T', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Tinh chất PDRN cá hồi phục hồi da mỏng yếu cực kỳ hiệu quả, dùng kết hợp trước khi makeup làm lớp nền mịn màng bóng khỏe hẳn.', helpful: 9, imageUrl: '' },
        { id: 3, name: 'Hương Thảo', avatarLetter: 'T', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Sản phẩm tuyệt vời, da đàn hồi căng mướt và sáng đều màu hơn rõ rệt. Không hề gây bí bách hay mụn ẩn cho da dầu nhạy cảm.', helpful: 11, imageUrl: '' },
        { id: 4, name: 'Thu Trang', avatarLetter: 'T', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Giao hàng siêu tốc, đóng gói rất kỹ lưỡng. Sử dụng thấy da khỏe, dày và giảm đỏ sau mụn nhanh chóng. Đánh giá 5 sao!', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'GGC' ? [
        { id: 1, name: 'Minh Thư', avatarLetter: 'T', avatarColor: 'bg-teal-500', rating: 5, date: '24/06/2026', verified: true, text: 'Gel xài siêu thích luôn, thoa lên da mát mát sau đó nóng nhẹ cực kỳ thư giãn. Da săn chắc và mượt mà rõ rệt sau 2 tuần massage.', helpful: 12, imageUrl: '' },
        { id: 2, name: 'Thanh Hà', avatarLetter: 'H', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Thẩm thấu nhanh lắm không bị bết rít tẹo nào. Vừa dùng vừa tập thể dục kết quả thon gọn bắp tay rất khả quan nha.', helpful: 8, imageUrl: '' },
        { id: 3, name: 'Khánh An', avatarLetter: 'A', avatarColor: 'bg-cyan-500', rating: 5, date: '26/06/2026', verified: true, text: 'Chất gel mỏng nhẹ mùi thơm thảo dược dễ chịu. Da bụng bớt sần sùi hẳn, láng mịn săn chắc lắm luôn. Cực kỳ ưng ý.', helpful: 10, imageUrl: '' },
        { id: 4, name: 'Phương Trinh', avatarLetter: 'T', avatarColor: 'bg-blue-500', rating: 5, date: '27/06/2026', verified: true, text: 'Giao hàng nhanh, đóng gói cẩn thận. Mình kết hợp bôi gel massage bụng mỗi tối, thấy da săn lại không bị chùng nhão nữa.', helpful: 5, imageUrl: '' }
      ] : fallback.sku === 'TCVKTT' ? [
        { id: 1, name: 'Bảo Ngọc', avatarLetter: 'N', avatarColor: 'bg-violet-500', rating: 5, date: '24/06/2026', verified: true, text: 'Bộ kit vi kim này quá xịn luôn! Lần đầu thoa Spicule Cream thấy tê nhẹ nhẹ rồi bôi ampoule PDRN lên thấy thấm sâu ngay. Da mịn căng hẳn sau tuần đầu.', helpful: 18, imageUrl: '' },
        { id: 2, name: 'Lan Phương', avatarLetter: 'P', avatarColor: 'bg-pink-500', rating: 5, date: '25/06/2026', verified: true, text: 'Lỗ chân lông se khít rõ ràng sau 2 tuần dùng. Trước giờ mình hay đi spa vi kim tốn nhiều tiền, giờ dùng kit này tại nhà tiện lợi hơn nhiều mà hiệu quả không thua.', helpful: 14, imageUrl: '' },
        { id: 3, name: 'Hồng Nhung', avatarLetter: 'N', avatarColor: 'bg-rose-500', rating: 5, date: '26/06/2026', verified: true, text: 'Da sáng đều hẳn, các vết thâm sau mụn mờ dần rõ rệt. Bộ đôi ampoule + kem vi kim phối hợp chuẩn khoa học lắm, dưỡng chất thấm sâu hơn dùng riêng lẻ nhiều.', helpful: 11, imageUrl: '' },
        { id: 4, name: 'Tú Anh', avatarLetter: 'A', avatarColor: 'bg-purple-500', rating: 5, date: '27/06/2026', verified: true, text: 'Sản phẩm được cấp bảo hộ sáng chế nên mình rất tin tưởng. Thoa lên da thấy nhẹ nhàng dễ chịu, không kích ứng gì. Da căng bóng và mịn hơn sau vài lần sử dụng.', helpful: 9, imageUrl: '' }
      ] : fallback.sku === 'KCNCN.SL' ? [
        { id: 1, name: 'Thu Hiền', avatarLetter: 'H', avatarColor: 'bg-amber-500', rating: 5, date: '24/06/2026', verified: true, text: 'Kem chống nắng này thật sự quá xịn luôn! Thoa lên da mát lạnh tức thì, thẩm thấu nhanh, không bóng dầu. Da sáng tự nhiên như kiểu có filter nhẹ.', helpful: 16, imageUrl: '' },
        { id: 2, name: 'Ngọc Mai', avatarLetter: 'M', avatarColor: 'bg-orange-500', rating: 5, date: '25/06/2026', verified: true, text: 'Đi biển cả ngày mà kem vẫn bám tốt, da không bị cháy nắng. Kháng nước rất ổn, bơi xong lên khô da vẫn không cảm thấy cần thoa lại ngay.', helpful: 13, imageUrl: '' },
        { id: 3, name: 'Phương Uyên', avatarLetter: 'U', avatarColor: 'bg-yellow-500', rating: 5, date: '26/06/2026', verified: true, text: 'Mình da dầu mà dùng không bị bóng nhờn gì hết. Tone da sáng lên tự nhiên, không bị vệt trắng hay màu lạ. Mùi thơm dễ chịu, rất thích.', helpful: 10, imageUrl: '' },
        { id: 4, name: 'Bảo Trân', avatarLetter: 'T', avatarColor: 'bg-lime-500', rating: 5, date: '27/06/2026', verified: true, text: 'SPF 50+ PA++++ mà không gây nặng mặt, kết cấu rất mỏng nhẹ. Dùng làm bước chống nắng cuối cùng trước khi trang điểm thấy nền phấn rất mịn và dễ blending.', helpful: 8, imageUrl: '' }
      ] : fallback.sku === 'TCDTD50' ? [
        { id: 1, name: 'Minh Châu', avatarLetter: 'C', avatarColor: 'bg-green-500', rating: 5, date: '24/06/2026', verified: true, text: 'Serum nhân sâm này dịu nhẹ mà hiệu quả thật sự bất ngờ. Mình dùng 2 tuần thấy da sáng dần đều, các vết thâm sau mụn mờ đi rõ rệt. Mùi nhân sâm rất dễ chịu.', helpful: 19, imageUrl: '' },
        { id: 2, name: 'Yến Nhi', avatarLetter: 'N', avatarColor: 'bg-emerald-500', rating: 5, date: '25/06/2026', verified: true, text: 'Thẩm thấu siêu nhanh, không cần chờ lâu là có thể tiếp tục bước dưỡng ẩm liền. Da mịn căng sau mỗi lần thoa, cảm giác da được nuôi dưỡng từ sâu bên trong.', helpful: 14, imageUrl: '' },
        { id: 3, name: 'Hà Trang', avatarLetter: 'T', avatarColor: 'bg-teal-500', rating: 5, date: '26/06/2026', verified: true, text: '62% nhân sâm quý nguyên chất nghe là thích liền. Dùng thấy da đều màu hẳn, nám nhạt dần sau 1 tháng kiên trì. Serum lành tính mà hiệu quả, rất xứng đáng.', helpful: 12, imageUrl: '' },
        { id: 4, name: 'Ngọc Anh', avatarLetter: 'A', avatarColor: 'bg-cyan-500', rating: 5, date: '27/06/2026', verified: true, text: 'Da mình nhạy cảm dễ kích ứng nhưng dùng serum này hoàn toàn ổn. Niacinamide 5% mờ thâm rất tốt, kết hợp adenosine da sáng và căng đều.', helpful: 9, imageUrl: '' }
      ] : [];

      return res.json({
        ...fallback,
        images: fallback.images.split(','),
        specs: [{ id: 1, label: "Thương hiệu", value: "GC Nature" }, { id: 2, label: "Xuất xứ", value: "Hàn Quốc" }],
        variants: [],
        reviews: mockReviews
      });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══ TEMPORARY: Fix categories endpoint (REMOVE AFTER USE) ═══
router.post('/fix-categories', async (req, res) => {
  try {
    const skuCategoryMap: Record<string, string> = {
      'MCK6.0': 'Kính Thông Minh AI',
      'MCK5.0Đôi': 'Kính Thông Minh AI',
      'MCK5.0T': 'Kính Thông Minh AI',
      'MCK5.0D': 'Kính Thông Minh AI',
      'MCK5.1Đôi': 'Kính Thông Minh AI',
      'MCK5.1T': 'Kính Thông Minh AI',
      'MCK5.1D': 'Kính Thông Minh AI',
      'KDT5.0Đôi': 'Kính Dịch Thuật',
      'KDT5.0T': 'Kính Dịch Thuật',
      'KDT5.0D': 'Kính Dịch Thuật',
      'KDT5.1Đôi': 'Kính Dịch Thuật',
      'KDT5.1T': 'Kính Dịch Thuật',
      'KDT5.1D': 'Kính Dịch Thuật',
      'POV5.0Đôi': 'Kính Có Camera',
      'POV5.0T': 'Kính Có Camera',
      'POV5.0D': 'Kính Có Camera',
      'POV5.1Đôi': 'Kính Có Camera',
      'POV5.1T': 'Kính Có Camera',
      'POV5.1D': 'Kính Có Camera',
      'RBnu-capy': 'Robot AI',
      'RBnu-gautruc': 'Robot AI',
      'RBnu-Tho': 'Robot AI',
      'BD1': 'Phụ Kiện',
    };

    function getCategoryByPrefix(sku: string): string | null {
      if (sku.startsWith('MCK')) return 'Kính Thông Minh AI';
      if (sku.startsWith('KDT')) return 'Kính Dịch Thuật';
      if (sku.startsWith('POV')) return 'Kính Có Camera';
      if (sku.startsWith('RB')) return 'Robot AI';
      if (sku.startsWith('BD')) return 'Phụ Kiện';
      return null;
    }

    const products = await prisma.products.findMany({
      select: { id: true, product_id: true, sku: true, name: true, category_name: true }
    });

    let updated = 0;
    let skipped = 0;
    const results: string[] = [];

    for (const p of products) {
      const sku = p.sku || p.product_id;
      const correctCategory = skuCategoryMap[sku] || getCategoryByPrefix(sku);

      if (!correctCategory) {
        results.push(`⚠️ ${sku} (id:${p.id}) - unknown SKU, kept: "${p.category_name}"`);
        continue;
      }

      if (p.category_name === correctCategory) {
        skipped++;
        continue;
      }

      results.push(`🔄 ${sku} (id:${p.id}): "${p.category_name}" → "${correctCategory}"`);
      await prisma.products.update({
        where: { id: p.id },
        data: { category_name: correctCategory }
      });
      updated++;
    }

    res.json({ updated, skipped, total: products.length, results });
  } catch (error) {
    console.error('Fix categories error:', error);
    res.status(500).json({ message: 'Lỗi cập nhật categories' });
  }
});

export default router;
