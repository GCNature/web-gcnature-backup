import express from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import { ACB_HISTORY_API_URL } from '../config';
import { requireAuth } from '../middleware/auth';
import { createSystemNotification } from '../utils/notification';

const router = express.Router();
const prisma = new PrismaClient();

// Rate limit order creation: max 10 orders per 15 minutes per IP
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Quá nhiều yêu cầu đặt hàng, vui lòng thử lại sau.' },
});

// Public endpoint to check payment status directly without needing an order in DB
router.get('/check-payment', async (req, res) => {
  try {
    const { amount, content } = req.query;
    if (!amount || !content) return res.json({ paid: false });

    if (!ACB_HISTORY_API_URL) {
      console.error('Missing ACB_HISTORY_API_URL');
      return res.json({ paid: false });
    }

    const response = await axios.get(ACB_HISTORY_API_URL);
    
    if (response.data && response.data.codeStatus === 200) {
      const transactions = response.data.data || [];
      const matched = transactions.find((tx: any) => {
        const cleanDesc = String(tx.description).toLowerCase().replace(/[^a-z0-9]/g, '');
        const orderNumStr = String(content).replace(/[^0-9]/g, ''); // Extract '0023' from 'CHUYEN TIEN KINH MERCY 0023'
        return tx.type === 'IN' && 
               tx.amount >= Number(amount) && 
               cleanDesc.includes('mercy') &&
               cleanDesc.includes(orderNumStr);
      });
      
      if (matched) {
        return res.json({ paid: true });
      }
    }
    
    return res.json({ paid: false });
  } catch (error) {
    console.error('Check payment error:', error);
    res.json({ paid: false });
  }
});

