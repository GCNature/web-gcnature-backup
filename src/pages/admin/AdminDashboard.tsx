import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  PackageOpen,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiGet('/admin/dashboard');
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="p-8 text-center text-muted-foreground">Đang tải biểu đồ...</div></AdminLayout>;

  const revenueGrowth = data?.revenueGrowth || 0;
  const isGrowthPositive = revenueGrowth >= 0;

  const stats = [
    { 
      label: "Doanh thu tháng này", 
      value: `₫${(data?.currentMonthRev || 0).toLocaleString('vi-VN')}`, 
      change: `${isGrowthPositive ? '+' : ''}${revenueGrowth}% so với tháng trước`, 
      up: isGrowthPositive, 
      icon: DollarSign,
      trendColor: isGrowthPositive ? "text-green-600" : "text-red-600"
    },
    { 
      label: "Khách đã mua hàng", 
      value: data?.distinctCustomers?.toString() || "0", 
      change: `Trọng tổng ${data?.totalUsers || 0} user đăng ký`, 
      up: true, 
      icon: Users,
      trendColor: "text-blue-600"
    },
    { 
      label: "Tổng số đơn hàng", 
      value: data?.totalOrders?.toString() || "0", 
      change: "Toàn thời gian", 
      up: true, 
      icon: ShoppingCart,
      trendColor: "text-muted-foreground" 
    },
    { 
      label: "Tổng doanh thu", 
      value: `₫${(data?.totalRevenue || 0).toLocaleString('vi-VN')}`, 
      change: "Toàn thời gian", 
      up: true, 
      icon: TrendingUp,
      trendColor: "text-muted-foreground"
    },
  ];

  const revenueData = data?.revenueData || [];
  const categoryData = data?.categoryData || [];
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-4 md:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-3 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-[10px] md:text-xs font-medium ${stat.trendColor}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-2 md:mt-3">
                  <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Doanh thu theo tháng</CardTitle>
              <button className="p-1 hover:bg-muted rounded">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent>
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(220, 10%, 46%)" }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="hsl(0, 72%, 51%)" strokeWidth={2} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
                  <PackageOpen className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Chưa có dữ liệu doanh thu</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Danh mục bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 11 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(0, 72%, 51%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground">
                  <PackageOpen className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Đơn hàng gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-3 font-medium">Mã đơn</th>
                        <th className="text-left py-3 font-medium">Khách hàng</th>
                        <th className="text-left py-3 font-medium">Số tiền</th>
                        <th className="text-left py-3 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-medium text-foreground">{order.id}</td>
                          <td className="py-3 text-foreground">{order.customer}</td>
                          <td className="py-3 text-foreground">{order.amount}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <PackageOpen className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Chưa có đơn hàng nào</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, i) => (
                    <div key={product.name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sold} đã bán</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{product.revenue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <PackageOpen className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
