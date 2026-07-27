import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical,
  ImageIcon, FileText, Tag, Settings, BarChart3, Link2, Zap, Star, MessageSquare,
  FolderOpen, Search, CheckSquare, Square, Filter, Play, Camera, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPut, apiPost, API_BASE } from "@/lib/api";
import { formatPrice } from "@/data/products";
import { productDropdown } from "@/data/navigation";

interface ImageItem { id?: number; url: string; sortOrder?: number }
interface SpecItem { id?: number; name: string; value: string; sortOrder?: number }
interface VariantItem { id?: number; name: string; isActive: boolean }
interface ReviewItem { id?: number; name: string; avatarLetter?: string; avatarColor?: string; rating: number; date: string; verified: boolean; text: string; helpful: number; imageUrl?: string; isActive?: boolean }

interface ProductDetail {
  id: number;
  productId: string;
  sku: string;
  name: string;
  shortName: string;
  categoryId: number | null;
  categoryName: string;
  price: number;
  originalPrice: number;
  discount: number;
  badge: string;
  rating: number;
  sold: number;
  stock: number;
  brand: string;
  description: string;
  seoTags: string;
  shopeeUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  isFlashSale: boolean;
  flashSalePercent: number;
  isActive: boolean;
  featuresVn?: string;
  featuresEn?: string;
  footerInfo?: string;
  productionYear?: number;
  clearancePrice?: number;
  dailySalePrice?: number;
  campaignPrice?: number;
  offPlatformPrice?: number;
  warrantyData?: string;
  origin?: string;
  volume?: string;
  ingredients?: string;
  images: ImageItem[];
  specs: SpecItem[];
  variants: VariantItem[];
  reviews: ReviewItem[];
}

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "images" | "specs" | "variants" | "reviews" | "seo">("info");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Media picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<"replace" | "add" | "review_image">("add");
  const [mediaPickerIndex, setMediaPickerIndex] = useState<number>(-1);
  const [mediaFiles, setMediaFiles] = useState<{filename:string;url:string;size:number;group:string;type:string}[]>([]);
  const [mediaGroups, setMediaGroups] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFilterGroup, setMediaFilterGroup] = useState("all");
  const [mediaSelected, setMediaSelected] = useState<Set<string>>(new Set());

  // Three way upload state inside media picker
  const [activeUploadMode, setActiveUploadMode] = useState<"library" | "upload">("library");
  const [subUploadTab, setSubUploadTab] = useState<"computer" | "url" | "camera">("computer");
  const [pastedUrl, setPastedUrl] = useState("");
  const [downloadingUrl, setDownloadingUrl] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const uploadFileInputRef = useRef<HTMLInputElement | null>(null);

  // Image drag & drop reorder state
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      if (id === "new") {
        setProduct({
          id: 0,
          productId: "",
          sku: "",
          name: "",
          shortName: "",
          categoryId: null,
          categoryName: "",
          price: 0,
          originalPrice: 0,
          discount: 0,
          badge: "",
          rating: 5,
          sold: 0,
          stock: 100,
           brand: "GCnature",
          description: "",
          seoTags: "",
          shopeeUrl: "",
          tiktokUrl: "",
          youtubeUrl: "",
          isFlashSale: false,
          flashSalePercent: 0,
          isActive: true,
          featuresVn: "",
          featuresEn: "",
          footerInfo: "",
          productionYear: new Date().getFullYear(),
          clearancePrice: 0,
          dailySalePrice: 0,
          campaignPrice: 0,
          offPlatformPrice: 0,
          warrantyData: "",
          images: [],
          specs: [],
          variants: [],
          reviews: []
        });
        setSeoTitle("");
        setSeoDesc("");
        setSeoKeywords("");
      } else {
        try {
          const data = await apiGet<ProductDetail>(`/admin/products/${id}?_t=${Date.now()}`);
          setProduct(data);
          if (data.seoTags && data.seoTags.trim().startsWith("{")) {
            const parsedSeo = JSON.parse(data.seoTags);
            setSeoTitle(parsedSeo.title || "");
            setSeoDesc(parsedSeo.desc || "");
            setSeoKeywords(parsedSeo.keywords || "");
          }
        } catch (err: any) {
          try {
            const fb = await apiGet<any>(`/products/${id}?_t=${Date.now()}`);
            if (fb) {
              const formattedImages = Array.isArray(fb.images)
                ? fb.images.map((imgUrl: string, idx: number) => ({ id: idx + 1, url: imgUrl, sortOrder: idx }))
                : (fb.image ? [{ id: 1, url: fb.image, sortOrder: 0 }] : []);
              
              setProduct({
                id: fb.id || Number(id),
                productId: fb.productId || fb.sku || "",
                sku: fb.sku || "",
                name: fb.name || "",
                shortName: fb.shortName || "",
                categoryId: fb.categoryId || null,
                categoryName: fb.categoryName || fb.category || "",
                price: fb.price || 0,
                originalPrice: fb.originalPrice || 0,
                discount: fb.discount || 0,
                badge: fb.badge || "",
                rating: fb.rating || 5,
                sold: fb.sold || 0,
                stock: fb.stock || 0,
                brand: fb.brand || "GC Nature",
                description: fb.description || "",
                seoTags: fb.seoTags || "",
                shopeeUrl: fb.shopeeUrl || "",
                tiktokUrl: fb.tiktokUrl || "",
                youtubeUrl: fb.youtubeUrl || "",
                isFlashSale: fb.isFlashSale || false,
                flashSalePercent: fb.flashSalePercent || 0,
                isActive: fb.isActive ?? true,
                featuresVn: typeof fb.featuresVn === "string" ? fb.featuresVn : JSON.stringify(fb.featuresVn || []),
                featuresEn: fb.featuresEn || "",
                footerInfo: fb.footerInfo || "",
                productionYear: fb.productionYear || new Date().getFullYear(),
                clearancePrice: fb.clearancePrice || 0,
                dailySalePrice: fb.dailySalePrice || 0,
                campaignPrice: fb.campaignPrice || 0,
                offPlatformPrice: fb.offPlatformPrice || 0,
                warrantyData: fb.warrantyData || "",
                origin: fb.origin || "",
                volume: fb.volume || "",
                ingredients: fb.ingredients || "",
                images: formattedImages,
                specs: fb.specs || [],
                variants: fb.variants || [],
                reviews: fb.reviews || []
              });
            }
          } catch (fbErr: any) {
            toast.error(err.message || "Không thể tải sản phẩm");
            navigate("/admin/products");
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải sản phẩm");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product) return;

    if (!product.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!product.productId || !product.productId.trim()) {
      toast.error("Vui lòng nhập Đường dẫn tĩnh (Slug / Product ID)");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: product.name,
        shortName: product.shortName,
        sku: product.sku,
        categoryName: product.categoryName,
        categoryId: product.categoryId,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        badge: product.badge,
        rating: product.rating,
        sold: product.sold,
        stock: product.stock,
        brand: product.brand,
        description: product.description,
        seoTags: JSON.stringify({
          title: seoTitle,
          desc: seoDesc,
          keywords: seoKeywords
        }),
        shopeeUrl: product.shopeeUrl,
        tiktokUrl: product.tiktokUrl,
        youtubeUrl: product.youtubeUrl,
        isFlashSale: product.isFlashSale,
        flashSalePercent: product.flashSalePercent,
        isActive: product.isActive,
        featuresVn: product.featuresVn,
        featuresEn: product.featuresEn,
        footerInfo: product.footerInfo,
        productionYear: product.productionYear,
        clearancePrice: product.clearancePrice,
        dailySalePrice: product.dailySalePrice,
        campaignPrice: product.campaignPrice,
        offPlatformPrice: product.offPlatformPrice,
        warrantyData: product.warrantyData,
        origin: product.origin,
        volume: product.volume,
        ingredients: product.ingredients,
        productId: product.productId,
        images: product.images,
        specs: product.specs,
        variants: product.variants,
        reviews: product.reviews,
      };

      if (id === "new") {
        const res = await apiPost("/admin/products", payload);
        toast.success("Đã tạo sản phẩm thành công!");
        navigate(`/admin/products/${res.id}`, { replace: true });
        // update url without keeping "new" in history
      } else {
        await apiPut(`/admin/products/${id}`, payload);
        toast.success("Đã lưu thay đổi!");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof ProductDetail, value: any) => {
    if (!product) return;
    const updated = { ...product, [field]: value };
    // Auto-sync discount when price or originalPrice changes
    if (field === "price" || field === "originalPrice") {
      const price = field === "price" ? Number(value) : updated.price;
      const orig = field === "originalPrice" ? Number(value) : updated.originalPrice;
      updated.discount = orig > 0 ? Math.round((1 - price / orig) * 100) : 0;
    }
    setProduct(updated);
  };

  // Image drag handlers
  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDragEnd = () => {
    if (!product || dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const imgs = [...product.images];
    const [moved] = imgs.splice(dragIdx, 1);
    imgs.splice(dragOverIdx, 0, moved);
    // Re-index sortOrder
    const reindexed = imgs.map((img, i) => ({ ...img, sortOrder: i }));
    setProduct({ ...product, images: reindexed });
    setDragIdx(null);
    setDragOverIdx(null);
    toast.success("Đã sắp xếp lại ảnh");
  };

  // Image helpers
  const addImage = () => {
    if (!product) return;
    setProduct({ ...product, images: [...product.images, { url: "", sortOrder: product.images.length }] });
  };
  const removeImage = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, images: product.images.filter((_, i) => i !== idx) });
  };
  const updateImage = (idx: number, url: string) => {
    if (!product) return;
    const imgs = [...product.images];
    imgs[idx] = { ...imgs[idx], url };
    setProduct({ ...product, images: imgs });
  };

  // Media picker helpers
  const loadMediaFiles = useCallback(async () => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string,string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/media/list`, { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMediaFiles(data.files || []);
      setMediaGroups(data.groups || []);
    } catch { toast.error("Lỗi tải kho ảnh"); }
    finally { setMediaLoading(false); }
  }, []);

  const openMediaPicker = (mode: "replace" | "add" | "review_image", index = -1) => {
    setMediaPickerMode(mode);
    setMediaPickerIndex(index);
    setMediaSelected(new Set());
    setMediaSearch("");
    setMediaFilterGroup("all");
    setActiveUploadMode("library");
    setMediaPickerOpen(true);
    if (mediaFiles.length === 0) loadMediaFiles();
  };

  const handleUploadFiles = async (files: File[]) => {
    setMediaLoading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append("images", f));
      
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      
      const response = await fetch(`${API_BASE}/media/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      const resData = await response.json();
      
      toast.success(resData.message || "Tải lên thành công");
      
      // Reload media files
      await loadMediaFiles();
      
      // Auto select the new file(s)
      if (resData.files && resData.files.length > 0) {
        const newUrls = resData.files.map((f: any) => f.url);
        if (mediaPickerMode === "review_image" && mediaPickerIndex >= 0 && product) {
          const revs = [...product.reviews];
          revs[mediaPickerIndex] = { ...revs[mediaPickerIndex], imageUrl: newUrls[0] };
          setProduct({ ...product, reviews: revs });
          setMediaPickerOpen(false);
          return;
        }
        const s = new Set(mediaSelected);
        if (mediaPickerMode === "replace") {
          s.clear();
          s.add(newUrls[0]);
        } else {
          newUrls.forEach((u: string) => s.add(u));
        }
        setMediaSelected(s);
      }
      
      // Switch back to library view
      setActiveUploadMode("library");
    } catch (err) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setMediaLoading(false);
    }
  };

  const handleDownloadUrl = async () => {
    if (!pastedUrl.trim()) return;
    setDownloadingUrl(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      
      const response = await fetch(`${API_BASE}/media/upload-url`, {
        method: "POST",
        headers,
        body: JSON.stringify({ url: pastedUrl.trim() }),
      });
      
      if (!response.ok) throw new Error("Failed to download from URL");
      const resData = await response.json();
      
      toast.success(resData.message || "Đã lưu ảnh thành công");
      setPastedUrl("");
      
      // Reload media files
      await loadMediaFiles();
      
      // Auto select the new file
      if (resData.file) {
        if (mediaPickerMode === "review_image" && mediaPickerIndex >= 0 && product) {
          const revs = [...product.reviews];
          revs[mediaPickerIndex] = { ...revs[mediaPickerIndex], imageUrl: resData.file.url };
          setProduct({ ...product, reviews: revs });
          setMediaPickerOpen(false);
          return;
        }
        const s = new Set(mediaSelected);
        if (mediaPickerMode === "replace") {
          s.clear();
          s.add(resData.file.url);
        } else {
          s.add(resData.file.url);
        }
        setMediaSelected(s);
      }
      
      // Switch back to library view
      setActiveUploadMode("library");
    } catch (err) {
      toast.error("Không thể tải ảnh từ liên kết này");
    } finally {
      setDownloadingUrl(false);
    }
  };

  const startCamera = async () => {
    setCameraLoading(true);
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      toast.error("Không thể truy cập camera. Vui lòng kiểm tra quyền thiết bị.");
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error("Lỗi chụp ảnh");
        return;
      }
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
      await handleUploadFiles([file]);
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const confirmMediaPicker = () => {
    if (!product) return;
    const urls = Array.from(mediaSelected);
    if (urls.length === 0) { toast.error("Chưa chọn ảnh nào"); return; }
    if (mediaPickerMode === "review_image" && mediaPickerIndex >= 0) {
      const revs = [...product.reviews];
      revs[mediaPickerIndex] = { ...revs[mediaPickerIndex], imageUrl: urls[0] };
      setProduct({ ...product, reviews: revs });
    } else if (mediaPickerMode === "replace" && mediaPickerIndex >= 0) {
      // Replace single image
      const imgs = [...product.images];
      imgs[mediaPickerIndex] = { ...imgs[mediaPickerIndex], url: urls[0] };
      setProduct({ ...product, images: imgs });
    } else {
      // Add multiple images
      const newImgs = urls.map((url, i) => ({ url, sortOrder: product.images.length + i }));
      setProduct({ ...product, images: [...product.images, ...newImgs] });
    }
    setMediaPickerOpen(false);
    toast.success(`Đã ${mediaPickerMode === "replace" || mediaPickerMode === "review_image" ? "thay" : "thêm"} ${urls.length} ảnh`);
  };

  const toggleMediaSelect = (url: string) => {
    const s = new Set(mediaSelected);
    if (mediaPickerMode === "replace" || mediaPickerMode === "review_image") {
      // Single select for replace or review image
      s.clear(); s.add(url);
    } else {
      if (s.has(url)) s.delete(url); else s.add(url);
    }
    setMediaSelected(s);
  };

  // Spec helpers
  const addSpec = () => {
    if (!product) return;
    setProduct({ ...product, specs: [...product.specs, { name: "", value: "", sortOrder: product.specs.length }] });
  };
  const removeSpec = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, specs: product.specs.filter((_, i) => i !== idx) });
  };
  const updateSpec = (idx: number, field: "name" | "value", val: string) => {
    if (!product) return;
    const s = [...product.specs];
    s[idx] = { ...s[idx], [field]: val };
    setProduct({ ...product, specs: s });
  };
  const moveSpec = (idx: number, dir: "up" | "down") => {
    if (!product) return;
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= product.specs.length) return;
    const s = [...product.specs];
    const tmp = s[idx];
    s[idx] = s[targetIdx];
    s[targetIdx] = tmp;
    setProduct({ ...product, specs: s });
  };

  // Variant helpers
  const addVariant = () => {
    if (!product) return;
    setProduct({ ...product, variants: [...product.variants, { name: "", isActive: true }] });
  };
  const removeVariant = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, variants: product.variants.filter((_, i) => i !== idx) });
  };
  const updateVariant = (idx: number, val: string) => {
    if (!product) return;
    const v = [...product.variants];
    v[idx] = { ...v[idx], name: val };
    setProduct({ ...product, variants: v });
  };

  // Review helpers
  const addReview = () => {
    if (!product) return;
    const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500", "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setProduct({
      ...product,
      reviews: [
        ...product.reviews,
        {
          name: "Khách hàng mới",
          avatarLetter: "K",
          avatarColor: randomColor,
          rating: 5,
          date: new Date().toLocaleDateString("vi-VN"),
          verified: true,
          text: "Đánh giá chất lượng tốt",
          helpful: 0,
          isActive: true
        }
      ]
    });
  };
  const removeReview = (idx: number) => {
    if (!product) return;
    setProduct({ ...product, reviews: product.reviews.filter((_, i) => i !== idx) });
  };
  const updateReview = (idx: number, field: keyof ReviewItem, val: any) => {
    if (!product) return;
    const r = [...product.reviews];
    r[idx] = { ...r[idx], [field]: val } as any;
    if (field === "name" && typeof val === "string" && val.trim().length > 0) {
      r[idx].avatarLetter = val.trim().substring(0, 1).toUpperCase();
    }
    setProduct({ ...product, reviews: r });
  };

  const tabs = [
    { id: "info", label: "Thông tin chung", icon: Settings },
    { id: "images", label: "Hình ảnh", icon: ImageIcon, count: product?.images.length },
    { id: "specs", label: "Thông số kỹ thuật", icon: FileText, count: product?.specs.length },
    { id: "variants", label: "Phiên bản", icon: Tag, count: product?.variants.length },
    { id: "reviews", label: "Đánh giá khách hàng", icon: MessageSquare, count: product?.reviews.length },
    { id: "seo", label: "SEO & Phụ lục", icon: BarChart3 },
  ] as const;

  if (loading) {
    return (
      <AdminLayout title="Đang tải sản phẩm...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            <p className="text-sm">Đang tải dữ liệu sản phẩm...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Không tìm thấy">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <p className="text-sm">Không tìm thấy sản phẩm.</p>
            <Button variant="outline" onClick={() => navigate("/admin/products")}>Quay lại danh sách</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const discountPercent = product.originalPrice > 0
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <AdminLayout title={id === "new" ? "Thêm sản phẩm" : "Sửa sản phẩm"}>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Back and Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground leading-tight">{product?.shortName || product?.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">SKU: {product?.sku} • ID: {product?.productId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-3">
              <Switch
                checked={product?.isActive || false}
                onCheckedChange={(v) => update("isActive", v)}
              />
              <span className="text-sm text-muted-foreground">{product?.isActive ? "Đang bán" : "Tạm ẩn"}</span>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2 bg-teal-600 hover:bg-teal-700 font-bold">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Giá bán</p>
              <p className="text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Giá gốc</p>
              <p className="text-lg font-bold text-muted-foreground line-through">{formatPrice(product.originalPrice)}</p>
              {discountPercent > 0 && <span className="text-xs text-green-600 font-medium">-{discountPercent}%</span>}
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Đã bán</p>
              <p className="text-lg font-bold text-foreground">{product.sold}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Tồn kho</p>
              <p className={`text-lg font-bold ${product.stock < 10 ? "text-red-600" : "text-foreground"}`}>{product.stock}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {"count" in tab && tab.count !== undefined && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Basic info */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Tên sản phẩm</Label>
                  <Input value={product.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-teal-700 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5" /> Đường dẫn tĩnh (Slug / Product ID)
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono select-none">/product/</span>
                    <Input
                      value={product.productId}
                      onChange={(e) => update("productId", e.target.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                      placeholder="vi-du-duong-dan-san-pham"
                      className="font-mono h-9"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    URL hiển thị: https://gcnature.com.vn/product/{product.productId || "id-san-pham"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">SKU</Label>
                  <Input value={product.sku} onChange={(e) => update("sku", e.target.value)} className="font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Danh mục</Label>
                    <select
                      value={product.categoryName}
                      onChange={(e) => update("categoryName", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Chọn danh mục...</option>
                      {productDropdown.map((cat) => (
                        <optgroup key={cat.title} label={cat.title}>
                          <option value={cat.title}>{cat.title}</option>
                          {cat.items.map((item) => (
                            <option key={item.name} value={item.name}>--- {item.name}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Thương hiệu</Label>
                    <Input value={product.brand} onChange={(e) => update("brand", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Xuất xứ</Label>
                    <Input value={product.origin || ""} onChange={(e) => update("origin", e.target.value)} placeholder="Hàn Quốc, Nhật Bản, Pháp..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-teal-700">Định lượng (Dung tích / Trọng lượng)</Label>
                    <Input value={product.volume || ""} onChange={(e) => update("volume", e.target.value)} placeholder="Vd: 50ml, 23ml, 12g..." />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Badge</Label>
                  <Input value={product.badge} onChange={(e) => update("badge", e.target.value)} placeholder="HOT, MỚI, BESTSELLER..." />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Giá & Kho hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Giá bán (₫)</Label>
                    <Input type="number" value={product.price} onChange={(e) => update("price", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Giá gốc (₫)</Label>
                    <Input type="number" value={product.originalPrice} onChange={(e) => update("originalPrice", Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Giảm giá (%)</Label>
                    <Input type="number" value={discountPercent} readOnly className="bg-muted/50 cursor-not-allowed" title="Tự tính từ Giá bán / Giá gốc" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Đã bán</Label>
                    <Input type="number" value={product.sold} onChange={(e) => update("sold", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Tồn kho</Label>
                    <Input type="number" value={product.stock} onChange={(e) => update("stock", Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Đánh giá</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={product.rating} onChange={(e) => update("rating", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5 pt-5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Flash Sale</Label>
                      <Switch checked={product.isFlashSale} onCheckedChange={(v) => update("isFlashSale", v)} />
                    </div>
                    {product.isFlashSale && (
                      <Input type="number" value={product.flashSalePercent} onChange={(e) => update("flashSalePercent", Number(e.target.value))} placeholder="% giảm Flash Sale" className="mt-1" />
                    )}
                  </div>
                </div>
                
                {/* Advanced Pricing */}
                <div className="pt-5 border-t border-border mt-5">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Mở rộng (Hệ thống giá phụ)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Xả hàng (₫)</Label>
                      <Input type="number" value={product.clearancePrice || 0} onChange={(e) => update("clearancePrice", Number(e.target.value))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Sale Daily (₫)</Label>
                      <Input type="number" value={product.dailySalePrice || 0} onChange={(e) => update("dailySalePrice", Number(e.target.value))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Campaign (₫)</Label>
                      <Input type="number" value={product.campaignPrice || 0} onChange={(e) => update("campaignPrice", Number(e.target.value))} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Ngoại Sàn (₫)</Label>
                      <Input type="number" value={product.offPlatformPrice || 0} onChange={(e) => update("offPlatformPrice", Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description (full width) */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Mô tả sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={product.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                />
              </CardContent>
            </Card>

            {/* Features (Công dụng nổi bật) */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Công dụng nổi bật</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={product.featuresVn || ""}
                  onChange={(e) => update("featuresVn", e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Nhập công dụng nổi bật của sản phẩm..."
                />
              </CardContent>
            </Card>

            {/* Thành phần đặc biệt & Hoạt chất Hot (Nổi bật giao diện người dùng - Đúng phần khoanh đỏ Admin Screenshot 2) */}
            <Card className="border-emerald-200 bg-emerald-50/20 lg:col-span-2 shadow-2xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-emerald-800 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    🔥 Thành phần đặc biệt & Hoạt chất Hot (Bổ sung nổi bật giao diện người dùng)
                  </span>
                  <span className="text-[11px] font-normal text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Sẽ hiển thị dạng ô màu xanh lá nổi bật kèm chấm vàng trên giao diện khách hàng
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={product.featuresEn || ""}
                  onChange={(e) => update("featuresEn", e.target.value)}
                  placeholder="Nhập tên các hoạt chất HOT cần bổ sung nổi bật (phân cách bằng dấu phẩy, ví dụ: Niacinamide, Panthenol, Madecassoside, Hydrolyzed Hyaluronic Acid...)"
                  className="bg-white border-emerald-300 font-semibold text-emerald-950 focus:border-emerald-500"
                />
                
                {/* Preset Quick Add Buttons */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-emerald-900 block">Bấm để thêm nhanh hoạt chất Hot:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Niacinamide", "Panthenol", "Madecassoside", "Asiaticoside",
                      "Hyaluronic Acid", "Hydrolyzed Hyaluronic Acid", "PDRN DNA Cá Hồi",
                      "Ascorbic Acid (Vitamin C)", "Glutathione", "Keo Ong", "Snail Secretion Filtrate (Ốc Sên)",
                      "Beta-Glucan", "Tocopherol (Vitamin E)", "Centella Asiatica"
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          const current = (product.featuresEn || "").split(',').map(s => s.trim()).filter(Boolean);
                          if (!current.includes(preset)) {
                            const updatedList = [...current, preset].join(', ');
                            update("featuresEn", updatedList);
                            toast.success(`Đã thêm hoạt chất hot: ${preset}`);
                          }
                        }}
                        className="text-[11px] font-semibold bg-white hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs transition-colors"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thành phần chính (Ingredients) */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                  🌿 Thành phần chính (Bảng thành phần đầy đủ INCI Standard)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={product.ingredients || ""}
                  onChange={(e) => update("ingredients", e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Nhập bảng thành phần chính đầy đủ (INCI Standard) phân cách bởi dấu phẩy..."
                />
              </CardContent>
            </Card>

            {/* Footer Rules & Warranty Details */}
            <Card className="border-border lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Chính sách & Chân trang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Chính sách chân trang</Label>
                    <textarea
                      value={product.footerInfo || ""}
                      onChange={(e) => update("footerInfo", e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Thông tin chung ở chân trạng, ví dụ: 'Bản quyền...', 'Hotline...'"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Dữ liệu bảo hành (Warranty Packages)</Label>
                    <textarea
                      value={product.warrantyData || ""}
                      onChange={(e) => update("warrantyData", e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Nhập ghi chú gói bảo hành cụ thể cho sản phẩm, vd: BH 3 T: 550k"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "images" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Hình ảnh sản phẩm ({product.images.length})</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openMediaPicker("add")} className="gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" /> Chọn từ kho
                </Button>
                <Button size="sm" variant="outline" onClick={addImage} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Thêm thủ công
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {product.images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có ảnh nào</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <Button size="sm" variant="outline" onClick={() => openMediaPicker("add")} className="gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" /> Chọn từ kho ảnh
                    </Button>
                    <Button size="sm" variant="ghost" onClick={addImage} className="gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Nhập URL thủ công
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 p-2 rounded-lg border transition-all group ${
                        idx === 0 ? 'border-primary/30 bg-primary/5' : 'border-border/50 hover:border-border'
                      } ${dragIdx === idx ? 'opacity-40 scale-95' : ''} ${dragOverIdx === idx && dragIdx !== idx ? 'border-primary border-dashed bg-primary/5' : ''}`}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground/50 shrink-0 cursor-grab active:cursor-grabbing" />
                      <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0 border border-border relative">
                        {img.url ? (
                          <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        {idx === 0 && (
                          <div className="absolute top-0.5 left-0.5 bg-primary text-white text-[8px] font-bold px-1 rounded">★</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={img.url}
                          onChange={(e) => updateImage(idx, e.target.value)}
                          placeholder="/products/image.jpg hoặc https://..."
                          className="text-xs h-8"
                        />
                        {idx === 0 && <span className="text-[10px] text-primary font-medium">Ảnh chính</span>}
                      </div>
                      {/* Set as main image */}
                      {idx !== 0 && (
                        <button
                          onClick={() => {
                            const imgs = [...product.images];
                            const [moved] = imgs.splice(idx, 1);
                            imgs.unshift(moved);
                            setProduct({ ...product, images: imgs });
                          }}
                          className="p-1.5 rounded hover:bg-amber-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Đặt làm ảnh chính"
                        >
                          <Star className="w-4 h-4 text-amber-500" />
                        </button>
                      )}
                      <button onClick={() => openMediaPicker("replace", idx)} className="p-1.5 rounded hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" title="Chọn từ kho">
                        <FolderOpen className="w-4 h-4 text-primary" />
                      </button>
                      <button onClick={() => removeImage(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "specs" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Thông số kỹ thuật ({product.specs.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addSpec} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm thông số
              </Button>
            </CardHeader>
            <CardContent>
              {product.specs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có thông số nào</p>
                  <Button size="sm" variant="outline" onClick={addSpec} className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Thêm thông số
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-[40px_1fr_1.5fr_40px] gap-2 text-xs text-muted-foreground font-medium px-1 mb-1">
                    <span>#</span><span>Tên</span><span>Giá trị</span><span></span>
                  </div>
                  {product.specs.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-[40px_1fr_1.5fr_40px] gap-2 items-center group">
                      <span className="text-xs text-muted-foreground text-center">{idx + 1}</span>
                      <Input
                        value={spec.name}
                        onChange={(e) => updateSpec(idx, "name", e.target.value)}
                        placeholder="Camera, Pin, ..."
                        className="text-xs h-8"
                      />
                      <Input
                        value={spec.value}
                        onChange={(e) => updateSpec(idx, "value", e.target.value)}
                        placeholder="32MP, 270mAh, ..."
                        className="text-xs h-8"
                      />
                      <button onClick={() => removeSpec(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "variants" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Biến thể sản phẩm ({product.variants.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addVariant} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm biến thể
              </Button>
            </CardHeader>
            <CardContent>
              {product.variants.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có biến thể nào</p>
                  <p className="text-xs mt-1">Ví dụ: Đen, Trắng, Combo...</p>
                  <Button size="sm" variant="outline" onClick={addVariant} className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Thêm biến thể
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {product.variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-border/50 hover:border-border transition-colors group">
                      <Input
                        value={v.name}
                        onChange={(e) => updateVariant(idx, "name", e.target.value)}
                        placeholder="Tên biến thể (Đen, Trắng...)"
                        className="text-sm h-9 flex-1"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={v.isActive}
                          onCheckedChange={(val) => updateVariant(idx, "isActive", val)}
                        />
                        <span className="text-xs text-muted-foreground w-10">{v.isActive ? "Bật" : "Tắt"}</span>
                      </div>
                      <button onClick={() => removeVariant(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "reviews" && (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Đánh giá sản phẩm ({product.reviews.length})</CardTitle>
              <Button size="sm" variant="outline" onClick={addReview} className="gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Thêm đánh giá
              </Button>
            </CardHeader>
            <CardContent>
              {product.reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Chưa có đánh giá nào</p>
                  <p className="text-xs mt-1">Thêm đánh giá để hiển thị ở trang sản phẩm</p>
                  <Button size="sm" variant="outline" onClick={addReview} className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Thêm đánh giá
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-border/50 hover:border-border transition-colors group space-y-3">
                      {/* Row 1: Name, Rating, Date */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                          <div className={`w-8 h-8 rounded-full ${review.avatarColor || 'bg-red-500'} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                            {review.avatarLetter || review.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <Input
                            value={review.name}
                            onChange={(e) => updateReview(idx, "name", e.target.value)}
                            placeholder="Tên người đánh giá"
                            className="text-sm h-8 flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => updateReview(idx, "rating", s)}
                              className="p-0 transition-transform hover:scale-110"
                            >
                              <Star className={`w-4 h-4 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            </button>
                          ))}
                        </div>
                        <Input
                          value={review.date}
                          onChange={(e) => updateReview(idx, "date", e.target.value)}
                          placeholder="DD/MM/YYYY"
                          className="text-xs h-8 w-28"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <Switch
                              checked={review.verified}
                              onCheckedChange={(v) => updateReview(idx, "verified", v)}
                            />
                            <span className="text-[10px] text-muted-foreground">{review.verified ? "✓ Đã mua" : "Chưa xác nhận"}</span>
                          </label>
                        </div>
                        <button onClick={() => removeReview(idx)} className="p-1.5 rounded hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                      {/* Row 2: Review text */}
                      <textarea
                        value={review.text}
                        onChange={(e) => updateReview(idx, "text", e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-border bg-background p-2 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Nội dung đánh giá..."
                      />
                      {/* Row 3: Extra fields */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground">👍</span>
                          <Input
                            type="number"
                            value={review.helpful}
                            onChange={(e) => updateReview(idx, "helpful", Number(e.target.value))}
                            className="text-xs h-7 w-16"
                            min={0}
                          />
                        </div>
                        <div className="flex-1 flex gap-1.5 items-center">
                          <Input
                            value={review.imageUrl || ''}
                            onChange={(e) => updateReview(idx, "imageUrl", e.target.value)}
                            placeholder="URL ảnh đánh giá (tuỳ chọn)"
                            className="text-xs h-7 flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openMediaPicker("review_image", idx)}
                            className="h-7 px-2 text-[10px] gap-1 shrink-0"
                          >
                            <FolderOpen className="w-3 h-3 text-primary" /> Chọn ảnh
                          </Button>
                        </div>
                        <select
                          value={review.avatarColor || 'bg-red-500'}
                          onChange={(e) => updateReview(idx, "avatarColor", e.target.value)}
                          className="text-xs h-7 rounded border border-border bg-background px-1"
                        >
                          <option value="bg-red-500">Đỏ</option>
                          <option value="bg-blue-500">Xanh dương</option>
                          <option value="bg-green-500">Xanh lá</option>
                          <option value="bg-pink-500">Hồng</option>
                          <option value="bg-purple-500">Tím</option>
                          <option value="bg-orange-500">Cam</option>
                          <option value="bg-emerald-500">Ngọc lục</option>
                          <option value="bg-cyan-500">Cyan</option>
                          <option value="bg-teal-500">Teal</option>
                          <option value="bg-indigo-500">Chàm</option>
                          <option value="bg-amber-600">Hổ phách</option>
                          <option value="bg-fuchsia-500">Hồng tím</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "seo" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Liên kết bán hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Link Shopee</Label>
                  <Input value={product.shopeeUrl} onChange={(e) => update("shopeeUrl", e.target.value)} placeholder="https://s.shopee.vn/..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Link TikTok Shop</Label>
                  <Input value={product.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} placeholder="https://tiktok.com/..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Video YouTube
                  </Label>
                  <Input value={product.youtubeUrl} onChange={(e) => update("youtubeUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..." />
                  <p className="text-[10px] text-muted-foreground">Nhập link YouTube — video sẽ được nhúng trên trang chi tiết sản phẩm</p>
                  {product.youtubeUrl && (() => {
                    const url = product.youtubeUrl;
                    let videoId = '';
                    try {
                      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
                      else if (url.includes('youtube.com/watch')) videoId = new URL(url).searchParams.get('v') || '';
                      else if (url.includes('youtube.com/embed/')) videoId = url.split('youtube.com/embed/')[1]?.split(/[?&#]/)[0] || '';
                    } catch {}
                    if (!videoId) return null;
                    return (
                      <div className="mt-2 rounded-lg overflow-hidden border border-border aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                          title="YouTube preview"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Tối ưu SEO Google</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Tiêu đề hiển thị trên Google (Meta Title)</Label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Nhập tiêu đề SEO..."
                  />
                  <p className="text-[10px] text-muted-foreground">Độ dài tối ưu: 50 - 60 ký tự. Để trống sẽ tự động lấy Tên sản phẩm.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Mô tả hiển thị trên Google (Meta Description)</Label>
                  <textarea
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Nhập mô tả SEO..."
                  />
                  <p className="text-[10px] text-muted-foreground">Độ dài tối ưu: 150 - 160 ký tự. Để trống sẽ tự động lấy Công dụng nổi bật.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Từ khóa hiển thị trên Google (Meta Keywords)</Label>
                  <Input
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="mỹ phẩm hàn quốc, dưỡng da, gcnature..."
                  />
                  <p className="text-[10px] text-muted-foreground">Các từ khóa cách nhau bằng dấu phẩy.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bottom save bar */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border -mx-3 md:-mx-4 lg:-mx-6 px-3 md:px-4 lg:px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/products")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary hover:bg-primary/90 min-w-[140px]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* ═══ Media Picker Dialog ═══ */}
      <Dialog open={mediaPickerOpen} onOpenChange={(open) => {
        setMediaPickerOpen(open);
        if (!open) stopCamera();
      }}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              {mediaPickerMode === "replace" ? "Chọn media thay thế" : "Chọn media từ kho"}
              {mediaSelected.size > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Đã chọn {mediaSelected.size}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Library vs Upload modes switch */}
          <div className="flex border-b border-border mb-3">
            <button
              onClick={() => { setActiveUploadMode("library"); stopCamera(); }}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                activeUploadMode === "library" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Chọn từ kho ảnh
            </button>
            <button
              onClick={() => setActiveUploadMode("upload")}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                activeUploadMode === "upload" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Tải ảnh mới (3 cách)
            </button>
          </div>

          {activeUploadMode === "library" && (
            <>
              {/* Toolbar */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={mediaSearch} onChange={e => setMediaSearch(e.target.value)}
                    placeholder="Tìm ảnh..." className="pl-8 h-8 text-xs" />
                </div>
                <select value={mediaFilterGroup} onChange={e => setMediaFilterGroup(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="all">Tất cả</option>
                  {mediaGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
                {mediaLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (() => {
                  const filteredMedia = mediaFiles.filter(f => {
                    if (mediaFilterGroup !== "all" && f.group !== mediaFilterGroup) return false;
                    if (mediaSearch && !f.filename.toLowerCase().includes(mediaSearch.toLowerCase())) return false;
                    return true;
                  });
                  if (filteredMedia.length === 0) return (
                    <div className="text-center py-16 text-muted-foreground">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Không tìm thấy ảnh</p>
                    </div>
                  );
                  return (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 py-2">
                      {filteredMedia.map(file => {
                        const isSelected = mediaSelected.has(file.url);
                        return (
                          <div key={file.filename}
                            className={`relative rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                              isSelected ? "ring-2 ring-primary border-primary" : "border-border hover:border-primary/40"
                            }`}
                            onClick={() => toggleMediaSelect(file.url)}>
                            <div className="absolute top-1 left-1 z-10">
                              {isSelected
                                ? <CheckSquare className="w-4 h-4 text-primary drop-shadow" />
                                : <Square className="w-4 h-4 text-white/70 drop-shadow" />}
                            </div>
                            <div className="aspect-square bg-muted/50 overflow-hidden relative">
                              {file.type === 'video' ? (
                                <>
                                  <video src={file.url} className="w-full h-full object-cover" muted preload="metadata" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
                                      <Play className="w-3 h-3 text-gray-800 ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="absolute top-0.5 right-0.5">
                                    <span className="text-[7px] font-bold text-white bg-blue-600 px-1 py-0.5 rounded">VIDEO</span>
                                  </div>
                                </>
                              ) : (
                                <img src={file.url} alt={file.filename} loading="lazy"
                                  className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="p-1.5 bg-background">
                              <p className="text-[10px] font-medium truncate" title={file.filename}>{file.filename}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {activeUploadMode === "upload" && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto py-2">
              {/* Sub tabs for 3 upload methods */}
              <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                <button
                  onClick={() => { setSubUploadTab("computer"); stopCamera(); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    subUploadTab === "computer" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 inline mr-1" />
                  Từ máy tính
                </button>
                <button
                  onClick={() => { setSubUploadTab("url"); stopCamera(); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    subUploadTab === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 inline mr-1" />
                  Dán link ảnh
                </button>
                <button
                  onClick={() => { setSubUploadTab("camera"); startCamera(); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    subUploadTab === "camera" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 inline mr-1" />
                  Chụp từ Camera
                </button>
              </div>

              {/* Content panels */}
              <div className="flex-1 flex flex-col justify-center min-h-[300px] border border-dashed rounded-xl p-6 bg-muted/10">
                {subUploadTab === "computer" && (
                  <div
                    className="flex flex-col items-center justify-center gap-3 cursor-pointer h-full py-12"
                    onClick={() => uploadFileInputRef.current?.click()}
                  >
                    <input
                      ref={uploadFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => { if (e.target.files) handleUploadFiles(Array.from(e.target.files)); }}
                    />
                    <Upload className="w-12 h-12 text-muted-foreground/45" />
                    <div className="text-center">
                      <p className="text-sm font-semibold">Nhấp để chọn tệp từ máy tính</p>
                      <p className="text-xs text-muted-foreground mt-1">Hỗ trợ các định dạng JPG, PNG, WEBP, GIF</p>
                    </div>
                  </div>
                )}

                {subUploadTab === "url" && (
                  <div className="max-w-md mx-auto w-full space-y-4 py-8">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Địa chỉ liên kết hình ảnh (URL)</Label>
                      <Input
                        value={pastedUrl}
                        onChange={(e) => setPastedUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      onClick={handleDownloadUrl}
                      disabled={downloadingUrl || !pastedUrl.trim()}
                      className="w-full bg-primary text-white gap-2"
                    >
                      {downloadingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                      Tải về & Lưu vào kho
                    </Button>
                  </div>
                )}

                {subUploadTab === "camera" && (
                  <div className="flex flex-col items-center gap-4 py-2">
                    {cameraLoading ? (
                      <div className="h-[240px] w-full max-w-sm flex items-center justify-center bg-black rounded-lg">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                      </div>
                    ) : cameraStream ? (
                      <div className="relative rounded-lg overflow-hidden border border-border bg-black max-w-sm w-full">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-auto object-cover transform -scale-x-100" />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                          <Button onClick={capturePhoto} size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4 gap-1.5">
                            <Camera className="w-4 h-4" /> Chụp ảnh
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-8">
                        <Camera className="w-12 h-12 text-muted-foreground/45" />
                        <Button onClick={startCamera} size="sm" className="mt-2 bg-primary text-white">
                          Bật Camera
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setMediaPickerOpen(false); stopCamera(); }}>Hủy</Button>
            <Button onClick={confirmMediaPicker} disabled={mediaSelected.size === 0} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              {mediaPickerMode === "replace"
                ? "Thay ảnh"
                : `Thêm ${mediaSelected.size} ảnh`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
