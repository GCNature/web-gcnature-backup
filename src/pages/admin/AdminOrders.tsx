import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, PackageOpen, Loader2, RefreshCw, Eye, Shield, MapPin, Phone, Mail, Clock, CreditCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  variantName: string | null;
  warrantyName: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

interface Order {
  id: number;
  orderCode: string;
  userId: number | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  total: number;
  status: string;
  paymentMethod: string;
  notes: string | null;
  ipAddress: string | null;
  paymentStatus: string;
  paymentRef: string | null;
  paymentAmount: number | null;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Chờ xác nhận", variant: "outline" },
  confirmed: { label: "Đã xác nhận", variant: "default" },
  shipping: { label: "Đang giao", variant: "secondary" },
  delivered: { label: "Hoàn thành", variant: "default" },
  cancelled: { label: "Đã hủy (Chưa hoàn tiền)", variant: "destructive" },
  refunded: { label: "Đã hủy & Hoàn tiền", variant: "destructive" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Order[]>("/admin/orders");
      setOrders(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await apiPut(`/admin/orders/${id}/status`, { status });
      await loadOrders();
      if (detailOrder && detailOrder.id === id) {
        setDetailOrder({ ...detailOrder, status });
      }
      toast.success("Đã cập nhật trạng thái");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery)
  );

  const formatPrice = (n: number) => "₫" + n.toLocaleString("vi-VN");

  return (
    <AdminLayout title="Đơn hàng">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã đơn, tên khách, SĐT..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={loadOrders} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Mã đơn</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Tổng tiền</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">PTTT</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Trạng thái TT</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Giao hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ngày đặt</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const sc = statusConfig[order.status] || { label: order.status, variant: "outline" as const };
                      return (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-mono font-medium text-primary">{order.orderCode}</td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{order.customerName}</span>
                              <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-foreground">{formatPrice(order.total)}</td>
                          <td className="p-4">
                            {order.paymentMethod === 'deposit' ? (
                              <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">Cọc 10%</Badge>
                            ) : order.paymentMethod === 'full' ? (
                              <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">Toàn bộ</Badge>
                            ) : order.paymentMethod === 'cod' ? (
                              <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">COD</Badge>
                            ) : (
                              <Badge variant="outline">{order.paymentMethod}</Badge>
                            )}
                          </td>
                          <td className="p-4">
                            {order.paymentStatus === 'paid' ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium px-2 py-1 bg-green-50 rounded-full border border-green-200">
                                ✅ Đã thanh toán
                              </span>
                            ) : order.paymentMethod !== 'cod' ? (
                              <span className="inline-flex items-center gap-1 text-orange-600 text-xs font-medium px-2 py-1 bg-orange-50 rounded-full border border-orange-200">
                                ⏳ Chờ thanh toán
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-gray-600 text-xs font-medium px-2 py-1 bg-gray-50 rounded-full border border-gray-200">
                                Thanh toán khi nhận
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className="text-xs border border-border rounded px-2 py-1 bg-background"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="confirmed">Đã xác nhận</option>
                              <option value="shipping">Đang giao hàng</option>
                              <option value="delivered">Đã giao hoàn thành</option>
                              <option value="cancelled">Đã hủy (Chưa hoàn tiền)</option>
                              <option value="refunded">Đã hủy & Đã hoàn tiền</option>
                            </select>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm" onClick={() => setDetailOrder(order)} className="h-8 gap-1.5">
                              <Eye className="w-4 h-4" /> Chi tiết
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <PackageOpen className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có đơn hàng nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="sm:max-w-[700px] bg-background max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b border-border pb-4">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl">Chi tiết đơn hàng {detailOrder?.orderCode}</DialogTitle>
                <DialogDescription className="mt-1">
                  Đặt lúc: {detailOrder ? new Date(detailOrder.createdAt).toLocaleString("vi-VN") : ""}
                </DialogDescription>
              </div>
              {detailOrder && (
                <Badge variant={statusConfig[detailOrder.status]?.variant || "outline"} className="text-sm px-3 py-1">
                  {statusConfig[detailOrder.status]?.label || detailOrder.status}
                </Badge>
              )}
            </div>
          </DialogHeader>
          
          {detailOrder && (
            <div className="flex-1 overflow-auto p-6 pt-4 space-y-6">
              {/* Grid 2 columns for Customer & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Thông tin khách hàng
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Họ tên:</span>
                      <span className="font-medium text-foreground">{detailOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> SĐT:</span>
                      <span className="font-medium text-foreground">{detailOrder.customerPhone}</span>
                    </div>
                    {detailOrder.customerEmail && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> Email:</span>
                        <span className="font-medium text-foreground">{detailOrder.customerEmail}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-muted-foreground flex items-center gap-1 whitespace-nowrap"><MapPin className="w-3.5 h-3.5"/> Địa chỉ:</span>
                      <span className="font-medium text-foreground text-right">{detailOrder.shippingAddress}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="text-muted-foreground">IP Address:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-foreground">
                        {detailOrder.ipAddress || "Không xác định"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment & Cron Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" /> Trạng thái thanh toán
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-xl space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hình thức:</span>
                      <span className="font-medium text-foreground uppercase">{detailOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      {detailOrder.paymentStatus === 'paid' ? (
                        <span className="text-emerald-600 font-bold">Đã thanh toán</span>
                      ) : (
                        <span className="text-orange-600 font-bold">Chưa thanh toán</span>
                      )}
                    </div>
                    
                    {/* ACB Cron Info */}
                    {detailOrder.paymentStatus === 'paid' && detailOrder.paymentRef && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                          <Receipt className="w-4 h-4" /> Đã khớp Cron Ngân hàng
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-emerald-600/70">Số tiền khớp:</span>
                          <span className="font-bold text-emerald-700">{formatPrice(detailOrder.paymentAmount || 0)}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-emerald-600/70 text-xs">Nội dung CK:</span>
                          <p className="font-mono text-xs bg-emerald-100/50 p-1.5 rounded text-emerald-800 break-words">
                            {detailOrder.paymentRef}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Danh sách sản phẩm</h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium text-muted-foreground">Sản phẩm</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">SL</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Đơn giá</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {detailOrder.items.map((item) => (
                        <tr key={item.id} className="bg-background">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded object-cover border border-border" />
                              )}
                              <div>
                                <p className="font-medium text-foreground">{item.productName}</p>
                                {(item.variantName || item.warrantyName) && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {[item.variantName, item.warrantyName].filter(Boolean).join(" • ")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center font-medium">{item.quantity}</td>
                          <td className="p-3 text-right text-muted-foreground">{formatPrice(item.price)}</td>
                          <td className="p-3 text-right font-medium text-primary">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/20">
                      <tr>
                        <td colSpan={3} className="p-3 text-right font-medium text-muted-foreground">Tổng cộng:</td>
                        <td className="p-3 text-right font-bold text-lg text-primary">{formatPrice(detailOrder.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status Update Action inside Modal */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <Label className="text-muted-foreground">Cập nhật trạng thái đơn hàng:</Label>
                <div className="flex items-center gap-2">
                  <select
                    value={detailOrder.status}
                    onChange={(e) => updateStatus(detailOrder.id, e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-background font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="delivered">Đã giao hoàn thành</option>
                    <option value="cancelled">Đã hủy (Chưa hoàn tiền)</option>
                    <option value="refunded">Đã hủy & Đã hoàn tiền</option>
                  </select>
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
