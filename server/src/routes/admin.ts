import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '../config';
import { isAdmin, isEditor, isShopManager } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Setup sub-routers to intercept prefix matching request paths and apply proper RBAC rules
const adminOnlyRouter = express.Router();
adminOnlyRouter.use(isAdmin);

// Update user info - accessible by admin and shop_manager (for CRM customer edits)
router.put('/members/:id', isShopManager, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, role } = req.body;
    const currentUserRole = (req.user as any)?.role;
    
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Validate role changes - ONLY admin can select/change roles!
    if (role !== undefined && role !== user.role) {
      if (currentUserRole !== 'admin') {
        return res.status(403).json({ message: 'Chỉ quản trị viên mới được quyền thay đổi vai trò của thành viên' });
      }

      const allowedRoles = ['customer', 'admin', 'editor', 'shop_manager'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Vai trò không hợp lệ' });
      }
      
      // Prevent self demotion
      if (user.id === (req.user as any)?.id && user.role === 'admin' && role !== 'admin') {
        return res.status(403).json({ message: 'Không thể tự tước quyền Admin của chính mình' });
      }
    }

    const updateData: any = { updated_at: new Date() };
    if (name !== undefined) updateData.full_name = name;
    if (phone !== undefined) updateData.phone = phone;
    // Only apply role update if sent and user is admin
    if (role !== undefined && currentUserRole === 'admin') {
      updateData.role = role as any;
    }

    const updated = await prisma.users.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, full_name: true, phone: true, role: true },
    });

    res.json({ 
      id: updated.id, 
      email: updated.email, 
      name: updated.full_name, 
      phone: updated.phone,
      role: updated.role 
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.use('/members', adminOnlyRouter);
router.use('/spam-check', adminOnlyRouter);

const shopRouter = express.Router();
shopRouter.use(isShopManager);
router.use('/orders', shopRouter);
router.use('/products', shopRouter);
router.use('/analytics', shopRouter);
router.use('/crm', shopRouter);

const editorRouter = express.Router();
editorRouter.use(isEditor);
router.use('/articles', editorRouter);

// ═══════════════════════════════════
// MEMBERS (Users)
// ═══════════════════════════════════

// GET all users
router.get('/members', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true, email: true, full_name: true, username: true, role: true,
        phone: true, is_active: true, created_at: true,
        register_ip: true, last_login_at: true, user_agent: true,
        _count: { select: { orders: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    const mapped = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.full_name || u.username,
      role: u.role,
      phone: u.phone,
      isActive: u.is_active,
      createdAt: u.created_at,
      registerIp: u.register_ip,
      lastLoginAt: u.last_login_at,
      userAgent: u.user_agent,
      orderCount: u._count.orders,
    }));
    res.json(mapped);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Update user role
router.put('/members/:id/role', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body;
    const allowedRoles = ['customer', 'admin', 'editor', 'shop_manager'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ' });
    }
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Protect Super Admin permanent account
    if (user.email === 'gcnatureofficial@gmail.com') {
      return res.status(403).json({ message: 'Tài khoản gcnatureofficial@gmail.com là Quản trị viên Tối cao Vĩnh viễn, không thể thay đổi vai trò!' });
    }

    // Prevent self demotion
    if (user.id === (req.user as any)?.id && user.role === 'admin' && role !== 'admin') {
      return res.status(403).json({ message: 'Không thể tự tước quyền Admin của chính mình' });
    }

    const updated = await prisma.users.update({
      where: { id },
      data: { role: role as any },
      select: { id: true, email: true, full_name: true, role: true },
    });
    res.json({ id: updated.id, email: updated.email, name: updated.full_name, role: updated.role });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Delete user
router.delete('/members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({ where: { id }, select: { role: true, email: true } });
    
    // Protect Super Admin permanent account
    if (user?.email === 'gcnatureofficial@gmail.com' || user?.role === 'admin') {
      return res.status(403).json({ message: 'Không thể xóa tài khoản Quản trị viên Vĩnh viễn' });
    }
    
    // Delete carts first to prevent foreign key constraint errors
    await prisma.cart.deleteMany({ where: { user_id: id } });
    
    await prisma.users.delete({ where: { id } });
    res.json({ message: 'Đã xóa thành viên' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══ Spam Check ═══════════════════════════════════════════
router.get('/spam-check', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      where: { role: 'customer' },
      select: {
        id: true, email: true, full_name: true, username: true,
        register_ip: true, last_login_at: true, user_agent: true,
        created_at: true, is_active: true,
        _count: { select: { orders: true } },
      },
    });

    // Count IPs
    const ipCounts = new Map<string, number>();
    users.forEach(u => {
      if (u.register_ip) {
        ipCounts.set(u.register_ip, (ipCounts.get(u.register_ip) || 0) + 1);
      }
    });

    // Count user agents for device fingerprinting
    const uaCounts = new Map<string, number>();
    users.forEach(u => {
      if (u.user_agent) {
        uaCounts.set(u.user_agent, (uaCounts.get(u.user_agent) || 0) + 1);
      }
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const spamUsers = users.map(u => {
      const reasons: string[] = [];
      const ipCount = u.register_ip ? (ipCounts.get(u.register_ip) || 0) : 0;

      if (ipCount >= 3) reasons.push(`IP trùng (${ipCount} tài khoản)`);
      if (u._count.orders === 0) reasons.push('Không có đơn hàng');
      if (!u.last_login_at || u.last_login_at < thirtyDaysAgo) reasons.push('Không đăng nhập 30 ngày');

      return {
        id: u.id,
        email: u.email,
        name: u.full_name || u.username,
        registerIp: u.register_ip,
        lastLoginAt: u.last_login_at,
        userAgent: u.user_agent,
        createdAt: u.created_at,
        orderCount: u._count.orders,
        ipCount,
        spamReasons: reasons,
        isSpam: reasons.length >= 2, // at least 2 spam signals
      };
    }).filter(u => u.isSpam);

    // Sort by IP count desc
    spamUsers.sort((a, b) => b.ipCount - a.ipCount);

    res.json({
      total: spamUsers.length,
      stats: {
        duplicateIp: spamUsers.filter(u => u.spamReasons.some(r => r.includes('IP'))).length,
        noOrders: spamUsers.filter(u => u.spamReasons.some(r => r.includes('đơn'))).length,
        inactive: spamUsers.filter(u => u.spamReasons.some(r => r.includes('30'))).length,
      },
      users: spamUsers,
    });
  } catch (error) {
    console.error('Spam check error:', error);
    res.status(500).json({ message: 'Lỗi kiểm tra spam' });
  }
});

// ═══ Bulk Delete ══════════════════════════════════════════
router.post('/members/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách ID trống' });
    }

    // Filter out admin accounts
    const admins = await prisma.users.findMany({
      where: { id: { in: ids }, role: 'admin' },
      select: { id: true },
    });
    const adminIds = new Set(admins.map(a => a.id));
    const safeIds = ids.filter((id: number) => !adminIds.has(id));

    if (safeIds.length === 0) {
      return res.status(400).json({ message: 'Không thể xóa tài khoản admin' });
    }

    // Process in batches to avoid DB timeouts
    const BATCH_SIZE = 500;
    let totalDeleted = 0;

    for (let i = 0; i < safeIds.length; i += BATCH_SIZE) {
      const batch = safeIds.slice(i, i + BATCH_SIZE);

      // Delete related data first to prevent foreign key constraint errors
      // Delete order items for orders belonging to these users
      const userOrders = await prisma.orders.findMany({
        where: { user_id: { in: batch } },
        select: { id: true },
      });
      const orderIds = userOrders.map(o => o.id);
      if (orderIds.length > 0) {
        await prisma.order_items.deleteMany({ where: { order_id: { in: orderIds } } });
        await prisma.orders.deleteMany({ where: { id: { in: orderIds } } });
      }

      // Delete carts
      await prisma.cart.deleteMany({ where: { user_id: { in: batch } } });

      // Delete users
      const result = await prisma.users.deleteMany({ where: { id: { in: batch } } });
      totalDeleted += result.count;
    }

    res.json({
      message: `Đã xóa ${totalDeleted} tài khoản${adminIds.size > 0 ? ` (bỏ qua ${adminIds.size} admin)` : ''}`,
      deleted: totalDeleted,
      skippedAdmins: adminIds.size,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ message: 'Lỗi xóa hàng loạt' });
  }
});

// Old update user info route removed (moved to top level for shop manager accessibility with admin role checks)


// ═══════════════════════════════════
// CUSTOMERS (Users & Guests with Orders)
// ═══════════════════════════════════

