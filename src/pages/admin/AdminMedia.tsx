import { useState, useEffect, useRef, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  FolderOpen, Search, Upload, Trash2, Copy, Pencil, Eye, Loader2,
  Image as ImageIcon, HardDrive, CheckSquare, Square, X, Filter,
  Play, Film, Camera, Link2,
} from "lucide-react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  modified: string;
  group: string;
  type: 'image' | 'video';
}

const VIDEO_EXTS = /\.(mp4|webm|mov|avi|mkv)$/i;
function isVideo(filename: string) { return VIDEO_EXTS.test(filename); }

interface MediaListResponse {
  files: MediaFile[];
  groups: string[];
  stats: { totalFiles: number; totalSize: number };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getToken() { return localStorage.getItem("token"); }
function authHeaders(): Record<string, string> {
  const t = getToken();
  const h: Record<string, string> = {};
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
}

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  // Dialogs
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [renameFile, setRenameFile] = useState<MediaFile | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteFile, setDeleteFile] = useState<MediaFile | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Three way upload state inside media upload dialog
  const [subUploadTab, setSubUploadTab] = useState<"computer" | "url" | "camera">("computer");
  const [pastedUrl, setPastedUrl] = useState("");
  const [downloadingUrl, setDownloadingUrl] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Bulk move state
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const [newGroupValue, setNewGroupValue] = useState("");
  const [moving, setMoving] = useState(false);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/media/list`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Lỗi tải danh sách");
      const data: MediaListResponse = await res.json();
      setFiles(data.files);
      setGroups(data.groups);
      setStats(data.stats);
    } catch (e: any) {
      toast.error(e.message || "Lỗi tải danh sách ảnh");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  // Filtered files
  const filtered = files.filter(f => {
    if (filterGroup !== "all" && f.group !== filterGroup) return false;
    if (search && !f.filename.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Group filtered files
  const groupedFiles = new Map<string, MediaFile[]>();
  filtered.forEach(f => {
    if (!groupedFiles.has(f.group)) groupedFiles.set(f.group, []);
    groupedFiles.get(f.group)!.push(f);
  });

  // Select helpers
  const selectAll = () => {
    setSelected(new Set(filtered.map(f => f.filename)));
  };
  const deselectAll = () => setSelected(new Set());
  const toggleSelectGroup = (group: string) => {
    const groupFiles = filtered.filter(f => f.group === group).map(f => f.filename);
    const allSelected = groupFiles.every(fn => selected.has(fn));
    const s = new Set(selected);
    if (allSelected) { groupFiles.forEach(fn => s.delete(fn)); } else { groupFiles.forEach(fn => s.add(fn)); }
    setSelected(s);
  };
  const isGroupSelected = (group: string) => {
    const groupFiles = filtered.filter(f => f.group === group).map(f => f.filename);
    return groupFiles.length > 0 && groupFiles.every(fn => selected.has(fn));
  };

  // Upload handler
  const handleUpload = async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList);
    if (arr.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      arr.forEach(f => formData.append("images", f));
      // Don't set Content-Type manually — browser adds multipart boundary automatically
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: "POST", body: formData, headers,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Upload thất bại' }));
        throw new Error(err.message);
      }
      const data = await res.json();
      toast.success(data.message);
      setUploadOpen(false);
      loadFiles();
    } catch (e: any) {
      toast.error(e.message || "Lỗi upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadUrl = async () => {
    if (!pastedUrl.trim()) return;
    setDownloadingUrl(true);
    try {
      const token = getToken();
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
      setUploadOpen(false);
      loadFiles();
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
      await handleUpload([file]);
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  // Rename handler
  const handleRename = async () => {
    if (!renameFile || !renameValue.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/media/rename`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ oldName: renameFile.filename, newName: renameValue.trim() }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      toast.success("Đã đổi tên thành công");
      setRenameFile(null);
      loadFiles();
    } catch (e: any) {
      toast.error(e.message || "Lỗi đổi tên");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (filename: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/media/delete/${encodeURIComponent(filename)}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Lỗi xóa");
      toast.success("Đã xóa ảnh");
      setDeleteFile(null);
      setPreviewFile(null);
      loadFiles();
    } catch (e: any) {
      toast.error(e.message || "Lỗi xóa file");
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/media/bulk-delete`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Lỗi xóa");
      const data = await res.json();
      toast.success(data.message);
      setSelected(new Set());
      setSelectMode(false);
      setBulkDeleteOpen(false);
      loadFiles();
    } catch (e: any) {
      toast.error(e.message || "Lỗi xóa");
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk Move handler
  const handleBulkMove = async () => {
    if (!newGroupValue.trim()) {
      toast.error("Vui lòng nhập tên nhóm mới");
      return;
    }
    setMoving(true);
    try {
      const res = await fetch(`${API_BASE}/media/bulk-move`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filenames: Array.from(selected),
          newGroup: newGroupValue.trim(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Di chuyển thất bại" }));
        throw new Error(err.message);
      }
      const data = await res.json();
      toast.success(data.message);
      setBulkMoveOpen(false);
      setNewGroupValue("");
      setSelected(new Set());
      setSelectMode(false);
      loadFiles();
    } catch (e: any) {
      toast.error(e.message || "Lỗi di chuyển nhóm");
    } finally {
      setMoving(false);
    }
  };

  // Copy path
  const copyPath = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Đã copy đường dẫn!");
  };

  // Toggle select
  const toggleSelect = (filename: string) => {
    const s = new Set(selected);
    if (s.has(filename)) s.delete(filename); else s.add(filename);
    setSelected(s);
  };

  // Drop handler for upload zone
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (droppedFiles.length > 0) handleUpload(droppedFiles);
  };

  return (
    <AdminLayout title="Kho ảnh sản phẩm">
      <div className="space-y-4 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-primary" /> Kho Media sản phẩm
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý ảnh & video trong <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/products/</code>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {selectMode && (
              <>
                {selected.size > 0 && (
                  <>
                    <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)} className="gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> Xóa {selected.size} ảnh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setNewGroupValue(""); setBulkMoveOpen(true); }} className="gap-1.5 border-primary/40 text-primary hover:bg-primary/5">
                      <FolderOpen className="w-3.5 h-3.5" /> Di chuyển nhóm ({selected.size})
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm"
                  onClick={selected.size === filtered.length ? deselectAll : selectAll}
                  className="gap-1.5">
                  {selected.size === filtered.length ? (
                    <><X className="w-3.5 h-3.5" /> Bỏ chọn tất cả</>
                  ) : (
                    <><CheckSquare className="w-3.5 h-3.5" /> Chọn tất cả ({filtered.length})</>
                  )}
                </Button>
              </>
            )}
            <Button variant={selectMode ? "secondary" : "outline"} size="sm"
              onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}
              className="gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" /> {selectMode ? "Thoát chọn" : "Chọn nhiều"}
            </Button>
            <Button onClick={() => setUploadOpen(true)} className="gap-1.5">
              <Upload className="w-4 h-4" /> Tải lên
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border"><CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Tổng media</p>
            <p className="text-xl font-bold text-foreground">{stats.totalFiles}</p>
          </CardContent></Card>
          <Card className="border-border"><CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Dung lượng</p>
            <p className="text-xl font-bold text-foreground">{formatBytes(stats.totalSize)}</p>
          </CardContent></Card>
          <Card className="border-border"><CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Nhóm SKU</p>
            <p className="text-xl font-bold text-foreground">{groups.length}</p>
          </CardContent></Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên file..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="all">Tất cả nhóm ({files.length})</option>
              {groups.map(g => {
                const count = files.filter(f => f.group === g).length;
                return <option key={g} value={g}>{g} ({count})</option>;
              })}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-16 text-center text-muted-foreground">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Không tìm thấy ảnh nào</p>
            <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc tải ảnh mới lên</p>
            <Button onClick={() => setUploadOpen(true)} variant="outline" className="mt-4 gap-1.5">
              <Upload className="w-4 h-4" /> Tải ảnh lên
            </Button>
          </CardContent></Card>
        ) : (
          <div className="space-y-6">
            {Array.from(groupedFiles.entries()).map(([group, groupFiles]) => (
              <Card key={group} className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    {selectMode && (
                      <button
                        onClick={() => toggleSelectGroup(group)}
                        className="p-0 shrink-0 transition-transform hover:scale-110"
                        title={isGroupSelected(group) ? "Bỏ chọn nhóm" : "Chọn cả nhóm"}
                      >
                        {isGroupSelected(group)
                          ? <CheckSquare className="w-4.5 h-4.5 text-primary" />
                          : <Square className="w-4.5 h-4.5 text-muted-foreground hover:text-primary" />}
                      </button>
                    )}
                    <FolderOpen className="w-4 h-4 text-primary" />
                    {group}
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {groupFiles.length} file
                      {selectMode && (() => {
                        const cnt = groupFiles.filter(f => selected.has(f.filename)).length;
                        return cnt > 0 ? ` • đã chọn ${cnt}` : '';
                      })()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {groupFiles.map(file => (
                      <div key={file.filename}
                        className={`group relative rounded-xl border overflow-hidden transition-all hover:shadow-md cursor-pointer ${
                          selected.has(file.filename) ? "ring-2 ring-primary border-primary" : "border-border hover:border-primary/40"
                        }`}
                        onClick={() => selectMode ? toggleSelect(file.filename) : setPreviewFile(file)}>
                        {/* Select checkbox — always visible in select mode */}
                        {selectMode && (
                          <div className="absolute top-2 left-2 z-10 cursor-pointer" onClick={e => { e.stopPropagation(); toggleSelect(file.filename); }}>
                            {selected.has(file.filename)
                              ? <CheckSquare className="w-5 h-5 text-primary drop-shadow-md" />
                              : <Square className="w-5 h-5 text-white/80 drop-shadow-md hover:text-primary transition-colors" />}
                          </div>
                        )}
                        {/* Thumbnail */}
                        <div className="aspect-square bg-muted/50 flex items-center justify-center overflow-hidden relative">
                          {file.type === 'video' ? (
                            <>
                              <video src={file.url} className="w-full h-full object-cover" muted preload="metadata" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow">
                                  <Play className="w-4 h-4 text-gray-800 ml-0.5" />
                                </div>
                              </div>
                              <div className="absolute top-1.5 left-1.5">
                                <span className="text-[9px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded">VIDEO</span>
                              </div>
                            </>
                          ) : (
                            <img src={file.url} alt={file.filename} loading="lazy"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-2 bg-background">
                          <p className="text-xs font-medium truncate text-foreground" title={file.filename}>
                            {file.filename}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{formatBytes(file.size)}</p>
                        </div>
                        {/* Hover actions */}
                        {!selectMode && (
                          <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={e => { e.stopPropagation(); copyPath(file.url); }}
                              className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition" title="Copy path">
                              <Copy className="w-3 h-3" />
                            </button>
                            <button onClick={e => { e.stopPropagation(); setRenameFile(file); setRenameValue(file.filename); }}
                              className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition" title="Đổi tên">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={e => { e.stopPropagation(); setDeleteFile(file); }}
                              className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-700 transition" title="Xóa">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Upload Dialog ═══ */}
      <Dialog open={uploadOpen} onOpenChange={(open) => {
        setUploadOpen(open);
        if (!open) stopCamera();
      }}>
        <DialogContent className="max-w-lg flex flex-col max-h-[85vh]">
          <DialogHeader><DialogTitle>Tải ảnh & video lên kho sản phẩm</DialogTitle></DialogHeader>

          {/* Upload modes switch tabs */}
          <div className="flex border-b border-border mb-3">
            <button
              onClick={() => { setSubUploadTab("computer"); stopCamera(); }}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                subUploadTab === "computer" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Từ máy tính
            </button>
            <button
              onClick={() => { setSubUploadTab("url"); stopCamera(); }}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                subUploadTab === "url" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Dán link ảnh
            </button>
            <button
              onClick={() => { setSubUploadTab("camera"); startCamera(); }}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${
                subUploadTab === "camera" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Chụp từ Camera
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[250px] border border-dashed rounded-xl p-6 bg-muted/10">
            {subUploadTab === "computer" && (
              <div className={`text-center cursor-pointer h-full py-8 ${dragOver ? "bg-primary/5 border-primary" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden"
                  onChange={e => { if (e.target.files) handleUpload(e.target.files); }} />
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Đang tải lên...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-10 w-10 text-muted-foreground/50" />
                    <div>
                      <p className="text-sm"><span className="font-semibold text-primary">Nhấn để chọn file</span> hoặc kéo thả vào đây</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP, MP4, WEBM, MOV • Tối đa 100MB • Nhiều file cùng lúc</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {subUploadTab === "url" && (
              <div className="max-w-md mx-auto w-full space-y-4 py-4">
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
        </DialogContent>
      </Dialog>

      {/* ═══ Preview Dialog ═══ */}
      <Dialog open={previewFile !== null} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-2xl">
          {previewFile && (<>
            <DialogHeader><DialogTitle className="truncate pr-8">{previewFile.filename}</DialogTitle></DialogHeader>
            <div className="rounded-xl overflow-hidden border border-border bg-muted/30">
              {previewFile.type === 'video' ? (
                <video src={previewFile.url} controls className="w-full max-h-[60vh]" autoPlay muted />
              ) : (
                <img src={previewFile.url} alt={previewFile.filename} className="w-full max-h-[60vh] object-contain" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Đường dẫn:</span>
                <code className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">{previewFile.url}</code>
              </div>
              <div><span className="text-muted-foreground">Kích thước:</span>
                <span className="ml-1 font-medium">{formatBytes(previewFile.size)}</span>
              </div>
              <div><span className="text-muted-foreground">Nhóm:</span>
                <span className="ml-1 font-medium">{previewFile.group}</span>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => copyPath(previewFile.url)} className="gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy path
              </Button>
              <Button variant="outline" onClick={() => { setRenameFile(previewFile); setRenameValue(previewFile.filename); setPreviewFile(null); }} className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" /> Đổi tên
              </Button>
              <Button variant="destructive" onClick={() => { setDeleteFile(previewFile); setPreviewFile(null); }} className="gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Xóa
              </Button>
            </DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>

      {/* ═══ Rename Dialog ═══ */}
      <Dialog open={renameFile !== null} onOpenChange={() => setRenameFile(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Đổi tên file</DialogTitle></DialogHeader>
          {renameFile && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                  {renameFile.type === 'video' ? (
                    <video src={renameFile.url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={renameFile.url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Tên cũ:</p>
                  <p className="font-mono text-xs">{renameFile.filename}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Tên mới</Label>
                <Input value={renameValue} onChange={e => setRenameValue(e.target.value)} className="mt-1.5 font-mono text-sm" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameFile(null)}>Hủy</Button>
            <Button onClick={handleRename} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null} Đổi tên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete Dialog ═══ */}
      <Dialog open={deleteFile !== null} onOpenChange={() => setDeleteFile(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Xác nhận xóa?</DialogTitle></DialogHeader>
          {deleteFile && (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                {deleteFile.type === 'video' ? (
                  <video src={deleteFile.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={deleteFile.url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{deleteFile.filename}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(deleteFile.size)}</p>
                <p className="text-xs text-destructive mt-1">Hành động này không thể hoàn tác</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFile(null)}>Hủy</Button>
            <Button variant="destructive" onClick={() => deleteFile && handleDelete(deleteFile.filename)} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null} Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Bulk Delete Dialog ═══ */}
      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Xóa {selected.size} ảnh đã chọn?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Hành động này sẽ xóa vĩnh viễn {selected.size} ảnh và không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleBulkDelete} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null} Xóa {selected.size} ảnh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ═══ Bulk Move Dialog ═══ */}
      <Dialog open={bulkMoveOpen} onOpenChange={setBulkMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Di chuyển {selected.size} ảnh sang nhóm khác</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              Nhóm/SKU sẽ được đổi tên tương ứng ở đầu tên file. Hệ thống sẽ tự động thêm số thứ tự để tránh trùng lặp.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tên nhóm mới (ví dụ: TCPHD, BD1, ...)</Label>
              <Input
                value={newGroupValue}
                onChange={e => setNewGroupValue(e.target.value)}
                placeholder="Nhập tên nhóm/SKU mới..."
                className="text-sm font-mono"
              />
            </div>
            {groups.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground block font-medium">Hoặc chọn nhanh từ nhóm có sẵn:</span>
                <div className="flex flex-wrap gap-1.5">
                  {groups.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewGroupValue(g)}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-muted hover:bg-primary/10 hover:text-primary transition"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkMoveOpen(false)}>Hủy</Button>
            <Button onClick={handleBulkMove} disabled={moving || !newGroupValue.trim()} className="gap-1.5">
              {moving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-3.5 h-3.5" />}
              Xác nhận di chuyển
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
