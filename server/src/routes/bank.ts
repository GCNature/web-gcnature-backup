import express from 'express';
import axios from 'axios';
import { ACB_HISTORY_API_URL } from '../config';
import { PrismaClient } from '@prisma/client';
import { isShopManager } from '../middleware/auth';

const prisma = new PrismaClient();
const router = express.Router();

// All bank routes require shop manager authentication
router.use(isShopManager);

router.get('/history', async (_req, res) => {
  try {
    if (!ACB_HISTORY_API_URL) {
      return res.status(500).json({ message: 'Chưa cấu hình ACB_HISTORY_API_URL' });
    }

    const response = await axios.get(ACB_HISTORY_API_URL);
    
    // Đảm bảo lấy đúng mảng giao dịch từ response (đôi khi là response.data.data hoặc response.data)
    let transactions: any[] = [];
    if (Array.isArray(response.data)) {
      transactions = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      transactions = response.data.data;
    }
    
    // Lọc theo từ khóa chuyển tiền của Mercy
    transactions = transactions.filter((t: any) => {
      if (!t.description) return false;
      const desc = t.description.toLowerCase();
      // Loại bỏ dấu tiếng Việt để so sánh chính xác hơn
      const normalizedDesc = desc.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedDesc.includes("chuyen tien kinh mercy");
    });
    
    res.json({ data: transactions });
  } catch (error) {
    console.error('Bank history error:', error);
    res.status(500).json({ message: 'Không thể tải lịch sử giao dịch ngân hàng' });
  }
});


router.get('/cron', async (_req, res) => {
  try {
    if (!ACB_HISTORY_API_URL) {
      return res.status(500).json({ message: 'Chưa cấu hình ACB_HISTORY_API_URL' });
    }

    const response = await axios.get(ACB_HISTORY_API_URL);
    
    let transactions: any[] = [];
    if (Array.isArray(response.data)) {
      transactions = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      transactions = response.data.data;
    }
    
    const pendingOrders = await prisma.orders.findMany({
      where: { status: 'pending' }
    });
    
    let updatedCount = 0;
    for (const order of pendingOrders) {
      const orderNumStr = String(order.order_code).replace('MRC', '');
      const matchedTx = transactions.find((tx: any) => {
        const cleanDesc = String(tx.description).toLowerCase().replace(/[^a-z0-9]/g, '');
        return tx.type === 'IN' && 
               tx.amount >= Number(order.total) &&
               cleanDesc.includes('mercy') &&
               cleanDesc.includes(orderNumStr);
      });
      
      if (matchedTx) {
        await prisma.orders.update({
          where: { id: order.id },
          data: { 
            status: 'confirmed',
            payment_status: 'paid',
            payment_ref: String(matchedTx.description).substring(0, 250),
            payment_amount: BigInt(matchedTx.amount)
          }
        });
        updatedCount++;
      }
    }
    
    res.json({ message: 'Đã chạy tiến trình kiểm tra thanh toán', checkedOrders: pendingOrders.length, updated: updatedCount });
  } catch (error) {
    console.error('Bank cron API error:', error);
    res.status(500).json({ message: 'Lỗi thực thi cron job' });
  }
});

export default router;
