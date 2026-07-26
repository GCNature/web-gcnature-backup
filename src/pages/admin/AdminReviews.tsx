import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, User, Video, Link, Users, Sparkles, Loader2, Play, Film, Folder, Upload, Image as ImageIcon } from "lucide-react";

interface KOLVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail?: string;
}

interface KOLInfo {
  id: string;
  tiktokUrl: string;
  channelName: string;
  followers: string;
  specialty: string;
  avatarUrl?: string;
  coverUrl?: string;
  videos: KOLVideo[];
}

export default function AdminReviews() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kols, setKols] = useState<KOLInfo[]>([]);

  // Temp state for adding a video to a specific KOL
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [loadingVideo, setLoadingVideo] = useState<Record<string, boolean>>({});

  // Media Library Selection State
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [activeKolForLibrary, setActiveKolForLibrary] = useState<string | null>(null);
  const [libraryType, setLibraryType] = useState<'avatar' | 'cover'>('avatar');
  const [libraryFiles, setLibraryFiles] = useState<{ filename: string; url: string }[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const response = await fetch('/api/settings', { headers });
        const data = await response.json();
        if (data.page_reviews) {
          const parsed = JSON.parse(data.page_reviews);
          const rawKols = parsed.kols;
          const cleanKols = (Array.isArray(rawKols) ? rawKols : []).map((k: any) => ({
            id: String(k.id || Date.now() + Math.random()),
            tiktokUrl: String(k.tiktokUrl || ""),
            channelName: String(k.channelName || "KOL"),
            followers: String(k.followers || "0"),
            specialty: String(k.specialty || ""),
            avatarUrl: k.avatarUrl ? String(k.avatarUrl) : undefined,
            coverUrl: k.coverUrl ? String(k.coverUrl) : undefined,
            videos: Array.isArray(k.videos) ? k.videos.map((v: any) => ({
              id: String(v.id || Date.now() + Math.random()),
              videoId: String(v.videoId || ""),
              title: String(v.title || "Video"),
              thumbnail: v.thumbnail ? String(v.thumbnail) : undefined
            })) : []
          }));
          setKols(cleanKols);
        }
      } catch (error) {
        console.error('Load reviews data error:', error);
        toast.error("Không thể tải cấu hình góc review");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (kols.length > 4) {
      toast.error("Tối đa 4 KOLs được hiển thị ở góc review");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: "Góc review",
        desc: "Đánh giá chân thực về mỹ phẩm GCnature từ các nhà sáng tạo nội dung và KOLs uy tín.",
        kols
      };

      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          page_reviews: JSON.stringify(payload)
        })
      });

      if (response.ok) {
        toast.success("Lưu dữ liệu góc review thành công!");
      } else {
        toast.error("Gặp sự cố khi lưu dữ liệu");
      }
    } catch (err) {
      toast.error("Không thể kết nối máy chủ");
    } finally {
      setSaving(false);
    }
  };

  const handleAddKol = () => {
    if (kols.length >= 4) {
      toast.error("Bạn chỉ được cấu hình tối đa 4 KOLs");
      return;
    }
    const newId = String(Date.now());
    setKols(prev => [
      ...prev,
      {
        id: newId,
        tiktokUrl: "",
        channelName: "KOL mới",
        followers: "100K",
        specialty: "Beauty & Review",
        avatarUrl: "",
        coverUrl: "",
        videos: []
      }
    ]);
  };

  const handleRemoveKol = (id: string) => {
    setKols(prev => prev.filter(k => k.id !== id));
  };

  const handleKolChange = (id: string, field: keyof KOLInfo, value: string) => {
    setKols(prev => prev.map(k => k.id === id ? { ...k, [field]: value } : k));
  };

  const handleMoveKol = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= kols.length) return;
    
    setKols(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  // Upload Avatar
  const handleUploadAvatar = async (kolId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh quá lớn (tối đa 5MB)");
      return;
    }

    const token = localStorage.getItem("token") || "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append("images", file);

    try {
      toast.loading("Đang tải ảnh đại diện...", { id: "upload-avatar" });
      const res = await fetch('/api/media/upload', {
        method: "POST",
        body: formData,
        headers
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const resData = await res.json();
      const uploadedUrl = resData.files?.[0]?.url;
      if (uploadedUrl) {
        handleKolChange(kolId, 'avatarUrl', uploadedUrl);
        toast.success("Tải ảnh đại diện lên thành công!", { id: "upload-avatar" });
      } else {
        toast.error("Không nhận được URL ảnh từ server", { id: "upload-avatar" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải ảnh đại diện", { id: "upload-avatar" });
    }
  };

  // Upload Cover Image
  const handleUploadCover = async (kolId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Ảnh bìa quá lớn (tối đa 8MB)");
      return;
    }

    const token = localStorage.getItem("token") || "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append("images", file);

    try {
      toast.loading("Đang tải ảnh bìa...", { id: "upload-cover" });
      const res = await fetch('/api/media/upload', {
        method: "POST",
        body: formData,
        headers
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const resData = await res.json();
      const uploadedUrl = resData.files?.[0]?.url;
      if (uploadedUrl) {
        handleKolChange(kolId, 'coverUrl', uploadedUrl);
        toast.success("Tải ảnh bìa lên thành công!", { id: "upload-cover" });
      } else {
        toast.error("Không nhận được URL ảnh từ server", { id: "upload-cover" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải ảnh bìa", { id: "upload-cover" });
    }
  };

  // Open Media Library Modal
  const handleOpenLibrary = async (kolId: string, type: 'avatar' | 'cover') => {
    setActiveKolForLibrary(kolId);
    setLibraryType(type);
    setLibraryOpen(true);
    setLoadingLibrary(true);
    try {
      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch('/api/media/list', { headers });
      if (res.ok) {
        const data = await res.json();
        const imagesOnly = (data.files || []).filter((f: any) => f.type === 'image');
        setLibraryFiles(imagesOnly);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách ảnh từ thư viện");
    } finally {
      setLoadingLibrary(false);
    }
  };

  // Helper to extract or resolve video link
  const handleAddVideoLink = async (kolId: string) => {
    const rawUrl = videoUrls[kolId] || "";
    if (!rawUrl.trim()) return;

    setLoadingVideo(prev => ({ ...prev, [kolId]: true }));
    try {
      let videoId = "";
      const match = rawUrl.match(/\/video\/(\d+)/);
      if (match) {
        videoId = match[1];
      } else if (rawUrl.includes("tiktok.com")) {
        const res = await fetch('/api/tiktok/resolve-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: rawUrl.trim() })
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.type === 'video' && resData.videoId) {
            videoId = resData.videoId;
          }
        }
      }

      if (!videoId) {
        if (/^\d+$/.test(rawUrl.trim())) {
          videoId = rawUrl.trim();
        } else {
          toast.error("Không nhận diện được link video TikTok này. Hãy copy link video đầy đủ.");
          setLoadingVideo(prev => ({ ...prev, [kolId]: false }));
          return;
        }
      }

      const oembedRes = await fetch(`/api/tiktok/oembed/${videoId}`);
      let title = `Video TikTok #${videoId}`;
      let thumbnail = "";

      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        title = oembedData.title || title;
        thumbnail = oembedData.thumbnail_url || "";
      }

      const newVideo: KOLVideo = {
        id: String(Date.now()),
        videoId,
        title,
        thumbnail
      };

      setKols(prev => prev.map(k => {
        if (k.id === kolId) {
          return {
            ...k,
            videos: [...(k.videos || []), newVideo]
          };
        }
        return k;
      }));

      setVideoUrls(prev => ({ ...prev, [kolId]: "" }));
      toast.success("Đã nạp video và tải thumbnail tự động!");

    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi nạp link video");
    } finally {
      setLoadingVideo(prev => ({ ...prev, [kolId]: false }));
    }
  };

  const handleRemoveVideo = (kolId: string, videoId: string) => {
    setKols(prev => prev.map(k => {
      if (k.id === kolId) {
        return {
          ...k,
          videos: (k.videos || []).filter(v => v.id !== videoId)
        };
      }
      return k;
    }));
  };

  const handleMoveVideo = (kolId: string, index: number, direction: 'up' | 'down') => {
    setKols(prev => prev.map(k => {
      if (k.id === kolId) {
        const updatedVideos = [...(k.videos || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < updatedVideos.length) {
          const temp = updatedVideos[index];
          updatedVideos[index] = updatedVideos[targetIndex];
          updatedVideos[targetIndex] = temp;
        }
        return { ...k, videos: updatedVideos };
      }
      return k;
    }));
  };

  return (
    <AdminLayout title="Góc Review">
      <div className="max-w-5xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-teal-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý Góc Review (KOLs & Clips)</h1>
              <p className="text-xs text-gray-500">Cấu hình hiển thị danh sách KOLs và các video review trên trang chủ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddKol}
              disabled={kols.length >= 4}
              variant="outline"
              className="border-dashed border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm KOL mới ({kols.length}/4)
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-teal-600 hover:bg-teal-700 font-bold"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Đang tải dữ liệu góc review...</div>
        ) : kols.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed text-gray-500 space-y-3">
            <Video className="w-12 h-12 text-gray-300 mx-auto" />
            <p>Chưa có KOL nào được cấu hình. Hãy bấm nút "Thêm KOL mới" để bắt đầu.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {kols.map((kol, idx) => (
              <Card key={kol.id} className="border border-gray-200/80 hover:shadow-md transition-shadow duration-300 relative group overflow-hidden">
                
                {/* Reorder/Delete KOL Controls */}
                <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 p-1 rounded-lg border shadow-sm">
                  <Button onClick={() => handleMoveKol(idx, 'up')} disabled={idx === 0} variant="ghost" size="icon" className="h-7 w-7"><ArrowUp className="w-3.5 h-3.5" /></Button>
                  <Button onClick={() => handleMoveKol(idx, 'down')} disabled={idx === kols.length - 1} variant="ghost" size="icon" className="h-7 w-7"><ArrowDown className="w-3.5 h-3.5" /></Button>
                  <Button onClick={() => handleRemoveKol(kol.id)} variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>

                <div className="bg-teal-50/20 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <h3 className="font-bold text-gray-900">Thông tin KOL: {kol.channelName}</h3>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Left Column Fields: Avatar, TikTok URL, Name, Followers, Specialty */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    
                    {/* Channel name, link, Avatar URL & Cover URL */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase"><User className="w-3.5 h-3.5 text-teal-600" /> Tên kênh TikTok</Label>
                        <Input
                          value={kol.channelName}
                          onChange={(e) => handleKolChange(kol.id, 'channelName', e.target.value)}
                          placeholder="mr.manhdora.macginhi"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase"><Link className="w-3.5 h-3.5 text-teal-600" /> Link kênh TikTok</Label>
                        <Input
                          value={kol.tiktokUrl}
                          onChange={(e) => handleKolChange(kol.id, 'tiktokUrl', e.target.value)}
                          placeholder="https://www.tiktok.com/@mr.manhdora.macginhi"
                          className="h-10"
                        />
                      </div>
                      
                      {/* Avatar Image Selection Inputs */}
                      <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase"><Link className="w-3.5 h-3.5 text-teal-600" /> Ảnh đại diện (KOL Avatar)</Label>
                        <div className="flex gap-2">
                          <Input
                            value={kol.avatarUrl || ""}
                            onChange={(e) => handleKolChange(kol.id, 'avatarUrl', e.target.value)}
                            placeholder="/products/filename.png hoặc link URL"
                            className="h-10 flex-1 text-xs"
                          />
                          
                          {/* File input (hidden) */}
                          <input
                            type="file"
                            id={`avatar-file-${kol.id}`}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUploadAvatar(kol.id, e.target.files)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`avatar-file-${kol.id}`)?.click()}
                            className="h-10 text-xs px-3 border-teal-600 text-teal-600 hover:bg-teal-50 shrink-0 gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Tải lên
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenLibrary(kol.id, 'avatar')}
                            className="h-10 text-xs px-3 border-gray-300 text-gray-700 hover:bg-gray-50 shrink-0 gap-1.5"
                          >
                            <Folder className="w-3.5 h-3.5" />
                            Thư viện
                          </Button>
                        </div>
                      </div>

                      {/* Cover Image Selection Inputs */}
                      <div className="space-y-1.5">
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase"><ImageIcon className="w-3.5 h-3.5 text-teal-600" /> Ảnh bìa (KOL Cover)</Label>
                        <div className="flex gap-2">
                          <Input
                            value={kol.coverUrl || ""}
                            onChange={(e) => handleKolChange(kol.id, 'coverUrl', e.target.value)}
                            placeholder="/products/filename.png hoặc link URL"
                            className="h-10 flex-1 text-xs"
                          />
                          
                          {/* File input (hidden) */}
                          <input
                            type="file"
                            id={`cover-file-${kol.id}`}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUploadCover(kol.id, e.target.files)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`cover-file-${kol.id}`)?.click()}
                            className="h-10 text-xs px-3 border-teal-600 text-teal-600 hover:bg-teal-50 shrink-0 gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Tải lên
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenLibrary(kol.id, 'cover')}
                            className="h-10 text-xs px-3 border-gray-300 text-gray-700 hover:bg-gray-50 shrink-0 gap-1.5"
                          >
                            <Folder className="w-3.5 h-3.5" />
                            Thư viện
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Followers, Specialty & Preview */}
                    <div className="md:col-span-5 grid grid-cols-1 gap-4 h-full">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase"><Users className="w-3.5 h-3.5 text-teal-600" /> Lượng Follower</Label>
                          <Input
                            value={kol.followers}
                            onChange={(e) => handleKolChange(kol.id, 'followers', e.target.value)}
                            placeholder="Ví dụ: 1.2M hoặc 500K"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase"><Sparkles className="w-3.5 h-3.5 text-teal-600" /> Ngành nghề chuyên môn</Label>
                          <Input
                            value={kol.specialty}
                            onChange={(e) => handleKolChange(kol.id, 'specialty', e.target.value)}
                            placeholder="Ví dụ: Mỹ phẩm & Skincare"
                            className="h-10"
                          />
                        </div>
                      </div>

                      {/* Visual Card Preview */}
                      <div className="flex items-center justify-center p-3 border rounded-xl bg-gray-50/50">
                        <div className="flex flex-col items-center text-center w-full">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Xem trước Card KOL</span>
                          
                          {/* Live Preview Card */}
                          <div
                            className="w-full max-w-[240px] rounded-2xl border p-4 relative overflow-hidden bg-cover bg-center min-h-[150px] flex flex-col items-center justify-center text-center shadow-sm"
                            style={{
                              backgroundImage: kol.coverUrl ? `url(${kol.coverUrl})` : 'none',
                              backgroundColor: kol.coverUrl ? 'transparent' : '#ffffff'
                            }}
                          >
                            {kol.coverUrl && <div className="absolute inset-0 bg-black/45 z-0" />}
                            
                            <div className="relative z-10 flex flex-col items-center">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-teal-500 bg-white mb-2 shadow-sm">
                                {kol.avatarUrl ? (
                                  <img src={kol.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-teal-50 text-teal-600 font-bold flex items-center justify-center text-xs">KOL</div>
                                )}
                              </div>
                              <span className={`text-xs font-bold ${kol.coverUrl ? 'text-white' : 'text-gray-900'} truncate max-w-[180px]`}>
                                @{kol.channelName || "Name"}
                              </span>
                              <span className={`text-[10px] font-medium ${kol.coverUrl ? 'text-white/80' : 'text-gray-500'} mt-0.5`}>
                                {kol.followers || "100K"} Followers
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Add Video Link Section */}
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <Label className="flex items-center gap-1.5 text-sm font-bold text-teal-600 uppercase">
                        <Video className="w-4 h-4" />
                        Danh sách clips liên kết ({(kol.videos || []).length})
                      </Label>
                      
                      <div className="flex w-full sm:w-auto gap-2">
                        <Input
                          value={videoUrls[kol.id] || ""}
                          onChange={(e) => setVideoUrls(prev => ({ ...prev, [kol.id]: e.target.value }))}
                          placeholder="Dán link video TikTok (nhập hoặc paste)..."
                          className="h-9 text-xs flex-1 sm:w-80"
                        />
                        <Button
                          onClick={() => handleAddVideoLink(kol.id)}
                          disabled={loadingVideo[kol.id]}
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-xs shrink-0"
                        >
                          {loadingVideo[kol.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                          Nạp video
                        </Button>
                      </div>
                    </div>

                    {(!kol.videos || kol.videos.length === 0) ? (
                      <div className="text-center p-4 border border-dashed rounded-xl text-gray-400 text-xs">
                        KOL này chưa được liên kết clip review nào. Hãy dán link clip TikTok ở góc trên để nạp.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {(kol.videos || []).map((vid, vIdx) => (
                          <div key={vid.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex flex-col group/video relative">
                            {/* Video Controls */}
                            <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover/video:opacity-100 transition-opacity bg-white/95 rounded p-0.5 shadow border border-gray-100 z-10">
                              <Button onClick={() => handleMoveVideo(kol.id, vIdx, 'up')} disabled={vIdx === 0} variant="ghost" size="icon" className="h-5 w-5"><ArrowUp className="w-2.5 h-2.5" /></Button>
                              <Button onClick={() => handleMoveVideo(kol.id, vIdx, 'down')} disabled={vIdx === (kol.videos || []).length - 1} variant="ghost" size="icon" className="h-5 w-5"><ArrowDown className="w-2.5 h-2.5" /></Button>
                              <Button onClick={() => handleRemoveVideo(kol.id, vid.id)} variant="ghost" size="icon" className="h-5 w-5 text-red-500 hover:bg-red-50"><Trash2 className="w-2.5 h-2.5" /></Button>
                            </div>

                            {/* Aspect 9/16 video frame container */}
                            <div className="relative aspect-[9/16] bg-gray-900 flex items-center justify-center">
                              {vid.thumbnail ? (
                                <img
                                  src={vid.thumbnail}
                                  alt={vid.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Video className="w-8 h-8 text-gray-600" />
                              )}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                                  <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-2 flex-1 flex flex-col justify-between">
                              <p className="text-[10px] text-gray-500 font-bold truncate">ID: {vid.videoId}</p>
                              <p className="text-[10px] text-gray-700 leading-snug line-clamp-2 mt-0.5 font-medium min-h-[30px]" title={vid.title}>
                                {vid.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </div>

      {/* Media Library Selection Dialog */}
      <Dialog open={libraryOpen} onOpenChange={setLibraryOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="flex items-center gap-2 text-teal-600">
              <Folder className="w-5 h-5" />
              Chọn ảnh từ Thư viện ({libraryType === 'avatar' ? 'Ảnh đại diện' : 'Ảnh bìa'})
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {loadingLibrary ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                <span className="text-sm">Đang tải danh sách hình ảnh...</span>
              </div>
            ) : libraryFiles.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                Thư viện ảnh hiện tại đang trống. Bạn hãy tải ảnh lên trước tại mục "Kho ảnh" trong sidebar.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {libraryFiles.map((file, fIdx) => (
                  <button
                    key={fIdx}
                    type="button"
                    onClick={() => {
                      if (activeKolForLibrary) {
                        const fieldName = libraryType === 'avatar' ? 'avatarUrl' : 'coverUrl';
                        handleKolChange(activeKolForLibrary, fieldName, file.url);
                        setLibraryOpen(false);
                        toast.success(`Đã áp dụng ${libraryType === 'avatar' ? 'ảnh đại diện' : 'ảnh bìa'} từ thư viện!`);
                      }
                    }}
                    className="border border-gray-200 hover:border-teal-500 rounded-xl overflow-hidden aspect-square bg-white flex items-center justify-center p-1 transition-colors relative group shadow-sm"
                  >
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[11px] font-bold rounded-lg">
                      Chọn ảnh
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
}
