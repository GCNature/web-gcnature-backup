import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, Trash2, Users, Crown, UserCheck, Loader2, RefreshCw, Edit, User, Lock, Unlock, Download, Key, Eye, ChevronLeft, ChevronRight, Award, Gem, Medal, PackageOpen, CheckSquare, Square, ShieldAlert, AlertTriangle, FileText, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPut, apiDelete, API_BASE } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Member {
  id: number;
  name: string | null;
  email: string;
  phone?: string | null;
  role: string;
  isActive?: boolean;
  createdAt: string;
  registerIp?: string | null;
  lastLoginAt?: string | null;
  userAgent?: string | null;
  orderCount?: number;
}

interface SpamUser {
  id: number; email: string; name: string;
  registerIp: string | null; lastLoginAt: string | null;
  createdAt: string; orderCount: number; ipCount: number;
  spamReasons: string[]; isSpam: boolean;
}

interface MemberDetail {
  id: number; email: string; name: string; phone: string; address: string;
  role: string; isActive: boolean; createdAt: string; totalOrders: number;
  totalSpent: number; tier: string;
  orders: { id: string; total: number; status: string; date: string }[];
}

const TIER_CONFIG: Record<string, { icon: any; label: string; className: string }> = {
  diamond: { icon: Gem, label: "Diamond", className: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white" },
  gold: { icon: Crown, label: "Gold", className: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white" },
  silver: { icon: Award, label: "Silver", className: "bg-gradient-to-r from-gray-300 to-gray-400 text-white" },
  bronze: { icon: Medal, label: "Bronze", className: "bg-gradient-to-r from-orange-300 to-orange-400 text-white" },
};

const PAGE_SIZE = 15;

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Edit dialog
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", role: "user" });
  const [saving, setSaving] = useState(false);

  // Detail dialog
  const [detailMember, setDetailMember] = useState<MemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Reset password dialog
  const [resetMember, setResetMember] = useState<Member | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Selection & Spam
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [spamUsers, setSpamUsers] = useState<SpamUser[]>([]);
  const [spamMode, setSpamMode] = useState(false);
  const [spamLoading, setSpamLoading] = useState(false);
  const [spamStats, setSpamStats] = useState({ duplicateIp: 0, noOrders: 0, inactive: 0 });
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Member[]>("/admin/members");
      setMembers(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const filteredMembers = members.filter((m) => {
    const matchSearch = (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "active" && m.isActive !== false) ||
      (statusFilter === "locked" && m.isActive === false);
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filteredMembers.length / PAGE_SIZE);
  const paged = filteredMembers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [searchQuery, roleFilter, statusFilter]);

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setEditForm({ name: member.name || "", phone: member.phone || "", role: member.role === "user" ? "customer" : (member.role || "customer") });
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;
    setSaving(true);
    try {
      await apiPut(`/admin/members/${editingMember.id}`, editForm);
      toast.success("Cập nhật thành công");
      setEditingMember(null);
      await loadMembers();
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: number) => {
    try {
      await apiPut(`/admin/members/${id}/toggle-active`);
      await loadMembers();
      toast.success("Đã cập nhật trạng thái");
    } catch (err: any) {
      toast.error(err.message || "Lỗi");
    }
  };

  const deleteMember = async (id: number, email: string) => {
    if (!confirm(`Xác nhận xóa thành viên ${email}?`)) return;
    try {
      await apiDelete(`/admin/members/${id}`);
      await loadMembers();
      toast.success("Đã xóa thành viên");
    } catch (err: any) {
      toast.error(err.message || "Lỗi xóa thành viên");
    }
  };

  const handleViewDetail = async (id: number) => {
    setDetailLoading(true);
    try {
      const data = await apiGet<MemberDetail>(`/admin/members/${id}/detail`);
      setDetailMember(data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải chi tiết");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetMember || !newPassword) return;
    setSaving(true);
    try {
      await apiPut(`/admin/members/${resetMember.id}/reset-password`, { newPassword });
      toast.success("Đã đặt lại mật khẩu");
      setResetMember(null);
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  // Spam check
  const runSpamCheck = async () => {
    setSpamLoading(true);
    try {
      const data = await apiGet<{ total: number; stats: any; users: SpamUser[] }>("/admin/spam-check");
      setSpamUsers(data.users);
      setSpamStats(data.stats);
      setSpamMode(true);
      setSelected(new Set());
      setPage(1);
      toast.success(`T\u00ecm th\u1ea5y ${data.total} t\u00e0i kho\u1ea3n nghi spam`);
    } catch (err: any) {
      toast.error(err.message || "L\u1ed7i qu\u00e9t spam");
    } finally {
      setSpamLoading(false);
    }
  };

  const exitSpamMode = () => { setSpamMode(false); setSelected(new Set()); setSpamUsers([]); };

  const toggleSelect = (id: number) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };
  const displayList = spamMode ? spamUsers : filteredMembers;
  const spamPaged = displayList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) as any[];
  const spamTotalPages = Math.ceil(displayList.length / PAGE_SIZE);
  const toggleSelectAll = () => {
    const pageIds = spamPaged.map((m: any) => m.id);
    const allSelected = pageIds.every((id: number) => selected.has(id));
    const s = new Set(selected);
    if (allSelected) pageIds.forEach((id: number) => s.delete(id));
    else pageIds.forEach((id: number) => s.add(id));
    setSelected(s);
  };
  const selectAllSpam = () => { setSelected(new Set(spamUsers.map(u => u.id))); };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`X\u00e1c nh\u1eadn x\u00f3a ${selected.size} t\u00e0i kho\u1ea3n?`)) return;
    setBulkDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/members/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi xóa hàng loạt');
      toast.success(data.message);
      setSelected(new Set());
      if (spamMode) { setSpamUsers(spamUsers.filter(u => !selected.has(u.id))); }
      await loadMembers();
    } catch (err: any) {
      toast.error(err.message || "L\u1ed7i x\u00f3a");
    } finally {
      setBulkDeleting(false);
    }
  };

  const exportCSV = () => {
    const token = localStorage.getItem("token");
    const url = `${API_BASE}/admin/members/export`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "members.csv";
        a.click();
        toast.success("Đã xuất CSV");
      });
  };

  const adminCount = members.filter((m) => m.role === "admin").length;
  const userCount = members.filter((m) => m.role !== "admin").length;
  const lockedCount = members.filter((m) => m.isActive === false).length;

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: "Chờ xử lý", cls: "bg-yellow-100 text-yellow-700" },
      confirmed: { label: "Đã xác nhận", cls: "bg-blue-100 text-blue-700" },
      shipping: { label: "Đang giao", cls: "bg-indigo-100 text-indigo-700" },
      delivered: { label: "Đã giao", cls: "bg-green-100 text-green-700" },
      cancelled: { label: "Đã hủy", cls: "bg-red-100 text-red-700" },
    };
    const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-700" };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.cls}`}>{s.label}</span>;
  };

  return (
    <AdminLayout title="Thành viên">
      <div className="space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Tổng thành viên", value: members.length, color: "bg-blue-100 text-blue-600" },
            { icon: Crown, label: "Admin", value: adminCount, color: "bg-red-100 text-red-600" },
            { icon: UserCheck, label: "Thành viên", value: userCount, color: "bg-green-100 text-green-600" },
            { icon: Lock, label: "Đã khóa", value: lockedCount, color: "bg-orange-100 text-orange-600" },
          ].map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${s.color.split(" ")[0]} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color.split(" ")[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tên hoặc email..." className="pl-9" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Quyền" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="customer">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="locked">Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selected.size > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={bulkDeleting} className="gap-1.5">
                {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Xóa {selected.size} tài khoản
              </Button>
            )}
            {spamMode ? (
              <>
                <Button variant="outline" size="sm" onClick={selectAllSpam} className="gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5" /> Chọn tất cả ({spamUsers.length})
                </Button>
                <Button variant="outline" size="sm" onClick={exitSpamMode} className="gap-1.5">
                  Thoát Spam
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={runSpamCheck} disabled={spamLoading} className="gap-1.5 border-orange-300 text-orange-600 hover:bg-orange-50">
                {spamLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                Quét Spam
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
              <Download className="w-4 h-4" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => { exitSpamMode(); loadMembers(); }} disabled={loading} className="gap-1.5">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
            </Button>
          </div>
        </div>

        {/* Spam mode banner */}
        {spamMode && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="font-semibold text-orange-800">Tìm thấy {spamUsers.length} tài khoản nghi spam</span>
            </div>
            <div className="flex gap-4 text-xs text-orange-700">
              <span>🔴 IP trùng: {spamStats.duplicateIp}</span>
              <span>📦 Không đơn hàng: {spamStats.noOrders}</span>
              <span>💤 Không login 30 ngày: {spamStats.inactive}</span>
            </div>
          </div>
        )}

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (spamMode ? spamPaged : paged).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="p-4 w-10">
                        <button onClick={toggleSelectAll} className="text-muted-foreground hover:text-foreground">
                          {spamPaged.length > 0 && spamPaged.every((m: any) => selected.has(m.id))
                            ? <CheckSquare className="w-4 h-4 text-primary" />
                            : <Square className="w-4 h-4" />}
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">#</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thành viên</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                      {spamMode && <th className="text-left p-4 font-medium text-muted-foreground">IP</th>}
                      <th className="text-left p-4 font-medium text-muted-foreground">Quyền</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Trạng thái</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">{spamMode ? 'Lý do' : 'Ngày ĐK'}</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(spamMode ? spamPaged : paged).map((member: any, i: number) => (
                      <tr key={member.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${selected.has(member.id) ? 'bg-primary/5' : ''}`}>
                        <td className="p-4">
                          <button onClick={() => toggleSelect(member.id)}>
                            {selected.has(member.id)
                              ? <CheckSquare className="w-4 h-4 text-primary" />
                              : <Square className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </td>
                        <td className="p-4 text-muted-foreground">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              member.role === "admin" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                            }`}>
                              {(member.name || member.email).charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">{member.name || "—"}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{member.email}</td>
                        {spamMode && (
                          <td className="p-4">
                            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">{member.registerIp || '—'}</span>
                            {member.ipCount >= 3 && <span className="ml-1 text-[9px] text-red-600 font-bold">×{member.ipCount}</span>}
                          </td>
                        )}
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            member.role === "admin" 
                              ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20" 
                              : member.role === "editor"
                              ? "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20"
                              : member.role === "shop_manager"
                              ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                              : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                          }`}>
                            {member.role === "admin" ? (
                              <><Crown className="w-3 h-3" /> Quản trị viên</>
                            ) : member.role === "editor" ? (
                              <><FileText className="w-3 h-3" /> Biên tập viên</>
                            ) : member.role === "shop_manager" ? (
                              <><ShoppingBag className="w-3 h-3" /> Quản lý cửa hàng</>
                            ) : (
                              <><Users className="w-3 h-3" /> Thành viên</>
                            )}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            member.isActive !== false ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {member.isActive !== false ? "Hoạt động" : "Đã khóa"}
                          </span>
                        </td>
                        <td className="p-4 text-xs">
                          {spamMode && member.spamReasons ? (
                            <div className="flex flex-wrap gap-1">
                              {member.spamReasons.map((r: string, ri: number) => (
                                <span key={ri} className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px]">{r}</span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">{new Date(member.createdAt).toLocaleDateString("vi-VN")}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleViewDetail(member.id)} className="p-1.5 rounded hover:bg-muted transition-colors" title="Xem chi tiết">
                              <Eye className="h-4 w-4 text-primary" />
                            </button>
                            <button onClick={() => handleEditClick(member)} className="p-1.5 rounded hover:bg-muted transition-colors" title="Sửa">
                              <Edit className="h-4 w-4 text-blue-500" />
                            </button>
                            <button onClick={() => toggleActive(member.id)} className="p-1.5 rounded hover:bg-muted transition-colors"
                              title={member.isActive !== false ? "Khóa" : "Mở khóa"}>
                              {member.isActive !== false ? <Lock className="h-4 w-4 text-orange-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
                            </button>
                            <button onClick={() => { setResetMember(member); setNewPassword(""); }} className="p-1.5 rounded hover:bg-muted transition-colors" title="Đặt lại mật khẩu">
                              <Key className="h-4 w-4 text-purple-500" />
                            </button>
                            <button onClick={() => deleteMember(member.id, member.email)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors" title="Xóa">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">{searchQuery ? "Không tìm thấy" : "Chưa có thành viên"}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {(spamMode ? spamTotalPages : totalPages) > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Hiển thị {(page-1)*PAGE_SIZE+1}-{Math.min(page*PAGE_SIZE, displayList.length)} / {displayList.length}{selected.size > 0 ? ` • Đã chọn ${selected.size}` : ''}</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: Math.min(spamMode ? spamTotalPages : totalPages, 5) }, (_, i) => i + 1).map(p => (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}>{p}</Button>
              ))}
              <Button variant="outline" size="sm" disabled={page >= (spamMode ? spamTotalPages : totalPages)} onClick={() => setPage(page+1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit className="w-5 h-5" /> Chỉnh sửa thành viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho {editingMember?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Nhập họ tên" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={editingMember?.email || ""} disabled />
              <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} placeholder="0898273899" />
            </div>
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
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditingMember(null)} disabled={saving}>Hủy</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Lưu thay đổi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!detailMember || detailLoading} onOpenChange={() => setDetailMember(null)}>
        <DialogContent className="sm:max-w-[650px] bg-background max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Eye className="w-5 h-5" /> Chi tiết thành viên</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : detailMember ? (
            <div className="flex-1 overflow-auto space-y-4 mt-2">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary text-xl font-bold flex items-center justify-center">
                  {detailMember.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{detailMember.name}</p>
                  <p className="text-sm text-muted-foreground">{detailMember.email}</p>
                  <div className="flex gap-2 mt-1">
                    {(() => {
                      const cfg = TIER_CONFIG[detailMember.tier] || TIER_CONFIG.bronze;
                      const Icon = cfg.icon;
                      return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.className}`}><Icon className="w-3 h-3" /> {cfg.label}</span>;
                    })()}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${detailMember.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      {detailMember.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-xl font-bold text-primary">{detailMember.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Đơn hàng</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-xl font-bold text-emerald-600">₫{detailMember.totalSpent.toLocaleString("vi-VN")}</p>
                  <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <p className="text-xl font-bold">{detailMember.phone || "—"}</p>
                  <p className="text-xs text-muted-foreground">Số ĐT</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Lịch sử đơn hàng</h4>
                {detailMember.orders.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-auto">
                    {detailMember.orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between p-2.5 border border-border rounded-lg hover:bg-muted/10">
                        <div>
                          <p className="text-sm font-medium">#{o.id}</p>
                          <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">₫{o.total.toLocaleString("vi-VN")}</span>
                          {getStatusBadge(o.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 text-muted-foreground">
                    <PackageOpen className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-xs">Chưa có đơn hàng</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetMember} onOpenChange={() => setResetMember(null)}>
        <DialogContent className="sm:max-w-[400px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Key className="w-5 h-5" /> Đặt lại mật khẩu</DialogTitle>
            <DialogDescription>Đặt mật khẩu mới cho {resetMember?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Mật khẩu mới</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setResetMember(null)}>Hủy</Button>
            <Button onClick={handleResetPassword} disabled={saving || newPassword.length < 6}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
