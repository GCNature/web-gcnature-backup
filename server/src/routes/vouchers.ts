import express from 'express';
import { PrismaClient } from '@prisma/client';
import { isShopManager, requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// ── Default vouchers to seed ────────────────────────────────────────────────
export const DEFAULT_VOUCHERS = [
  { code: 'GIAM10K', name: 'Giảm 10.000đ cho đơn từ 100.000đ', discount_amount: 10000n, min_order_value: 100000n },
  { code: 'GIAM20K', name: 'Giảm 20.000đ cho đơn từ 200.000đ', discount_amount: 20000n, min_order_value: 200000n },
  { code: 'GIAM30K', name: 'Giảm 30.000đ cho đơn từ 300.000đ', discount_amount: 30000n, min_order_value: 300000n },
  { code: 'GIAM40K', name: 'Giảm 40.000đ cho đơn từ 400.000đ', discount_amount: 40000n, min_order_value: 400000n },
  { code: 'GIAM50K', name: 'Giảm 50.000đ cho đơn từ 500.000đ', discount_amount: 50000n, min_order_value: 500000n },
  { code: 'GIAM100K', name: 'Giảm 100.000đ cho đơn từ 1.000.000đ', discount_amount: 100000n, min_order_value: 1000000n },
];

/**
 * Assign all active vouchers to a newly registered user.
 * Called from auth.ts after user creation.
 */
export async function assignDefaultVouchersToUser(userId: number): Promise<void> {
  try {
    const activeVouchers = await prisma.vouchers.findMany({ where: { is_active: true } });
    for (const v of activeVouchers) {
      await prisma.user_vouchers.upsert({
        where: { user_id_voucher_id: { user_id: userId, voucher_id: v.id } },
        create: { user_id: userId, voucher_id: v.id },
        update: {},
      });
    }
  } catch (err) {
    console.error('[Voucher] Failed to assign default vouchers to user', userId, err);
  }
}

// ── PUBLIC: Get all active vouchers ──────────────────────────────────────────
router.get('/active', async (req: any, res: any) => {
  try {
    const active = await prisma.vouchers.findMany({
      where: {
        is_active: true,
        OR: [{ expires_at: null }, { expires_at: { gte: new Date() } }],
      },
      orderBy: { min_order_value: 'asc' },
    });
    res.json(
      active.map(v => ({
        id: v.id,
        code: v.code,
        name: v.name,
        discount_amount: Number(v.discount_amount),
        min_order_value: Number(v.min_order_value),
        expires_at: v.expires_at,
      }))
    );
  } catch (error) {
    console.error('[Voucher] active list error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// ── PUBLIC AUTH: Get best voucher for a given order amount ──────────────────
// GET /api/vouchers/best-for-order?amount=300000
router.get('/best-for-order', requireAuth, async (req: any, res: any) => {
  try {
    const amount = parseInt(String(req.query.amount || '0'), 10);
    const userId = req.userId as number;

    // Auto-allocate vouchers for existing accounts
    await assignDefaultVouchersToUser(userId);

    const userVouchers = await prisma.user_vouchers.findMany({
      where: {
        user_id: userId,
        is_used: false,
        vouchers: {
          is_active: true,
          min_order_value: { lte: BigInt(amount) },
          OR: [{ expires_at: null }, { expires_at: { gte: new Date() } }],
        },
      },
      include: { vouchers: true },
      orderBy: { vouchers: { discount_amount: 'desc' } },
    });

    if (userVouchers.length === 0) {
      return res.json({ voucher: null });
    }

    const best = userVouchers[0].vouchers;
    return res.json({
      voucher: {
        id: best.id,
        code: best.code,
        name: best.name,
        discount_amount: Number(best.discount_amount),
        min_order_value: Number(best.min_order_value),
        expires_at: best.expires_at,
      },
    });
  } catch (error) {
    console.error('[Voucher] best-for-order error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// ── PUBLIC AUTH: Get user's own vouchers ────────────────────────────────────
router.get('/my', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId as number;
    
    // Auto-allocate vouchers for existing accounts
    await assignDefaultVouchersToUser(userId);

    const userVouchers = await prisma.user_vouchers.findMany({
      where: { user_id: userId },
      include: { vouchers: true },
      orderBy: { vouchers: { min_order_value: 'asc' } },
    });

    const result = userVouchers.map(uv => ({
      id: uv.vouchers.id,
      code: uv.vouchers.code,
      name: uv.vouchers.name,
      discount_amount: Number(uv.vouchers.discount_amount),
      min_order_value: Number(uv.vouchers.min_order_value),
      expires_at: uv.vouchers.expires_at,
      is_active: uv.vouchers.is_active,
      is_used: uv.is_used,
      used_at: uv.used_at,
      order_id: uv.order_id,
    }));

    res.json(result);
  } catch (error) {
    console.error('[Voucher] my vouchers error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// ── PUBLIC AUTH: Validate a voucher code ────────────────────────────────────
router.post('/validate', requireAuth, async (req: any, res: any) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.userId as number;

    if (!code) return res.status(400).json({ error: 'Vui long nhap ma voucher' });

    // Auto-allocate vouchers for existing accounts
    await assignDefaultVouchersToUser(userId);

    const voucher = await prisma.vouchers.findUnique({ where: { code: String(code).toUpperCase() } });
    if (!voucher || !voucher.is_active) {
      return res.status(404).json({ error: 'Ma voucher khong ton tai hoac da bi tat' });
    }
    if (voucher.expires_at && voucher.expires_at < new Date()) {
      return res.status(400).json({ error: 'Ma voucher da het han' });
    }
    if (BigInt(orderAmount || 0) < voucher.min_order_value) {
      return res.status(400).json({
        error: `Don hang toi thieu ${Number(voucher.min_order_value).toLocaleString('vi-VN')}d`,
      });
    }

    const uv = await prisma.user_vouchers.findUnique({
      where: { user_id_voucher_id: { user_id: userId, voucher_id: voucher.id } },
    });
    if (!uv) {
      return res.status(403).json({ error: 'Ban khong co voucher nay' });
    }
    if (uv.is_used) {
      return res.status(400).json({ error: 'Voucher nay da duoc su dung' });
    }

    res.json({
      voucher: {
        id: voucher.id,
        code: voucher.code,
        name: voucher.name,
        discount_amount: Number(voucher.discount_amount),
        min_order_value: Number(voucher.min_order_value),
        expires_at: voucher.expires_at,
      },
    });
  } catch (error) {
    console.error('[Voucher] validate error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// ════════════════ ADMIN ROUTES ════════════════════════════════════════════════
router.use(isShopManager);

// POST /api/vouchers/seed — seed default vouchers (must be before GET /)
router.post('/seed', async (_req: any, res: any) => {
  try {
    const results = [];
    for (const v of DEFAULT_VOUCHERS) {
      const voucher = await prisma.vouchers.upsert({
        where: { code: v.code },
        create: { ...v, expires_at: null, is_active: true },
        update: {},
      });
      results.push(voucher);
    }
    res.json({ seeded: results.length, message: 'Da seed voucher mac dinh' });
  } catch (error) {
    console.error('[Voucher] seed error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// GET /api/vouchers/usage — usage history
router.get('/usage', async (_req: any, res: any) => {
  try {
    const usage = await prisma.user_vouchers.findMany({
      where: { is_used: true },
      include: {
        users: { select: { id: true, full_name: true, email: true, phone: true } },
        vouchers: { select: { code: true, name: true, discount_amount: true } },
      },
      orderBy: { used_at: 'desc' },
      take: 200,
    });
    res.json(
      usage.map(u => ({
        id: u.id,
        user: u.users,
        voucher_code: u.vouchers.code,
        voucher_name: u.vouchers.name,
        discount_amount: Number(u.vouchers.discount_amount),
        order_id: u.order_id,
        used_at: u.used_at,
      }))
    );
  } catch (error) {
    console.error('[Voucher] usage error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// GET /api/vouchers — list all vouchers with stats
router.get('/', async (_req: any, res: any) => {
  try {
    const vouchers = await prisma.vouchers.findMany({
      include: { _count: { select: { user_vouchers: true } } },
      orderBy: { min_order_value: 'asc' },
    });
    const usedCounts = await prisma.user_vouchers.groupBy({
      by: ['voucher_id'],
      where: { is_used: true },
      _count: { id: true },
    });
    const usedMap: Record<number, number> = {};
    for (const u of usedCounts) usedMap[u.voucher_id] = u._count.id;

    res.json(
      vouchers.map(v => ({
        id: v.id,
        code: v.code,
        name: v.name,
        discount_amount: Number(v.discount_amount),
        min_order_value: Number(v.min_order_value),
        expires_at: v.expires_at,
        is_active: v.is_active,
        created_at: v.created_at,
        total_assigned: v._count.user_vouchers,
        total_used: usedMap[v.id] || 0,
      }))
    );
  } catch (error) {
    console.error('[Voucher] list error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// POST /api/vouchers — create voucher
router.post('/', async (req: any, res: any) => {
  try {
    const { code, name, discount_amount, min_order_value, expires_at, is_active } = req.body;
    if (!code || !name || discount_amount == null || min_order_value == null) {
      return res.status(400).json({ error: 'Thieu thong tin voucher' });
    }
    const voucher = await prisma.vouchers.create({
      data: {
        code: String(code).toUpperCase().trim(),
        name: String(name).trim(),
        discount_amount: BigInt(discount_amount),
        min_order_value: BigInt(min_order_value),
        expires_at: expires_at ? new Date(expires_at) : null,
        is_active: is_active !== false,
      },
    });
    res.json({ ...voucher, discount_amount: Number(voucher.discount_amount), min_order_value: Number(voucher.min_order_value) });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'Ma voucher da ton tai' });
    }
    console.error('[Voucher] create error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// PUT /api/vouchers/:id — update voucher
router.put('/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    const { code, name, discount_amount, min_order_value, expires_at, is_active } = req.body;
    const data: any = {};
    if (code !== undefined) data.code = String(code).toUpperCase().trim();
    if (name !== undefined) data.name = String(name).trim();
    if (discount_amount !== undefined) data.discount_amount = BigInt(discount_amount);
    if (min_order_value !== undefined) data.min_order_value = BigInt(min_order_value);
    if (expires_at !== undefined) data.expires_at = expires_at ? new Date(expires_at) : null;
    if (is_active !== undefined) data.is_active = Boolean(is_active);
    data.updated_at = new Date();

    const voucher = await prisma.vouchers.update({ where: { id }, data });
    res.json({ ...voucher, discount_amount: Number(voucher.discount_amount), min_order_value: Number(voucher.min_order_value) });
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Khong tim thay voucher' });
    if (error?.code === 'P2002') return res.status(409).json({ error: 'Ma voucher da ton tai' });
    console.error('[Voucher] update error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

// DELETE /api/vouchers/:id — delete voucher
router.delete('/:id', async (req: any, res: any) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.vouchers.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') return res.status(404).json({ error: 'Khong tim thay voucher' });
    console.error('[Voucher] delete error:', error);
    res.status(500).json({ error: 'Loi server' });
  }
});

export default router;