router.post('/', orderLimiter, async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.info('Incoming order POST request');
    }
    const { total, items, affiliateCode, userId, shippingInfo, orderCode: providedOrderCode, status: providedStatus, voucherCode, voucherDiscount } = req.body;
    
    // Auto-generate ordercode if not provided
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderCode = providedOrderCode || `MERCY-${randomNum}`;

    // Capture IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '';

    // Preserve 'deposit' or 'full' intention in notes since DB only accepts 'bank_transfer'
    const actualPaymentType = shippingInfo?.paymentMethod;
    let finalNotes = shippingInfo?.notes || '';
    if (actualPaymentType === 'deposit') {
      finalNotes = `[DEPOSIT] ${finalNotes}`;
    } else if (actualPaymentType === 'full') {
      finalNotes = `[FULL] ${finalNotes}`;
    }
    
    const order = await prisma.orders.create({
      data: {
        order_code: orderCode,
        total: BigInt(total || 0),
        subtotal: BigInt(total || 0) + BigInt(voucherDiscount || 0),
        discount_amount: BigInt(voucherDiscount || 0),
        shipping_fee: BigInt(0),
        customer_name: shippingInfo?.name || 'Khách hàng',
        customer_phone: shippingInfo?.phone || '',
        customer_email: shippingInfo?.email || null,
        shipping_address: shippingInfo?.address || '',
        user_id: userId ? Number(userId) : null,
        payment_method: (['cod', 'ewallet', 'bank_transfer'].includes(shippingInfo?.paymentMethod) ? shippingInfo.paymentMethod : 'bank_transfer'),
        notes: finalNotes || null,
        status: providedStatus || 'pending',
        ip_address: String(ipAddress).substring(0, 50),
        voucher_code: voucherCode || null,
        voucher_discount: BigInt(voucherDiscount || 0),
      }
    });

    // Mark user voucher as used if applicable
    if (voucherCode && userId) {
      try {
        const vObj = await prisma.vouchers.findUnique({ where: { code: voucherCode.toUpperCase() } });
        if (vObj) {
          await prisma.user_vouchers.update({
            where: { user_id_voucher_id: { user_id: Number(userId), voucher_id: vObj.id } },
            data: {
              is_used: true,
              used_at: new Date(),
              order_id: order.id
            }
          });
        }
      } catch (err) {
        console.error('[Order] Failed to mark user voucher as used', err);
      }
    }

    // Create order items if provided
    if (items && items.length > 0) {
      await prisma.order_items.createMany({
        data: items.map((item: any) => ({
          order_id: order.id,
          product_id: String(item.productId || item.product_id || ''),
          product_name: String(item.productName || item.product_name || item.name || ''),
          variant_name: item.variantName || item.variant_name || null,
          warranty_name: item.warrantyName || item.warranty_name || null,
          warranty_fee: BigInt(item.warrantyFee || item.warranty_fee || 0),
          price: BigInt(item.price || 0),
          original_price: BigInt(item.originalPrice || item.original_price || item.price || 0),
          quantity: Number(item.quantity || 1),
          image_url: item.imageUrl || item.image_url || null,
        })),
      });
    }

    // Create system notification for new order (non-blocking)
    const notifyPayload = {
      name: order.customer_name,
      phone: order.customer_phone || 'Không có',
      email: order.customer_email || 'Không có',
      requestType: 'Đơn hàng mới',
      address: order.shipping_address || 'Không có',
      message: `Mã đơn hàng: ${order.order_code}. Tổng tiền: ${Number(order.total).toLocaleString('vi-VN')}đ. Phương thức thanh toán: ${order.payment_method.toUpperCase()}.`
    };
    createSystemNotification('order_new', `Đơn hàng mới: ${order.order_code}`, JSON.stringify(notifyPayload)).catch(err => {
      console.error('Failed to log system notification:', err);
    });

    res.json({
      success: true,
      message: 'Order created',
      data: {
        id: order.id,
        orderCode: order.order_code,
        total: Number(order.total),
        status: order.status,
        createdAt: order.created_at,
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: 'Cannot create order' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { codes, userId } = req.query;
    let whereClause: any = {};
    
    if (userId) {
       // When querying by userId, verify JWT auth and ownership
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({ data: [], message: 'Chưa đăng nhập' });
       }
       try {
         const jwt = await import('jsonwebtoken');
         const { JWT_SECRET } = await import('../config');
         const decoded: any = jwt.default.verify(authHeader.split(' ')[1], JWT_SECRET);
         // Only allow users to view their own orders
         if (decoded.id !== Number(userId) && decoded.role !== 'admin') {
           return res.status(403).json({ data: [], message: 'Không có quyền' });
         }
       } catch {
         return res.status(401).json({ data: [], message: 'Token không hợp lệ' });
       }
       whereClause.user_id = Number(userId);
    } else if (codes) {
       whereClause.order_code = { in: String(codes).split(',') };
    } else {
       return res.json({ data: [] });
    }

    const orders = await prisma.orders.findMany({
      where: whereClause,
      include: {
        order_items: true
      },
      orderBy: { created_at: 'desc' }
    });

    const mapped = orders.map((o: any) => {
      let isDeposit = false;
      let cleanTransferContent = o.notes || '';
      
      if (cleanTransferContent.includes('[DEPOSIT]')) {
        isDeposit = true;
        cleanTransferContent = cleanTransferContent.replace('[DEPOSIT] ', '').replace('[DEPOSIT]', '');
      } else if (cleanTransferContent.includes('[FULL]')) {
        cleanTransferContent = cleanTransferContent.replace('[FULL] ', '').replace('[FULL]', '');
      }

      const total = Number(o.total);
      
      // Calculate deposit logic
      let finalPaymentMethod = isDeposit ? 'deposit' : 'full';
      if (o.payment_method === 'cod') finalPaymentMethod = 'cod'; // Fallback if regular COD without popup
      
      let transferAmount = isDeposit ? Math.ceil(total * 0.1) : total;
      let remainingCOD = isDeposit ? total - transferAmount : 0;

      return {
        orderCode: o.order_code,
        total: total,
        status: o.status,
        paymentMethod: finalPaymentMethod,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerAddress: o.shipping_address,
        createdAt: o.created_at,
        transferAmount: transferAmount,
        remainingCOD: remainingCOD,
        transferContent: cleanTransferContent,
        items: o.order_items.map((i: any) => ({
          id: i.id,
          name: i.product_name,
          price: Number(i.price),
          image: i.image_url,
          quantity: i.quantity
        }))
      };
    });
    
    res.json({ data: mapped });
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ data: [] });
  }
});

router.put('/:orderCode', async (req, res) => {
  try {
    const { orderCode } = req.params;
    const { shippingInfo, status } = req.body;
    
    // Find order
    const existing = await prisma.orders.findUnique({ where: { order_code: orderCode } });
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    
    const updated = await prisma.orders.update({
      where: { order_code: orderCode },
      data: {
        customer_name: shippingInfo?.name || existing.customer_name,
        customer_phone: shippingInfo?.phone || existing.customer_phone,
        shipping_address: shippingInfo?.address || existing.shipping_address,
        status: status || existing.status,
      }
    });

    // Check if status transitioned to delivered
    if (status === 'delivered' && existing.status !== 'delivered') {
      const notifyPayload = {
        name: updated.customer_name,
        phone: updated.customer_phone || 'Không có',
        email: updated.customer_email || 'Không có',
        requestType: 'Đơn hàng hoàn thành',
        address: updated.shipping_address || 'Không có',
        message: `Đơn hàng ${orderCode} đã hoàn thành giao hàng thành công.`
      };
      createSystemNotification('order_completed', `Đơn hàng hoàn thành: ${orderCode}`, JSON.stringify(notifyPayload)).catch(err => {
        console.error('Failed to log system notification:', err);
      });
    }

    res.json({ success: true, message: 'Order updated' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, error: 'Cannot update order' });
  }
});

export default router;
