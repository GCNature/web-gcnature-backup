import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createSystemNotification(type: 'order_new' | 'order_completed' | 'contact_new' | 'hotline_call', title: string, content: string) {
  try {
    const notification = await prisma.notifications.create({
      data: {
        type,
        title,
        content,
        is_read: false,
      }
    });
    return notification;
  } catch (error) {
    console.error('Failed to create system notification:', error);
    return null;
  }
}
