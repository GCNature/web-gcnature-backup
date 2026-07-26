import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, Eye, Zap, ArrowRight, ImageIcon, CheckCircle2, AlertCircle, XCircle, Layers, DollarSign, CheckSquare, Square, Star, Copy } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiDelete, apiPost, apiPut } from "@/lib/api";
import { formatPrice } from "@/data/products";
import { getFeaturedCategories, saveFeaturedCategories } from "@/components/HeroSection";

interface Product {
  id: number;
  sku: string;
  productId?: string;
  name: string;
  price: number;
  originalPrice: number | null;
  description: string;
  category: string;
  image: string;
  images: string;
  sold?: number;
  stock?: number;
  isActive?: boolean;
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApi, setUseApi] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [newestFirst, setNewestFirst] = useState(false);
  const [catSyncLoading, setCatSyncLoading] = useState(false);

  // Selection & bulk edit
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<"fixed" | "percent">("percent");
  const [bulkField, setBulkField] = useState<"price" | "originalPrice" | "both">("price");
  const [bulkValue, setBulkValue] = useState<number>(0);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [lastAsMainLoading, setLastAsMainLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Product[]>("/admin/products?_t=" + Date.now());
      setProducts(data);
      setUseApi(true);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const deleteProduct = async (e: React.MouseEvent, id: number, name: string) => {
    e.stopPropagation();
    if (!confirm(`Xóa "${name}"?`)) return;
    try {
      await apiDelete(`/admin/products/${id}`);
      toast.success("Đã xóa sản phẩm");
      await loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Lỗi xóa");
    }
  };

  const handleCopyLink = (product: Product) => {
    const link = `${window.location.origin}/product/${product.productId || product.sku}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success(`Đã sao chép link sản phẩm: ${product.name}`);
      })
      .catch(() => {
        toast.error("Không thể sao chép liên kết");
      });
  };

  const handleCopyImageLink = (product: Product) => {
    if (!product.image) {
      toast.error("Sản phẩm không có hình ảnh chính");
      return;
    }
    const imageLink = product.image.startsWith("http")
      ? product.image
      : `${window.location.origin}${product.image}`;
      
    navigator.clipboard.writeText(imageLink)
      .then(() => {
        toast.success(`Đã sao chép link ảnh chính: ${product.name}`);
      })
      .catch(() => {
        toast.error("Không thể sao chép liên kết hình ảnh");
      });
  };

  // Sync images
  const handleSyncImages = async () => {
    setSyncLoading(true);
    try {
      const data = await apiPost<any>("/admin/sync-images", { newestFirst });
      setSyncResult(data);
      setSyncDialogOpen(true);
      if (data.fixed > 0) {
        toast.success(`Đã đồng bộ ${data.fixed} sản phẩm`);
        loadProducts();
      } else {
        toast.info("Tất cả ảnh đã đúng, không cần thay đổi");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi đồng bộ ảnh");
    } finally {
      setSyncLoading(false);
    }
  };

  // Sync categories — update localStorage featured categories with real product images
  const handleSyncCategories = async () => {
    setCatSyncLoading(true);
    try {
      const data = await apiPost<any>("/admin/sync-categories");
      // data.results has { name, slug, image } for each category
      // Update localStorage featured categories
      const cats = getFeaturedCategories();
      let updated = 0;
      const newCats = cats.map(cat => {
        const linkSlug = cat.link.replace(/^\/danh-muc\//, '');
        const matched = data.results?.find((r: any) =>
          r.slug === linkSlug || r.name.toLowerCase() === cat.name.toLowerCase()
        );
        if (matched?.image && cat.image !== matched.image) {
          updated++;
          return { ...cat, image: matched.image };
        }
        return cat;
      });
      if (updated > 0) {
        saveFeaturedCategories(newCats);
        // Also save to database
        await apiPut("/settings", {
          featured_categories: JSON.stringify(newCats)
        });
        toast.success(`Đã cập nhật ảnh cho ${updated} danh mục`);
      } else {
        toast.info("Ảnh danh mục đã đúng");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi đồng bộ danh mục");
    } finally {
      setCatSyncLoading(false);
    }
  };

  // Sync last image as main for ALL products
  const handleLastAsMain = async () => {
    if (!confirm("Đặt ảnh CUỐI của mỗi sản phẩm làm ảnh đại diện?\nThao tác này áp dụng cho tất cả sản phẩm.")) return;
    setLastAsMainLoading(true);
    try {
      const data = await apiPost<any>("/admin/sync-last-as-main");
      if (data.fixed > 0) {
        toast.success(data.message);
        loadProducts();
      } else {
        toast.info("Tất cả sản phẩm đã có ảnh cuối là ảnh chính");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi đồng bộ ảnh cuối");
    } finally {
      setLastAsMainLoading(false);
    }
  };

  // Selection helpers
  const toggleSelect = (id: number) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredProducts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const isAllSelected = filteredProducts.length > 0 && selected.size === filteredProducts.length;

  // Bulk price update
  const handleBulkPrice = async () => {
    if (selected.size === 0) { toast.error("Chưa chọn sản phẩm"); return; }
    if (bulkValue <= 0) { toast.error("Vui lòng nhập giá trị > 0"); return; }
    setBulkLoading(true);
    try {
      const data = await apiPost<any>("/admin/bulk-update-prices", {
        productIds: Array.from(selected),
        mode: bulkMode,
        field: bulkField,
        value: bulkValue,
      });
      toast.success(data.message);
      setBulkPriceOpen(false);
      setSelected(new Set());
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật giá");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <AdminLayout title="Sản phẩm">
      <div className="space-y-4">
        {/* ═══ Quick link to Flash Sale management ═══ */}
        <button
          onClick={() => navigate("/admin/flash-sale")}
          className="w-full text-left rounded-xl border border-red-200 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 hover:shadow-md hover:-translate-y-0.5 transition-all p-4 flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-sm shrink-0">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Quản lý Flash Sale</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tạo chiến dịch theo khung giờ, đếm ngược thực, % giảm và sản phẩm tham gia tại trang Flash Sale
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm sản phẩm..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={handleSyncCategories} disabled={catSyncLoading || loading} className="gap-2" title="Đồng bộ ảnh bìa danh mục từ sản phẩm">
              {catSyncLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span className="hidden sm:inline">ĐB Danh mục</span>
            </Button>
            <Button variant="outline" onClick={handleSyncImages} disabled={syncLoading || loading} className="gap-2" title="Đồng bộ ảnh kho với sản phẩm theo SKU">
              {syncLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              <span className="hidden sm:inline">ĐB Ảnh</span>
            </Button>
            <Button variant="outline" onClick={handleLastAsMain} disabled={lastAsMainLoading || loading} className="gap-2" title="Ảnh cuối của mỗi sản phẩm → làm ảnh đại diện">
              {lastAsMainLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
              <span className="hidden sm:inline">Ảnh cuối → Chính</span>
            </Button>
            <Button variant="outline" onClick={loadProducts} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/admin/products/new")}>
              <Plus className="h-4 w-4" /> Thêm sản phẩm
            </Button>
          </div>
        </div>

        {/* ═══ Bulk action bar ═══ */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl p-3 animate-in fade-in">
            <span className="text-sm font-medium text-primary">
              {selected.size} sản phẩm đã chọn
            </span>
            <Button size="sm" variant="outline" onClick={() => { setBulkValue(0); setBulkPriceOpen(true); }} className="gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Chỉnh giá hàng loạt
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="text-xs text-muted-foreground">
              Bỏ chọn
            </Button>
          </div>
        )}

        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="p-4 w-10">
                        <button onClick={toggleSelectAll} className="flex items-center justify-center" title="Chọn tất cả">
                          {isAllSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Sản phẩm</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Danh mục</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Giá bán</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Giá gốc</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">SKU</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className={`border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${selected.has(product.id) ? 'bg-primary/5' : ''}`}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.closest('[data-actions]') || target.closest('[data-checkbox]')) return;
                          useApi && navigate(`/admin/products/${product.id}`);
                        }}
                      >
                        <td className="p-4" data-checkbox>
                          <button onClick={(e) => { e.stopPropagation(); toggleSelect(product.id); }}>
                            {selected.has(product.id)
                              ? <CheckSquare className="w-4 h-4 text-primary" />
                              : <Square className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                            }
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                              {product.image && <img src={product.image} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <span className="font-medium text-foreground text-xs leading-tight line-clamp-2 max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{product.category}</td>
                        <td className="p-4 font-medium text-red-600 text-xs">{formatPrice(product.price)}</td>
                        <td className="p-4 text-muted-foreground text-xs line-through">{product.originalPrice ? formatPrice(product.originalPrice) : "—"}</td>
                        <td className="p-4 text-muted-foreground text-xs font-mono">{product.sku}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2" data-actions onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate(`/admin/products/${product.id}`)}
                              className="p-1.5 rounded hover:bg-primary/10 transition-colors"
                              title="Chỉnh sửa chi tiết"
                            >
                              <Edit className="h-4 w-4 text-primary" />
                            </button>
                            <button
                              onClick={() => window.open(`/product/${product.productId || product.sku}`, "_blank")}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              title="Xem trang sản phẩm"
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleCopyLink(product)}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              title="Sao chép liên kết sản phẩm"
                            >
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => handleCopyImageLink(product)}
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              title="Sao chép liên kết ảnh chính"
                            >
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={(e) => deleteProduct(e, product.id, product.name)}
                              className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          {useApi ? "📊" : "📁"} {useApi ? "Dữ liệu từ MySQL" : "Đang dùng catalog tĩnh (server chưa kết nối)"} • {filteredProducts.length} sản phẩm
        </p>
      </div>

      {/* ═══ Sync Results Dialog ═══ */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Kết quả đồng bộ ảnh
            </DialogTitle>
          </DialogHeader>
          {syncResult && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-xs text-green-600">Đã sửa</p>
                  <p className="text-lg font-bold text-green-700">{syncResult.fixed}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <p className="text-xs text-blue-600">Đúng rồi</p>
                  <p className="text-lg font-bold text-blue-700">{syncResult.skipped}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Ảnh trên disk</p>
                  <p className="text-lg font-bold text-gray-700">{syncResult.diskFiles}</p>
                </div>
              </div>
              {/* Detail table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-2 font-medium">SKU</th>
                      <th className="text-left p-2 font-medium">Tên</th>
                      <th className="p-2 font-medium text-center">Trạng thái</th>
                      <th className="p-2 font-medium text-center">Số ảnh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncResult.results?.map((r: any, i: number) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-muted/10">
                        <td className="p-2 font-mono">{r.sku}</td>
                        <td className="p-2 text-muted-foreground truncate max-w-[150px]">{r.name}</td>
                        <td className="p-2 text-center">
                          {r.status === 'fixed' && <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />}
                          {r.status === 'ok' && <AlertCircle className="w-4 h-4 text-blue-500 mx-auto" />}
                          {r.status === 'no_files' && <XCircle className="w-4 h-4 text-gray-400 mx-auto" />}
                        </td>
                        <td className="p-2 text-center text-muted-foreground">
                          {r.status === 'no_files' ? '—' : `${r.oldCount} → ${r.newCount}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                id="newestFirst"
                checked={newestFirst}
                onChange={(e) => setNewestFirst(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="newestFirst" className="text-xs text-muted-foreground cursor-pointer">
                Ảnh mới nhất làm ảnh chính
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSyncImages} disabled={syncLoading} className="gap-1.5">
                {syncLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Đồng bộ lại
              </Button>
              <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>Đóng</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Bulk Price Editor Dialog ═══ */}
      <Dialog open={bulkPriceOpen} onOpenChange={setBulkPriceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Chỉnh giá hàng loạt
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Áp dụng cho <strong className="text-foreground">{selected.size}</strong> sản phẩm đã chọn
          </p>
          <div className="space-y-4">
            {/* Mode */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Cách điều chỉnh</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBulkMode("percent")}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    bulkMode === "percent" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Giảm theo %
                </button>
                <button
                  onClick={() => setBulkMode("fixed")}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    bulkMode === "fixed" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Giá cố định
                </button>
              </div>
            </div>

            {/* Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Áp dụng cho</Label>
              <div className="flex gap-2">
                <button
                  onClick={() => setBulkField("price")}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    bulkField === "price" ? "border-red-400 bg-red-50 text-red-600" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Giá bán
                </button>
                <button
                  onClick={() => setBulkField("originalPrice")}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    bulkField === "originalPrice" ? "border-blue-400 bg-blue-50 text-blue-600" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Giá gốc
                </button>
                <button
                  onClick={() => setBulkField("both")}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    bulkField === "both" ? "border-purple-400 bg-purple-50 text-purple-600" : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Cả hai
                </button>
              </div>
            </div>

            {/* Value */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                {bulkMode === "percent" ? "Phần trăm giảm (%)" : "Giá mới (VND)"}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={bulkValue || ""}
                  onChange={(e) => setBulkValue(Number(e.target.value))}
                  placeholder={bulkMode === "percent" ? "Ví dụ: 18" : "Ví dụ: 4091800"}
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {bulkMode === "percent" ? "%" : "₫"}
                </span>
              </div>
              {bulkMode === "percent" && (
                <p className="text-[10px] text-muted-foreground">
                  Giá bán = Giá gốc × (1 - {bulkValue || 0}%) → giảm {bulkValue || 0}% từ giá gốc
                </p>
              )}
            </div>

            {/* Quick percent buttons */}
            {bulkMode === "percent" && (
              <div className="flex gap-1.5 flex-wrap">
                {[10, 15, 18, 20, 25, 30, 50].map(p => (
                  <button
                    key={p}
                    onClick={() => setBulkValue(p)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      bulkValue === p ? "border-primary bg-primary text-white" : "border-border hover:bg-muted"
                    }`}
                  >
                    -{p}%
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkPriceOpen(false)}>Hủy</Button>
            <Button onClick={handleBulkPrice} disabled={bulkLoading || bulkValue <= 0} className="gap-1.5">
              {bulkLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
              Áp dụng cho {selected.size} sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