router.get('/customers/export', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      where: { role: { not: 'admin' } },
      include: {
        orders: {
          include: {
            order_items: true
          }
        }
      }
    });

    const guestOrders = await prisma.orders.findMany({
      where: { user_id: null },
      include: {
        order_items: true
      }
    });

    const exportData: any[] = [];

    users.forEach(u => {
      const validOrders = u.orders.filter(o => ['confirmed', 'shipping', 'delivered'].includes(o.status || ''));
      const totalSpent = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      
      const addresses = new Set<string>();
      if (u.address) addresses.add(u.address);
      u.orders.forEach(o => {
        if (o.shipping_address) addresses.add(o.shipping_address);
      });
      const finalAddress = Array.from(addresses).join('; ') || '—';

      const productsMap = new Map<string, number>();
      u.orders.forEach(o => {
        o.order_items.forEach(oi => {
          const key = oi.product_name;
          productsMap.set(key, (productsMap.get(key) || 0) + oi.quantity);
        });
      });
      const purchasedProducts = Array.from(productsMap.entries())
        .map(([name, qty]) => `${name} (SL: ${qty})`)
        .join(', ') || '—';

      const orderHistoryList = u.orders.map(o => {
        const dateStr = new Date(o.created_at).toLocaleDateString('vi-VN');
        const statusMap: Record<string, string> = {
          pending: "Chờ xử lý",
          confirmed: "Đã xác nhận",
          shipping: "Đang giao",
          delivered: "Đã giao",
          cancelled: "Đã hủy"
        };
        const statusText = statusMap[o.status || ''] || o.status;
        return `${o.order_code} (${dateStr} - ${Number(o.total || 0).toLocaleString('vi-VN')}đ - ${statusText})`;
      }).join('; ') || '—';

      exportData.push({
        name: u.full_name || u.username,
        email: u.email || '—',
        phone: u.phone || '—',
        spent: totalSpent,
        address: finalAddress,
        products: purchasedProducts,
        history: orderHistoryList,
        type: 'Thành viên'
      });
    });

    const guestGroups = new Map<string, any>();
    guestOrders.forEach(o => {
      const key = o.customer_phone || o.customer_email || o.customer_name || 'guest';
      if (!guestGroups.has(key)) {
        guestGroups.set(key, {
          name: o.customer_name || 'Khách vãng lai',
          email: o.customer_email || '—',
          phone: o.customer_phone || '—',
          spent: 0,
          addresses: new Set(),
          productsMap: new Map(),
          orderList: [],
          type: 'Khách vãng lai'
        });
      }

      const g = guestGroups.get(key);
      if (['confirmed', 'shipping', 'delivered'].includes(o.status || '')) {
        g.spent += Number(o.total || 0);
      }
      if (o.shipping_address) {
        g.addresses.add(o.shipping_address);
      }
      o.order_items.forEach(oi => {
        const pName = oi.product_name;
        g.productsMap.set(pName, (g.productsMap.get(pName) || 0) + oi.quantity);
      });
      g.orderList.push({
        code: o.order_code,
        date: o.created_at,
        total: o.total,
        status: o.status
      });
    });

    guestGroups.forEach(g => {
      const purchasedProducts = Array.from(g.productsMap.entries())
        .map(([name, qty]) => `${name} (SL: ${qty})`)
        .join(', ') || '—';

      const orderHistoryList = g.orderList.map((o: any) => {
        const dateStr = new Date(o.date).toLocaleDateString('vi-VN');
        const statusMap: Record<string, string> = {
          pending: "Chờ xử lý",
          confirmed: "Đã xác nhận",
          shipping: "Đang giao",
          delivered: "Đã giao",
          cancelled: "Đã hủy"
        };
        const statusText = statusMap[o.status || ''] || o.status;
        return `${o.code} (${dateStr} - ${Number(o.total || 0).toLocaleString('vi-VN')}đ - ${statusText})`;
      }).join('; ') || '—';

      exportData.push({
        name: g.name,
        email: g.email,
        phone: g.phone,
        spent: g.spent,
        address: Array.from(g.addresses).join('; ') || '—',
        products: purchasedProducts,
        history: orderHistoryList,
        type: g.type
      });
    });

    exportData.sort((a, b) => b.spent - a.spent);
    res.json(exportData);
  } catch (err) {
    console.error('Export customers error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const usersWithOrders = await prisma.users.findMany({
      where: {
        role: { not: 'admin' },
        orders: { some: {} }
      },
      include: {
        orders: { select: { id: true, order_code: true, total: true, status: true, created_at: true } }
      }
    });

    const guestOrders = await prisma.orders.findMany({
      where: { user_id: null },
      select: { customer_name: true, customer_email: true, customer_phone: true, order_code: true, total: true, status: true, created_at: true }
    });

    const customers = usersWithOrders.map(u => {
      const validOrders = u.orders.filter(o => ['confirmed', 'shipping', 'delivered'].includes(o.status));
      return {
        id: `U${u.id}`,
        userId: u.id,
        name: u.full_name || u.username,
        email: u.email || '—',
        phone: u.phone || '—',
        role: u.role,
        orders: u.orders.length,
        spent: validOrders.reduce((sum, o) => sum + Number(o.total), 0),
        joined: u.created_at,
        orderList: u.orders.map(o => ({
           id: o.order_code,
           total: Number(o.total),
           status: o.status,
           date: o.created_at
        }))
      }
    });

    const guestMap = new Map();
    guestOrders.forEach(o => {
      const key = o.customer_phone || o.customer_email || o.customer_name;
      if (!guestMap.has(key)) {
         guestMap.set(key, {
           id: `G_${key}`,
           name: o.customer_name || 'Khách vãng lai',
           email: o.customer_email || '—',
           phone: o.customer_phone || '—',
           orders: 0,
           spent: 0,
           joined: o.created_at,
           orderList: []
         });
      }
      const g = guestMap.get(key);
      g.orders++;
      if (['confirmed', 'shipping', 'delivered'].includes(o.status)) {
        g.spent += Number(o.total);
      }
      g.orderList.push({
         id: o.order_code,
         total: Number(o.total),
         status: o.status,
         date: o.created_at
      });
    });

    const finalCustomers = [...customers, ...Array.from(guestMap.values())].sort((a, b) => b.spent - a.spent);
    res.json(finalCustomers);
  } catch (err) {
    console.error('Get customers error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// ORDERS
// ═══════════════════════════════════

// GET all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
      include: { order_items: true },
      orderBy: { created_at: 'desc' },
    });
    // Map to frontend expected format
    const mapped = orders.map(o => {
      let isDeposit = false;
      let isRefunded = false;
      let cleanTransferContent = o.notes || '';
      
      if (cleanTransferContent.includes('[REFUNDED]')) {
        isRefunded = true;
        cleanTransferContent = cleanTransferContent.replace('[REFUNDED] ', '').replace('[REFUNDED]', '');
      }

      if (cleanTransferContent.includes('[DEPOSIT]')) {
        isDeposit = true;
        cleanTransferContent = cleanTransferContent.replace('[DEPOSIT] ', '').replace('[DEPOSIT]', '');
      } else if (cleanTransferContent.includes('[FULL]')) {
        cleanTransferContent = cleanTransferContent.replace('[FULL] ', '').replace('[FULL]', '');
      }

      let finalPaymentMethod = isDeposit ? 'deposit' : 'full';
      if (o.payment_method === 'cod') finalPaymentMethod = 'cod';
      if (o.payment_method === 'ewallet') finalPaymentMethod = 'ewallet';

      return {
      id: o.id,
      orderCode: o.order_code,
      userId: o.user_id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: o.customer_email,
      shippingAddress: o.shipping_address,
      subtotal: Number(o.subtotal),
      discountAmount: Number(o.discount_amount),
      shippingFee: Number(o.shipping_fee),
      total: Number(o.total),
      paymentMethod: finalPaymentMethod,
      status: o.status === 'cancelled' && isRefunded ? 'refunded' : o.status,
      notes: cleanTransferContent,
      ipAddress: o.ip_address,
      paymentStatus: o.payment_status,
      paymentRef: o.payment_ref,
      paymentAmount: Number(o.payment_amount),
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      items: o.order_items.map(i => ({
        id: i.id,
        productId: i.product_id,
        productName: i.product_name,
        variantName: i.variant_name,
        warrantyName: i.warranty_name,
        warrantyFee: Number(i.warranty_fee || 0),
        price: Number(i.price),
        originalPrice: Number(i.original_price),
        quantity: i.quantity,
        imageUrl: i.image_url,
      })),
    };
    });
    res.json(mapped);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let { status } = req.body;
    let isRefunded = false;

    if (status === 'refunded') {
      status = 'cancelled';
      isRefunded = true;
    }

    const orderObj = await prisma.orders.findUnique({ where: { id } });
    if (!orderObj) return res.status(404).json({ message: 'Order not found' });

    const oldStatus = orderObj.status;

    let finalNotes = orderObj.notes || '';
    if (isRefunded && !finalNotes.includes('[REFUNDED]')) {
      finalNotes = `[REFUNDED] ${finalNotes}`;
    } else if (!isRefunded && finalNotes.includes('[REFUNDED]')) {
      finalNotes = finalNotes.replace('[REFUNDED] ', '').replace('[REFUNDED]', '');
    }

    const order = await prisma.orders.update({
      where: { id },
      data: { status, notes: finalNotes },
    });

    // Increment user's lucky spins when order transitions to 'delivered'
    if (oldStatus !== 'delivered' && status === 'delivered' && order.user_id) {
      try {
        await prisma.users.update({
          where: { id: order.user_id },
          data: { lucky_spins_count: { increment: 1 } }
        });
      } catch (err) {
        console.error('[Admin] Failed to increment user lucky spins', err);
      }
    }
    
    // Return artificial refunded status to match UI expectation immediately
    res.json({ id: order.id, status: isRefunded ? 'refunded' : order.status });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════

router.get('/products', async (req, res) => {
  try {
    const products = await prisma.products.findMany({ orderBy: { id: 'asc' } });
    // Fetch all images in one query
    const allImages = await prisma.product_images.findMany({ orderBy: { sort_order: 'asc' } });
    const imageMap: Record<string, string[]> = {};
    for (const img of allImages) {
      if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
      imageMap[img.product_id].push(img.image_url);
    }
    // Map to frontend expected format
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
        rating: p.rating ? Number(p.rating) : 0,
        sold: p.sold || 0,
        stock: p.stock || 0,
        isFlashSale: p.is_flash_sale,
        flashSalePercent: p.flash_sale_percent,
        shopeeUrl: p.shopee_url,
        tiktokUrl: p.tiktok_url,
        youtubeUrl: p.youtube_url,
        isActive: p.is_active,
        volume: (p as any).volume || '',
        ingredients: (p as any).ingredients || '',
        origin: p.origin || '',
      };
    });
    res.json(mapped);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET single product with full details
