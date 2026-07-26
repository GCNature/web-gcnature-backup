import { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Zap,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  Hourglass,
  Power,
  PowerOff,
  Save,
  Loader2,
  PackagePlus,
  Tag,
  Boxes,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api";

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface FlashSaleProductRow {
  id?: number;
  productId: string;
  salePrice: number;
  discountPercent: number;
  stockLimit: number;
  soldCount?: number;
  sortOrder?: number;
  product?: {
    id: number;
    productId: string;
    sku: string;
    name: string;
    shortName?: string;
    category?: string;
    originalPrice: number;
    price: number;
    image?: string;
    stock?: number;
  } | null;
}

interface FlashSaleCampaign {
  id: number;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  isRepeatDaily?: boolean;
  sortOrder: number;
  bannerUrl?: string;
  products: FlashSaleProductRow[];
}

interface ProductOption {
  id: number;
  productId: string;
  sku: string;
  name: string;
  category?: string;
  price: number;
  originalPrice: number;
  image?: string;
  stock?: number;
}

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */
const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "₫";

// Convert ISO date → "yyyy-MM-ddTHH:mm" string for <input type="datetime-local">
function toLocalInput(iso: string | Date | undefined | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string {
  // datetime-local has no timezone; treat as local time and convert to ISO
  if (!value) return "";
  const d = new Date(value);
  return d.toISOString();
}

function statusOf(c: FlashSaleCampaign): "running" | "upcoming" | "ended" | "paused" {
  if (!c.isActive) return "paused";
  const now = Date.now();
  const s = new Date(c.startAt).getTime();
  const e = new Date(c.endAt).getTime();
  if (now < s) return "upcoming";
  if (now > e) return "ended";
  return "running";
}

function statusBadge(s: ReturnType<typeof statusOf>) {
  switch (s) {
    case "running":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Đang diễn ra
        </Badge>
      );
    case "upcoming":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-200 gap-1">
          <Hourglass className="w-3 h-3" /> Sắp diễn ra
        </Badge>
      );
    case "ended":
      return (
        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border border-gray-200 gap-1">
          <XCircle className="w-3 h-3" /> Đã kết thúc
        </Badge>
      );
    case "paused":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border border-amber-200 gap-1">
          <PowerOff className="w-3 h-3" /> Tạm tắt
        </Badge>
      );
  }
}

function formatLocalRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const d = (x: Date) =>
    `${String(x.getDate()).padStart(2, "0")}/${String(x.getMonth() + 1).padStart(2, "0")}/${x.getFullYear()} ${String(x.getHours()).padStart(2, "0")}:${String(x.getMinutes()).padStart(2, "0")}`;
  return `${d(s)} → ${d(e)}`;
}

