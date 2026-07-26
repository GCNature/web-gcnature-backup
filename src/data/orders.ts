// Order management - localStorage-based persistent orders
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  orderCode: string;
  orderNumber: number;
  items: OrderItem[];
  total: number;
  transferAmount: number;
  paymentMethod: "deposit" | "full";
  depositAmount?: number;
  remainingCOD?: number;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  createdAt: string;
  transferContent: string;
}

const ORDERS_KEY = "gcnature_orders";
const ORDER_COUNTER_KEY = "gcnature_order_counter";

// Get next incrementing order number
export function getNextOrderNumber(): number {
  try {
    const current = localStorage.getItem(ORDER_COUNTER_KEY);
    const next = current ? parseInt(current, 10) + 1 : 1;
    localStorage.setItem(ORDER_COUNTER_KEY, String(next));
    return next;
  } catch {
    return 1;
  }
}

// Generate transfer content: GCNATURE + order number
export function generateTransferContent(orderNumber: number): string {
  const paddedNum = String(orderNumber).padStart(4, "0");
  return `GCNATURE ${paddedNum}`;
}

// Generate order code for display
export function generateOrderCode(orderNumber: number): string {
  return `MRC${String(orderNumber).padStart(4, "0")}`;
}

// Save order to localStorage
export function saveOrder(order: Order): void {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    const orders: Order[] = stored ? JSON.parse(stored) : [];
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    
    // Also set a cookie for backup
    const cookieData = JSON.stringify({
      code: order.orderCode,
      total: order.total,
      time: order.createdAt,
    });
    document.cookie = `gcnature_last_order=${encodeURIComponent(cookieData)}; path=/; max-age=${60 * 60 * 24 * 30}`;
  } catch {
    // silently fail
  }
}

// Get all orders
export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Get a specific order by code
export function getOrderByCode(code: string): Order | undefined {
  return getOrders().find(o => o.orderCode === code);
}

// Update order with customer info
export function updateOrderInfo(orderCode: string, info: { name: string; phone: string; address: string }): void {
  try {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.orderCode === orderCode);
    if (idx !== -1) {
      orders[idx].customerName = info.name;
      orders[idx].customerPhone = info.phone;
      orders[idx].customerAddress = info.address;
      orders[idx].status = "confirmed";
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  } catch {
    // silently fail
  }
}
