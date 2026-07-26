import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { QrCode, Building2, Copy, Check, Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface PaymentMethod {
  id: number;
  bankCode: string;
  bankName: string | null;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<PaymentMethod>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({
    bankCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await apiGet<PaymentMethod[]>("/admin/payments");
      setPayments(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const toggleActive = async (id: number) => {
    try {
      await apiPut(`/admin/payments/${id}/toggle`);
      await loadPayments();
      toast.success("Đã cập nhật trạng thái");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const startEdit = (p: PaymentMethod) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await apiPut(`/admin/payments/${editingId}`, {
        bankCode: editForm.bankCode,
        bankName: editForm.bankName,
        accountNumber: editForm.accountNumber,
        accountName: editForm.accountName,
      });
      await loadPayments();
      setEditingId(null);
      toast.success("Đã lưu thay đổi");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deletePayment = async (id: number) => {
    if (!confirm("Xác nhận xóa phương thức thanh toán này?")) return;
    try {
      await apiDelete(`/admin/payments/${id}`);
      await loadPayments();
      toast.success("Đã xóa");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addPayment = async () => {
    if (!newForm.bankCode || !newForm.accountNumber || !newForm.accountName) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      await apiPost("/admin/payments", newForm);
      await loadPayments();
      setNewForm({ bankCode: "", bankName: "", accountNumber: "", accountName: "" });
      setShowAdd(false);
      toast.success("Đã thêm phương thức thanh toán");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép: " + text);
  };

  const activePayment = payments.find((p) => p.isActive);
  const qrPreviewUrl = activePayment
    ? `https://img.vietqr.io/image/${activePayment.bankCode}-${activePayment.accountNumber}-compact2.png?amount=100000&addInfo=TEST&accountName=${encodeURIComponent(activePayment.accountName)}`
    : null;

  if (loading) {
    return (
      <AdminLayout title="Thanh toán">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Thanh toán">
      <div className="space-y-6">
        {/* Active payment QR preview */}
        {activePayment && (
          <Card className="border-border border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-green-600" />
                Phương thức thanh toán đang hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {qrPreviewUrl && (
                  <div className="shrink-0">
                    <img
                      src={qrPreviewUrl}
                      alt="QR Preview"
                      className="w-40 h-40 rounded-xl border border-gray-200 shadow-sm"
                    />
                    <p className="text-[10px] text-muted-foreground text-center mt-1">QR mẫu (100.000đ)</p>
                  </div>
                )}
                <div className="flex-1 space-y-2 text-sm w-full">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Ngân hàng</span>
                    <span className="font-semibold">{activePayment.bankName || activePayment.bankCode}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Số tài khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-lg">{activePayment.accountNumber}</span>
                      <button onClick={() => copyText(activePayment.accountNumber)} className="p-1 hover:bg-muted rounded">
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Chủ tài khoản</span>
                    <span className="font-semibold uppercase">{activePayment.accountName}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment methods list */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Danh sách tài khoản ({payments.length})</h2>
          <Button size="sm" className="gap-2" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-4 h-4" /> Thêm tài khoản
          </Button>
        </div>

        {/* Add form */}
        {showAdd && (
          <Card className="border-border border-primary/30">
            <CardContent className="p-4 space-y-4">
              <p className="text-sm font-semibold">Thêm tài khoản mới</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã ngân hàng (VietQR)</Label>
                  <Input
                    placeholder="VD: ACB, VCB, TCB, MB..."
                    value={newForm.bankCode}
                    onChange={(e) => setNewForm({ ...newForm, bankCode: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tên ngân hàng</Label>
                  <Input
                    placeholder="VD: Ngân hàng Á Châu"
                    value={newForm.bankName}
                    onChange={(e) => setNewForm({ ...newForm, bankName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số tài khoản</Label>
                  <Input
                    placeholder="VD: 24488671"
                    value={newForm.accountNumber}
                    onChange={(e) => setNewForm({ ...newForm, accountNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chủ tài khoản</Label>
                  <Input
                    placeholder="VD: MAI XUAN ANH"
                    value={newForm.accountName}
                    onChange={(e) => setNewForm({ ...newForm, accountName: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addPayment} className="gap-2">
                  <Check className="w-4 h-4" /> Thêm
                </Button>
                <Button variant="outline" onClick={() => setShowAdd(false)}>
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing accounts */}
        <div className="space-y-3">
          {payments.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Building2 className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có tài khoản thanh toán</p>
                <p className="text-xs mt-1">Thêm tài khoản ngân hàng để nhận thanh toán qua VietQR</p>
              </CardContent>
            </Card>
          ) : (
            payments.map((p) => (
              <Card key={p.id} className={`border-border ${p.isActive ? "ring-1 ring-green-300" : "opacity-70"}`}>
                <CardContent className="p-4">
                  {editingId === p.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Mã ngân hàng</Label>
                          <Input
                            value={editForm.bankCode || ""}
                            onChange={(e) => setEditForm({ ...editForm, bankCode: e.target.value.toUpperCase() })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Tên ngân hàng</Label>
                          <Input
                            value={editForm.bankName || ""}
                            onChange={(e) => setEditForm({ ...editForm, bankName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Số tài khoản</Label>
                          <Input
                            value={editForm.accountNumber || ""}
                            onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Chủ tài khoản</Label>
                          <Input
                            value={editForm.accountName || ""}
                            onChange={(e) => setEditForm({ ...editForm, accountName: e.target.value.toUpperCase() })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEdit} className="gap-1">
                          <Save className="w-3 h-3" /> Lưu
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="w-3 h-3" /> Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{p.bankName || p.bankCode}</p>
                        <p className="text-sm text-muted-foreground">
                          STK: <span className="font-mono font-bold text-primary">{p.accountNumber}</span>
                        </p>
                        <p className="text-xs text-muted-foreground uppercase">{p.accountName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${p.isActive ? "text-green-600" : "text-muted-foreground"}`}>
                            {p.isActive ? "Hoạt động" : "Tắt"}
                          </span>
                          <Switch checked={p.isActive} onCheckedChange={() => toggleActive(p.id)} />
                        </div>
                        <button onClick={() => startEdit(p)} className="p-1.5 rounded hover:bg-muted transition-colors">
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => deletePayment(p.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          📊 Dữ liệu từ MySQL • Tài khoản "Hoạt động" sẽ hiển thị QR trên trang thanh toán •{" "}
          <a href="https://vietqr.io/danh-sach-ngan-hang" target="_blank" className="text-primary hover:underline">
            Xem mã ngân hàng VietQR
          </a>
        </p>
      </div>
    </AdminLayout>
  );
}
