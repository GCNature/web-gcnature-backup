/**
 * ImagePicker — reusable admin image selector
 *
 * Combines three ways to set an image URL in admin forms:
 *  1. Type/paste a URL directly
 *  2. Drag-and-drop or click-to-upload a new image (uses banners upload endpoint)
 *  3. Pick from the existing media library (banners + product images)
 *
 * Designed to drop into any admin dialog where an image URL field exists.
 */
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, Loader2, Image as ImageIcon, FolderOpen, Search, Check } from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  modified: string;
  group?: string;
  type?: "image" | "video";
}

interface BannerFile {
  filename: string;
  url: string;
  size: number;
  modified: string;
}

interface Props {
  value: string;
  onChange: (url: string) => void;
  /** Label shown above the URL input. Defaults to "Ảnh" */
  label?: string;
  /** Helper text under the field */
  hint?: string;
}

export const ImagePicker = ({ value, onChange, label = "Ảnh", hint }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState<"banners" | "products">("banners");
  const [bannerFiles, setBannerFiles] = useState<BannerFile[]>([]);
  const [productFiles, setProductFiles] = useState<MediaFile[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* ──────────── Upload (uses /api/banners/upload) ──────────── */
  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File quá lớn (tối đa 10MB)");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ hỗ trợ file ảnh");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_BASE}/banners/upload`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.url);
      toast.success("Đã tải ảnh lên");
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
    if (file) handleUpload(file);
  };

  /* ──────────── Library loading ──────────── */
  const loadLibrary = async () => {
    setLibraryLoading(true);
    const token = localStorage.getItem("token") || "";
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    try {
      const [bannerRes, productRes] = await Promise.all([
        fetch(`${API_BASE}/banners/list`, { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/media/list`, { headers }).then((r) => (r.ok ? r.json() : { files: [] })),
      ]);
      setBannerFiles(Array.isArray(bannerRes) ? bannerRes : []);
      setProductFiles(Array.isArray(productRes?.files) ? productRes.files.filter((f: MediaFile) => f.type === "image") : []);
    } catch (e) {
      toast.error("Không tải được kho ảnh");
    } finally {
      setLibraryLoading(false);
    }
  };

  useEffect(() => {
    if (libraryOpen) loadLibrary();
  }, [libraryOpen]);

  const visibleFiles = (libraryTab === "banners" ? bannerFiles : productFiles).filter((f) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return f.filename.toLowerCase().includes(q);
  });

  const choose = (url: string) => {
    onChange(url);
    setLibraryOpen(false);
    toast.success("Đã chọn ảnh");
  };

  /* ──────────── Render ──────────── */
  return (
    <div className="space-y-3">
      {label && <Label className="font-semibold">{label}</Label>}

      {/* Preview */}
      {value && (
        <div className="rounded-lg overflow-hidden border border-border bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-48 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          />
        </div>
      )}

      {/* Action buttons row */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`relative border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
            dragOver ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-red-300 hover:bg-red-50/50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
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
            <div className="flex flex-col items-center gap-1.5 py-1">
              <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
              <p className="text-xs text-gray-600">Đang tải lên...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <Upload className="h-5 w-5 text-gray-500" />
              <p className="text-xs text-gray-700">
                <span className="font-semibold text-red-600">Tải lên</span> hoặc kéo thả
              </p>
              <p className="text-[10px] text-gray-400">PNG/JPG/WEBP, ≤10MB</p>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="border-2 border-dashed border-gray-300 hover:border-red-300 hover:bg-red-50/50 rounded-lg p-3 text-center transition-colors"
        >
          <div className="flex flex-col items-center gap-1.5 py-1">
            <FolderOpen className="h-5 w-5 text-gray-500" />
            <p className="text-xs text-gray-700">
              <span className="font-semibold text-red-600">Chọn từ kho</span> ảnh
            </p>
            <p className="text-[10px] text-gray-400">Banner & sản phẩm có sẵn</p>
          </div>
        </button>
      </div>

      {/* URL input fallback */}
      <div>
        <Label className="text-xs text-gray-500">Hoặc nhập URL ảnh</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/banners/banner/1.png hoặc https://..."
          className="mt-1 font-mono text-xs"
        />
        {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
      </div>

      {/* ═══ Library Picker Dialog ═══ */}
      <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> Kho ảnh
            </DialogTitle>
          </DialogHeader>

          {/* Tabs + search */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-border pb-3">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setLibraryTab("banners")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  libraryTab === "banners" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                Banner & ảnh đã upload ({bannerFiles.length})
              </button>
              <button
                type="button"
                onClick={() => setLibraryTab("products")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  libraryTab === "products" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                Ảnh sản phẩm ({productFiles.length})
              </button>
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên file..."
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto py-3">
            {libraryLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : visibleFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                {search ? "Không tìm thấy ảnh phù hợp" : "Chưa có ảnh nào trong kho"}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {visibleFiles.map((f) => {
                  const isSelected = value === f.url;
                  return (
                    <button
                      key={f.url}
                      type="button"
                      onClick={() => choose(f.url)}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected ? "border-red-500 ring-2 ring-red-100" : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <img
                        src={f.url}
                        alt={f.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white truncate font-mono">{f.filename}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-3 mt-1">
            <Button variant="outline" onClick={() => setLibraryOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImagePicker;
