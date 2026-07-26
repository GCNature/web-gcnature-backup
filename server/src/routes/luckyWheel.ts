import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Default configuration for rewards if not customized in the DB
export const DEFAULT_REWARDS = [
  { id: 1, name: "Liệu trình chăm sóc tại hệ thống đối tác Spa của GC Nature", probability: 5, type: "spa" },
  { id: 2, name: "Voucher giảm giá độc quyền 10K cho đơn từ 100K", probability: 10, type: "voucher", discount: 10000, minOrder: 100000 },
  { id: 3, name: "Voucher giảm giá độc quyền 20K cho đơn từ 200K", probability: 10, type: "voucher", discount: 20000, minOrder: 200000 },
  { id: 4, name: "Voucher giảm giá độc quyền 30K cho đơn từ 250K", probability: 10, type: "voucher", discount: 30000, minOrder: 250000 },
  { id: 5, name: "Voucher giảm giá độc quyền 40K cho đơn từ 350K", probability: 10, type: "voucher", discount: 40000, minOrder: 350000 },
  { id: 6, name: "Voucher giảm giá độc quyền 50K cho đơn từ 450K", probability: 10, type: "voucher", discount: 50000, minOrder: 450000 },
  { id: 7, name: "Voucher giảm giá độc quyền 100K cho đơn từ 900K", probability: 10, type: "voucher", discount: 100000, minOrder: 900000 },
  { id: 8, name: "Tặng 10 Mặt Nạ Tinh Chất Phục Hồi & Làm Dịu Da Chuyên Sâu SKIN BALANCING CICA COMPLEX SERUM MASK GC NATURE", probability: 5, type: "physical" },
  { id: 9, name: "Tặng 10 Mặt nạ Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC SERUM MASK GC NATURE", probability: 5, type: "physical" },
  { id: 10, name: "Tặng 10 Mặt nạ Dưỡng Trắng DA VITAMIN-C SERUM MASK GC NATURE", probability: 5, type: "physical" },
  { id: 11, name: "Tặng chuyến du lịch Hàn Quốc trị giá 10.000.000đ", probability: 0, type: "other" },
  { id: 12, name: "Tặng 1 Mặt Nạ Tinh Chất Phục Hồi & Làm Dịu Da Chuyên Sâu SKIN BALANCING CICA COMPLEX SERUM MASK GC NATURE", probability: 5, type: "physical" },
  { id: 13, name: "Tặng 1 Mặt nạ Cấp Ẩm Chuyên Sâu SKIN BALANCING HYALURONIC SERUM MASK GC NATURE", probability: 5, type: "physical" },
  { id: 14, name: "Tặng 1 Mặt nạ Dưỡng Trắng DA VITAMIN-C SERUM MASK GC NATURE", probability: 5, type: "physical" }
];