router.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.products.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const [images, specs, variants, reviews] = await Promise.all([
      prisma.product_images.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_specs.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
      prisma.product_variants.findMany({ where: { product_id: product.product_id } }),
      prisma.product_reviews.findMany({ where: { product_id: product.product_id }, orderBy: { sort_order: 'asc' } }),
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
      rating: product.rating ? Number(product.rating) : 0,
      sold: product.sold || 0,
      stock: product.stock || 0,
      brand: product.brand || 'Mercy Tech Global',
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
      images: images.map(img => ({ id: img.id, url: img.image_url, sortOrder: img.sort_order })),
      specs: specs.map(s => ({ id: s.id, name: s.spec_name, value: s.spec_value, sortOrder: s.sort_order })),
      variants: variants.map(v => ({ id: v.id, name: v.variant_name, isActive: v.is_active })),
      reviews: reviews.map(r => ({ id: r.id, name: r.reviewer_name, avatarLetter: r.avatar_letter, avatarColor: r.avatar_color, rating: r.rating, date: r.review_date, verified: r.is_verified, text: r.review_text, helpful: r.helpful_count, imageUrl: r.image_url, isActive: r.is_active })),
    });
  } catch (error) {
    console.error('Get product detail error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, shortName, sku, categoryName, categoryId, price, originalPrice, discount, badge,
      rating, sold, stock, brand, description, seoTags, shopeeUrl, tiktokUrl, youtubeUrl,
      isFlashSale, flashSalePercent, isActive, featuresVn, featuresEn, footerInfo, productionYear,
      clearancePrice, dailySalePrice, campaignPrice, offPlatformPrice, warrantyData,
      origin, images, specs, variants } = req.body;

    if (!name) return res.status(400).json({ message: 'Tên sản phẩm là bắt buộc' });

    const productId = req.body.productId && String(req.body.productId).trim();
    if (!productId) return res.status(400).json({ message: 'Đường dẫn tĩnh (Slug / Product ID) là bắt buộc' });

    const username = productId; // used for unique constraint

    // Check unique constraint on product_id
    const conflict = await prisma.products.findUnique({ where: { product_id: productId } });
    if (conflict) {
      return res.status(409).json({ message: `Đường dẫn tĩnh "${productId}" đã được dùng bởi sản phẩm khác` });
    }

    const product = await prisma.products.create({
      data: {
        product_id: productId,
        sku: sku || '',
        name,
        short_name: shortName || null,
        category_name: categoryName || null,
        categories: categoryId ? { connect: { id: parseInt(categoryId) } } : undefined,
        price: BigInt(price || 0),
        original_price: BigInt(originalPrice || 0),
        discount: discount || 0,
        badge: badge || null,
        rating: rating || 0,
        sold: sold || 0,
        stock: stock || 0,
        brand: brand || 'GC Nature',
        description: description || '',
        seo_tags: seoTags || null,
        shopee_url: shopeeUrl || null,
        tiktok_url: tiktokUrl || null,
        youtube_url: youtubeUrl || null,
        is_flash_sale: isFlashSale || false,
        flash_sale_percent: flashSalePercent || 0,
        is_active: isActive !== false,
        features_vn: featuresVn || null,
        features_en: featuresEn || null,
        footer_info: footerInfo || null,
        production_year: productionYear ? parseInt(productionYear) : null,
        clearance_price: BigInt(clearancePrice || 0),
        daily_sale_price: BigInt(dailySalePrice || 0),
        campaign_price: BigInt(campaignPrice || 0),
        off_platform_price: BigInt(offPlatformPrice || 0),
        origin: origin || null,
        volume: req.body.volume || null,
        ingredients: req.body.ingredients || null,
      } as any,
    });

    // Create images if provided
    if (images && images.length > 0) {
      await prisma.product_images.createMany({
        data: images.map((img: any, idx: number) => ({
          product_id: productId,
          image_url: typeof img === 'string' ? img : img.url,
          sort_order: idx,
        })),
      });
    }

    // Create specs if provided
    if (specs && specs.length > 0) {
      await prisma.product_specs.createMany({
        data: specs.map((s: any, idx: number) => ({
          product_id: productId,
          spec_name: s.name,
          spec_value: s.value,
          sort_order: idx,
        })),
      });
    }

    // Create variants if provided
    if (variants && variants.length > 0) {
      await prisma.product_variants.createMany({
        data: variants.map((v: any) => ({
          product_id: productId,
          variant_name: typeof v === 'string' ? v : v.name,
          is_active: true,
        })),
      });
    }

    res.json({ message: 'Tạo sản phẩm thành công', id: product.id, productId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Lỗi tạo sản phẩm' });
  }
});

// PUT update product with full details (info + images + specs + variants)
router.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const { images, specs, variants, ...productData } = req.body;

    // Safe BigInt helper
    const toBigInt = (v: any): bigint => {
      if (v === null || v === undefined || v === '') return BigInt(0);
      return BigInt(Math.round(Number(v)));
    };

    // Update product fields
    const updateData: any = {};
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.shortName !== undefined) updateData.short_name = productData.shortName || null;
    if (productData.sku !== undefined) updateData.sku = productData.sku;
    if (productData.categoryName !== undefined) updateData.category_name = productData.categoryName || null;
    if (productData.categoryId !== undefined) {
      const catId = productData.categoryId ? parseInt(productData.categoryId) : null;
      if (catId) {
        updateData.categories = { connect: { id: catId } };
      } else {
        updateData.categories = { disconnect: true };
      }
    }
    if (productData.price !== undefined) updateData.price = toBigInt(productData.price);
    if (productData.originalPrice !== undefined) updateData.original_price = toBigInt(productData.originalPrice);
    if (productData.discount !== undefined) updateData.discount = Number(productData.discount) || 0;
    if (productData.badge !== undefined) updateData.badge = productData.badge || null;
    if (productData.rating !== undefined) updateData.rating = Number(productData.rating) || 0;
    if (productData.sold !== undefined) updateData.sold = Number(productData.sold) || 0;
    if (productData.stock !== undefined) updateData.stock = Number(productData.stock) || 0;
    if (productData.brand !== undefined) updateData.brand = productData.brand || 'GC Nature';
    if (productData.description !== undefined) updateData.description = productData.description || '';
    if (productData.seoTags !== undefined) updateData.seo_tags = productData.seoTags || null;
    if (productData.shopeeUrl !== undefined) updateData.shopee_url = productData.shopeeUrl || null;
    if (productData.tiktokUrl !== undefined) updateData.tiktok_url = productData.tiktokUrl || null;
    if (productData.youtubeUrl !== undefined) updateData.youtube_url = productData.youtubeUrl || null;
    if (productData.isFlashSale !== undefined) updateData.is_flash_sale = !!productData.isFlashSale;
    if (productData.flashSalePercent !== undefined) updateData.flash_sale_percent = Number(productData.flashSalePercent) || 0;
    if (productData.isActive !== undefined) updateData.is_active = productData.isActive !== false;
    if (productData.featuresVn !== undefined) updateData.features_vn = productData.featuresVn || null;
    if (productData.featuresEn !== undefined) updateData.features_en = productData.featuresEn || null;
    if (productData.footerInfo !== undefined) updateData.footer_info = productData.footerInfo || null;
    if (productData.productionYear !== undefined) updateData.production_year = productData.productionYear ? parseInt(productData.productionYear) : null;
    if (productData.clearancePrice !== undefined) updateData.clearance_price = toBigInt(productData.clearancePrice);
    if (productData.dailySalePrice !== undefined) updateData.daily_sale_price = toBigInt(productData.dailySalePrice);
    if (productData.campaignPrice !== undefined) updateData.campaign_price = toBigInt(productData.campaignPrice);
    if (productData.offPlatformPrice !== undefined) updateData.off_platform_price = toBigInt(productData.offPlatformPrice);
    if (productData.warrantyData !== undefined) updateData.warranty_data = typeof productData.warrantyData === 'string' ? productData.warrantyData : JSON.stringify(productData.warrantyData || null);
    if (productData.origin !== undefined) updateData.origin = productData.origin || null;
    if (productData.volume !== undefined) updateData.volume = productData.volume || null;
    if (productData.ingredients !== undefined) updateData.ingredients = productData.ingredients || null;
    let targetProductId = existing.product_id;
    if (productData.productId !== undefined && productData.productId !== existing.product_id) {
      const newProductId = String(productData.productId).trim();
      if (newProductId.length > 0) {
        // Check uniqueness
        const conflict = await prisma.products.findFirst({ where: { product_id: newProductId, NOT: { id } } });
        if (conflict) return res.status(409).json({ message: `Đường dẫn "${newProductId}" đã được dùng bởi sản phẩm khác` });
        
        updateData.product_id = newProductId;

        // Auto-sync SKU if it was previously matching the old product_id
        const currentSkuInBody = productData.sku !== undefined ? productData.sku : existing.sku;
        if (existing.sku === existing.product_id || currentSkuInBody === existing.product_id) {
          updateData.sku = newProductId;
        }

        // Run updates inside an interactive transaction to temporarily bypass MySQL foreign key constraint checks
        await prisma.$transaction(async (tx) => {
          await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

          await tx.product_images.updateMany({
            where: { product_id: existing.product_id },
            data: { product_id: newProductId }
          });
          await tx.product_specs.updateMany({
            where: { product_id: existing.product_id },
            data: { product_id: newProductId }
          });
          await tx.product_variants.updateMany({
            where: { product_id: existing.product_id },
            data: { product_id: newProductId }
          });
          await tx.product_reviews.updateMany({
            where: { product_id: existing.product_id },
            data: { product_id: newProductId }
          });
          await tx.cart.updateMany({
            where: { product_id: existing.product_id },
            data: { product_id: newProductId }
          });
          await tx.flash_sale_products.updateMany({
            where: { product_id: existing.product_id },
            data: { product_id: newProductId }
          });
          await tx.order_items.updateMany({
            where: { product_id: existing.product_id },
            data: { product_id: newProductId }
          });

          // Update main product record
          await tx.products.update({ where: { id }, data: updateData });

          await tx.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
        });

        targetProductId = newProductId;
      }
    } else {
      // Normal update if product_id hasn't changed
      await prisma.products.update({ where: { id }, data: updateData });
    }

    // Update images if provided (replace all)
    if (images !== undefined) {
      await prisma.product_images.deleteMany({ where: { product_id: targetProductId } });
      const validImages = (Array.isArray(images) ? images : [])
        .map((img: any) => typeof img === 'string' ? img : (img?.url || ''))
        .filter((url: string) => url.length > 0);
      if (validImages.length > 0) {
        await prisma.product_images.createMany({
          data: validImages.map((url: string, idx: number) => ({
            product_id: targetProductId,
            image_url: url,
            sort_order: idx,
          })),
        });
      }
    }

    // Update specs if provided (replace all)
    if (specs !== undefined) {
      await prisma.product_specs.deleteMany({ where: { product_id: targetProductId } });
      const validSpecs = (Array.isArray(specs) ? specs : []).filter((s: any) => s?.name);
      if (validSpecs.length > 0) {
        await prisma.product_specs.createMany({
          data: validSpecs.map((s: any, idx: number) => ({
            product_id: targetProductId,
            spec_name: s.name || '',
            spec_value: s.value || '',
            sort_order: idx,
          })),
        });
      }
    }

    // Update variants if provided (replace all)
    if (variants !== undefined) {
      await prisma.product_variants.deleteMany({ where: { product_id: targetProductId } });
      const validVariants = (Array.isArray(variants) ? variants : []).filter((v: any) => v?.name);
      if (validVariants.length > 0) {
        await prisma.product_variants.createMany({
          data: validVariants.map((v: any) => ({
            product_id: targetProductId,
            variant_name: v.name || '',
            is_active: v.isActive !== false,
          })),
        });
      }
    }

    // Update reviews if provided (replace all)
    if (req.body.reviews !== undefined) {
      await prisma.product_reviews.deleteMany({ where: { product_id: targetProductId } });
      const reviews = Array.isArray(req.body.reviews) ? req.body.reviews : [];
      if (reviews.length > 0) {
        await prisma.product_reviews.createMany({
          data: reviews.map((r: any, idx: number) => ({
            product_id: targetProductId,
            reviewer_name: r.name || 'Ẩn danh',
            avatar_letter: r.avatarLetter || r.name?.charAt(0)?.toUpperCase() || '?',
            avatar_color: r.avatarColor || 'bg-red-500',
            rating: Number(r.rating) || 5,
            review_date: r.date || '',
            is_verified: !!r.verified,
            review_text: r.text || '',
            helpful_count: Number(r.helpful) || 0,
            image_url: r.imageUrl || '',
            is_active: r.isActive !== false,
            sort_order: idx,
          })),
        });
      }
    }

    res.json({ message: 'Cập nhật thành công', id });
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({ message: `Lỗi cập nhật: ${error?.message || 'Unknown error'}` });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.products.findUnique({ where: { id } });
    if (product) {
      // Prevent deleting products that are in orders
      const orderCount = await prisma.order_items.count({ where: { product_id: product.product_id } });
      if (orderCount > 0) {
        return res.status(400).json({ message: 'Không thể xóa sản phẩm đã có trong đơn hàng. Vui lòng ẩn sản phẩm thay vì xóa.' });
      }

      // Clean up related data
      await prisma.product_images.deleteMany({ where: { product_id: product.product_id } });
      await prisma.product_specs.deleteMany({ where: { product_id: product.product_id } });
      await prisma.product_variants.deleteMany({ where: { product_id: product.product_id } });
      await prisma.product_reviews.deleteMany({ where: { product_id: product.product_id } });
      await prisma.cart.deleteMany({ where: { product_id: product.product_id } });
    }
    await prisma.products.delete({ where: { id } });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Lỗi xóa sản phẩm' });
  }
});

