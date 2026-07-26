import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Ticket, RefreshCw, Power, Users, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

interface Voucher {
  id: number;
  code: string;
  name: string;
  discount_amount: number;
  min_order_value: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  total_assigned: number;
  total_used: number;
}

interface UsageRecord {
  id: number;
  user: { id: number; full_name: string; email: string; phone: string };
  voucher_code: string;
  voucher_name: string;
  discount_amount: number;
  order_id: number | null;
  used_at: string;
}

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

const emptyForm = {
  code: "",
  name: "",
  discount_amount: "",
  min_order_value: "",
  expires_at: "",
  is_active: true,
};

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchVouchers = async () => {
    try {
      const res = await fetch(`${API_BASE}/vouchers`, { headers: authHeader() });
      if (res.ok) setVouchers(await res.json());
    } catch { /* silent */ }
  };

  const fetchUsage = async () => {
    try {
      const res = await fetch(`${API_BASE}/vouchers/usage`, { headers: authHeader() });
      if (res.ok) setUsage(await res.json());
    } catch { /* silent */ }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchVouchers(), fetchUsage()]).finally(() => setLoading(false));
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch(`${API_BASE}/vouchers/seed`, {
        method: "POST",
        headers: authHeader(),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Đã seed voucher mặc định");
        fetchVouchers();
      } else {
        toast.error(data.error || "Lỗi seed");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setSeeding(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (v: Voucher) => {
    setEditingId(v.id);
    setForm({
      code: v.code,
      name: v.name,
      discount_amount: String(v.discount_amount),
      min_order_value: String(v.min_order_value),
      expires_at: v.expires_at ? v.expires_at.slice(0, 10) : "",
      is_active: v.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.name.trim() || !form.discount_amount || !form.min_order_value) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const payload = {
      code: form.code.toUpperCase().trim(),
      name: form.name.trim(),
      discount_amount: parseInt(form.discount_amount),
      min_order_value: parseInt(form.min_order_value),
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    };
    try {
      const url = editingId ? `${API_BASE}/vouchers/${editingId}` : `${API_BASE}/vouchers`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingId ? "Đã cập nhật voucher" : "Đã tạo voucher mới");
        setDialogOpen(false);
        fetchVouchers();
      } else {
        toast.error(data.error || "Lỗi lưu voucher");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    }
  };

  const handleToggle = async (v: Voucher) => {
    try {
      const res = await fetch(`${API_BASE}/vouchers/${v.id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ is_active: !v.is_active }),
      });
      if (res.ok) {
        setVouchers(prev => prev.map(x => x.id === v.id ? { ...x, is_active: !v.is_active } : x));
        toast.success(v.is_active ? "Đã tắt voucher" : "Đã bật voucher");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_BASE}/vouchers/${deleteId}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      if (res.ok) {
        toast.success("Đã xóa voucher");
        setVouchers(prev => prev.filter(v => v.id !== deleteId));
        setDeleteId(null);
      } else {
        toast.error("Lỗi xóa voucher");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  const totalAssigned = vouchers.reduce((s, v) => s + v.total_assigned, 0);
  const totalUsed = vouchers.reduce((s, v) => s + v.total_used, 0);
  const activeCount = vouchers.filter(v => v.is_active).length;

  return (
    <AdminLayout title="Voucher">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" /> Quản lý Voucher
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Mỗi đơn hàng chỉ áp dụng 1 mã. Hệ thống tự chọn voucher cao nhất phù hợp khi thanh toán.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding} className="gap-1.5">
              <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} />
              Seed voucher mặc định
            </Button>
            <Button size="sm" onClick={openCreate} className="gap-1.5">
              <Plus className="w-4 h-4" /> Thêm voucher
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tổng voucher", value: vouchers.length, icon: Ticket, color: "text-blue-500" },
            { label: "Đang hoạt động", value: activeCount, icon: Power, color: "text-green-500" },
            { label: "Đã phân phối", value: totalAssigned, icon: Users, color: "text-purple-500" },
            { label: "Đã sử dụng", value: totalUsed, icon: ShoppingBag, color: "text-orange-500" },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="vouchers">
          <TabsList>
            <TabsTrigger value="vouchers">Danh sách Voucher</TabsTrigger>
            <TabsTrigger value="usage">Lịch sử sử dụng</TabsTrigger>
          </TabsList>

          {/* Vouchers Table */}
          <TabsContent value="vouchers" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center h-40 text-muted-foreground">Đang tải...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã Voucher</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead className="text-right">Giảm giá</TableHead>
                        <TableHead className="text-right">Đơn tối thiểu</TableHead>
                        <TableHead>Hạn dùng</TableHead>
                        <TableHead className="text-center">Phân phối</TableHead>
                        <TableHead className="text-center">Đã dùng</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vouchers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                            Chưa có voucher nào. Nhấn "Seed voucher mặc định" để tạo 5 voucher tiêu chuẩn.
                          </TableCell>
                        </TableRow>
                      ) : vouchers.map(v => (
                        <TableRow key={v.id}>
                          <TableCell>
                            <code className="bg-muted px-2 py-0.5 rounded font-mono text-sm font-semibold">
                              {v.code}
                            </code>
                          </TableCell>
                          <TableCell className="font-medium">{v.name}</TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            -{fmt(v.discount_amount)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {fmt(v.min_order_value)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {v.expires_at
                              ? new Date(v.expires_at).toLocaleDateString("vi-VN")
                              : <span className="text-green-600 font-medium">Vô thời hạn</span>}
                          </TableCell>
                          <TableCell className="text-center">{v.total_assigned}</TableCell>
                          <TableCell className="text-center">{v.total_used}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={v.is_active ? "default" : "secondary"}>
                              {v.is_active ? "Hoạt động" : "Tắt"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm" variant="ghost"
                                onClick={() => handleToggle(v)}
                                className={v.is_active ? "text-orange-500 hover:text-orange-600" : "text-green-500 hover:text-green-600"}
                                title={v.is_active ? "Tắt" : "Bật"}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => openEdit(v)} title="Sửa">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm" variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleteId(v.id)}
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage History */}
          <TabsContent value="usage" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Lịch sử sử dụng voucher</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Mã voucher</TableHead>
                      <TableHead className="text-right">Giảm giá</TableHead>
                      <TableHead>Đơn hàng #</TableHead>
                      <TableHead>Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usage.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                          Chưa có voucher nào được sử dụng
                        </TableCell>
                      </TableRow>
                    ) : usage.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="text-sm font-medium">{u.user?.full_name || "—"}</div>
                          <div className="text-xs text-muted-foreground">{u.user?.email}</div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-0.5 rounded font-mono text-sm">{u.voucher_code}</code>
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-semibold">
                          -{fmt(u.discount_amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {u.order_id ? `#${u.order_id}` : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.used_at ? new Date(u.used_at).toLocaleString("vi-VN") : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Sửa Voucher" : "Thêm Voucher mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Mã voucher <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="VD: GIAM50K"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  disabled={!!editingId}
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tên voucher <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="VD: Giảm 50.000đ"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Số tiền giảm (VNĐ) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={form.discount_amount}
                  onChange={e => setForm({ ...form, discount_amount: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Đơn tối thiểu (VNĐ) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={form.min_order_value}
                  onChange={e => setForm({ ...form, min_order_value: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Hạn sử dụng (để trống = vô thời hạn)</Label>
              <Input
                type="date"
                value={form.expires_at}
                onChange={e => setForm({ ...form, expires_at: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <Label htmlFor="is_active" className="cursor-pointer">Kích hoạt voucher ngay</Label>
            </div>
            {form.discount_amount && form.min_order_value && (
              <div className="bg-muted/60 rounded-lg p-3 text-sm space-y-1">
                <p className="font-medium text-foreground">Xem trước:</p>
                <p className="text-muted-foreground">
                  Mã <code className="font-mono font-semibold">{form.code || "???"}</code> — Giảm{" "}
                  <span className="text-green-600 font-semibold">{fmt(parseInt(form.discount_amount) || 0)}</span>{" "}
                  cho đơn từ{" "}
                  <span className="font-semibold">{fmt(parseInt(form.min_order_value) || 0)}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editingId ? "Cập nhật" : "Tạo Voucher"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc muốn xóa voucher này? Thao tác không thể hoàn tác.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminVouchers;
