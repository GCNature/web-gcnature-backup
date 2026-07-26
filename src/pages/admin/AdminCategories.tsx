import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Layers, Plus, Pencil, Trash2, GripVertical, Save, RotateCcw,
  FolderOpen, Search, CheckSquare, Square, Loader2, Eye,
  Image as ImageIcon, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  CategoryItem, defaultCategories, getFeaturedCategories, saveFeaturedCategories,
} from "@/components/HeroSection";
import { API_BASE, apiPost, apiPut } from "@/lib/api";

const gradientOptions = [
  { label: "Đỏ - Hồng", value: "from-red-500 via-rose-500 to-pink-500", lightBg: "from-red-50 via-rose-50 to-pink-50", border: "hover:border-red-300" },
  { label: "Xanh dương", value: "from-blue-500 via-indigo-500 to-violet-500", lightBg: "from-blue-50 via-indigo-50 to-violet-50", border: "hover:border-blue-300" },
  { label: "Xanh lá", value: "from-emerald-500 via-teal-500 to-cyan-500", lightBg: "from-emerald-50 via-teal-50 to-cyan-50", border: "hover:border-emerald-300" },
  { label: "Tím", value: "from-purple-500 via-violet-500 to-fuchsia-500", lightBg: "from-purple-50 via-violet-50 to-fuchsia-50", border: "hover:border-purple-300" },
  { label: "Cam - Vàng", value: "from-amber-500 via-orange-500 to-red-500", lightBg: "from-amber-50 via-orange-50 to-red-50", border: "hover:border-amber-300" },
  { label: "Hồng", value: "from-pink-500 via-fuchsia-500 to-purple-500", lightBg: "from-pink-50 via-fuchsia-50 to-purple-50", border: "hover:border-pink-300" },
  { label: "Cyan", value: "from-cyan-500 via-sky-500 to-blue-500", lightBg: "from-cyan-50 via-sky-50 to-blue-50", border: "hover:border-cyan-300" },
];

const iconOptions = [
  { label: "Tai nghe", value: "Headphones" },
  { label: "Camera", value: "Camera" },
  { label: "Ngôn ngữ", value: "Languages" },
  { label: "Robot", value: "Bot" },
  { label: "Kính", value: "Glasses" },
];

