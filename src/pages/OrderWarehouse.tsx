import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { formatPrice } from "@/data/products";
import { Package, Clock, Truck, CheckCircle2, XCircle, ChevronRight, ShoppingBag, Phone, MessageCircle } from "lucide-react";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
export interface Order {
  orderCode: string;
  items: OrderItem[];
  total: number;
  transferAmount: number;
  paymentMethod: "deposit" | "full";
  remainingCOD?: number;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  createdAt: string;
  transferContent: string;
}

const statusConfig: Record<Order["status"], { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: "Chờ xác nhận", color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200", icon: CheckCircle2 },
  shipping: { label: "Đang giao hàng", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200", icon: Truck },
  delivered: { label: "Đã giao hàng", color: "text-green-600", bgColor: "bg-green-50 border-green-200", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "text-red-600", bgColor: "bg-red-50 border-red-200", icon: XCircle },
};

const OrderWarehouse = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        let query = "";
        
        // Fetch using authenticated user, or fallback to local order codes if guest.
        if (user?.id) {
          query = `?userId=${user.id}`;
        } else {
          try {
            const stored = localStorage.getItem("gcnature_orders");
            const localOrders = stored ? JSON.parse(stored) : [];
            const codes = localOrders.map((o: any) => o.orderCode).join(',');
            if (codes) {
              query = `?codes=${codes}`;
            } else {
              setOrders([]);
              setLoading(false);
              return;
            }
          } catch {
            setOrders([]);
            setLoading(false);
            return;
          }
        }

        const res = await apiGet<{data: Order[]}>(`/orders/history${query}`);
        setOrders(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng từ MySQL:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <SEOHead
        title="Kho Hàng - Đơn Hàng Của Tôi | GCnature"
        description="Quản lý và theo dõi đơn hàng của bạn tại GCnature"
      />
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <ol className="container py-3 flex items-center gap-2 text-sm text-gray-500 list-none">
          <li><Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5" /></li>
          <li className="text-gray-800 font-medium">Kho Hàng</li>
        </ol>
      </nav>

      <div className="container py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Kho Hàng - Đơn Hàng Của Tôi</h1>
            <p className="text-sm text-gray-500">{orders.length} đơn hàng</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-700 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-sm text-gray-400 mb-6">Hãy khám phá các sản phẩm và đặt hàng ngay!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-5 space-y-3">
              {orders.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                const isSelected = selectedOrder?.orderCode === order.orderCode;
                
                return (
                  <button
                    key={order.orderCode}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full text-left bg-white rounded-2xl border-2 p-4 transition-all hover:shadow-md ${
                      isSelected ? "border-red-500 shadow-lg shadow-red-500/10" : "border-gray-100 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">#{order.orderCode}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border ${config.bgColor} ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    
                    {/* Items preview */}
                    <div className="flex items-center gap-2 mb-2">
                      {order.items.slice(0, 3).map((item) => (
                        <img key={item.id} src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-gray-400 font-medium">+{order.items.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-sm font-bold text-red-600">{formatPrice(order.total)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Order Detail */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-20">
                  {/* Order header */}
                  <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold">Đơn hàng #{selectedOrder.orderCode}</h2>
                        <p className="text-sm text-white/80 mt-0.5">
                          {new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {(() => {
                        const cfg = statusConfig[selectedOrder.status];
                        return (
                          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            <cfg.icon className="w-3.5 h-3.5" />
                            {cfg.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Items */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-3">Sản phẩm đã đặt</h4>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-100" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Số lượng: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-bold text-red-600 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <h4 className="text-sm font-bold text-gray-800 mb-2">Thanh toán</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phương thức</span>
                        <span className="font-semibold text-gray-800">
                          {selectedOrder.paymentMethod === "deposit" ? "Cọc đảm bảo 10%" : "Thanh toán toàn bộ"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Đã chuyển khoản</span>
                        <span className="font-bold text-green-600">{formatPrice(selectedOrder.transferAmount)}</span>
                      </div>
                      {selectedOrder.paymentMethod === "deposit" && selectedOrder.remainingCOD && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Còn lại khi nhận</span>
                          <span className="font-semibold text-gray-600">{formatPrice(selectedOrder.remainingCOD)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Nội dung CK</span>
                        <span className="font-mono text-xs font-semibold text-gray-800 bg-yellow-50 px-2 py-0.5 rounded">{selectedOrder.transferContent}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-bold text-gray-800">Tổng đơn hàng</span>
                          <span className="text-lg font-extrabold text-red-600">{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer info */}
                    {selectedOrder.customerName ? (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Thông tin giao hàng
                        </h4>
                        <div className="space-y-1.5 text-sm text-green-700">
                          <p><span className="font-medium">Họ tên:</span> {selectedOrder.customerName}</p>
                          <p><span className="font-medium">Zalo/SĐT:</span> {selectedOrder.customerPhone}</p>
                          <p><span className="font-medium">Địa chỉ:</span> {selectedOrder.customerAddress}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <p className="text-sm text-amber-700 font-medium flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          Chưa điền thông tin giao hàng - Kỹ thuật viên sẽ liên hệ qua Zalo
                        </p>
                      </div>
                    )}

                    {/* Contact */}
                    <div className="flex gap-3">
                      <a
                        href="https://zalo.me/0559869392"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Nhắn Zalo
                      </a>
                      <a
                        href="tel:0559869392"
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-[#5dc1d1] text-[#5dc1d1] font-bold py-3 rounded-xl text-sm hover:bg-cyan-50/50 transition-all active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        Gọi Hotline
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center sticky top-20">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-medium">Chọn một đơn hàng để xem chi tiết</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default OrderWarehouse;
