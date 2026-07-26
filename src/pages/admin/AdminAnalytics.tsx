import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { BarChart3, Download, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api";
import { toast } from "sonner";

const COLORS = ["hsl(220, 70%, 55%)", "hsl(0, 0%, 15%)", "hsl(36, 82%, 52%)", "hsl(15, 90%, 55%)", "hsl(210, 70%, 50%)"];

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiGet('/admin/analytics');
        setData(res);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const exportToCSV = () => {
    if (!data || !data.visitData) return;
    const headers = ["Ngày", "Doanh thu (VND)", "Số lượng đơn hàng"];
    const csvContent = [
      headers.join(","),
      ...data.visitData.map((row: any) => `${row.name},${row.visits},${row.orders}`)
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bao-cao-doanh-thu-14-ngay.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Đã xuất báo cáo CSV thành công!");
  };

  if (loading) {
    return (
      <AdminLayout title="Thống kê">
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const visitData = data?.visitData || [];
  const sourceData = data?.sourceData || [];
  const summary = data?.summary || {};

  return (
    <AdminLayout title="Thống kê">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={exportToCSV} className="gap-2" variant="outline">
            <Download className="w-4 h-4" /> Xuất Báo Cáo (CSV)
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Doanh thu & Số lượng đơn hàng (14 ngày)</CardTitle>
          </CardHeader>
          <CardContent>
            {visitData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                  <Tooltip formatter={(value: any, name: string) => [name === 'Doanh thu' ? `${Number(value).toLocaleString('vi-VN')}₫` : value, name]} />
                  <Line yAxisId="left" type="monotone" dataKey="visits" stroke="hsl(0, 72%, 51%)" strokeWidth={2} name="Doanh thu" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(220, 30%, 18%)" strokeWidth={2} name="Số lượng Đơn" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[320px] text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có dữ liệu thống kê</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tỷ trọng phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {sourceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, name: string) => [`${value} đơn hàng`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[260px] text-muted-foreground">
                  <BarChart3 className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Chưa có dữ liệu thanh toán</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Tóm tắt Kinh doanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Khách hàng đã mua", value: summary.totalCustomers || "0" },
                { label: "Tất cả mọi đơn hàng", value: summary.totalOrders || "0" },
                { label: "Doanh thu tháng này", value: summary.monthlyRev || "₫0" },
                { label: "Sản phẩm bán chạy nhất", value: summary.bestProduct || "—" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