/* ═══════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════ */
export default function AdminFlashSale() {
  const [campaigns, setCampaigns] = useState<FlashSaleCampaign[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FlashSaleCampaign | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startAt: "",
    endAt: "",
    isActive: true,
    isRepeatDaily: false,
    sortOrder: 0,
    bannerUrl: "",
  });
  const [formProducts, setFormProducts] = useState<FlashSaleProductRow[]>([]);
  const [bulkDiscount, setBulkDiscount] = useState<string>("");
  const [bulkStock, setBulkStock] = useState<string>("");

  /* ── Load data ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cs, ps] = await Promise.all([
        apiGet<FlashSaleCampaign[]>("/admin/flash-sale"),
        apiGet<ProductOption[]>("/admin/products"),
      ]);
      setCampaigns(cs);
      setProducts(ps);
    } catch (e: any) {
      toast.error(e.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ── Open create dialog ── */
  const openCreate = () => {
    const now = new Date();
    const start = new Date(now.getTime() + 5 * 60_000); // 5 min from now
    const end = new Date(now.getTime() + 2 * 3600_000); // 2 h from now
    setEditing(null);
    setForm({
      name: "",
      description: "",
      startAt: toLocalInput(start),
      endAt: toLocalInput(end),
      isActive: true,
      isRepeatDaily: false,
      sortOrder: 0,
      bannerUrl: "",
    });
    setFormProducts([]);
    setDialogOpen(true);
  };

  /* ── Open edit dialog ── */
  const openEdit = (c: FlashSaleCampaign) => {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description || "",
      startAt: toLocalInput(c.startAt),
      endAt: toLocalInput(c.endAt),
      isActive: c.isActive,
      isRepeatDaily: !!c.isRepeatDaily,
      sortOrder: c.sortOrder,
      bannerUrl: c.bannerUrl || "",
    });
    setFormProducts(
      (c.products || []).map((p) => ({
        productId: p.productId,
        salePrice: p.salePrice,
        discountPercent: p.discountPercent,
        stockLimit: p.stockLimit,
        soldCount: p.soldCount,
        sortOrder: p.sortOrder,
      }))
    );
    setDialogOpen(true);
  };

  /* ── Open copy dialog ── */
  const handleCopyCampaign = (c: FlashSaleCampaign) => {
    setEditing(null); // Create new campaign instead of updating
    setForm({
      name: `${c.name} - Sao chép`,
      description: c.description || "",
      startAt: toLocalInput(c.startAt),
      endAt: toLocalInput(c.endAt),
      isActive: c.isActive,
      isRepeatDaily: !!c.isRepeatDaily,
      sortOrder: c.sortOrder,
      bannerUrl: c.bannerUrl || "",
    });
    setFormProducts(
      (c.products || []).map((p) => ({
        productId: p.productId,
        salePrice: p.salePrice,
        discountPercent: p.discountPercent,
        stockLimit: p.stockLimit,
        soldCount: 0,
        sortOrder: p.sortOrder,
      }))
    );
    setDialogOpen(true);
  };

  /* ── Save (create or update) ── */
  const save = async () => {
    if (!form.name.trim()) return toast.error("Vui lòng nhập tên chiến dịch");
    if (!form.startAt || !form.endAt) return toast.error("Vui lòng chọn thời gian");
    const startIso = fromLocalInput(form.startAt);
    const endIso = fromLocalInput(form.endAt);
    if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
      return toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
    }
    setSaving(true);
    try {
      let campaign: FlashSaleCampaign;
      if (editing) {
        campaign = await apiPut<FlashSaleCampaign>(`/admin/flash-sale/${editing.id}`, {
          name: form.name,
          description: form.description,
          startAt: startIso,
          endAt: endIso,
          isActive: form.isActive,
          isRepeatDaily: form.isRepeatDaily,
          sortOrder: form.sortOrder,
          bannerUrl: form.bannerUrl,
        });
        // sync products
        await apiPut(`/admin/flash-sale/${campaign.id}/products`, {
          products: formProducts,
        });
        toast.success("Đã cập nhật chiến dịch");
      } else {
        campaign = await apiPost<FlashSaleCampaign>("/admin/flash-sale", {
          name: form.name,
          description: form.description,
          startAt: startIso,
          endAt: endIso,
          isActive: form.isActive,
          isRepeatDaily: form.isRepeatDaily,
          sortOrder: form.sortOrder,
          bannerUrl: form.bannerUrl,
          products: formProducts,
        });
        toast.success("Đã tạo chiến dịch mới");
      }
      setDialogOpen(false);
      await loadAll();
    } catch (e: any) {
      toast.error(e.message || "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await apiDelete(`/admin/flash-sale/${deleteId}`);
      toast.success("Đã xóa chiến dịch");
      setDeleteId(null);
      loadAll();
    } catch (e: any) {
      toast.error(e.message || "Lỗi xóa");
    }
  };

  /* ── Toggle active ── */
  const toggleActive = async (c: FlashSaleCampaign) => {
    try {
      await apiPatch(`/admin/flash-sale/${c.id}/toggle`);
      toast.success(c.isActive ? "Đã tạm tắt chiến dịch" : "Đã kích hoạt chiến dịch");
      loadAll();
    } catch (e: any) {
      toast.error(e.message || "Lỗi");
    }
  };

  /* ── Form-side product helpers ── */
  const addProductToForm = (p: ProductOption) => {
    if (formProducts.find((x) => x.productId === p.productId)) {
      toast.info("Sản phẩm đã có trong chiến dịch");
      return;
    }
    // default: 10% off original
    const orig = p.originalPrice || p.price;
    const discountPercent = 10;
    const sale = Math.round((orig * (100 - discountPercent)) / 100);
    setFormProducts((prev) => [
      ...prev,
      {
        productId: p.productId,
        salePrice: sale,
        discountPercent,
        stockLimit: 0,
        sortOrder: prev.length,
      },
    ]);
  };

  const removeProductFromForm = (productId: string) => {
    setFormProducts((prev) => prev.filter((x) => x.productId !== productId));
  };

  const updateProductInForm = (
    productId: string,
    patch: Partial<FlashSaleProductRow>
  ) => {
    setFormProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, ...patch } : p))
    );
  };

  /* ── Filtering & search inside dialog ── */
  const [searchProduct, setSearchProduct] = useState("");
  const productMap = useMemo(() => {
    const m = new Map<string, ProductOption>();
    for (const p of products) m.set(p.productId, p);
    return m;
  }, [products]);

  const applyBulkDiscountAndStock = () => {
    const pct = parseInt(bulkDiscount);
    const stock = parseInt(bulkStock);

    if (isNaN(pct) && isNaN(stock)) {
      return toast.error("Vui lòng nhập phần trăm giảm hoặc số lượng để cập nhật hàng loạt.");
    }

    if (!isNaN(pct) && (pct < 0 || pct > 100)) {
      return toast.error("Phần trăm giảm giá phải từ 0% đến 100%");
    }
    if (!isNaN(stock) && stock < 0) {
      return toast.error("Số lượng giới hạn phải lớn hơn hoặc bằng 0");
    }

    setFormProducts((prev) =>
      prev.map((fp) => {
        const p = productMap.get(fp.productId);
        const origPrice = p?.originalPrice || p?.price || 0;

        const newPct = !isNaN(pct) ? pct : fp.discountPercent;
        const newPrice = !isNaN(pct) ? Math.round(origPrice * (1 - pct / 100)) : fp.salePrice;
        const newStock = !isNaN(stock) ? stock : fp.stockLimit;

        return {
          ...fp,
          discountPercent: newPct,
          salePrice: newPrice,
          stockLimit: newStock,
        };
      })
    );

    toast.success("Đã áp dụng cập nhật hàng loạt thành công!");
    setBulkDiscount("");
    setBulkStock("");
  };

  const availableProducts = useMemo(() => {
    const usedIds = new Set(formProducts.map((p) => p.productId));
    const q = searchProduct.trim().toLowerCase();
    return products
      .filter((p) => !usedIds.has(p.productId))
      .filter((p) =>
        q === ""
          ? true
          : p.name.toLowerCase().includes(q) ||
            (p.sku || "").toLowerCase().includes(q) ||
            p.productId.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [products, formProducts, searchProduct]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const running = campaigns.filter((c) => statusOf(c) === "running").length;
    const upcoming = campaigns.filter((c) => statusOf(c) === "upcoming").length;
    const ended = campaigns.filter((c) => statusOf(c) === "ended").length;
    return { total: campaigns.length, running, upcoming, ended };
  }, [campaigns]);

  /* ═══════════════════════════════════════════
     Render
     ═══════════════════════════════════════════ */
  return (
    <AdminLayout title="Flash Sale">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-red-600 fill-red-600" /> Flash Sale
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tự tạo chiến dịch flash sale theo khung giờ thực, quản lý sản phẩm và giá ưu đãi.
            </p>
          </div>
          <Button onClick={openCreate} className="gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4" /> Tạo chiến dịch
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Tổng chiến dịch" value={stats.total} icon={Zap} color="red" />
          <StatCard label="Đang diễn ra" value={stats.running} icon={CheckCircle2} color="green" />
          <StatCard label="Sắp diễn ra" value={stats.upcoming} icon={Hourglass} color="blue" />
          <StatCard label="Đã kết thúc" value={stats.ended} icon={XCircle} color="gray" />
        </div>

        {/* List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh sách chiến dịch</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="mb-3">Chưa có chiến dịch flash sale nào</p>
                <Button onClick={openCreate} variant="outline" className="gap-1.5">
                  <Plus className="w-4 h-4" /> Tạo chiến dịch đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <CampaignRow
                    key={c.id}
                    campaign={c}
                    onEdit={() => openEdit(c)}
                    onCopy={() => handleCopyCampaign(c)}
                    onDelete={() => setDeleteId(c.id)}
                    onToggle={() => toggleActive(c)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ═══ Create / Edit Dialog ═══ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Chỉnh sửa chiến dịch flash sale" : "Tạo chiến dịch flash sale mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Basic info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tên chiến dịch *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="VD: Giờ vàng 10:00 - 12:00"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Bắt đầu *
                </Label>
                <Input
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Kết thúc *
                </Label>
                <Input
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold">Mô tả ngắn</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deal Online Giảm Kịch Sàn"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold">Banner URL (tùy chọn)</Label>
                <Input
                  value={form.bannerUrl}
                  onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                  placeholder="/banners/promo-flash-sale.png"
                />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-1">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                  />
                  <Label className="cursor-pointer text-sm">
                    {form.isActive ? "Kích hoạt chiến dịch" : "Tạm tắt (lưu nháp)"}
                  </Label>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    checked={form.isRepeatDaily}
                    onCheckedChange={(v) => setForm({ ...form, isRepeatDaily: v })}
                  />
                  <Label className="cursor-pointer text-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Lặp lại hàng ngày (Vòng lặp 24h)
                  </Label>
                </div>
              </div>
            </section>

            <hr className="border-border" />

            {/* Products section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-semibold flex items-center gap-1.5">
                  <PackagePlus className="w-4 h-4" />
                  Sản phẩm trong chiến dịch ({formProducts.length})
                </Label>
              </div>

              {/* Bulk update controls */}
              {formProducts.length > 0 && (
                <div className="mb-4 bg-muted/40 border border-muted/80 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-red-500" />
                    Cập nhật hàng loạt ({formProducts.length} sản phẩm)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-semibold text-gray-500">Giảm giá đồng loạt (%)</Label>
                      <Input
                        type="number"
                        placeholder="VD: 30"
                        value={bulkDiscount}
                        onChange={(e) => setBulkDiscount(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-semibold text-gray-500">Số lượng bán giới hạn</Label>
                      <Input
                        type="number"
                        placeholder="VD: 50"
                        value={bulkStock}
                        onChange={(e) => setBulkStock(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={applyBulkDiscountAndStock}
                        className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                      >
                        Áp dụng hàng loạt
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected products list */}
              {formProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                  <Boxes className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Chưa có sản phẩm nào trong chiến dịch</p>
                  <p className="text-xs mt-1">Thêm sản phẩm từ danh sách bên dưới</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {formProducts.map((row) => {
                    const p = productMap.get(row.productId);
                    const orig = p?.originalPrice || p?.price || 0;
                    const computedDiscount =
                      orig > 0
                        ? Math.max(0, Math.round(((orig - row.salePrice) / orig) * 100))
                        : row.discountPercent;
                    return (
                      <div
                        key={row.productId}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="w-12 h-12 rounded-md bg-white overflow-hidden border flex-shrink-0">
                          {p?.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {p?.name || row.productId}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            SKU: {p?.sku || row.productId} · Giá gốc:{" "}
                            <span className="line-through">{formatVND(orig)}</span>
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-[420px]">
                          <div>
                            <Label className="text-[10px] text-muted-foreground">
                              Giá sale
                            </Label>
                            <Input
                              type="number"
                              value={row.salePrice}
                              onChange={(e) =>
                                updateProductInForm(row.productId, {
                                  salePrice: Number(e.target.value) || 0,
                                  discountPercent:
                                    orig > 0
                                      ? Math.max(
                                          0,
                                          Math.round(
                                            ((orig - (Number(e.target.value) || 0)) / orig) *
                                              100
                                          )
                                        )
                                      : 0,
                                })
                              }
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-muted-foreground">
                              % giảm
                            </Label>
                            <Input
                              type="number"
                              value={computedDiscount}
                              onChange={(e) => {
                                const pct = Math.max(
                                  0,
                                  Math.min(100, Number(e.target.value) || 0)
                                );
                                const newPrice = Math.round(orig * (1 - pct / 100));
                                updateProductInForm(row.productId, {
                                  discountPercent: pct,
                                  salePrice: newPrice,
                                });
                              }}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-muted-foreground">
                              SL giới hạn
                            </Label>
                            <Input
                              type="number"
                              value={row.stockLimit}
                              onChange={(e) =>
                                updateProductInForm(row.productId, {
                                  stockLimit: Number(e.target.value) || 0,
                                })
                              }
                              placeholder="0 = không giới hạn"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProductFromForm(row.productId)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          title="Xóa khỏi chiến dịch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add product picker */}
              <div className="border rounded-lg bg-background">
                <div className="flex items-center gap-2 p-2 border-b">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Tìm sản phẩm theo tên hoặc SKU..."
                    className="border-0 h-7 focus-visible:ring-0"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto divide-y">
                  {availableProducts.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-6">
                      {searchProduct
                        ? "Không tìm thấy sản phẩm phù hợp"
                        : "Tất cả sản phẩm đã được thêm"}
                    </div>
                  ) : (
                    availableProducts.map((p) => (
                      <button
                        key={p.productId}
                        onClick={() => addProductToForm(p)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            SKU: {p.sku} · {formatVND(p.originalPrice || p.price)}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="border-t pt-3 mt-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={save} disabled={saving} className="gap-1.5">
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editing ? "Cập nhật" : "Tạo chiến dịch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete confirmation ═══ */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa chiến dịch?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Hành động này sẽ xóa chiến dịch và toàn bộ sản phẩm trong đó. Không thể hoàn tác.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: any;
  color: "red" | "green" | "blue" | "gray";
}) {
  const tone = {
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    gray: "bg-gray-50 text-gray-600",
  }[color];
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignRow({
  campaign,
  onEdit,
  onCopy,
  onDelete,
  onToggle,
}: {
  campaign: FlashSaleCampaign;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const status = statusOf(campaign);

  return (
    <div className="border rounded-xl p-4 bg-background hover:bg-muted/20 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-base truncate">{campaign.name}</h3>
            {statusBadge(status)}
            {campaign.isRepeatDaily && (
              <Badge variant="secondary" className="text-[10px] gap-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                <Clock className="w-3 h-3 text-green-600" /> Hằng ngày
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] gap-1">
              <Tag className="w-3 h-3" /> {campaign.products.length} SP
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatLocalRange(campaign.startAt, campaign.endAt)}
          </p>
          {campaign.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {campaign.description}
            </p>
          )}
        </div>

        {/* Quick product previews */}
        <div className="flex -space-x-2 flex-shrink-0">
          {campaign.products.slice(0, 5).map((p) => (
            <div
              key={p.productId}
              className="w-9 h-9 rounded-full border-2 border-background bg-muted overflow-hidden"
              title={p.product?.name}
            >
              {p.product?.image && (
                <img
                  src={p.product.image}
                  alt={p.product?.name}
                  className="w-full h-full object-contain bg-white"
                />
              )}
            </div>
          ))}
          {campaign.products.length > 5 && (
            <div className="w-9 h-9 rounded-full border-2 border-background bg-muted text-[10px] flex items-center justify-center font-bold text-muted-foreground">
              +{campaign.products.length - 5}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="gap-1"
            title={campaign.isActive ? "Tạm tắt" : "Kích hoạt"}
          >
            {campaign.isActive ? (
              <PowerOff className="w-3.5 h-3.5" />
            ) : (
              <Power className="w-3.5 h-3.5" />
            )}
            {campaign.isActive ? "Tắt" : "Bật"}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-1">
            <Pencil className="w-3.5 h-3.5" /> Sửa
          </Button>
          <Button variant="outline" size="sm" onClick={onCopy} className="gap-1 border-blue-200 hover:bg-blue-50 text-blue-600">
            <Copy className="w-3.5 h-3.5" /> Sao chép
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" /> Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
