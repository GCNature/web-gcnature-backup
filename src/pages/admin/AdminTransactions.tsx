import { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DollarSign, TrendingUp, Clock, CheckCircle2, AlertCircle, Download,
  Search, Filter, Calendar, ArrowUpRight, ArrowDownRight, Loader2, Eye,
  CreditCard, Package, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { apiGet } from "@/lib/api";

interface Transaction {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  total: number;
  paymentMethod: string;
  paymentType: string;
  paymentStatus: string;
  paymentRef: string;
  transferContent: string;
  status: string;
  createdAt: string;
  itemCount: number;
}

interface Stats {
  todayRevenue: number;
  monthRevenue: number;
  totalRevenue: number;
  todayOrders: number;
  monthOrders: number;
  totalOrders: number;
  pendingCount: number;
  confirmedCount: number;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ";

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

export default function AdminTransactions() {
  const [data, setData] = useState<{ stats: Stats; transactions: Transaction[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const result = await apiGet(`/admin/transactions?${params.toString()}`);
      setData(result);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải dữ liệu giao dịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data.transactions;
    const q = search.toLowerCase();
    return data.transactions.filter(
      (t) =>
        t.orderCode.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerPhone.includes(q) ||
        t.transferContent.toLowerCase().includes(q)
    );
  }, [data, search]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["Mã đơn", "Khách hàng", "SĐT", "Số tiền", "Tổng đơn", "Phương thức", "Nội dung CK", "Trạng thái", "Thời gian"];
    const rows = filtered.map((t) => [
      t.orderCode,
      t.customerName,
      t.customerPhone,
      t.amount,
      t.total,
      t.paymentType === "deposit" ? "Cọc 10%" : "Full",
      t.transferContent,
      statusLabels[t.status] || t.status,
      new Date(t.createdAt).toLocaleString("vi-VN"),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `giao-dich-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất file CSV");
  };

  const stats = data?.stats;

  if (loading) {
    return (
      <AdminLayout title="Giao dịch nhận tiền">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Giao dịch nhận tiền">
      <div className="space-y-6">

        {/* ── Stats Cards ─────────────────────────────────────────── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card className="border-border bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Hôm nay</span>
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-extrabold text-green-700">{formatPrice(stats.todayRevenue)}</p>
                <p className="text-[11px] text-green-600 mt-1 font-medium">
                  {stats.todayOrders} đơn hàng
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Tháng này</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-extrabold text-blue-700">{formatPrice(stats.monthRevenue)}</p>
                <p className="text-[11px] text-blue-600 mt-1 font-medium">
                  {stats.monthOrders} đơn hàng
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Chờ xác nhận</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-extrabold text-amber-700">{stats.pendingCount}</p>
                <p className="text-[11px] text-amber-600 mt-1 font-medium">
                  đơn đang chờ
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-purple-50 to-violet-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Tổng doanh thu</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-extrabold text-purple-700">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-[11px] text-purple-600 mt-1 font-medium">
                  {stats.confirmedCount} đơn đã thanh toán
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Filters ─────────────────────────────────────────────── */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm mã đơn, tên khách, SĐT, nội dung CK..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Date range */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-36 text-xs"
                  placeholder="Từ ngày"
                />
                <span className="text-xs text-muted-foreground">→</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-36 text-xs"
                  placeholder="Đến ngày"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={fetchData} className="gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                </Button>
                <Button size="sm" variant="outline" onClick={exportCSV} className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Transactions Table ──────────────────────────────────── */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Danh sách giao dịch ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Không có giao dịch nào</p>
                <p className="text-xs mt-1">Thử thay đổi bộ lọc</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Mã đơn</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Khách hàng</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Số tiền CK</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Tổng đơn</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">PT Thanh toán</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nội dung CK</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Trạng thái</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Thời gian</th>
                      <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-primary text-xs">{tx.orderCode}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground text-sm truncate max-w-[150px]">{tx.customerName}</p>
                          {tx.customerPhone && (
                            <p className="text-[11px] text-muted-foreground">{tx.customerPhone}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold text-sm ${
                            ['confirmed', 'shipping', 'delivered'].includes(tx.status)
                              ? 'text-green-600'
                              : tx.status === 'cancelled'
                                ? 'text-red-500 line-through'
                                : 'text-foreground'
                          }`}>
                            {formatPrice(tx.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                          {formatPrice(tx.total)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.paymentType === "deposit"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {tx.paymentType === "deposit" ? "Cọc 10%" : "Full"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground font-mono truncate max-w-[140px] block">
                            {tx.transferContent || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[tx.status] || "bg-gray-100 text-gray-600"}`}>
                            {statusLabels[tx.status] || tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(tx.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedTx(selectedTx?.id === tx.id ? null : tx)}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Detail Panel ────────────────────────────────────────── */}
        {selectedTx && (
          <Card className="border-border border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                Chi tiết giao dịch #{selectedTx.orderCode}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Khách hàng</p>
                  <p className="text-sm font-semibold">{selectedTx.customerName}</p>
                  <p className="text-xs text-muted-foreground">{selectedTx.customerPhone || "—"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Số tiền chuyển khoản</p>
                  <p className="text-lg font-extrabold text-green-600">{formatPrice(selectedTx.amount)}</p>
                  <p className="text-xs text-muted-foreground">Tổng đơn hàng: {formatPrice(selectedTx.total)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Nội dung chuyển khoản</p>
                  <p className="text-sm font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                    {selectedTx.transferContent || "—"}
                  </p>
                  {selectedTx.paymentRef && (
                    <p className="text-xs text-muted-foreground">Ref: {selectedTx.paymentRef}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Footer Info ─────────────────────────────────────────── */}
        <p className="text-xs text-muted-foreground text-center">
          📊 Dữ liệu realtime từ MySQL • Chỉ tính doanh thu từ đơn đã xác nhận/giao hàng •{" "}
          <button onClick={fetchData} className="text-primary hover:underline">
            Làm mới dữ liệu
          </button>
        </p>
      </div>
    </AdminLayout>
  );
}