export default function AdminCategories() {
  const [activeTab, setActiveTab] = useState<'featured' | 'system'>('featured');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [form, setForm] = useState<CategoryItem>({
    name: "", desc: "", iconName: "Glasses", gradient: gradientOptions[0].value,
    lightBg: gradientOptions[0].lightBg, borderHover: gradientOptions[0].border,
    image: "", count: 0, link: "",
  });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [syncingImages, setSyncingImages] = useState(false);

  // DB Categories state
  const [dbCategories, setDbCategories] = useState<{ id: number; name: string; slug: string; sort_order: number; is_active: boolean }[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbFormOpen, setDbFormOpen] = useState(false);
  const [dbFormIndex, setDbFormIndex] = useState(-1); // -1 for add, index for edit
  const [dbForm, setDbForm] = useState({ id: undefined as number | undefined, name: "", slug: "", sortOrder: 0, isActive: true });
  const [dbDeleteId, setDbDeleteId] = useState<number | null>(null);
  const [dbSeoTitle, setDbSeoTitle] = useState("");
  const [dbSeoDesc, setDbSeoDesc] = useState("");
  const [dbSeoKeywords, setDbSeoKeywords] = useState("");

  // Load Database categories
  const loadDbCategories = async () => {
    setDbLoading(true);
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        setDbCategories(data.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          sort_order: c.sort_order || 0,
          is_active: c.is_active !== false
        })));
      }
    } catch (err) {
      console.error("Load db categories error:", err);
      toast.error("Lỗi khi tải danh mục hệ thống");
    } finally {
      setDbLoading(false);
    }
  };

  // CRUD DB Categories
  const handleOpenAddDb = () => {
    setDbFormIndex(-1);
    setDbForm({ id: undefined, name: "", slug: "", sortOrder: 0, isActive: true });
    setDbSeoTitle("");
    setDbSeoDesc("");
    setDbSeoKeywords("");
    setDbFormOpen(true);
  };

  const handleOpenEditDb = (idx: number, cat: any) => {
    setDbFormIndex(idx);
    setDbForm({ id: cat.id, name: cat.name, slug: cat.slug, sortOrder: cat.sort_order, isActive: cat.is_active });
    setDbSeoTitle("");
    setDbSeoDesc("");
    setDbSeoKeywords("");
    setDbFormOpen(true);
    // Fetch SEO configurations
    fetch(`${API_BASE}/settings/category_seo_${cat.id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setDbSeoTitle(data.title || "");
          setDbSeoDesc(data.desc || "");
          setDbSeoKeywords(data.keywords || "");
        }
      })
      .catch(err => console.error("Error loading category SEO settings:", err));
  };

  const handleSaveDbForm = async () => {
    if (!dbForm.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    const token = localStorage.getItem("token") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    setDbLoading(true);
    try {
      const payload = {
        name: dbForm.name,
        slug: dbForm.slug,
        sortOrder: dbForm.sortOrder,
        isActive: dbForm.isActive
      };

      if (dbFormIndex >= 0 && dbForm.id) {
        // Edit existing
        const res = await fetch(`${API_BASE}/admin/db-categories/${dbForm.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          // Lưu SEO
          await fetch(`${API_BASE}/admin/settings`, {
            method: "PUT",
            headers,
            body: JSON.stringify({
              [`category_seo_${dbForm.id}`]: JSON.stringify({
                title: dbSeoTitle,
                desc: dbSeoDesc,
                keywords: dbSeoKeywords
              })
            })
          });
          toast.success("Cập nhật danh mục thành công!");
          loadDbCategories();
          setDbFormOpen(false);
        } else {
          const errData = await res.json();
          toast.error(errData.message || "Lỗi khi cập nhật danh mục");
        }
      } else {
        // Add new
        const res = await fetch(`${API_BASE}/admin/db-categories`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const resData = await res.json();
          const newId = resData.id;
          if (newId) {
            // Lưu SEO
            await fetch(`${API_BASE}/admin/settings`, {
              method: "PUT",
              headers,
              body: JSON.stringify({
                [`category_seo_${newId}`]: JSON.stringify({
                  title: dbSeoTitle,
                  desc: dbSeoDesc,
                  keywords: dbSeoKeywords
                })
              })
            });
          }
          toast.success("Tạo danh mục mới thành công!");
          loadDbCategories();
          setDbFormOpen(false);
        } else {
          const errData = await res.json();
          toast.error(errData.message || "Lỗi khi tạo danh mục");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối");
    } finally {
      setDbLoading(false);
    }
  };

  const handleDeleteDbCategory = async () => {
    if (!dbDeleteId) return;
    const token = localStorage.getItem("token") || "";
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token}`
    };

    setDbLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/db-categories/${dbDeleteId}`, {
        method: "DELETE",
        headers
      });
      if (res.ok) {
        toast.success("Đã xóa danh mục hệ thống!");
        loadDbCategories();
        setDbDeleteId(null);
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Không thể xóa danh mục");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setDbLoading(false);
    }
  };

  // Media picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{ filename: string; url: string; group: string }[]>([]);
  const [mediaGroups, setMediaGroups] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState("all");

  useEffect(() => {
    // 1. Initial load from local storage
    setCategories(getFeaturedCategories());
    
    // 2. Fetch latest from database to stay in sync
    const fetchLatest = async () => {
      try {
        const response = await fetch(`${API_BASE}/settings/featured-categories`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
            saveFeaturedCategories(data);
          }
        }
      } catch (err) {
        console.error("Error loading featured categories from server:", err);
      }
    };
    fetchLatest();
    loadDbCategories();
  }, []);

  const save = async () => {
    try {
      saveFeaturedCategories(categories); // save locally
      
      // Save to database
      await apiPut("/settings", {
        featured_categories: JSON.stringify(categories)
      });
      
      setHasChanges(false);
      toast.success("Đã lưu danh mục! Trang chủ sẽ cập nhật ngay.");
    } catch (err) {
      console.error("Error saving featured categories:", err);
      toast.error("Lỗi khi lưu danh mục lên máy chủ");
    }
  };

  const resetDefaults = () => {
    setCategories([...defaultCategories]);
    setHasChanges(true);
    toast.info("Đã khôi phục mặc định (nhấn Lưu để áp dụng)");
  };

  // Sync category images from products API
  const syncCategoryImages = async () => {
    setSyncingImages(true);
    try {
      const data = await apiPost<any>("/admin/sync-categories");
      // data.results has { id, name, slug, image } for each DB category
      let updated = 0;
      const newCategories = categories.map(cat => {
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

      setCategories(newCategories);
      if (updated > 0) {
        setHasChanges(true);
        toast.success(`Đã cập nhật ảnh cho ${updated} danh mục (nhấn Lưu để áp dụng)`);
      } else {
        toast.info("Ảnh danh mục đã đúng, không cần thay đổi");
      }
    } catch (err) {
      console.error('Sync category images error:', err);
      toast.error("Lỗi đồng bộ ảnh danh mục");
    } finally {
      setSyncingImages(false);
    }
  };

  // Edit / Add
  const openAdd = () => {
    setEditIndex(-1);
    setForm({
      name: "", desc: "", iconName: "Glasses", gradient: gradientOptions[0].value,
      lightBg: gradientOptions[0].lightBg, borderHover: gradientOptions[0].border,
      image: "", count: 0, link: "/shop",
    });
    setEditOpen(true);
  };

  const openEdit = (idx: number) => {
    setEditIndex(idx);
    setForm({ ...categories[idx] });
    setEditOpen(true);
  };

  const saveForm = () => {
    if (!form.name.trim() || !form.image.trim()) {
      toast.error("Vui lòng nhập tên và chọn ảnh bìa");
      return;
    }
    let updated: CategoryItem[];
    if (editIndex >= 0) {
      updated = categories.map((c, i) => i === editIndex ? { ...form } : c);
    } else {
      updated = [...categories, { ...form }];
    }
    setCategories(updated);
    setHasChanges(true);
    setEditOpen(false);
    toast.success(editIndex >= 0 ? "Đã cập nhật danh mục" : "Đã thêm danh mục mới");
  };

  // Delete
  const confirmDelete = () => {
    if (deleteIndex === null) return;
    setCategories(categories.filter((_, i) => i !== deleteIndex));
    setHasChanges(true);
    setDeleteIndex(null);
    toast.success("Đã xóa danh mục");
  };

  // Move
  const move = (idx: number, dir: "up" | "down") => {
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= categories.length) return;
    const updated = [...categories];
    [updated[idx], updated[swap]] = [updated[swap], updated[idx]];
    setCategories(updated);
    setHasChanges(true);
  };

  // Gradient change
  const setGradient = (gradientValue: string) => {
    const opt = gradientOptions.find(g => g.value === gradientValue);
    if (opt) setForm({ ...form, gradient: opt.value, lightBg: opt.lightBg, borderHover: opt.border });
  };

  // Media picker
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

  const openPicker = () => {
    setMediaSearch(""); setMediaFilter("all");
    setPickerOpen(true);
    if (mediaFiles.length === 0) loadMedia();
  };

  const pickImage = (url: string) => {
    setForm({ ...form, image: url });
    setPickerOpen(false);
  };

  const filteredMedia = mediaFiles.filter(f => {
    if (mediaFilter !== "all" && f.group !== mediaFilter) return false;
    if (mediaSearch && !f.filename.toLowerCase().includes(mediaSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout title="Quản lý Danh mục">
      <div className="space-y-4 max-w-4xl">
        {/* Tab Header */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'featured'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Danh mục nổi bật (Trang chủ)
          </button>
          <button
            onClick={() => { setActiveTab('system'); loadDbCategories(); }}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === 'system'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Danh mục hệ thống (Database)
          </button>
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-150 pb-4 mb-2">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" /> 
              {activeTab === 'featured' ? "Danh mục nổi bật (Trang chủ)" : "Danh mục hệ thống (Database)"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === 'featured' 
                ? "Quản lý các danh mục hiển thị trên trang chủ. Thay đổi thứ tự, ảnh bìa, tên, mô tả." 
                : "Quản lý danh mục sản phẩm trong cơ sở dữ liệu hệ thống, đường dẫn tĩnh (slug)."
              }
            </p>
          </div>

          {/* Header Actions depending on Tab */}
          {activeTab === 'featured' ? (
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={syncCategoryImages} disabled={syncingImages} className="gap-1.5 h-9 text-xs">
                {syncingImages ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} ĐB Ảnh
              </Button>
              <Button variant="outline" size="sm" onClick={resetDefaults} className="gap-1.5 h-9 text-xs">
                <RotateCcw className="w-3.5 h-3.5" /> Mặc định
              </Button>
              <Button variant="outline" size="sm" onClick={openAdd} className="gap-1.5 h-9 text-xs border-teal-500 text-teal-600 hover:bg-teal-50">
                <Plus className="w-3.5 h-3.5" /> Thêm nổi bật
              </Button>
              <Button size="sm" onClick={save} disabled={!hasChanges} className="gap-1.5 h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm">
                <Save className="w-3.5 h-3.5" /> Lưu thay đổi
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={loadDbCategories} disabled={dbLoading} className="gap-1.5 h-9 text-xs">
                <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? "animate-spin" : ""}`} /> Tải lại
              </Button>
              <Button size="sm" onClick={handleOpenAddDb} className="gap-1.5 h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm">
                <Plus className="w-3.5 h-3.5" /> Tạo danh mục hệ thống
              </Button>
            </div>
          )}
        </div>

        {activeTab === 'featured' && hasChanges && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex items-center gap-2">
            <span className="font-medium">⚠️ Có thay đổi chưa lưu.</span> Nhấn "Lưu thay đổi" để cập nhật lên trang chủ.
          </div>
        )}

        {/* --- RENDERING FEATURED TAB --- */}
        {activeTab === 'featured' && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{categories.length} danh mục nổi bật</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Chưa có danh mục nổi bật nào</p>
                    <Button variant="outline" onClick={openAdd} className="mt-3 gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Thêm danh mục
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categories.map((cat, idx) => (
                      <div key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-border transition-colors group bg-white">
                        {/* Reorder */}
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => move(idx, "up")} disabled={idx === 0}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▲</button>
                          <GripVertical className="w-4 h-4 text-muted-foreground/40" />
                          <button onClick={() => move(idx, "down")} disabled={idx === categories.length - 1}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-20 text-xs">▼</button>
                        </div>

                        {/* Image preview */}
                        <div className="w-20 h-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm truncate">{cat.name}</p>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{cat.count} SP</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{cat.desc}</p>
                          <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5">
                            Ảnh: <code className="bg-muted px-1 rounded">{cat.image}</code> • Link: {cat.link}
                          </p>
                        </div>

                        {/* Gradient preview */}
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${cat.gradient} shrink-0`} title="Màu gradient" />

                        {/* Actions */}
                        <div className="flex gap-1.5 shrink-0">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(idx)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteIndex(idx)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* --- RENDERING SYSTEM DB TAB --- */}
        {activeTab === 'system' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{dbCategories.length} danh mục hệ thống trong Database</CardTitle>
            </CardHeader>
            <CardContent>
              {dbLoading && dbCategories.length === 0 ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                </div>
              ) : dbCategories.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Không tìm thấy danh mục hệ thống nào trong database</p>
                  <Button onClick={handleOpenAddDb} variant="outline" className="mt-3 gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Tạo danh mục hệ thống đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="text-left p-3 font-semibold text-gray-700">Tên danh mục</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Đường dẫn tĩnh (Slug)</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Thứ tự</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Trạng thái</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbCategories.map((cat, idx) => (
                        <tr key={cat.id} className="border-b border-gray-150 hover:bg-gray-50/30 transition-colors">
                          <td className="p-3 font-semibold text-gray-800">{cat.name}</td>
                          <td className="p-3 font-mono text-xs text-teal-600">
                            <span className="text-gray-400">/danh-muc/</span>{cat.slug}
                          </td>
                          <td className="p-3 text-gray-600">{cat.sort_order}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.is_active ? "bg-teal-50 text-teal-600 border border-teal-100" : "bg-gray-100 text-gray-500"}`}>
                              {cat.is_active ? "Kích hoạt" : "Tạm ẩn"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-8 px-2.5 text-teal-600 hover:text-teal-700" onClick={() => handleOpenEditDb(idx, cat)}>
                                <Pencil className="w-3.5 h-3.5 mr-1" /> Sửa
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 px-2.5 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDbDeleteId(cat.id)}>
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Xóa
                              </Button>
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
        )}

        {/* Live preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Xem trước trang chủ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((cat, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-border">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-[10px] font-bold text-white">{cat.name}</p>
                    <p className="text-[8px] text-white/70">{cat.desc}</p>
                  </div>
                  <div className="absolute top-1 right-1">
                    <span className="text-[8px] text-white px-1 py-0.5 rounded bg-black/40">{cat.count} SP</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ Edit/Add Dialog ═══ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editIndex >= 0 ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tên danh mục</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Kính Bluetooth" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Số sản phẩm</Label>
                <Input type="number" value={form.count} onChange={e => setForm({ ...form, count: Number(e.target.value) })}
                  className="h-9" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Mô tả ngắn</Label>
              <Input value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                placeholder="Nghe nhạc, gọi điện, trợ lý AI" className="h-9" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Đường dẫn (link)</Label>
              <Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                placeholder="/danh-muc/kinh-bluetooth" className="h-9" />
            </div>

            {/* Image picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Ảnh bìa</Label>
              <div className="flex gap-2">
                <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="/products/MCK5.0D-0.jpg" className="h-9 flex-1" />
                <Button variant="outline" size="sm" onClick={openPicker} className="gap-1 h-9 shrink-0">
                  <FolderOpen className="w-3.5 h-3.5" /> Kho ảnh
                </Button>
              </div>
              {form.image && (
                <div className="w-full h-32 rounded-lg overflow-hidden border border-border bg-muted mt-1">
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Icon */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Biểu tượng</Label>
              <select value={form.iconName} onChange={e => setForm({ ...form, iconName: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                {iconOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Gradient */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Màu chủ đạo</Label>
              <div className="grid grid-cols-4 gap-2">
                {gradientOptions.map(opt => (
                  <button key={opt.value}
                    onClick={() => setGradient(opt.value)}
                    className={`h-8 rounded-lg bg-gradient-to-r ${opt.value} border-2 transition-all ${
                      form.gradient === opt.value ? "border-foreground scale-105 shadow" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    title={opt.label} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Hủy</Button>
            <Button onClick={saveForm}>{editIndex >= 0 ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete Dialog ═══ */}
      <Dialog open={deleteIndex !== null} onOpenChange={() => setDeleteIndex(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Xóa danh mục?</DialogTitle></DialogHeader>
          {deleteIndex !== null && (
            <p className="text-sm text-muted-foreground">
              Xóa danh mục <strong>"{categories[deleteIndex]?.name}"</strong>? Hành động này sẽ áp dụng sau khi bạn nhấn Lưu.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Media Picker Dialog ═══ */}
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" /> Chọn ảnh bìa từ kho
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
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
                  <button key={f.filename} onClick={() => pickImage(f.url)}
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
        </DialogContent>
      </Dialog>
      {/* ═══ Create/Edit DB Category Dialog ═══ */}
      <Dialog open={dbFormOpen} onOpenChange={setDbFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dbFormIndex >= 0 ? "Chỉnh sửa danh mục hệ thống" : "Tạo danh mục hệ thống mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tên danh mục *</Label>
              <Input
                value={dbForm.name}
                onChange={(e) => setDbForm({ ...dbForm, name: e.target.value })}
                placeholder="VD: Kem chống nắng"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Đường dẫn tĩnh (Slug)</Label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 font-mono">/danh-muc/</span>
                <Input
                  value={dbForm.slug}
                  onChange={(e) => setDbForm({ ...dbForm, slug: e.target.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                  placeholder="kem-chong-nang (để trống tự tạo)"
                  className="h-9 font-mono text-xs flex-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  value={dbForm.sortOrder}
                  onChange={(e) => setDbForm({ ...dbForm, sortOrder: parseInt(e.target.value) || 0 })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Trạng thái kích hoạt</Label>
                <select
                  value={dbForm.isActive ? "true" : "false"}
                  onChange={(e) => setDbForm({ ...dbForm, isActive: e.target.value === "true" })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="true">Kích hoạt</option>
                  <option value="false">Tạm ẩn</option>
                </select>
              </div>
            </div>

            {/* SEO section */}
            <div className="border-t border-border pt-3.5 space-y-3">
              <h4 className="text-xs font-bold uppercase text-teal-700">Tối ưu SEO Google</h4>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tiêu đề hiển thị trên Google (Meta Title)</Label>
                <Input
                  value={dbSeoTitle}
                  onChange={(e) => setDbSeoTitle(e.target.value)}
                  placeholder="Nhập tiêu đề SEO..."
                  className="h-9 text-xs"
                />
                <p className="text-[10px] text-muted-foreground">Mặc định lấy tên danh mục nếu để trống.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mô tả hiển thị trên Google (Meta Description)</Label>
                <textarea
                  value={dbSeoDesc}
                  onChange={(e) => setDbSeoDesc(e.target.value)}
                  placeholder="Nhập mô tả SEO..."
                  className="w-full text-xs rounded-md border border-input bg-background p-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Từ khóa hiển thị trên Google (Meta Keywords)</Label>
                <Input
                  value={dbSeoKeywords}
                  onChange={(e) => setDbSeoKeywords(e.target.value)}
                  placeholder="mỹ phẩm hàn quốc, dưỡng da mặt..."
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDbFormOpen(false)} disabled={dbLoading}>Hủy</Button>
            <Button onClick={handleSaveDbForm} disabled={dbLoading} className="bg-teal-600 hover:bg-teal-700">
              {dbLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Lưu danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Delete DB Category Confirmation Dialog ═══ */}
      <Dialog open={dbDeleteId !== null} onOpenChange={(open) => !open && setDbDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa danh mục hệ thống?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa danh mục này? Hành động này sẽ xóa vĩnh viễn khỏi database và không thể hoàn tác nếu không có sản phẩm nào thuộc danh mục này.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDbDeleteId(null)} disabled={dbLoading}>Hủy</Button>
            <Button variant="destructive" onClick={handleDeleteDbCategory} disabled={dbLoading}>
              {dbLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Xóa danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
