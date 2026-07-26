import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, History, Loader2, PackageOpen, Edit, Shield, User, DollarSign, ShoppingCart, UserPlus, Award, Crown, Gem, Medal, Download, FileText, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiGet, apiPut } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
  id: string;
  total: number;
  status: string;
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  joined: string;
  orderList: OrderItem[];
  role?: string;
  userId?: number;
}

const TIER_CONFIG: Record<string, { icon: any; label: string; className: string; min: number }> = {
  diamond: { icon: Gem, label: "Diamond", className: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white", min: 50000000 },
  gold: { icon: Crown, label: "Gold", className: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white", min: 10000000 },
  silver: { icon: Award, label: "Silver", className: "bg-gradient-to-r from-gray-300 to-gray-400 text-white", min: 2000000 },
  bronze: { icon: Medal, label: "Bronze", className: "bg-gradient-to-r from-orange-300 to-orange-400 text-white", min: 0 },
};

function getTier(spent: number) {
  if (spent >= 50000000) return "diamond";
  if (spent >= 10000000) return "gold";
  if (spent >= 2000000) return "silver";
  return "bronze";
}

export default function AdminCustomers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "customer" });
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await apiGet("/admin/customers/export");
      if (!Array.isArray(data) || data.length === 0) {
        toast.error("Không có dữ liệu để xuất");
        return;
      }

      const headers = ["Tên khách hàng", "Email", "Số điện thoại", "Tổng chi tiêu (Đã thanh toán)", "Địa chỉ", "Sản phẩm đã mua", "Lịch sử mua hàng", "Loại tài khoản"];
      
      const csvRows = [
        headers.join(","),
        ...data.map(row => {
          const spentFormatted = `"${row.spent}"`;
          const nameSafe = `"${(row.name || '').replace(/"/g, '""')}"`;
          const emailSafe = `"${(row.email || '').replace(/"/g, '""')}"`;
          const phoneSafe = `"${(row.phone || '').replace(/"/g, '""')}"`;
          const addressSafe = `"${(row.address || '').replace(/"/g, '""')}"`;
          const productsSafe = `"${(row.products || '').replace(/"/g, '""')}"`;
          const historySafe = `"${(row.history || '').replace(/"/g, '""')}"`;
          const typeSafe = `"${(row.type || '').replace(/"/g, '""')}"`;
          
          return [nameSafe, emailSafe, phoneSafe, spentFormatted, addressSafe, productsSafe, historySafe, typeSafe].join(",");
        })
      ];

      const csvContent = "\uFEFF" + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `danh_sach_khach_hang_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Xuất dữ liệu khách hàng thành công!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Lỗi khi xuất dữ liệu");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const data = await apiGet("/admin/customers");
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({ name: customer.name, email: customer.email, phone: customer.phone, role: customer.role || "customer" });
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer || !editingCustomer.userId) {
      toast.error("Không thể chỉnh sửa khách vãng lai");
      return;
    }
    setSaving(true);
    try {
      await apiPut(`/admin/members/${editingCustomer.userId}`, editForm);
      toast.success("Cập nhật thành công");
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchTier = tierFilter === "all" || getTier(c.spent) === tierFilter;
    return matchSearch && matchTier;
  });

  // Stats
  const totalSpent = customers.reduce((s, c) => s + c.spent, 0);
  const totalOrders = customers.reduce((s, c) => s + c.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = customers.filter(c => new Date(c.joined) >= firstDay).length;

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: "Chờ xử lý", cls: "bg-yellow-100 text-yellow-700" },
      confirmed: { label: "Đã xác nhận", cls: "bg-blue-100 text-blue-700" },
      shipping: { label: "Đang giao", cls: "bg-indigo-100 text-indigo-700" },
      delivered: { label: "Đã giao", cls: "bg-green-100 text-green-700" },
      cancelled: { label: "Đã hủy", cls: "bg-red-100 text-red-700" },
    };
    const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-700" };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
  };

  const renderTierBadge = (spent: number) => {
    const tier = getTier(spent);
    const cfg = TIER_CONFIG[tier];
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.className}`}>
        <Icon className="w-3 h-3" /> {cfg.label}
      </span>
    );
  };

  return (
    <AdminLayout title="Khách hàng">
      <div className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Tổng khách hàng", value: customers.length, color: "bg-blue-100 text-blue-600" },
            { icon: UserPlus, label: "Mới tháng này", value: newThisMonth, color: "bg-green-100 text-green-600" },
            { icon: DollarSign, label: "Tổng chi tiêu", value: `₫${totalSpent.toLocaleString("vi-VN")}`, color: "bg-emerald-100 text-emerald-600" },
            { icon: ShoppingCart, label: "TB đơn hàng", value: `₫${avgOrderValue.toLocaleString("vi-VN")}`, color: "bg-purple-100 text-purple-600" },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${s.color.split(" ")[0]} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color.split(" ")[1]}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm khách hàng (Tên, Email, SĐT)..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Phân hạng" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hạng</SelectItem>
                <SelectItem value="diamond">💎 Diamond</SelectItem>
                <SelectItem value="gold">👑 Gold</SelectItem>
                <SelectItem value="silver">🥈 Silver</SelectItem>
                <SelectItem value="bronze">🥉 Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full sm:w-auto gap-2 bg-[#5dc1d1] hover:bg-cyan-600 text-white shrink-0"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Xuất dữ liệu khách hàng
          </Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Liên hệ</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Hạng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đơn hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đã chi</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Ngày</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => {
                      const isGuest = c.id.startsWith('G_');
                      const userId = c.id.startsWith('U') ? parseInt(c.id.substring(1)) : null;
                      return (
                        <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${isGuest ? 'bg-gray-200 text-gray-600' : 'bg-primary/10 text-primary'} text-xs font-bold flex items-center justify-center`}>
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{c.name}</span>
                                {isGuest && <span className="ml-2 text-xs text-muted-foreground">(Khách vãng lai)</span>}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            <div className="flex flex-col text-xs">
                              <span className="font-medium text-foreground">{c.phone}</span>
                              <span>{c.email}</span>
                            </div>
                          </td>
                          <td className="p-4">{renderTierBadge(c.spent)}</td>
                          <td className="p-4 text-foreground font-semibold">{c.orders}</td>
                          <td className="p-4 font-bold text-primary">{c.spent.toLocaleString('vi-VN')}₫</td>
                          <td className="p-4 text-muted-foreground text-xs">{new Date(c.joined).toLocaleDateString('vi-VN')}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(c)} className="gap-1.5 h-8">
                                <History className="w-3.5 h-3.5" /> Lịch sử
                              </Button>
                              {!isGuest && userId && (
                                <Button variant="ghost" size="sm" onClick={() => handleEditClick({...c, userId})} className="gap-1.5 h-8">
                                  <Edit className="w-3.5 h-3.5" /> Sửa
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có khách hàng nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order History Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-[600px] bg-background max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Lịch sử mua hàng của {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              SĐT: {selectedCustomer?.phone} | Chi tiêu: <span className="font-bold text-primary">{selectedCustomer?.spent.toLocaleString('vi-VN')}₫</span>
              {selectedCustomer && <span className="ml-2">{renderTierBadge(selectedCustomer.spent)}</span>}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto mt-4 px-1">
            {selectedCustomer?.orderList && selectedCustomer.orderList.length > 0 ? (
              <div className="space-y-3">
                {selectedCustomer.orderList.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
                  <div key={order.id} className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="font-semibold text-sm">Mã ĐH: {order.id}</div>
                      <div className="text-xs text-muted-foreground">{new Date(order.date).toLocaleString('vi-VN')}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-bold text-sm">{order.total.toLocaleString('vi-VN')}₫</div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <PackageOpen className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có đơn hàng</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit className="w-5 h-5" /> Chỉnh sửa khách hàng</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho {editingCustomer?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Nhập họ tên" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={editForm.email} disabled />
              <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} />
            </div>
            {user?.role === "admin" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Shield className="w-4 h-4" /> Quyền hạn</Label>
                <Select value={editForm.role} onValueChange={(val) => setEditForm({...editForm, role: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer"><div className="flex items-center gap-2"><User className="w-4 h-4" /> Thành viên</div></SelectItem>
                    <SelectItem value="editor"><div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Biên tập viên</div></SelectItem>
                    <SelectItem value="shop_manager"><div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Quản lý cửa hàng</div></SelectItem>
                    <SelectItem value="admin"><div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Quản trị viên</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditingCustomer(null)} disabled={saving}>Hủy</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Lưu thay đổi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
