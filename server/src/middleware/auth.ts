import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const checkRoles = (allowedRoles: string[]) => (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('[AuthMiddleware] role verification failed:', error?.message || error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = checkRoles(['admin']);
export const isEditor = checkRoles(['admin', 'editor']);
export const isShopManager = checkRoles(['admin', 'shop_manager']);
export const isStaff = checkRoles(['admin', 'editor', 'shop_manager']);

/**
 * Auth middleware — verifies any valid JWT (not admin-specific).
 */
export const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('[AuthMiddleware] requireAuth verification failed:', error?.message || error);
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