// ═══════════════════════════════════
// SYNC IMAGES — match files on disk to products by SKU
// ═══════════════════════════════════
router.post('/sync-images', async (req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const PRODUCTS_DIR = path.default.resolve(__dirname, '../../../public/products');
    const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const newestFirst = req.body?.newestFirst === true;

    if (!fs.default.existsSync(PRODUCTS_DIR)) {
      return res.json({ message: 'Thư mục products không tồn tại', fixed: 0, skipped: 0, results: [] });
    }

    // Read all image files
    const allFiles = fs.default.readdirSync(PRODUCTS_DIR).filter(f => IMAGE_EXTS.test(f)).sort();

    // Group files by SKU prefix. Supports TWO naming patterns:
    //   Dash pattern:  "MCK5.0Đôi-0.jpg"  → group "MCK5.0Đôi"
    //   Dot pattern:   "MCK5.0D.2.png"    → group "MCK5.0D"  (legacy production files)
    //   Plain:         "MCK5.0D.png"       → group "MCK5.0D"
    const fileGroups: Record<string, string[]> = {};
    for (const f of allFiles) {
      const nameWithoutExt = f.replace(/\.[^/.]+$/, ''); // strip extension
      // Try dash pattern first: "SKU-0", "SKU-1", "SKU-10"
      const dashMatch = nameWithoutExt.match(/^(.+)-\d+$/);
      if (dashMatch) {
        const group = dashMatch[1];
        if (!fileGroups[group]) fileGroups[group] = [];
        fileGroups[group].push(f);
        continue;
      }
      // Try dot pattern: "SKU.2", "SKU.10" (but NOT "MCK5.0D" which has dot in SKU)
      // Only match trailing .number if the part before it looks like an existing SKU
      const dotMatch = nameWithoutExt.match(/^(.+)\.(\d+)$/);
      if (dotMatch) {
        const group = dotMatch[1];
        if (!fileGroups[group]) fileGroups[group] = [];
        fileGroups[group].push(f);
        continue;
      }
      // No number suffix — this IS the base file (e.g. "MCK5.0D.png" → group "MCK5.0D")
      if (!fileGroups[nameWithoutExt]) fileGroups[nameWithoutExt] = [];
      fileGroups[nameWithoutExt].push(f);
    }

    // Get all products
    const products = await prisma.products.findMany({
      select: { id: true, product_id: true, sku: true, name: true }
    });

    let fixed = 0;
    let skipped = 0;
    const results: { sku: string; name: string; status: string; oldCount: number; newCount: number; mainImage?: string }[] = [];

    for (const product of products) {
      const sku = product.sku || product.product_id;
      let matchingFiles = fileGroups[sku];

      if (!matchingFiles || matchingFiles.length === 0) {
        results.push({ sku, name: product.name, status: 'no_files', oldCount: 0, newCount: 0 });
        skipped++;
        continue;
      }

      // If newestFirst, reverse so highest-numbered file becomes index 0 (main image)
      if (newestFirst) {
        matchingFiles = [...matchingFiles].reverse();
      }

      // Get current images
      const currentImages = await prisma.product_images.findMany({
        where: { product_id: product.product_id },
        orderBy: { sort_order: 'asc' }
      });
      const currentPaths = currentImages.map(img => img.image_url).sort();
      const correctPaths = matchingFiles.map(f => `/products/${f}`).sort();

      // Compare (also check order if newestFirst changes the ordering)
      const currentOrdered = currentImages.map(img => img.image_url);
      const newOrdered = matchingFiles.map(f => `/products/${f}`);
      if (JSON.stringify(currentOrdered) === JSON.stringify(newOrdered)) {
        results.push({ sku, name: product.name, status: 'ok', oldCount: currentImages.length, newCount: correctPaths.length, mainImage: newOrdered[0] });
        skipped++;
        continue;
      }

      // Replace images
      await prisma.product_images.deleteMany({ where: { product_id: product.product_id } });
      await prisma.product_images.createMany({
        data: matchingFiles.map((f, idx) => ({
          product_id: product.product_id,
          image_url: `/products/${f}`,
          sort_order: idx
        }))
      });

      results.push({ sku, name: product.name, status: 'fixed', oldCount: currentImages.length, newCount: correctPaths.length, mainImage: `/products/${matchingFiles[0]}` });
      fixed++;
    }

    res.json({
      message: `Đã đồng bộ ${fixed} sản phẩm, ${skipped} không cần thay đổi`,
      fixed,
      skipped,
      total: products.length,
      diskFiles: allFiles.length,
      diskGroups: Object.keys(fileGroups).length,
      newestFirst,
      results
    });
  } catch (error) {
    console.error('Sync images error:', error);
    res.status(500).json({ message: 'Lỗi đồng bộ ảnh' });
  }
});

