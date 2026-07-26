import { useState, useEffect, useRef, useCallback } from "react";
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
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon, Megaphone, Upload, Loader2, Sparkles, RotateCcw, Save, FolderOpen, Search, Camera, Link2 } from "lucide-react";
import { toast } from "sonner";
import { apiPost, API_BASE } from "@/lib/api";
import { getBranding, saveBranding, saveBrandingToServer, defaultBranding, resolveBranding, type BrandingSettings } from "@/lib/branding";

/* ═══════════════════════════════════════════
   Types & storage helpers
   ═══════════════════════════════════════════ */
export interface BannerItem {
  id: number;
  image: string;
  imageMobile?: string;
  alt: string;
  link: string;
}

// ── Hero banner (single top banner) ──
const HERO_STORAGE_KEY = "gcnature_hero_banner";
const defaultHero: BannerItem = {
  id: 1,
  image: "/banner2/img.png",
  imageMobile: "",
  alt: "Đại lễ 30/4 - 1/5: Giảm 20% toàn shop",
  link: "/shop",
};

export function getHeroBanner(): BannerItem {
  try {
    const saved = localStorage.getItem(HERO_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultHero;
}

export async function saveHeroBanner(banner: BannerItem): Promise<boolean> {
  localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(banner));
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hero_banner: JSON.stringify(banner) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchHeroBanner(): Promise<BannerItem> {
  try {
    const res = await fetch(`${API_BASE}/settings/hero-banner`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && data.image) {
        localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {}
  return getHeroBanner();
}

// ── Hero background settings ──
export interface HeroBgSettings {
  image: string;
  imageMobile?: string;
}

const HERO_BG_STORAGE_KEY = "gcnature_hero_bg_settings";
const defaultHeroBg: HeroBgSettings = {
  image: "/banner2/bgimg.png",
  imageMobile: "/banner2/bgimg-mobile.png",
};

export function getHeroBgSettings(): HeroBgSettings {
  try {
    const saved = localStorage.getItem(HERO_BG_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultHeroBg;
}

export async function saveHeroBgSettings(settings: HeroBgSettings): Promise<boolean> {
  localStorage.setItem(HERO_BG_STORAGE_KEY, JSON.stringify(settings));
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hero_bg_settings: JSON.stringify(settings) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchHeroBgSettings(): Promise<HeroBgSettings> {
  try {
    const res = await fetch(`${API_BASE}/settings/hero-bg-settings`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object" && data.image) {
        localStorage.setItem(HERO_BG_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {}
  return getHeroBgSettings();
}

// ── Promo banners (carousel banners below hero) ──
const PROMO_STORAGE_KEY = "gcnature_promo_banners";

const defaultPromos: BannerItem[] = [
  { id: 1, image: "/banners/banner/1.png", alt: "Ưu đãi 30/4 - 1/5", link: "/shop" },
  { id: 2, image: "/banners/banner/2.png", alt: "Baby3 Three Thông Minh", link: "/shop?category=Robot+AI" },
  { id: 3, image: "/banners/banner/3.png", alt: "Thunder Sale Smart Glasses", link: "/shop?category=Kính+Thông+Minh+AI" },
  { id: 4, image: "/banners/banner/4.png", alt: "Quà tặng Bao Da Cao Cấp", link: "/shop?category=Phụ+Kiện" },
];

export function getPromoBanners(): BannerItem[] {
  try {
    const saved = localStorage.getItem(PROMO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return defaultPromos;
}

export async function savePromoBanners(banners: BannerItem[]): Promise<boolean> {
  localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(banners));
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ promo_banners: JSON.stringify(banners) }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchPromoBanners(): Promise<BannerItem[]> {
  try {
    const res = await fetch(`${API_BASE}/settings/promo-banners`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data)) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {}
  return getPromoBanners();
}

/* ═══════════════════════════════════════════
   Image Upload Component (with media picker)
   ═══════════════════════════════════════════ */
const ImageUploader = ({
  currentImage,
  onImageChange,
  previewFallback,
  fallbackLabel,
  onPickFromMedia,
}: {
  currentImage: string;
  onImageChange: (url: string) => void;
  previewFallback?: string;
  fallbackLabel?: string;
  /** Callback to open the shared media picker */
  onPickFromMedia?: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const previewSrc = currentImage || previewFallback || "";
  const usingFallback = !currentImage && !!previewFallback;

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File quá lớn (tối đa 10MB)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetch(`${API_BASE}/banners/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onImageChange(data.url);
      toast.success("Đã tải ảnh lên thành công!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {previewSrc && (
        <div className="rounded-lg overflow-hidden border border-border bg-gray-50 relative">
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-40 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          {usingFallback && (
            <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded">
              {fallbackLabel || "Mặc định"}
            </span>
          )}
        </div>
      )}

      {/* Upload zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-red-400 bg-red-50"
            : "border-gray-300 hover:border-red-300 hover:bg-red-50/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
            <p className="text-sm text-gray-600">Đang tải lên...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-red-600">Nhấn để tải ảnh</span> hoặc kéo thả vào đây
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP (tối đa 10MB)</p>
          </div>
        )}
      </div>

      {/* Pick from media + URL input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs text-gray-500">Hoặc nhập URL ảnh</Label>
          <Input
            value={currentImage}
            onChange={(e) => onImageChange(e.target.value)}
            placeholder="/banners/banner/1.png hoặc https://..."
            className="mt-1"
          />
        </div>
        {onPickFromMedia && (
          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={onPickFromMedia} className="gap-1.5 h-9">
              <FolderOpen className="w-3.5 h-3.5" /> Kho ảnh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Admin Banners Page
   ═══════════════════════════════════════════ */
const AdminBanners = () => {
  // Hero banner state
  const [hero, setHero] = useState<BannerItem>(defaultHero);
   const [heroDialogOpen, setHeroDialogOpen] = useState(false);
  const [heroForm, setHeroForm] = useState({ image: "", imageMobile: "", alt: "", link: "" });

  // Hero background settings state
  const [heroBg, setHeroBg] = useState<HeroBgSettings>(getHeroBgSettings());
  const [heroBgDialogOpen, setHeroBgDialogOpen] = useState(false);
  const [heroBgForm, setHeroBgForm] = useState({ image: "", imageMobile: "" });

  // Branding (logo) state
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [savedBranding, setSavedBranding] = useState<BrandingSettings>(defaultBranding);

  // Promo banners state
  const [promos, setPromos] = useState<BannerItem[]>([]);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<BannerItem | null>(null);
  const [promoForm, setPromoForm] = useState({ image: "", imageMobile: "", alt: "", link: "/shop" });
  const [deletePromoId, setDeletePromoId] = useState<number | null>(null);

  // Media picker state (shared across all ImageUploader fields)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string>(""); // which field triggered picker
  const [mediaFiles, setMediaFiles] = useState<{ filename: string; url: string; group: string }[]>([]);
  const [mediaGroups, setMediaGroups] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  // Three way upload state inside media picker
  const [activeUploadMode, setActiveUploadMode] = useState<"library" | "upload">("library");
  const [subUploadTab, setSubUploadTab] = useState<"computer" | "url" | "camera">("computer");
  const [pastedUrl, setPastedUrl] = useState("");
  const [downloadingUrl, setDownloadingUrl] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const uploadFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Initial local load for instant rendering
    setHero(getHeroBanner());
    setHeroBg(getHeroBgSettings());
    setPromos(getPromoBanners());
    const b = getBranding();
    setBranding(b);
    setSavedBranding(b);

    // Fetch from server for sync
    fetchHeroBanner().then(h => setHero(h));
    fetchHeroBgSettings().then(bg => setHeroBg(bg));
    fetchPromoBanners().then(p => setPromos(p));
  }, []);

  /* ── Branding (logo) handlers — auto-saves on every change ── */
  const updateBranding = (patch: Partial<BrandingSettings>) => {
    const next = { ...branding, ...patch };
    setBranding(next);
    saveBranding(next);
    setSavedBranding(next);
  };

  const resetBranding = () => {
    setBranding(defaultBranding);
    saveBrandingToServer(defaultBranding);
    setSavedBranding(defaultBranding);
    toast.success("Đã khôi phục cấu hình logo mặc định");
  };

  const saveBrandingNow = async () => {
    const ok = await saveBrandingToServer(branding);
    setSavedBranding(branding);
    if (ok) {
      toast.success("Đã lưu thay đổi logo & header (đồng bộ server)");
    } else {
      toast.success("Đã lưu thay đổi logo & header (chỉ trình duyệt này)");
    }
  };

  const isDirty = JSON.stringify(branding) !== JSON.stringify(savedBranding);

  /* ── Hero banner handlers ── */
  const openEditHero = () => {
    setHeroForm({ image: hero.image, imageMobile: hero.imageMobile || "", alt: hero.alt, link: hero.link });
    setHeroDialogOpen(true);
  };

  const saveHeroHandler = async () => {
    if (!heroForm.image.trim() || !heroForm.alt.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const updated = { ...hero, ...heroForm };
    setHero(updated);
    const ok = await saveHeroBanner(updated);
    setHeroDialogOpen(false);
    if (ok) {
      toast.success("Đã cập nhật banner đầu trang (đồng bộ server)");
    } else {
      toast.success("Đã cập nhật banner đầu trang (local)");
    }
  };

  /* ── Hero background image handlers ── */
  const openEditHeroBg = () => {
    setHeroBgForm({ image: heroBg.image, imageMobile: heroBg.imageMobile || "" });
    setHeroBgDialogOpen(true);
  };

  const saveHeroBgHandler = async () => {
    if (!heroBgForm.image.trim()) {
      toast.error("Vui lòng chọn hình ảnh nền");
      return;
    }
    const updated = { ...heroBg, ...heroBgForm };
    setHeroBg(updated);
    const ok = await saveHeroBgSettings(updated);
    setHeroBgDialogOpen(false);
    if (ok) {
      toast.success("Đã cập nhật ảnh nền đầu trang (đồng bộ server)");
    } else {
      toast.success("Đã cập nhật ảnh nền đầu trang (local)");
    }
  };

  /* ── Promo banner handlers ── */
  const openAddPromo = () => {
    setEditingPromo(null);
    setPromoForm({ image: "", imageMobile: "", alt: "", link: "/shop" });
    setPromoDialogOpen(true);
  };

  const openEditPromo = (banner: BannerItem) => {
    setEditingPromo(banner);
    setPromoForm({ image: banner.image, imageMobile: banner.imageMobile || "", alt: banner.alt, link: banner.link });
    setPromoDialogOpen(true);
  };

  const savePromoHandler = async () => {
    if (!promoForm.image.trim() || !promoForm.alt.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    let updated: BannerItem[];
    const isEditing = !!editingPromo;
    if (editingPromo) {
      updated = promos.map((b) =>
        b.id === editingPromo.id ? { ...b, ...promoForm } : b
      );
    } else {
      const newId = Math.max(0, ...promos.map((b) => b.id)) + 1;
      updated = [...promos, { id: newId, ...promoForm }];
    }
    setPromos(updated);
    const ok = await savePromoBanners(updated);
    setPromoDialogOpen(false);
    const label = isEditing ? "Đã cập nhật banner khuyến mãi" : "Đã thêm banner khuyến mãi";
    if (ok) {
      toast.success(`${label} (đồng bộ server)`);
    } else {
      toast.success(`${label} (local)`);
    }
  };

  const deletePromo = async (id: number) => {
    const updated = promos.filter((b) => b.id !== id);
    setPromos(updated);
    await savePromoBanners(updated);
    setDeletePromoId(null);
    toast.success("Đã xóa banner");
  };

  const movePromo = async (index: number, dir: "up" | "down") => {
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= promos.length) return;
    const updated = [...promos];
    [updated[index], updated[swap]] = [updated[swap], updated[index]];
    setPromos(updated);
    await savePromoBanners(updated);
  };

  // ── Media picker helpers ──
  const loadMedia = useCallback(async () => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem("token");
      const h: Record<string, string> = {};
      if (token) h["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/media/list`, { headers: h });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMediaFiles(data.files || []);
      setMediaGroups(data.groups || []);
    } catch { toast.error("Lỗi tải kho ảnh"); }
    finally { setMediaLoading(false); }
  }, []);

  const openMediaPicker = (target: string) => {
    setMediaPickerTarget(target);
    setMediaSearch(""); 
    setMediaFilter("all");
    setActiveUploadMode("library");
    setMediaPickerOpen(true);
    if (mediaFiles.length === 0) loadMedia();
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
      await loadMedia();
      
      // Auto select and apply
      if (resData.files && resData.files.length > 0) {
        pickMediaImage(resData.files[0].url);
      } else {
        setActiveUploadMode("library");
      }
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
      await loadMedia();
      
      // Auto select and apply
      if (resData.file) {
        pickMediaImage(resData.file.url);
      } else {
        setActiveUploadMode("library");
      }
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

  const pickMediaImage = (url: string) => {
    // Route picked URL to the correct form field
    if (mediaPickerTarget === "hero_desktop") setHeroForm({ ...heroForm, image: url });
    else if (mediaPickerTarget === "hero_mobile") setHeroForm({ ...heroForm, imageMobile: url });
    else if (mediaPickerTarget === "hero_bg_desktop") setHeroBgForm({ ...heroBgForm, image: url });
    else if (mediaPickerTarget === "hero_bg_mobile") setHeroBgForm({ ...heroBgForm, imageMobile: url });
    else if (mediaPickerTarget === "promo_desktop") setPromoForm({ ...promoForm, image: url });
    else if (mediaPickerTarget === "promo_mobile") setPromoForm({ ...promoForm, imageMobile: url });
    setMediaPickerOpen(false);
  };

  const filteredMedia = mediaFiles.filter(f => {
    if (mediaFilter !== "all" && f.group !== mediaFilter) return false;
    if (mediaSearch && !f.filename.toLowerCase().includes(mediaSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý Banner</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý banner đầu trang và các banner khuyến mãi trên trang chủ. Tải ảnh mới hoặc nhập URL.
          </p>
        </div>

        {/* ═══ Section 0: Logo Settings ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Logo thương hiệu</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tùy chỉnh logo hiển thị trên header desktop & mobile, kèm chiều cao riêng cho từng layout
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isDirty && (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                    Có thay đổi chưa lưu
                  </span>
                )}
                <Button onClick={saveBrandingNow} size="sm" className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </Button>
                <Button onClick={resetBranding} variant="outline" size="sm" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Khôi phục mặc định
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Live preview */}
            {(() => {
              const resolved = resolveBranding(branding);
              return (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden border border-border bg-[#cb1c22] p-4 flex flex-col items-start gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Xem trước Desktop</span>
                    <img
                      src={resolved.logoLight}
                      alt="logo desktop"
                      style={{ height: branding.logoHeightDesktop }}
                      className="w-auto object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border bg-[#cb1c22] p-4 flex flex-col items-start gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Xem trước Mobile</span>
                    <img
                      src={resolved.logoLightMobile}
                      alt="logo mobile"
                      style={{ height: branding.logoHeightMobile }}
                      className="w-auto object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Logo light (on red header) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
              <div>
                <Label className="font-semibold">Logo Desktop (nền đỏ — header sáng)</Label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">Dùng cho header chính, theme sáng</p>
                <ImageUploader
                  currentImage={branding.logoLight}
                  onImageChange={(url) => updateBranding({ logoLight: url })}
                  previewFallback={resolveBranding(branding).logoLight}
                  fallbackLabel="Đang dùng logo mặc định"
                />
              </div>
              <div>
                <Label className="font-semibold text-blue-600">Logo Mobile (tùy chọn)</Label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">Để trống sẽ dùng logo desktop</p>
                <ImageUploader
                  currentImage={branding.logoLightMobile}
                  onImageChange={(url) => updateBranding({ logoLightMobile: url })}
                  previewFallback={resolveBranding(branding).logoLightMobile}
                  fallbackLabel="Kế thừa từ desktop"
                />
              </div>
            </div>

            {/* Logo dark (theme tối) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-border">
              <div>
                <Label className="font-semibold">Logo Desktop (theme tối)</Label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">Hiển thị khi user dùng dark mode</p>
                <ImageUploader
                  currentImage={branding.logoDark}
                  onImageChange={(url) => updateBranding({ logoDark: url })}
                  previewFallback={resolveBranding(branding).logoDark}
                  fallbackLabel="Đang dùng logo mặc định"
                />
              </div>
              <div>
                <Label className="font-semibold text-blue-600">Logo Mobile (theme tối, tùy chọn)</Label>
                <p className="text-xs text-muted-foreground mt-0.5 mb-2">Để trống sẽ dùng logo dark desktop</p>
                <ImageUploader
                  currentImage={branding.logoDarkMobile}
                  onImageChange={(url) => updateBranding({ logoDarkMobile: url })}
                  previewFallback={resolveBranding(branding).logoDarkMobile}
                  fallbackLabel="Kế thừa từ desktop"
                />
              </div>
            </div>

            {/* Sizing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div>
                <Label>Chiều cao logo Desktop (px)</Label>
                <Input
                  type="number"
                  min={20}
                  max={140}
                  value={branding.logoHeightDesktop}
                  onChange={(e) => updateBranding({ logoHeightDesktop: Number(e.target.value) || defaultBranding.logoHeightDesktop })}
                  className="mt-1.5"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Mặc định 80px</p>
              </div>
              <div>
                <Label>Chiều cao logo Mobile header (px)</Label>
                <Input
                  type="number"
                  min={20}
                  max={120}
                  value={branding.logoHeightMobile}
                  onChange={(e) => updateBranding({ logoHeightMobile: Number(e.target.value) || defaultBranding.logoHeightMobile })}
                  className="mt-1.5"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Mặc định 64px — tăng lên nếu logo mobile bị nhỏ</p>
              </div>
              <div>
                <Label>Chiều cao logo Mobile sidebar (px)</Label>
                <Input
                  type="number"
                  min={20}
                  max={160}
                  value={branding.logoHeightSidebar}
                  onChange={(e) => updateBranding({ logoHeightSidebar: Number(e.target.value) || defaultBranding.logoHeightSidebar })}
                  className="mt-1.5"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Mặc định 80px</p>
              </div>
            </div>

            {/* Header bar height (controls how big the red top bar is) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border mt-6">
              <div>
                <Label>Tagline dưới logo</Label>
                <Input
                  value={branding.tagline}
                  onChange={(e) => updateBranding({ tagline: e.target.value })}
                  placeholder="VD: SMART VISION • SMART LIFE (để trống để ẩn)"
                  className="mt-1.5"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Dòng chữ nhỏ dưới logo. Để trống = ẩn hoàn toàn.</p>
              </div>
              <div>
                <Label>Chiều cao thanh header Desktop (px)</Label>
                <Input
                  type="number"
                  min={56}
                  max={160}
                  value={branding.headerHeightDesktop}
                  onChange={(e) => updateBranding({ headerHeightDesktop: Number(e.target.value) || defaultBranding.headerHeightDesktop })}
                  className="mt-1.5"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Mặc định 88px — thanh đỏ trên cùng PC</p>
              </div>
              <div>
                <Label>Chiều cao thanh header Mobile (px)</Label>
                <Input
                  type="number"
                  min={48}
                  max={140}
                  value={branding.headerHeightMobile}
                  onChange={(e) => updateBranding({ headerHeightMobile: Number(e.target.value) || defaultBranding.headerHeightMobile })}
                  className="mt-1.5"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Mặc định 68px — tăng nếu muốn logo header to hơn nữa</p>
              </div>
            </div>

            {/* Sidebar style */}
            <div className="mt-6 pt-6 border-t border-border">
              <Label className="text-sm font-semibold">Kiểu header sidebar Mobile</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-3">Chọn nền sáng (logo đen, nổi bật & to) hoặc nền đỏ thương hiệu (logo trắng).</p>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => updateBranding({ sidebarHeaderStyle: "white" })}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    branding.sidebarHeaderStyle === "white"
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-border hover:border-red-300"
                  }`}
                >
                  <div className="bg-white border border-gray-100 rounded-lg p-2 mb-2 flex items-center justify-center h-12">
                    <img src={resolveBranding(branding).logoDark} alt="" className="h-8 w-auto object-contain" />
                  </div>
                  <p className="text-xs font-semibold">Nền trắng + logo đen</p>
                  <p className="text-[10px] text-muted-foreground">Sạch, hiện đại</p>
                </button>
                <button
                  type="button"
                  onClick={() => updateBranding({ sidebarHeaderStyle: "red" })}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    branding.sidebarHeaderStyle === "red"
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-border hover:border-red-300"
                  }`}
                >
                  <div className="bg-[#be0117] rounded-lg p-2 mb-2 flex items-center justify-center h-12">
                    <img src={resolveBranding(branding).logoLight} alt="" className="h-8 w-auto object-contain" />
                  </div>
                  <p className="text-xs font-semibold">Nền đỏ + logo trắng</p>
                  <p className="text-[10px] text-muted-foreground">Thương hiệu mạnh</p>
                </button>
              </div>
            </div>

            {/* Sticky bottom action bar */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-muted-foreground">
                {isDirty
                  ? "Đang có thay đổi chưa lưu — bấm Lưu để áp dụng cho website."
                  : "Mọi thay đổi đã được lưu và áp dụng."}
              </p>
              <div className="flex items-center gap-2">
                <Button onClick={resetBranding} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Khôi phục mặc định
                </Button>
                <Button onClick={saveBrandingNow} className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Section 1: Hero Banner ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Banner Đầu Trang (Hero)</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Ảnh quảng cáo lớn phía trên trang chủ</p>
                </div>
              </div>
              <Button onClick={openEditHero} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl overflow-hidden border border-border bg-gradient-to-b from-red-500/10 to-transparent">
              <img
                src={hero.image}
                alt={hero.alt}
                className="w-full h-auto max-h-[200px] object-contain"
              />
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Mô tả:</span>
              <span className="font-medium text-foreground">{hero.alt}</span>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">Liên kết:</span>
              <span className="font-medium text-blue-600">{hero.link}</span>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Section 1.5: Hero Background Image ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ảnh Nền Đầu Trang (Hero Background)</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Ảnh nền background phía dưới banner đầu trang</p>
                </div>
              </div>
              <Button onClick={openEditHeroBg} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Hình nền Desktop:</span>
                <div className="rounded-lg overflow-hidden border border-border bg-gray-50 h-32 flex items-center justify-center relative">
                  <img
                    src={heroBg.image}
                    alt="Hero Background Desktop"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">Hình nền Mobile:</span>
                <div className="rounded-lg overflow-hidden border border-border bg-gray-50 h-32 flex items-center justify-center relative">
                  {heroBg.imageMobile ? (
                    <img
                      src={heroBg.imageMobile}
                      alt="Hero Background Mobile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Chưa có ảnh nền Mobile (dùng ảnh desktop)</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Section 2: Promo Banners ═══ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Banner Khuyến Mãi ({promos.length})</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Các banner hiển thị carousel bên dưới hero</p>
                </div>
              </div>
              <Button onClick={openAddPromo} className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm banner
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {promos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Chưa có banner khuyến mãi nào</p>
                <Button onClick={openAddPromo} variant="outline" className="mt-3 gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm banner đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {promos.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
                  >
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => movePromo(index, "up")}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        ▲
                      </button>
                      <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                      <button
                        onClick={() => movePromo(index, "down")}
                        disabled={index === promos.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Preview image */}
                    <div className="w-40 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{banner.alt}</p>
                      <p className="text-xs text-muted-foreground truncate">{banner.link}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Vị trí: {index + 1}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditPromo(banner)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeletePromoId(banner.id)}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ═══ Hero Edit Dialog ═══ */}
        <Dialog open={heroDialogOpen} onOpenChange={setHeroDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Banner Đầu Trang</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Hình ảnh Desktop</Label>
                  <div className="mt-2">
                    <ImageUploader
                      currentImage={heroForm.image}
                      onImageChange={(url) => setHeroForm({ ...heroForm, image: url })}
                      onPickFromMedia={() => openMediaPicker("hero_desktop")}
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-semibold text-blue-600">Hình ảnh Mobile (tùy chọn)</Label>
                  <div className="mt-2">
                    <ImageUploader
                      currentImage={heroForm.imageMobile}
                      onImageChange={(url) => setHeroForm({ ...heroForm, imageMobile: url })}
                      onPickFromMedia={() => openMediaPicker("hero_mobile")}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Mô tả (alt text)</Label>
                <Input
                  value={heroForm.alt}
                  onChange={(e) => setHeroForm({ ...heroForm, alt: e.target.value })}
                  placeholder="Mô tả banner"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Liên kết</Label>
                <Input
                  value={heroForm.link}
                  onChange={(e) => setHeroForm({ ...heroForm, link: e.target.value })}
                  placeholder="/shop hoặc https://..."
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHeroDialogOpen(false)}>Hủy</Button>
              <Button onClick={saveHeroHandler}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ═══ Hero Background Edit Dialog ═══ */}
        <Dialog open={heroBgDialogOpen} onOpenChange={setHeroBgDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Ảnh Nền Đầu Trang</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Hình nền Desktop</Label>
                  <div className="mt-2">
                    <ImageUploader
                      currentImage={heroBgForm.image}
                      onImageChange={(url) => setHeroBgForm({ ...heroBgForm, image: url })}
                      onPickFromMedia={() => openMediaPicker("hero_bg_desktop")}
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-semibold text-blue-600">Hình nền Mobile (tùy chọn)</Label>
                  <div className="mt-2">
                    <ImageUploader
                      currentImage={heroBgForm.imageMobile}
                      onImageChange={(url) => setHeroBgForm({ ...heroBgForm, imageMobile: url })}
                      onPickFromMedia={() => openMediaPicker("hero_bg_mobile")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHeroBgDialogOpen(false)}>Hủy</Button>
              <Button onClick={saveHeroBgHandler}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ═══ Promo Add/Edit Dialog ═══ */}
        <Dialog open={promoDialogOpen} onOpenChange={setPromoDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPromo ? "Chỉnh sửa banner khuyến mãi" : "Thêm banner khuyến mãi"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Hình ảnh Desktop</Label>
                  <div className="mt-2">
                    <ImageUploader
                      currentImage={promoForm.image}
                      onImageChange={(url) => setPromoForm({ ...promoForm, image: url })}
                      onPickFromMedia={() => openMediaPicker("promo_desktop")}
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-semibold text-blue-600">Hình ảnh Mobile (tùy chọn)</Label>
                  <div className="mt-2">
                    <ImageUploader
                      currentImage={promoForm.imageMobile}
                      onImageChange={(url) => setPromoForm({ ...promoForm, imageMobile: url })}
                      onPickFromMedia={() => openMediaPicker("promo_mobile")}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label>Mô tả (alt text)</Label>
                <Input
                  value={promoForm.alt}
                  onChange={(e) => setPromoForm({ ...promoForm, alt: e.target.value })}
                  placeholder="Mô tả banner"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Liên kết</Label>
                <Input
                  value={promoForm.link}
                  onChange={(e) => setPromoForm({ ...promoForm, link: e.target.value })}
                  placeholder="/shop hoặc https://..."
                  className="mt-1.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPromoDialogOpen(false)}>Hủy</Button>
              <Button onClick={savePromoHandler}>
                {editingPromo ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ═══ Delete Confirmation ═══ */}
        <Dialog open={deletePromoId !== null} onOpenChange={() => setDeletePromoId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa banner?</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Hành động này không thể hoàn tác.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletePromoId(null)}>Hủy</Button>
              <Button
                variant="destructive"
                onClick={() => deletePromoId !== null && deletePromo(deletePromoId)}
              >
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ═══ Media Picker Dialog (shared) ═══ */}
      <Dialog open={mediaPickerOpen} onOpenChange={(open) => {
        setMediaPickerOpen(open);
        if (!open) stopCamera();
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" /> Chọn ảnh từ kho
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
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={mediaSearch} onChange={e => setMediaSearch(e.target.value)}
                    placeholder="Tìm ảnh..." className="pl-8 h-8 text-xs" />
                </div>
                <select value={mediaFilter} onChange={e => setMediaFilter(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                  <option value="all">Tất cả</option>
                  {mediaGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                {mediaLoading ? (
                  <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : filteredMedia.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground"><p className="text-sm">Không tìm thấy ảnh</p></div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 py-2">
                    {filteredMedia.map(f => (
                      <button key={f.filename} onClick={() => pickMediaImage(f.url)}
                        className="rounded-lg border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all text-left">
                        <div className="aspect-square bg-muted overflow-hidden">
                          <img src={f.url} alt={f.filename} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-1.5"><p className="text-[10px] font-medium truncate">{f.filename}</p></div>
                      </button>
                    ))}
                  </div>
                )}
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
              <div className="flex-1 flex flex-col justify-center min-h-[250px] border border-dashed rounded-xl p-6 bg-muted/10">
                {subUploadTab === "computer" && (
                  <div
                    className="flex flex-col items-center justify-center gap-3 cursor-pointer h-full py-12"
                    onClick={() => uploadFileInputRef.current?.click()}
                  >
                    <input
                      ref={uploadFileInputRef}
                      type="file"
                      accept="image/*"
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
                  <div className="max-w-md mx-auto w-full space-y-4 py-6">
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
                      <div className="h-[200px] w-full max-w-sm flex items-center justify-center bg-black rounded-lg">
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
                      <div className="flex flex-col items-center gap-2 py-6">
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
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBanners;
