import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkRoles } from '../middleware/auth';
import { createSystemNotification } from '../utils/notification';

const router = Router();
const prisma = new PrismaClient();

// POST /api/notifications/log-hotline - Public endpoint to log hotline clicks
router.post('/log-hotline', async (req, res) => {
  try {
    const { phone } = req.body;
    const title = 'Khách gọi hotline';
    
    const notifyPayload = {
      name: 'Khách vãng lai',
      phone: phone || 'Không có',
      requestType: 'Yêu cầu Hotline',
      message: 'Khách hàng bấm nút gọi Hotline trên website.'
    };
    
    const notification = await createSystemNotification('hotline_call', title, JSON.stringify(notifyPayload));
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Log hotline error:', error);
    res.status(500).json({ success: false, error: 'Cannot log hotline' });
  }
});

// GET /api/notifications - Get all notifications (Admin & Shop Manager only)
router.get('/', checkRoles(['admin', 'shop_manager']), async (req, res) => {
  try {
    const notifications = await prisma.notifications.findMany({
      orderBy: { created_at: 'desc' },
      take: 50
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ success: false, error: 'Cannot fetch notifications' });
  }
});

// GET /api/notifications/unread-count - Get unread count (Any staff member)
router.get('/unread-count', checkRoles(['admin', 'shop_manager', 'editor']), async (req, res) => {
  try {
    const count = await prisma.notifications.count({
      where: { is_read: false }
    });
    res.json({ success: true, count });
  } catch (error) {
    console.error('Fetch unread notifications error:', error);
    res.status(500).json({ success: false, error: 'Cannot fetch unread count' });
  }
});

// PUT /api/notifications/read-all - Mark all as read (Admin & Shop Manager only)
router.put('/read-all', checkRoles(['admin', 'shop_manager']), async (req, res) => {
  try {
    await prisma.notifications.updateMany({
      where: { is_read: false },
      data: { is_read: true }
    });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ success: false, error: 'Cannot mark all as read' });
  }
});

// PUT /api/notifications/:id/read - Mark single as read (Admin & Shop Manager only)
router.put('/:id/read', checkRoles(['admin', 'shop_manager']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.notifications.update({
      where: { id },
      data: { is_read: true }
    });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ success: false, error: 'Cannot mark notification as read' });
  }
});

export default router;
