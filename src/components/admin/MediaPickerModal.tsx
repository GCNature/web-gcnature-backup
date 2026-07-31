import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Check, Loader2, Search, HardDrive, RefreshCw } from "lucide-react";
import { apiGet } from "@/lib/api";
import { toast } from "sonner";

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export function MediaPickerModal({ open, onClose, onSelectImage }: MediaPickerModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await apiGet<any>(`/media/list?_t=${Date.now()}`);
      if (res && Array.isArray(res.files)) {
        const fileUrls = res.files.map((f: any) => {
          if (typeof f === 'string') return f;
          return f.url || (f.filename ? `/products/${f.filename}` : '');
        }).filter(Boolean);
        setImages(fileUrls);
      } else if (Array.isArray(res)) {
        const fileUrls = res.map((f: any) => {
          if (typeof f === 'string') return f;
          return f.url || (f.filename ? `/products/${f.filename}` : '');
        }).filter(Boolean);
        setImages(fileUrls);
      }
    } catch (err: any) {
      console.error('Failed to load media gallery:', err);
      toast.error("Lỗi kết nối kho ảnh: " + (err.message || 'Lỗi server'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedia();
      setSelectedUrl("");
    }
  }, [open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('images', file);
    formData.append('file', file);
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        console.error('[MediaUpload] Non-JSON response:', responseText);
        throw new Error(`Máy chủ trả về phản hồi HTML (${res.status}). Vui lòng kiểm tra dung lượng file.`);
      }

      if (res.ok && (data.success || data.url || data.fileUrl || data.files)) {
        const uploadedUrl = data.url || data.fileUrl || data.files?.[0]?.url;
        if (uploadedUrl) {
          toast.success("Đã tải ảnh từ máy tính lên thành công!");
          fetchMedia(); // Refresh media gallery
          onSelectImage(uploadedUrl);
          onClose();
        } else {
          toast.error("Tải ảnh thất bại: Không nhận được đường dẫn tệp");
        }
      } else {
        toast.error("Tải ảnh thất bại: " + (data.message || `Lỗi server (HTTP ${res.status})`));
      }
    } catch (err: any) {
      toast.error("Lỗi khi tải ảnh: " + (err.message || 'Lỗi kết nối'));
    } finally {
      setUploading(false);
    }
  };

  const filteredImages = images.filter((img) => 
    img.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ImageIcon className="w-5 h-5 text-primary" /> Kho Dữ Liệu Ảnh & Tải Ảnh Mới
          </DialogTitle>
          <DialogDescription>
            Tải ảnh trực tiếp từ máy tính hoặc chọn ảnh đã có trong Kho Dữ Liệu Media của hệ thống.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switchers */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={activeTab === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("upload")}
              className="gap-2"
            >
              <HardDrive className="w-4 h-4" /> Tải từ Máy Tính
            </Button>
            <Button
              type="button"
              variant={activeTab === "library" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("library")}
              className="gap-2"
            >
              <ImageIcon className="w-4 h-4" /> Kho Dữ Liệu Web ({images.length})
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchMedia}
            title="Làm mới kho ảnh"
            className="text-xs text-muted-foreground gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Làm mới
          </Button>
        </div>

        {/* Tab Content: Upload */}
        {activeTab === "upload" && (
          <div className="p-8 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center my-4 bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              {uploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Upload className="w-7 h-7" />}
            </div>
            <h4 className="font-semibold text-base mb-1">Kéo thả hoặc Nhấp để Tải Ảnh từ Máy Tính</h4>
            <p className="text-xs text-muted-foreground mb-4">Hỗ trợ các định dạng PNG, JPG, WEBP, SVG, GIF (Tối đa 100MB)</p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <span className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors">
                {uploading ? "Đang tải ảnh lên..." : "Chọn Tệp Từ Máy Tính"}
              </span>
            </label>
          </div>
        )}

        {/* Tab Content: Library */}
        {activeTab === "library" && (
          <div className="flex-1 flex flex-col min-h-[300px]">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm tên ảnh trong kho dữ liệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[350px] p-2 border border-border rounded-xl">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
                  <p>Chưa có ảnh trong kho dữ liệu.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {filteredImages.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedUrl(url)}
                      className={`group relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                        selectedUrl === url
                          ? "border-primary ring-2 ring-primary/40 scale-[0.98]"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <img
                        src={url}
                        alt="Media"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {selectedUrl === url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-border mt-auto">
          <p className="text-xs text-muted-foreground truncate max-w-[350px]">
            {selectedUrl ? `Đã chọn: ${selectedUrl}` : "Hãy chọn 1 ảnh hoặc tải từ máy tính..."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              disabled={!selectedUrl}
              onClick={() => {
                if (selectedUrl) {
                  onSelectImage(selectedUrl);
                  onClose();
                }
              }}
              className="bg-primary text-primary-foreground font-semibold"
            >
              Xác Nhận Chọn Ảnh
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
