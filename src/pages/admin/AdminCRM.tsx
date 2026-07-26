import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Line
} from "recharts";
import {
  Users, TrendingUp, ShoppingCart, Repeat, Award, Crown, Gem, Medal,
  UserPlus, ArrowUpRight, ArrowDownRight, DollarSign, Activity, Loader2,
  ShoppingBag, UserCheck, Clock, Zap
} from "lucide-react";
import { apiGet } from "@/lib/api";
import { toast } from "sonner";

const SEGMENT_COLORS = {
  diamond: { bg: "bg-gradient-to-r from-cyan-400 to-blue-500", text: "text-cyan-600", fill: "#06b6d4", icon: Gem },
  gold: { bg: "bg-gradient-to-r from-yellow-400 to-amber-500", text: "text-amber-600", fill: "#f59e0b", icon: Crown },
  silver: { bg: "bg-gradient-to-r from-gray-300 to-gray-400", text: "text-gray-500", fill: "#9ca3af", icon: Award },
  bronze: { bg: "bg-gradient-to-r from-orange-300 to-orange-400", text: "text-orange-600", fill: "#f97316", icon: Medal },
};

const PIE_COLORS = ["#f97316", "#9ca3af", "#f59e0b", "#06b6d4"];

function formatVND(value: number) {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return value.toLocaleString("vi-VN");
}

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{typeof count === 'number' && count >= 1000 ? formatVND(count) : count}{suffix}</span>;
}

function GrowthBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
      isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
    }`}>
      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {isPositive ? "+" : ""}{value}%
    </span>
  );
}

export default function AdminCRM() {
  const [overview, setOverview] = useState<any>(null);
  const [growth, setGrowth] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ov, gr, tc, act] = await Promise.all([
          apiGet("/admin/crm/overview"),
          apiGet("/admin/crm/growth"),
          apiGet("/admin/crm/top-customers"),
          apiGet("/admin/crm/activity"),
        ]);
        setOverview(ov);
        setGrowth(gr);
        setTopCustomers(tc);
        setActivities(act);
      } catch (err: any) {
        toast.error(err.message || "Không thể tải dữ liệu CRM");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="CRM Tăng trưởng">
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const segmentData = overview?.segments
    ? [
        { name: "Bronze", value: overview.segments.bronze, ...SEGMENT_COLORS.bronze },
        { name: "Silver", value: overview.segments.silver, ...SEGMENT_COLORS.silver },
        { name: "Gold", value: overview.segments.gold, ...SEGMENT_COLORS.gold },
        { name: "Diamond", value: overview.segments.diamond, ...SEGMENT_COLORS.diamond },
      ]
    : [];

  const totalSegment = segmentData.reduce((s, d) => s + d.value, 0);

  const funnelData = [
    { label: "Đăng ký", value: overview?.totalUsers || 0, pct: 100, color: "bg-blue-500" },
    { label: "Đã mua hàng", value: overview?.totalBuyers || 0, pct: overview?.conversionRate || 0, color: "bg-emerald-500" },
    { label: "Hoạt động (30 ngày)", value: overview?.activeUsersLast30Days || 0, pct: overview?.retentionRate || 0, color: "bg-violet-500" },
  ];

  const tierBadge = (tier: string) => {
    const cfg = SEGMENT_COLORS[tier as keyof typeof SEGMENT_COLORS] || SEGMENT_COLORS.bronze;
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${cfg.bg}`}>
        <Icon className="w-3 h-3" /> {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout title="CRM Tăng trưởng">
      <div className="space-y-5">
        {/* ═══ KPI CARDS ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* User Growth */}
          <Card className="border-border overflow-hidden relative group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <GrowthBadge value={overview?.userGrowthRate || 0} />
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                <AnimatedCounter value={overview?.newUsersThisMonth || 0} />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">User mới tháng này</p>
              <p className="text-[10px] text-muted-foreground">Tổng: {overview?.totalUsers || 0} users</p>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="border-border overflow-hidden relative group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <GrowthBadge value={overview?.revenueGrowthRate || 0} />
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                ₫<AnimatedCounter value={overview?.currentMonthRev || 0} />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Doanh thu tháng này</p>
              <p className="text-[10px] text-muted-foreground">TB đơn: ₫{formatVND(overview?.avgOrderValue || 0)}</p>
            </CardContent>
          </Card>

          {/* Conversion */}
          <Card className="border-border overflow-hidden relative group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                <AnimatedCounter value={overview?.conversionRate || 0} suffix="%" />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Tỷ lệ chuyển đổi</p>
              <p className="text-[10px] text-muted-foreground">{overview?.totalBuyers || 0} / {overview?.totalUsers || 0} đã mua</p>
            </CardContent>
          </Card>

          {/* Retention */}
          <Card className="border-border overflow-hidden relative group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-violet-600" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Repeat className="h-5 w-5 text-violet-600" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground">
                <AnimatedCounter value={overview?.retentionRate || 0} suffix="%" />
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Tỷ lệ quay lại (30 ngày)</p>
              <p className="text-[10px] text-muted-foreground">{overview?.activeUsersLast30Days || 0} users hoạt động</p>
            </CardContent>
          </Card>
        </div>

        {/* ═══ CHARTS ROW ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* User Growth Chart */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Tăng trưởng người dùng & Doanh thu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {growth.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={growth}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220, 10%, 46%)", fontSize: 11 }}
                      tickFormatter={(v) => formatVND(v)} />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name === "Doanh thu" ? `₫${Number(value).toLocaleString("vi-VN")}` : value,
                        name
                      ]}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="cumulativeUsers" stroke="#3b82f6" strokeWidth={2}
                      fill="url(#colorUsers)" name="Tổng users" />
                    <Bar yAxisId="left" dataKey="newUsers" fill="#93c5fd" radius={[4, 4, 0, 0]} name="User mới" barSize={16} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2}
                      dot={{ r: 3, fill: "#10b981" }} name="Doanh thu" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Gem className="w-4 h-4 text-cyan-500" />
                Phân hạng khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {totalSegment > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%" cy="50%"
                        innerRadius={45} outerRadius={70}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {segmentData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: string) => [`${value} khách`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {segmentData.map((seg) => {
                      const Icon = SEGMENT_COLORS[seg.name.toLowerCase() as keyof typeof SEGMENT_COLORS]?.icon || Medal;
                      return (
                        <div key={seg.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${seg.text}`} />
                            <span className="font-medium">{seg.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{seg.value}</span>
                            <span className="text-xs text-muted-foreground">
                              ({totalSegment > 0 ? Math.round((seg.value / totalSegment) * 100) : 0}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[260px] text-muted-foreground">
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ═══ FUNNEL + CLV ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Conversion Funnel */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Phễu chuyển đổi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {funnelData.map((step, i) => (
                <div key={step.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{step.label}</span>
                    <span className="text-muted-foreground">{step.value} ({step.pct}%)</span>
                  </div>
                  <div className="w-full h-7 bg-muted/50 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${step.color} rounded-lg transition-all duration-1000 ease-out flex items-center px-3`}
                      style={{ width: `${Math.max(step.pct, 5)}%` }}
                    >
                      <span className="text-white text-xs font-bold">{step.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá trị vòng đời TB (CLV)</span>
                  <span className="font-bold text-foreground">₫{formatVND(overview?.avgCLV || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                {activities.length > 0 ? activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      act.type === "order" ? "bg-emerald-100" : "bg-blue-100"
                    }`}>
                      {act.type === "order"
                        ? <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        : <UserCheck className="w-4 h-4 text-blue-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{act.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{act.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                      <Clock className="w-3 h-3" />
                      {new Date(act.time).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                )) : (
                  <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                    Chưa có hoạt động
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ TOP CUSTOMERS ═══ */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              Top khách hàng chi tiêu cao nhất
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Khách hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Hạng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đơn hàng</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Tổng chi tiêu</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đơn gần nhất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((c, i) => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? "bg-amber-100 text-amber-700" :
                            i === 1 ? "bg-gray-200 text-gray-600" :
                            i === 2 ? "bg-orange-100 text-orange-600" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {c.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{tierBadge(c.tier)}</td>
                        <td className="p-4 font-semibold">{c.totalOrders}</td>
                        <td className="p-4 font-bold text-primary">₫{c.totalSpent.toLocaleString("vi-VN")}</td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString("vi-VN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <p className="text-sm">Chưa có dữ liệu khách hàng</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