// ═══════════════════════════════════
// SYNC LAST IMAGE AS MAIN — set each product's last image as the thumbnail
// ═══════════════════════════════════
router.post('/sync-last-as-main', async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      select: { id: true, product_id: true, name: true, sku: true }
    });

    let fixed = 0;
    let skipped = 0;
    const results: { sku: string; name: string; status: string; mainImage?: string; totalImages: number }[] = [];

    for (const product of products) {
      const images = await prisma.product_images.findMany({
        where: { product_id: product.product_id },
        orderBy: { sort_order: 'asc' }
      });

      if (images.length <= 1) {
        results.push({
          sku: product.sku || product.product_id,
          name: product.name,
          status: images.length === 0 ? 'no_images' : 'single',
          mainImage: images[0]?.image_url,
          totalImages: images.length
        });
        skipped++;
        continue;
      }

      // Check if last image is already the first
      const lastImage = images[images.length - 1];
      if (images[0].id === lastImage.id) {
        results.push({
          sku: product.sku || product.product_id,
          name: product.name,
          status: 'ok',
          mainImage: lastImage.image_url,
          totalImages: images.length
        });
        skipped++;
        continue;
      }

      // Move last image to first position: [1,2,3,4,LAST] → [LAST,1,2,3,4]
      const reordered = [lastImage, ...images.filter(img => img.id !== lastImage.id)];

      // Update sort_order for all images
      for (let i = 0; i < reordered.length; i++) {
        await prisma.product_images.update({
          where: { id: reordered[i].id },
          data: { sort_order: i }
        });
      }

      results.push({
        sku: product.sku || product.product_id,
        name: product.name,
        status: 'fixed',
        mainImage: lastImage.image_url,
        totalImages: images.length
      });
      fixed++;
    }

    res.json({
      message: `Đã đặt ảnh cuối làm ảnh chính cho ${fixed} sản phẩm, ${skipped} không cần thay đổi`,
      fixed,
      skipped,
      total: products.length,
      results
    });
  } catch (error) {
    console.error('Sync last as main error:', error);
    res.status(500).json({ message: 'Lỗi đồng bộ ảnh cuối' });
  }
});

// ═══════════════════════════════════
// SYNC CATEGORIES — fix category cover images from product images
// ═══════════════════════════════════
router.post('/sync-categories', async (req, res) => {
  try {
    // Featured categories use localStorage on frontend, not DB.
    // This endpoint returns product images for each DB category so the frontend can update.
    const categories = await prisma.categories.findMany({
      include: { _count: { select: { products: true } } }
    });

    const results: { id: number; name: string; slug: string; status: string; image?: string; productCount: number }[] = [];

    for (const cat of categories) {
      // Find first product in this category with an image
      const product = await prisma.products.findFirst({
        where: { category_id: cat.id },
        orderBy: { id: 'asc' }
      });

      if (!product) {
        results.push({ id: cat.id, name: cat.name, slug: cat.slug, status: 'no_products', productCount: cat._count.products });
        continue;
      }

      // Get first image of this product
      const img = await prisma.product_images.findFirst({
        where: { product_id: product.product_id },
        orderBy: { sort_order: 'asc' }
      });

      if (!img) {
        results.push({ id: cat.id, name: cat.name, slug: cat.slug, status: 'no_images', productCount: cat._count.products });
        continue;
      }

      results.push({ id: cat.id, name: cat.name, slug: cat.slug, status: 'ok', image: img.image_url, productCount: cat._count.products });
    }

    res.json({
      message: `Đã quét ${categories.length} danh mục`,
      total: categories.length,
      results
    });
  } catch (error) {
    console.error('Sync categories error:', error);
    res.status(500).json({ message: 'Lỗi đồng bộ danh mục' });
  }
});

// Create system DB category
router.post('/db-categories', async (req, res) => {
  try {
    const { name, slug, parentId, sortOrder, isActive } = req.body;
    if (!name) return res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
    const finalSlug = slug && String(slug).trim() ? String(slug).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') : name.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    
    // Check slug duplication
    const conflict = await prisma.categories.findUnique({ where: { slug: finalSlug } });
    if (conflict) return res.status(409).json({ message: `Đường dẫn "${finalSlug}" đã được sử dụng` });

    const created = await prisma.categories.create({
      data: {
        name,
        slug: finalSlug,
        parent_id: parentId ? parseInt(parentId) : null,
        sort_order: sortOrder !== undefined ? parseInt(sortOrder) : 0,
        is_active: isActive !== false
      }
    });
    res.json(created);
  } catch (error: any) {
    console.error('Create DB category error:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo danh mục' });
  }
});

// Update system DB category
router.put('/db-categories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, slug, parentId, sortOrder, isActive } = req.body;
    
    const existing = await prisma.categories.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (parentId !== undefined) data.parent_id = parentId ? parseInt(parentId) : null;
    if (sortOrder !== undefined) data.sort_order = parseInt(sortOrder);
    if (isActive !== undefined) data.is_active = !!isActive;

    if (slug !== undefined && slug.trim()) {
      const newSlug = String(slug).trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      const conflict = await prisma.categories.findFirst({ where: { slug: newSlug, NOT: { id } } });
      if (conflict) return res.status(409).json({ message: `Đường dẫn "${newSlug}" đã được sử dụng` });
      data.slug = newSlug;
    }

    const updated = await prisma.categories.update({ where: { id }, data });

    // Cập nhật category_name trong bảng sản phẩm nếu tên danh mục thay đổi
    if (name !== undefined && name !== existing.name) {
      await prisma.products.updateMany({
        where: { category_id: id },
        data: { category_name: name }
      });
    }

    res.json(updated);
  } catch (error: any) {
    console.error('Update DB category error:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật danh mục' });
  }
});

// Delete system DB category
router.delete('/db-categories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.categories.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

    // Check if there are products belonging to this category
    const productCount = await prisma.products.count({ where: { category_id: id } });
    if (productCount > 0) {
      return res.status(400).json({ message: 'Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước.' });
    }

    await prisma.categories.delete({ where: { id } });
    res.json({ message: 'Đã xóa danh mục thành công' });
  } catch (error: any) {
    console.error('Delete DB category error:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa danh mục' });
  }
});

// ═══════════════════════════════════
// BULK UPDATE PRICES
// ═══════════════════════════════════
router.post('/bulk-update-prices', async (req, res) => {
  try {
    const { productIds, mode, field, value } = req.body;
    // productIds: number[] - list of product IDs to update
    // mode: 'fixed' | 'percent' 
    // field: 'price' | 'originalPrice' | 'both'
    // value: number (amount in VND for fixed, percentage for percent)

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Chưa chọn sản phẩm' });
    }

    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, product_id: true, name: true, price: true, original_price: true }
    });

    let updated = 0;
    for (const p of products) {
      const updateData: any = {};

      if (field === 'price' || field === 'both') {
        if (mode === 'fixed') {
          updateData.price = BigInt(value);
        } else if (mode === 'percent') {
          // Decrease by percentage
          const newPrice = Math.round(Number(p.original_price) * (1 - value / 100));
          updateData.price = BigInt(newPrice);
        }
      }

      if (field === 'originalPrice' || field === 'both') {
        if (mode === 'fixed') {
          updateData.original_price = BigInt(value);
        } else if (mode === 'percent') {
          // Increase by percentage from current price
          const newOriginal = Math.round(Number(p.price) * (1 + value / 100));
          updateData.original_price = BigInt(newOriginal);
        }
      }

      // Auto-calc discount
      const finalPrice = updateData.price !== undefined ? Number(updateData.price) : Number(p.price);
      const finalOriginal = updateData.original_price !== undefined ? Number(updateData.original_price) : Number(p.original_price);
      if (finalOriginal > 0 && finalOriginal > finalPrice) {
        updateData.discount = Math.round(((finalOriginal - finalPrice) / finalOriginal) * 100);
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.products.update({ where: { id: p.id }, data: updateData });
        updated++;
      }
    }

    res.json({ message: `Đã cập nhật giá ${updated} sản phẩm`, updated });
  } catch (error) {
    console.error('Bulk update prices error:', error);
    res.status(500).json({ message: 'Lỗi cập nhật giá hàng loạt' });
  }
});

// ═══════════════════════════════════
// REVIEWS
// ═══════════════════════════════════

router.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await prisma.product_reviews.findMany({
      where: { product_id: req.params.productId },
      orderBy: { sort_order: 'asc' },
    });
    res.json(reviews.map(r => ({
      id: r.id, name: r.reviewer_name, avatarLetter: r.avatar_letter, avatarColor: r.avatar_color,
      rating: r.rating, date: r.review_date, verified: r.is_verified, text: r.review_text,
      helpful: r.helpful_count, imageUrl: r.image_url, isActive: r.is_active,
    })));
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const { productId, name, avatarLetter, avatarColor, rating, date, verified, text, helpful, imageUrl } = req.body;
    const review = await prisma.product_reviews.create({
      data: {
        product_id: productId,
        reviewer_name: name,
        avatar_letter: avatarLetter || name.charAt(0).toUpperCase(),
        avatar_color: avatarColor || 'bg-red-500',
        rating: rating || 5,
        review_date: date,
        is_verified: verified || false,
        review_text: text,
        helpful_count: helpful || 0,
        image_url: imageUrl || '',
      },
    });
    res.json({ id: review.id, message: 'Đã thêm đánh giá' });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Lỗi tạo đánh giá' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, avatarLetter, avatarColor, rating, date, verified, text, helpful, imageUrl, isActive } = req.body;
    const updateData: any = {};
    if (name !== undefined) updateData.reviewer_name = name;
    if (avatarLetter !== undefined) updateData.avatar_letter = avatarLetter;
    if (avatarColor !== undefined) updateData.avatar_color = avatarColor;
    if (rating !== undefined) updateData.rating = rating;
    if (date !== undefined) updateData.review_date = date;
    if (verified !== undefined) updateData.is_verified = verified;
    if (text !== undefined) updateData.review_text = text;
    if (helpful !== undefined) updateData.helpful_count = helpful;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (isActive !== undefined) updateData.is_active = isActive;
    await prisma.product_reviews.update({ where: { id }, data: updateData });
    res.json({ message: 'Đã cập nhật đánh giá' });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Lỗi cập nhật đánh giá' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.product_reviews.delete({ where: { id } });
    res.json({ message: 'Đã xóa đánh giá' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Lỗi xóa đánh giá' });
  }
});