// ── GET status ──
router.get('/status', async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ authenticated: false, luckySpinsCount: 0 });
    }

    const jwt = await import('jsonwebtoken');
    const { JWT_SECRET } = await import('../config');
    let decoded: any;
    try {
      decoded = jwt.default.verify(authHeader.split(' ')[1], JWT_SECRET);
    } catch {
      return res.json({ authenticated: false, luckySpinsCount: 0 });
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.json({ authenticated: false, luckySpinsCount: 0 });
    }

    return res.json({
      authenticated: true,
      luckySpinsCount: user.lucky_spins_count
    });
  } catch (error) {
    console.error('Get lucky wheel status error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// ── POST spin ──
router.post('/spin', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId as number;
    const user = await prisma.users.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    if (user.lucky_spins_count <= 0) {
      return res.status(400).json({ error: 'Bạn đã hết lượt quay. Hãy mua thêm đơn hàng để nhận thêm lượt!' });
    }

    // Load custom configuration from DB setting
    const setting = await prisma.settings.findUnique({ where: { key: 'page_lucky_wheel' } });
    let rewards = DEFAULT_REWARDS;
    if (setting?.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (parsed.tabsConfig && Array.isArray(parsed.tabsConfig) && parsed.tabsConfig.length > 0) {
          rewards = parsed.tabsConfig;
        }
      } catch (err) {
        console.error('Failed to parse page_lucky_wheel settings:', err);
      }
    }

    // Spin algorithm based on probabilities
    const activeRewards = rewards.filter(r => r.probability > 0);
    const sumProb = activeRewards.reduce((sum, r) => sum + r.probability, 0);

    if (sumProb <= 0) {
      return res.status(500).json({ error: 'Lỗi cấu hình phần thưởng. Vui lòng liên hệ Admin.' });
    }

    const rand = Math.random() * sumProb;
    let runningSum = 0;
    let winningItem = activeRewards[activeRewards.length - 1]; // Fallback

    for (const r of activeRewards) {
      runningSum += r.probability;
      if (rand <= runningSum) {
        winningItem = r;
        break;
      }
    }

    // Decrement lucky spin count
    await prisma.users.update({
      where: { id: userId },
      data: { lucky_spins_count: { decrement: 1 } }
    });

    let code: string | null = null;

    if (winningItem.type === 'voucher') {
      const discount = Number(winningItem.discount) || 10000;
      const minOrder = Number(winningItem.minOrder) || 100000;
      const codeSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      code = `WHEEL-${discount / 1000}K-${codeSuffix}`;

      // Create voucher in DB
      const voucher = await prisma.vouchers.create({
        data: {
          code: code,
          name: winningItem.name,
          discount_amount: BigInt(discount),
          min_order_value: BigInt(minOrder),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
          is_active: true
        }
      });

      // Assign to user's wallet
      await prisma.user_vouchers.create({
        data: {
          user_id: userId,
          voucher_id: voucher.id,
          is_used: false
        }
      });
    }

    // Log the user reward
    await prisma.user_rewards.create({
      data: {
        user_id: userId,
        reward_name: winningItem.name,
        reward_type: winningItem.type,
        code: code
      }
    });

    res.json({
      success: true,
      reward: {
        id: winningItem.id,
        name: winningItem.name,
        type: winningItem.type,
        code: code
      },
      luckySpinsCount: user.lucky_spins_count - 1
    });

  } catch (error) {
    console.error('Spin lucky wheel error:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

// ── GET my-rewards ──
router.get('/my-rewards', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId as number;
    const rewards = await prisma.user_rewards.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    res.json(rewards);
  } catch (error) {
    console.error('Get my-rewards error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});
// ── POST gift-spins (Admin only) ──
router.post('/gift-spins', requireAuth, async (req: any, res: any) => {
  try {
    const adminId = req.userId as number;
    const admin = await prisma.users.findUnique({ where: { id: adminId } });
    if (!admin || (admin.role !== 'admin' && admin.role !== 'shop_manager')) {
      return res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này.' });
    }

    const { email, spins } = req.body;
    if (!email || !spins || typeof spins !== 'number' || spins < 1) {
      return res.status(400).json({ error: 'Vui lòng nhập email hợp lệ và số lượt quay >= 1.' });
    }

    const targetUser = await prisma.users.findUnique({ where: { email } });
    if (!targetUser) {
      return res.status(404).json({ error: `Không tìm thấy người dùng với email: ${email}` });
    }

    const updated = await prisma.users.update({
      where: { id: targetUser.id },
      data: { lucky_spins_count: { increment: spins } }
    });

    res.json({
      success: true,
      message: `Đã tặng ${spins} lượt quay cho ${email}. Tổng lượt quay hiện tại: ${updated.lucky_spins_count}`,
      user: { id: updated.id, email: updated.email, lucky_spins_count: updated.lucky_spins_count }
    });
  } catch (error) {
    console.error('Gift spins error:', error);
    res.status(500).json({ error: 'Lỗi hệ thống' });
  }
});

export default router;
