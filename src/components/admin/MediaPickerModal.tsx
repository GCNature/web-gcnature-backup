import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FolderOpen, Search, Loader2, Link2, Camera, Sparkles } from "lucide-react";
import { API_BASE, apiGet } from "@/lib/api";
import { toast } from "sonner";

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export function MediaPickerModal({ open, onClose, onSelectImage }: MediaPickerModalProps) {
  const [activeUploadMode, setActiveUploadMode] = useState<"library" | "upload">("upload");
  const [subUploadTab, setSubUploadTab] = useState<"computer" | "url" | "camera">("computer");
  
  // Library state
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [mediaGroups, setMediaGroups] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  // URL state
  const [pastedUrl, setPastedUrl] = useState("");
  const [downloadingUrl, setDownloadingUrl] = useState(false);

  // Camera state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadMedia = async () => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/media/list?_t=${Date.now()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setMediaFiles(data.files || []);
        setMediaGroups(data.groups || []);
      }
    } catch (err) {
      console.error("Failed to load media gallery:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadMedia();
      setPastedUrl("");
    } else {
      stopCamera();
    }
  }, [open]);

  const handleUploadFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setMediaLoading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));

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

      toast.success(resData.message || "Tải ảnh lên thành công");
      await loadMedia();

      if (resData.files && resData.files.length > 0) {
        onSelectImage(resData.files[0].url);
        onClose();
      } else if (resData.url || resData.fileUrl) {
        onSelectImage(resData.url || resData.fileUrl);
        onClose();
      } else {
        setActiveUploadMode("library");
      }
    } catch (err: any) {
      toast.error("Lỗi khi tải ảnh lên. Vui lòng kiểm tra dung lượng.");
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
        "Content-Type": "application/json",
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
      await loadMedia();

      if (resData.file?.url) {
        onSelectImage(resData.file.url);
        onClose();
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
        cameraStream.getTracks().forEach((t) => t.stop());
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
      cameraStream.getTracks().forEach((t) => t.stop());
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

  const filteredMedia = mediaFiles.filter((f) => {
    if (mediaFilter !== "all" && f.group !== mediaFilter) return false;
    if (mediaSearch && !f.filename.toLowerCase().includes(mediaSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) { stopCamera(); onClose(); } }}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" /> Chọn media thay thế
          </DialogTitle>
        </DialogHeader>

        {/* Modes Navigation */}
        <div className="flex border-b border-border mb-3">
          <button
            type="button"
            onClick={() => { setActiveUploadMode("library"); stopCamera(); }}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeUploadMode === "library" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Chọn từ kho ảnh
          </button>
          <button
            type="button"
            onClick={() => setActiveUploadMode("upload")}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeUploadMode === "upload" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Tải ảnh mới (3 cách)
          </button>
        </div>

        {/* ═══ Mode 1: Library ═══ */}
        {activeUploadMode === "library" && (
          <>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  placeholder="Tìm tên ảnh..."
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <select
                value={mediaFilter}
                onChange={(e) => setMediaFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="all">Tất cả ({mediaFiles.length})</option>
                {mediaGroups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[300px] border border-border rounded-xl p-2">
              {mediaLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p className="text-sm">Không tìm thấy ảnh trong kho</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {filteredMedia.map((f) => (
                    <button
                      key={f.filename}
                      type="button"
                      onClick={() => {
                        onSelectImage(f.url);
                        onClose();
                      }}
                      className="rounded-lg border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all text-left group"
                    >
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img src={f.url} alt={f.filename} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-1.5 bg-card">
                        <p className="text-[10px] font-medium truncate text-foreground">{f.filename}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══ Mode 2: Upload (3 Ways) ═══ */}
        {activeUploadMode === "upload" && (
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-[300px]">
            {/* Sub Tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
              <button
                type="button"
                onClick={() => { setSubUploadTab("computer"); stopCamera(); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  subUploadTab === "computer" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Từ máy tính
              </button>
              <button
                type="button"
                onClick={() => { setSubUploadTab("url"); stopCamera(); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  subUploadTab === "url" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link2 className="w-3.5 h-3.5 inline mr-1" />
                Dán link ảnh
              </button>
              <button
                type="button"
                onClick={() => { setSubUploadTab("camera"); startCamera(); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  subUploadTab === "camera" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Camera className="w-3.5 h-3.5 inline mr-1" />
                Chụp từ Camera
              </button>
            </div>

            {/* Panel 1: Computer file click upload */}
            {subUploadTab === "computer" && (
              <div
                className="flex-1 flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[250px] border-2 border-dashed border-border rounded-xl p-6 bg-muted/10 hover:bg-muted/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleUploadFiles(Array.from(e.target.files));
                    }
                  }}
                />
                {mediaLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                ) : (
                  <Upload className="w-12 h-12 text-muted-foreground/60" />
                )}
                <div className="text-center">
                  <p className="text-sm font-semibold">Nhấp để chọn tệp từ máy tính</p>
                  <p className="text-xs text-muted-foreground mt-1">Hỗ trợ các định dạng JPG, PNG, WEBP, GIF (Tối đa 100MB)</p>
                </div>
              </div>
            )}

            {/* Panel 2: Paste URL */}
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
                  Tải về & Lưu vào kho ảnh
                </Button>
              </div>
            )}

            {/* Panel 3: Camera */}
            {subUploadTab === "camera" && (
              <div className="flex flex-col items-center justify-center gap-3 py-4">
                {cameraLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  </div>
                )}
                <Button onClick={capturePhoto} className="gap-2 bg-primary text-white">
                  <Camera className="w-4 h-4" /> Chụp & Chọn Ảnh
                </Button>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="pt-2 border-t border-border">
          <Button variant="outline" onClick={() => { stopCamera(); onClose(); }}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