// ═══════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({ orderBy: { sort_order: 'asc' } });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// DASHBOARD stats
// ═══════════════════════════════════

router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalUsers, totalOrders, totalRevenue, nonCancelledOrders, latestOrders, orderItems, products, thisMonthRev, lastMonthRev, allOrderPhones] = await Promise.all([
      prisma.users.count(),
      prisma.orders.count(),
      prisma.orders.aggregate({ _sum: { total: true }, where: { status: { in: ['confirmed', 'shipping', 'delivered'] } } }),
      prisma.orders.findMany({
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] } },
        select: { created_at: true, total: true }
      }),
      prisma.orders.findMany({
        orderBy: { created_at: 'desc' },
        take: 5
      }),
      prisma.order_items.findMany({
        include: { orders: { select: { status: true } } }
      }),
      prisma.products.findMany({ select: { product_id: true, category_name: true } }),
      prisma.orders.aggregate({ 
        _sum: { total: true }, 
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] }, created_at: { gte: firstDayThisMonth } } 
      }),
      prisma.orders.aggregate({ 
        _sum: { total: true }, 
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] }, created_at: { gte: firstDayLastMonth, lt: firstDayThisMonth } } 
      }),
      prisma.orders.findMany({ select: { customer_phone: true } })
    ]);

    const distinctCustomers = new Set(allOrderPhones.map(o => o.customer_phone).filter(Boolean)).size;

    const currentMonthRev = Number(thisMonthRev._sum.total || 0);
    const prevMonthRev = Number(lastMonthRev._sum.total || 0);
    let revenueGrowth = 0;
    if (prevMonthRev > 0) {
      revenueGrowth = Math.round(((currentMonthRev - prevMonthRev) / prevMonthRev) * 100);
    } else if (currentMonthRev > 0) {
      revenueGrowth = 100;
    }

    // Format revenue over months chart
    const monthlyRevenue = new Map<string, number>();
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    months.forEach(m => monthlyRevenue.set(m, 0));
    nonCancelledOrders.forEach(order => {
      if (order.created_at) {
        const monthIdx = order.created_at.getMonth();
        const monthName = months[monthIdx];
        monthlyRevenue.set(monthName, (monthlyRevenue.get(monthName) || 0) + Number(order.total));
      }
    });
    const revenueData = Array.from(monthlyRevenue, ([name, value]) => ({ name, value }));

    // Format category and top product charts
    const productCategoryMap = new Map();
    products.forEach(p => productCategoryMap.set(p.product_id, p.category_name || 'Khác'));

    const categoryMap = new Map<string, number>();
    const productSalesMap = new Map<string, { sold: number, revenue: number, name: string }>();

    orderItems.forEach(item => {
      if (item.orders?.status === 'cancelled') return;
      
      const cat = productCategoryMap.get(item.product_id) || 'Khác';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.quantity);

      const current = productSalesMap.get(item.product_id) || { sold: 0, revenue: 0, name: item.product_name };
      current.sold += item.quantity;
      current.revenue += Number(item.price) * item.quantity;
      productSalesMap.set(item.product_id, current);
    });

    const categoryData = Array.from(categoryMap, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map(p => ({
         name: p.name,
         sold: p.sold,
         revenue: p.revenue.toLocaleString('vi-VN') + '₫'
      }));

    // Format recent orders
    const recentOrders = latestOrders.map(o => {
      let statusStr = 'Chờ xử lý';
      let statusColor = 'text-yellow-600 bg-yellow-100';
      if (o.status === 'confirmed') { statusStr = 'Đã xác nhận'; statusColor = 'text-blue-600 bg-blue-100'; }
      if (o.status === 'shipping') { statusStr = 'Đang giao'; statusColor = 'text-indigo-600 bg-indigo-100'; }
      if (o.status === 'delivered') { statusStr = 'Đã giao'; statusColor = 'text-green-600 bg-green-100'; }
      if (o.status === 'cancelled') { statusStr = 'Đã hủy'; statusColor = 'text-red-600 bg-red-100'; }

      const notes = o.notes || '';
      const isRefunded = notes.includes('[REFUNDED]');
      if (o.status === 'cancelled' && isRefunded) {
         statusStr = 'Đã hoàn tiền';
         statusColor = 'text-purple-600 bg-purple-100';
      }

      return {
        id: o.order_code,
        customer: o.customer_name,
        amount: Number(o.total).toLocaleString('vi-VN') + '₫',
        status: statusStr,
        statusColor
      };
    });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.total || 0),
      distinctCustomers,
      revenueGrowth,
      currentMonthRev,
      prevMonthRev,
      revenueData,
      categoryData,
      topProducts,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════

router.get('/analytics', async (req, res) => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    fourteenDaysAgo.setHours(0,0,0,0);
    
    const recentOrders = await prisma.orders.findMany({
       where: { created_at: { gte: fourteenDaysAgo } },
       select: { created_at: true, total: true, status: true, payment_method: true }
    });

    const visitDataMap = new Map();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = `${d.getDate()}/${d.getMonth()+1}`;
      visitDataMap.set(dayStr, { name: dayStr, visits: 0, orders: 0 }); 
    }

    recentOrders.forEach(o => {
      if (o.created_at) {
        const d = new Date(o.created_at);
        const dayStr = `${d.getDate()}/${d.getMonth()+1}`;
        if (visitDataMap.has(dayStr)) {
          const entry = visitDataMap.get(dayStr);
          if (['confirmed', 'shipping', 'delivered'].includes(o.status)) {
             entry.visits += Number(o.total); 
          }
           entry.orders += 1;
        }
      }
    });

    const visitData = Array.from(visitDataMap.values());

    const allOrders = await prisma.orders.findMany({
      where: { status: { in: ['confirmed', 'shipping', 'delivered'] } },
      select: { payment_method: true }
    });
    
    const paymentMap = new Map<string, number>();
    allOrders.forEach(o => {
       const p = o.payment_method === 'bank_transfer' ? 'Chuyển khoản' : (o.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán khác');
       paymentMap.set(p, (paymentMap.get(p) || 0) + 1);
    });
    
    const sourceData = Array.from(paymentMap, ([name, value]) => ({ name, value }));

    const totalOrdersCompleted = allOrders.length;
    const totalOrders = await prisma.orders.count();
    
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0,0,0,0);
    const monthOrders = await prisma.orders.aggregate({
       _sum: { total: true },
       where: { status: { in: ['confirmed', 'shipping', 'delivered'] }, created_at: { gte: firstDayOfMonth } }
    });
    const monthlyRev = '₫' + Number(monthOrders._sum.total || 0).toLocaleString('vi-VN');

    const orderItemsGroup = await prisma.order_items.findMany({
       include: { orders: { select: { status: true } } }
    });
    
    const productCountMap = new Map();
    orderItemsGroup.forEach(item => {
       if (item.orders?.status === 'cancelled') return;
       const c = productCountMap.get(item.product_name) || 0;
       productCountMap.set(item.product_name, c + item.quantity);
    });
    let bestProduct = '—';
    let maxQty = 0;
    productCountMap.forEach((qty, name) => {
       if (qty > maxQty) {
          maxQty = qty;
          bestProduct = name;
       }
    });

    const allOrderPhones = await prisma.orders.findMany({ select: { customer_phone: true } });
    const totalCustomers = new Set(allOrderPhones.map(o => o.customer_phone).filter(Boolean)).size;

    res.json({
       visitData,
       sourceData,
       summary: {
         totalCustomers: totalCustomers.toString(),
         totalOrders: totalOrders.toString(),
         monthlyRev,
         bestProduct
       }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// MEMBER MANAGEMENT (Extended)
// ═══════════════════════════════════

// Toggle user active status (lock/unlock)
router.put('/members/:id/toggle-active', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const updated = await prisma.users.update({
      where: { id },
      data: { is_active: !user.is_active, updated_at: new Date() },
    });
    res.json({ id: updated.id, isActive: updated.is_active });
  } catch (error) {
    console.error('Toggle active error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Reset password (admin action)
router.put('/members/:id/reset-password', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id },
      data: { password_hash: hashedPassword, updated_at: new Date() },
    });
    res.json({ message: 'Đã đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET member detail with orders + stats
router.get('/members/:id/detail', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        orders: {
          select: { id: true, order_code: true, total: true, status: true, created_at: true, payment_method: true },
          orderBy: { created_at: 'desc' },
          take: 20
        }
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const validOrders = user.orders.filter(o => ['confirmed', 'shipping', 'delivered'].includes(o.status));
    const totalSpent = validOrders.reduce((sum, o) => sum + Number(o.total), 0);
    
    // Determine tier
    let tier = 'bronze';
    if (totalSpent >= 50000000) tier = 'diamond';
    else if (totalSpent >= 10000000) tier = 'gold';
    else if (totalSpent >= 2000000) tier = 'silver';
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.full_name || user.username,
      username: user.username,
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '',
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      totalOrders: user.orders.length,
      totalSpent,
      tier,
      orders: user.orders.map(o => ({
        id: o.order_code,
        total: Number(o.total),
        status: o.status,
        paymentMethod: o.payment_method,
        date: o.created_at
      }))
    });
  } catch (error) {
    console.error('Get member detail error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Export members CSV
router.get('/members/export', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { id: true, email: true, full_name: true, username: true, phone: true, role: true, is_active: true, created_at: true },
      orderBy: { created_at: 'desc' },
    });
    
    const csvHeader = 'ID,Tên,Email,Số điện thoại,Quyền,Trạng thái,Ngày đăng ký\n';
    const csvRows = users.map(u => 
      `${u.id},"${u.full_name || u.username}","${u.email}","${u.phone || ''}","${u.role}","${u.is_active ? 'Hoạt động' : 'Đã khóa'}","${u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : ''}"`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
    res.send('\uFEFF' + csvHeader + csvRows);
  } catch (error) {
    console.error('Export members error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// CRM DASHBOARD
// ═══════════════════════════════════

// CRM Overview
router.get('/crm/overview', async (req, res) => {
  try {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      allNonCancelledOrders,
      thisMonthOrders,
      lastMonthOrders,
      allOrdersByUser,
      recentBuyers
    ] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { created_at: { gte: firstDayThisMonth } } }),
      prisma.users.count({ where: { created_at: { gte: firstDayLastMonth, lt: firstDayThisMonth } } }),
      prisma.orders.findMany({
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] } },
        select: { user_id: true, total: true, customer_phone: true }
      }),
      prisma.orders.aggregate({
        _sum: { total: true },
        _count: true,
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] }, created_at: { gte: firstDayThisMonth } }
      }),
      prisma.orders.aggregate({
        _sum: { total: true },
        _count: true,
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] }, created_at: { gte: firstDayLastMonth, lt: firstDayThisMonth } }
      }),
      prisma.orders.findMany({
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] } },
        select: { user_id: true, customer_phone: true, total: true, created_at: true }
      }),
      prisma.orders.findMany({
        where: { status: { in: ['confirmed', 'shipping', 'delivered'] }, created_at: { gte: thirtyDaysAgo } },
        select: { user_id: true, customer_phone: true }
      })
    ]);

    // User growth rate
    const userGrowthRate = newUsersLastMonth > 0
      ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
      : (newUsersThisMonth > 0 ? 100 : 0);

    // Conversion: registered -> bought
    const uniqueBuyers = new Set(allNonCancelledOrders.map(o => o.user_id || o.customer_phone).filter(Boolean));
    const totalBuyers = uniqueBuyers.size;
    const conversionRate = totalUsers > 0 ? Math.round((totalBuyers / totalUsers) * 100 * 10) / 10 : 0;

    // Retention: unique buyers last 30 days vs total buyers
    const recentUniqueBuyers = new Set(recentBuyers.map(o => o.user_id || o.customer_phone).filter(Boolean));
    const retentionRate = totalBuyers > 0 ? Math.round((recentUniqueBuyers.size / totalBuyers) * 100 * 10) / 10 : 0;

    // Revenue metrics
    const currentMonthRev = Number(thisMonthOrders._sum.total || 0);
    const lastMonthRev = Number(lastMonthOrders._sum.total || 0);
    const revenueGrowthRate = lastMonthRev > 0
      ? Math.round(((currentMonthRev - lastMonthRev) / lastMonthRev) * 100)
      : (currentMonthRev > 0 ? 100 : 0);

    const totalRevenue = allNonCancelledOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const avgOrderValue = allNonCancelledOrders.length > 0
      ? Math.round(totalRevenue / allNonCancelledOrders.length)
      : 0;

    // Customer segments by spending
    const customerSpending = new Map<string, number>();
    allOrdersByUser.forEach(o => {
      const key = String(o.user_id || o.customer_phone);
      if (key) customerSpending.set(key, (customerSpending.get(key) || 0) + Number(o.total));
    });

    let bronze = 0, silver = 0, gold = 0, diamond = 0;
    customerSpending.forEach(spent => {
      if (spent >= 50000000) diamond++;
      else if (spent >= 10000000) gold++;
      else if (spent >= 2000000) silver++;
      else bronze++;
    });

    // Avg CLV
    const avgCLV = customerSpending.size > 0
      ? Math.round(Array.from(customerSpending.values()).reduce((a, b) => a + b, 0) / customerSpending.size)
      : 0;

    res.json({
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      userGrowthRate,
      totalBuyers,
      conversionRate,
      retentionRate,
      activeUsersLast30Days: recentUniqueBuyers.size,
      currentMonthRev,
      lastMonthRev,
      revenueGrowthRate,
      avgOrderValue,
      avgCLV,
      segments: { bronze, silver, gold, diamond },
      totalOrdersThisMonth: thisMonthOrders._count,
      totalOrdersLastMonth: lastMonthOrders._count
    });
  } catch (error) {
    console.error('CRM overview error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// CRM Growth data (user registrations + orders by month)
router.get('/crm/growth', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { created_at: true },
      orderBy: { created_at: 'asc' }
    });
    
    const orders = await prisma.orders.findMany({
      where: { status: { in: ['confirmed', 'shipping', 'delivered'] } },
      select: { created_at: true, total: true },
      orderBy: { created_at: 'asc' }
    });

    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const now = new Date();
    const growthData: { month: string; newUsers: number; cumulativeUsers: number; revenue: number; orders: number }[] = [];
    
    let cumulative = 0;
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(now.getFullYear(), i, 1);
      const monthEnd = new Date(now.getFullYear(), i + 1, 1);
      
      const newUsers = users.filter(u => u.created_at && u.created_at >= monthStart && u.created_at < monthEnd).length;
      cumulative += newUsers;
      
      const monthOrders = orders.filter(o => o.created_at && o.created_at >= monthStart && o.created_at < monthEnd);
      const revenue = monthOrders.reduce((sum, o) => sum + Number(o.total), 0);
      
      growthData.push({
        month: months[i],
        newUsers,
        cumulativeUsers: cumulative,
        revenue,
        orders: monthOrders.length
      });
    }

    res.json(growthData);
  } catch (error) {
    console.error('CRM growth error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// CRM Top Customers
router.get('/crm/top-customers', async (req, res) => {
  try {
    const usersWithOrders = await prisma.users.findMany({
      where: { orders: { some: {} } },
      include: {
        orders: {
          where: { status: { in: ['confirmed', 'shipping', 'delivered'] } },
          select: { total: true, created_at: true }
        }
      }
    });

    const topCustomers = usersWithOrders
      .map(u => {
        const totalSpent = u.orders.reduce((sum, o) => sum + Number(o.total), 0);
        let tier = 'bronze';
        if (totalSpent >= 50000000) tier = 'diamond';
        else if (totalSpent >= 10000000) tier = 'gold';
        else if (totalSpent >= 2000000) tier = 'silver';
        
        return {
          id: u.id,
          name: u.full_name || u.username,
          email: u.email,
          phone: u.phone || '',
          totalOrders: u.orders.length,
          totalSpent,
          tier,
          lastOrder: u.orders.length > 0 ? u.orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at : null,
          monthlySpend: u.orders.map(o => ({
            month: new Date(o.created_at).getMonth(),
            amount: Number(o.total)
          }))
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    res.json(topCustomers);
  } catch (error) {
    console.error('CRM top customers error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// CRM Recent Activity (simulated from orders + users)
router.get('/crm/activity', async (req, res) => {
  try {
    const recentOrders = await prisma.orders.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: { order_code: true, customer_name: true, total: true, status: true, created_at: true }
    });

    const recentUsers = await prisma.users.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { full_name: true, username: true, email: true, created_at: true }
    });

    const activities: { type: string; title: string; description: string; time: Date }[] = [];

    recentOrders.forEach(o => {
      activities.push({
        type: 'order',
        title: `Đơn hàng #${o.order_code}`,
        description: `${o.customer_name} - ${Number(o.total).toLocaleString('vi-VN')}₫`,
        time: o.created_at
      });
    });

    recentUsers.forEach(u => {
      activities.push({
        type: 'register',
        title: 'Thành viên mới đăng ký',
        description: `${u.full_name || u.username} (${u.email})`,
        time: u.created_at
      });
    });

    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    res.json(activities.slice(0, 15));
  } catch (error) {
    console.error('CRM activity error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// PAYMENTS (Bank Accounts)
// ═══════════════════════════════════

// GET all payment methods
router.get('/payments', async (req, res) => {
  try {
    let payments = await prisma.payment_methods.findMany({
      orderBy: { created_at: 'desc' }
    });

    // Auto-seed default bank account from config if table is empty
    if (payments.length === 0) {
      const defaultPayment = await prisma.payment_methods.create({
        data: {
          bank_code: 'ACB',
          bank_name: 'Ngân hàng Á Châu',
          account_number: '24488671',
          account_name: 'MAI XUAN ANH',
          is_active: true
        }
      });
      payments = [defaultPayment];
    }

    const mapped = payments.map(p => ({
      id: p.id,
      bankCode: p.bank_code,
      bankName: p.bank_name,
      accountNumber: p.account_number,
      accountName: p.account_name,
      isActive: p.is_active,
    }));
    res.json(mapped);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST create payment method
router.post('/payments', async (req, res) => {
  try {
    const { bankCode, bankName, accountNumber, accountName } = req.body;
    if (!bankCode || !accountNumber || !accountName) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }
    const payment = await prisma.payment_methods.create({
      data: {
        bank_code: bankCode,
        bank_name: bankName || null,
        account_number: accountNumber,
        account_name: accountName,
      }
    });
    res.json({ id: payment.id, message: 'Đã thêm tài khoản' });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT update payment method
router.put('/payments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { bankCode, bankName, accountNumber, accountName } = req.body;
    await prisma.payment_methods.update({
      where: { id },
      data: {
        bank_code: bankCode,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        updated_at: new Date()
      }
    });
    res.json({ message: 'Đã cập nhật' });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT toggle active status
router.put('/payments/:id/toggle', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const payment = await prisma.payment_methods.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ message: 'Không tìm thấy' });

    // Deactivate all others first, then activate this one
    if (!payment.is_active) {
      await prisma.payment_methods.updateMany({ data: { is_active: false } });
    }

    await prisma.payment_methods.update({
      where: { id },
      data: { is_active: !payment.is_active, updated_at: new Date() }
    });
    res.json({ message: 'Đã cập nhật trạng thái' });
  } catch (error) {
    console.error('Toggle payment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE payment method
router.delete('/payments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.payment_methods.delete({ where: { id } });
    res.json({ message: 'Đã xóa' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// TRANSACTIONS (Payment monitoring)
// ═══════════════════════════════════

router.get('/transactions', async (req, res) => {
  try {
    const { from, to, status } = req.query;

    const where: any = {};

    // Filter by date range
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.gte = new Date(from as string);
      if (to) {
        const toDate = new Date(to as string);
        toDate.setHours(23, 59, 59, 999);
        where.created_at.lte = toDate;
      }
    }

    // Filter by status
    if (status && status !== 'all') {
      where.status = status as string;
    }

    const orders = await prisma.orders.findMany({
      where,
      include: { order_items: true },
      orderBy: { created_at: 'desc' },
    });

    // Calculate statistics
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let todayRevenue = 0;
    let monthRevenue = 0;
    let totalRevenue = 0;
    let todayOrders = 0;
    let monthOrders = 0;
    let pendingCount = 0;
    let confirmedCount = 0;

    const transactions = orders.map(o => {
      const amount = Number(o.payment_amount) || Number(o.total);
      const createdAt = new Date(o.created_at);

      // Only count paid/confirmed orders for revenue
      const isPaid = ['confirmed', 'shipping', 'delivered'].includes(o.status);
      if (isPaid) {
        totalRevenue += amount;
        if (createdAt >= monthStart) {
          monthRevenue += amount;
          monthOrders++;
        }
        if (createdAt >= todayStart) {
          todayRevenue += amount;
          todayOrders++;
        }
        confirmedCount++;
      }
      if (o.status === 'pending') pendingCount++;

      // Detect payment type
      let paymentType = 'full';
      const notes = o.notes || '';
      if (notes.includes('[DEPOSIT]')) paymentType = 'deposit';

      return {
        id: o.id,
        orderCode: o.order_code,
        customerName: o.customer_name || '—',
        customerPhone: o.customer_phone || '',
        amount,
        total: Number(o.total),
        paymentMethod: o.payment_method || paymentType,
        paymentType,
        paymentStatus: o.payment_status || 'pending',
        paymentRef: o.payment_ref || '',
        transferContent: notes.replace('[DEPOSIT] ', '').replace('[FULL] ', '').replace('[REFUNDED] ', ''),
        status: o.status,
        createdAt: o.created_at,
        itemCount: o.order_items.length,
      };
    });

    res.json({
      stats: {
        todayRevenue,
        monthRevenue,
        totalRevenue,
        todayOrders,
        monthOrders,
        totalOrders: orders.length,
        pendingCount,
        confirmedCount,
      },
      transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ═══════════════════════════════════
// ARTICLES (BLOG) CRUD
// ═══════════════════════════════════

function slugify(s: string) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 150);
}

// GET all articles (admin sees drafts too)
router.get('/articles', async (_req, res) => {
  try {
    const list = await prisma.articles.findMany({ orderBy: { created_at: 'desc' } });
    res.json(list.map((a: any) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || '',
      content: a.content || '',
      image: a.image || '',
      date: a.date,
      category: a.category,
      author: a.author,
      views: a.views,
      isPublished: !!a.is_published,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    })));
  } catch (e: any) {
    console.error('Admin articles list error:', e);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET single
router.get('/articles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const a: any = await prisma.articles.findUnique({ where: { id } });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || '',
      content: a.content || '',
      image: a.image || '',
      date: a.date,
      category: a.category,
      author: a.author,
      views: a.views,
      isPublished: !!a.is_published,
    });
  } catch (e: any) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST create
router.post('/articles', async (req, res) => {
  try {
    const { title, excerpt, content, image, category, author, isPublished, slug, date } = req.body;
    if (!title) return res.status(400).json({ message: 'Thiếu tiêu đề' });
    let finalSlug: string = slug && String(slug).trim() ? String(slug).trim() : slugify(title);
    // Ensure uniqueness
    const existing = await prisma.articles.findUnique({ where: { slug: finalSlug } });
    if (existing) finalSlug = `${finalSlug}-${Date.now().toString().slice(-5)}`;
    const created = await prisma.articles.create({
      data: {
        slug: finalSlug,
        title,
        excerpt: excerpt || null,
        content: content || null,
        image: image || null,
        date: date || new Date().toLocaleDateString('vi-VN'),
        category: category || 'Tin Tức',
        author: author || 'Mercy',
        is_published: isPublished !== false,
      },
    });
    res.json(created);
  } catch (e: any) {
    console.error('Create article error:', e);
    res.status(500).json({ message: e.message || 'Lỗi tạo' });
  }
});

// PUT update
router.put('/articles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, excerpt, content, image, category, author, isPublished, slug, date } = req.body;
    const data: any = {};
    if (title !== undefined) data.title = title;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (content !== undefined) data.content = content;
    if (image !== undefined) data.image = image;
    if (category !== undefined) data.category = category;
    if (author !== undefined) data.author = author;
    if (date !== undefined) data.date = date;
    if (isPublished !== undefined) data.is_published = !!isPublished;
    if (slug !== undefined && slug.trim()) {
      const newSlug = String(slug).trim();
      // Avoid collision with another article
      const collide = await prisma.articles.findFirst({ where: { slug: newSlug, NOT: { id } } });
      if (collide) return res.status(400).json({ message: 'Slug đã tồn tại' });
      data.slug = newSlug;
    }
    const updated = await prisma.articles.update({ where: { id }, data });
    res.json(updated);
  } catch (e: any) {
    console.error('Update article error:', e);
    res.status(500).json({ message: e.message || 'Lỗi cập nhật' });
  }
});

// POST rename category
router.post('/articles/rename-category', async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;
    if (!oldCategory || !newCategory) {
      return res.status(400).json({ message: 'Thiếu thông tin danh mục' });
    }
    
    const result = await prisma.articles.updateMany({
      where: { category: oldCategory },
      data: { category: newCategory }
    });
    
    res.json({ message: 'Đã đổi tên danh mục thành công', count: result.count });
  } catch (e: any) {
    console.error('Rename category error:', e);
    res.status(500).json({ message: e.message || 'Lỗi đổi tên danh mục' });
  }
});

// DELETE
router.delete('/articles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.articles.delete({ where: { id } });
    res.json({ message: 'Đã xóa' });
  } catch (e: any) {
    console.error('Delete article error:', e);
    res.status(500).json({ message: e.message || 'Lỗi xóa' });
  }
});

// PATCH toggle publish
router.patch('/articles/:id/toggle', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const a: any = await prisma.articles.findUnique({ where: { id } });
    if (!a) return res.status(404).json({ message: 'Not found' });
    const updated = await prisma.articles.update({
      where: { id },
      data: { is_published: !a.is_published },
    });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ message: 'Lỗi' });
  }
});

// ═══ RECRUITMENT JD FILE UPLOAD (PDF, PNG, JPG, WORD) ════════════
const jdStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const jdDir = path.resolve(__dirname, '../../../public/uploads/jd');
    if (!fs.existsSync(jdDir)) fs.mkdirSync(jdDir, { recursive: true });
    cb(null, jdDir);
  },
  filename: (_req, file, cb) => {
    let originalName = file.originalname;
    try {
      originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch {
      originalName = file.originalname;
    }
    const ext = path.extname(originalName) || path.extname(file.originalname);
    const baseName = path.basename(originalName, ext);
    const sanitized = baseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    const safeExt = ext.toLowerCase() || '.pdf';
    const finalName = `jd-${sanitized || 'file'}-${Date.now()}${safeExt}`;
    cb(null, finalName);
  }
});

const jdUpload = multer({
  storage: jdStorage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max
  fileFilter: (_req, file, cb) => {
    let originalName = file.originalname;
    try {
      originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch {
      originalName = file.originalname;
    }
    const ext = path.extname(originalName) || path.extname(file.originalname);
    const allowed = /\.(pdf|png|jpg|jpeg|doc|docx|webp)$/i;
    if (allowed.test(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('image') || file.mimetype.includes('word') || file.mimetype.includes('document')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận các định dạng file: PDF, PNG, JPG, JPEG, WEBP, Word (doc/docx)'));
    }
  }
});

router.post('/upload-jd', (req: any, res: any) => {
  jdUpload.any()(req, res, (err: any) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    if (!file) return res.status(400).json({ success: false, message: 'Vui lòng chọn tệp JD' });

    syncFileToDist('uploads/jd', file.filename);
    const publicPath = `/uploads/jd/${file.filename}`;
    
    let originalName = file.originalname;
    try {
      originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch {
      originalName = file.originalname;
    }

    res.json({
      success: true,
      url: publicPath,
      fileUrl: publicPath,
      filename: file.filename,
      fileName: file.filename,
      originalName
    });
  });
});

export default router;
