import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FolderOpen, Edit, RefreshCw, Loader2, Plus, Trash2, AlertTriangle, CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut } from "@/lib/api";

interface ArticleSummary {
  id: number;
  category: string;
}

interface PostCategoryItem {
  id: string; // Tên/ID danh mục độc nhất
  name: string;
  slug: string;
  parentId: string | null; // ID của danh mục cha
}

interface DisplayCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  count: number;
}

export default function AdminPostCategories() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayCategories, setDisplayCategories] = useState<DisplayCategory[]>([]);
  const [categoryTree, setCategoryTree] = useState<PostCategoryItem[]>([]);
  
  // Dialog States
  const [editOpen, setEditOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DisplayCategory | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", parentId: "" });

  // Delete State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCat, setDeletingCat] = useState<DisplayCategory | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch articles summaries to extract active categories & count posts
      const articles = await apiGet<ArticleSummary[]>("/admin/articles");
      const activeArticles = Array.isArray(articles) ? articles : [];

      const counts: Record<string, number> = {};
      activeArticles.forEach((a) => {
        const cat = a.category || "Tin Tức";
        counts[cat] = (counts[cat] || 0) + 1;
      });

      // 2. Fetch hierarchical tree from settings
      const settingsRes = await apiGet<{ value: string | null }>("/settings/post_categories_tree");
      let savedTree: PostCategoryItem[] = [];
      try {
        if (settingsRes?.value) {
          savedTree = JSON.parse(settingsRes.value);
        } else {
          // Backward compatibility: check if old post_categories_map exists
          const oldSettingsRes = await apiGet<{ value: string | null }>("/settings/post_categories_map");
          if (oldSettingsRes?.value) {
            const oldMap = JSON.parse(oldSettingsRes.value);
            savedTree = oldMap.map((item: any) => ({
              id: item.name,
              name: item.name,
              slug: item.slug,
              parentId: null,
            }));
          }
        }
      } catch (err) {
        console.error("Parse post_categories_tree settings error:", err);
      }

      // Ensure "Tin Tức" is always present in category tree
      if (!savedTree.find(c => c.name.toLowerCase() === "tin tức")) {
        savedTree.unshift({
          id: "Tin Tức",
          name: "Tin Tức",
          slug: "tin-tuc",
          parentId: null
        });
      }
      setCategoryTree(savedTree);

      // 3. Extract unique list of names
      const allCategoryNames = Array.from(
        new Set([...Object.keys(counts), ...savedTree.map((c) => c.name)])
      ).filter(Boolean);

      const merged: DisplayCategory[] = allCategoryNames.map((name) => {
        const treeItem = savedTree.find((c) => c.name === name);
        // Fallback slug generation
        const fallbackSlug = name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        const parentId = treeItem?.parentId || null;
        const parentItem = savedTree.find(p => p.id === parentId);

        return {
          id: name,
          name,
          slug: treeItem?.slug || fallbackSlug,
          parentId,
          parentName: parentItem ? parentItem.name : null,
          count: counts[name] || 0,
        };
      });

      // Sort categories logically: parent category first, then its child categories
      const sorted: DisplayCategory[] = [];
      const parents = merged.filter(c => !c.parentId);
      parents.forEach(p => {
        sorted.push(p);
        const children = merged.filter(c => c.parentId === p.id);
        sorted.push(...children);
      });

      // Append any orphaned categories (e.g. parentId refers to a deleted parent)
      merged.forEach(c => {
        if (!sorted.find(s => s.name === c.name)) {
          sorted.push(c);
        }
      });

      setDisplayCategories(sorted);
    } catch (e: any) {
      toast.error(e.message || "Không tải được danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setIsCreate(true);
    setEditingCategory(null);
    setForm({ name: "", slug: "", parentId: "" });
    setEditOpen(true);
  };

  const openEdit = (cat: DisplayCategory) => {
    setIsCreate(false);
    setEditingCategory(cat);
    setForm({ name: cat.name, slug: cat.slug, parentId: cat.parentId || "" });
    setEditOpen(true);
  };

  // Helper auto-generate slug on name change (only for creation)
  const handleNameChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: isCreate ? generatedSlug : prev.slug,
    }));
  };

  const handleSave = async () => {
    const trimmedName = form.name.trim();
    const trimmedSlug = form.slug.trim();
    const parentIdVal = form.parentId || null;

    if (!trimmedName || !trimmedSlug) {
      toast.error("Vui lòng nhập đầy đủ tên và slug");
      return;
    }

    setSaving(true);
    try {
      if (isCreate) {
        // Create new category
        const exist = categoryTree.find((item) => item.name.toLowerCase() === trimmedName.toLowerCase());
        if (exist) {
          toast.error("Danh mục này đã tồn tại");
          setSaving(false);
          return;
        }

        const newTree = [...categoryTree, { 
          id: trimmedName, 
          name: trimmedName, 
          slug: trimmedSlug, 
          parentId: parentIdVal 
        }];
        await apiPut("/settings", {
          post_categories_tree: JSON.stringify(newTree),
        });
        toast.success(`Đã tạo danh mục "${trimmedName}" thành công`);
      } else {
        // Edit existing category
        if (editingCategory && editingCategory.name !== trimmedName) {
          // Rename database articles categories references bulk rename
          await apiPost("/admin/articles/rename-category", {
            oldCategory: editingCategory.name,
            newCategory: trimmedName,
          });
          toast.success(`Đã cập nhật tên danh mục cho các bài viết liên quan`);
        }

        const newTree = [...categoryTree];
        const matchIndex = newTree.findIndex((item) => item.name === editingCategory?.name);

        const updatedItem = {
          id: trimmedName,
          name: trimmedName,
          slug: trimmedSlug,
          parentId: parentIdVal,
        };

        if (matchIndex >= 0) {
          newTree[matchIndex] = updatedItem;
        } else {
          newTree.push(updatedItem);
        }

        // If renamed category, clean up duplicate or older entries
        if (editingCategory && editingCategory.name !== trimmedName) {
          const oldIndex = newTree.findIndex(
            (item, idx) => item.name === editingCategory.name && idx !== matchIndex
          );
          if (oldIndex >= 0) newTree.splice(oldIndex, 1);

          // Update parentId of child categories referring to old name
          newTree.forEach(c => {
            if (c.parentId === editingCategory.name) {
              c.parentId = trimmedName;
            }
          });
        }

        await apiPut("/settings", {
          post_categories_tree: JSON.stringify(newTree),
        });
        toast.success("Đã cập nhật cấu hình danh mục");
      }

      setEditOpen(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Lỗi lưu danh mục");
    } finally {
      setSaving(false);
    }
  };

  const startDelete = (cat: DisplayCategory) => {
    setDeletingCat(cat);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCat) return;

    setSaving(true);
    try {
      // 1. If category contains articles, update those articles to "Tin Tức"
      if (deletingCat.count > 0) {
        await apiPost("/admin/articles/rename-category", {
          oldCategory: deletingCat.name,
          newCategory: "Tin Tức",
        });
        toast.success(`Đã chuyển các bài viết thuộc danh mục này sang "Tin Tức"`);
      }

      // 2. Remove from settings config map and clean up parentIds
      let newTree = categoryTree.filter((item) => item.name !== deletingCat.name);
      
      // If deleted category is a parent, change its children's parentId to null (make them parents)
      newTree = newTree.map((item) => {
        if (item.parentId === deletingCat.id) {
          return { ...item, parentId: null };
        }
        return item;
      });

      await apiPut("/settings", {
        post_categories_tree: JSON.stringify(newTree),
      });

      toast.success(`Đã xóa danh mục "${deletingCat.name}" khỏi hệ thống`);
      setDeleteOpen(false);
      setDeletingCat(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Lỗi khi xóa danh mục");
    } finally {
      setSaving(false);
    }
  };

  // Get available parent options (categories that are parents themselves)
  const parentOptions = categoryTree.filter(c => !c.parentId && (!editingCategory || c.id !== editingCategory.id));

  return (
    <AdminLayout title="Danh mục bài viết">
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <p className="text-sm text-muted-foreground max-w-xl">
            Tổ chức cấu trúc danh mục bài viết theo dạng **Cha - Con** tương tự như sản phẩm. 
            Các danh mục được tạo sẽ phân nhóm rõ ràng trong bộ lọc và ô viết bài.
          </p>
          <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
            <Button variant="outline" onClick={loadData} disabled={loading} className="gap-2 h-10">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Tải lại
            </Button>
            <Button onClick={openCreate} className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5 h-10 animate-pulse-subtle">
              <Plus className="w-4 h-4" /> Thêm danh mục
            </Button>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : displayCategories.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
                <FolderOpen className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Chưa có danh mục bài viết nào</p>
                <Button onClick={openCreate} className="mt-3 bg-teal-600 hover:bg-teal-700 text-white gap-1.5">
                  <Plus className="w-4 h-4" /> Tạo danh mục đầu tiên
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Tên danh mục</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thuộc danh mục cha</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Đường dẫn tùy chỉnh (Slug)</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Số bài viết</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayCategories.map((cat) => (
                      <tr 
                        key={cat.name} 
                        className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                          cat.parentId ? "bg-gray-50/50" : "bg-white font-medium"
                        }`}
                      >
                        <td className="p-4 text-foreground flex items-center">
                          {cat.parentId ? (
                            <>
                              <CornerDownRight className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                              <span className="text-gray-700">{cat.name}</span>
                            </>
                          ) : (
                            <span className="font-semibold text-gray-900">{cat.name}</span>
                          )}
                        </td>
                        <td className="p-4 text-gray-500 text-xs">
                          {cat.parentName ? (
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">
                              {cat.parentName}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Mặc định (Danh mục cha)</span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                        <td className="p-4">
                          <span className="bg-teal-50 text-teal-700 font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                            {cat.count} bài viết
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(cat)}
                              className="p-1.5 rounded hover:bg-primary/10 text-primary flex items-center gap-1 text-xs font-semibold"
                              title="Tùy chỉnh cấu hình"
                            >
                              <Edit className="h-4 w-4" /> Cấu hình
                            </button>
                            {cat.name !== "Tin Tức" && (
                              <button
                                onClick={() => startDelete(cat)}
                                className="p-1.5 rounded hover:bg-destructive/10 text-destructive flex items-center gap-1 text-xs font-semibold"
                                title="Xóa danh mục"
                              >
                                <Trash2 className="h-4 w-4" /> Xóa
                              </button>
                            )}
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
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader>
            <DialogTitle>
              {isCreate ? "Tạo danh mục bài viết mới" : "Cấu hình danh mục bài viết"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div>
              <Label className="text-xs font-semibold text-gray-500">Tên danh mục</Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Chăm sóc da"
                className="mt-1 h-10"
              />
              {!isCreate && editingCategory && editingCategory.name !== form.name.trim() && (
                <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-start gap-1.5 leading-normal">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Chú ý:</strong> Đổi tên sẽ thay đổi tên danh mục của tất cả <strong>{editingCategory.count}</strong> bài viết cũ liên quan trong cơ sở dữ liệu.
                  </span>
                </div>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-500">Thuộc danh mục cha</Label>
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className="w-full mt-1 h-10 text-sm border border-border rounded-md px-3 bg-background"
              >
                <option value="">-- Mặc định (Là danh mục cha) --</option>
                {parentOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-gray-500">Đường dẫn tùy chỉnh (Slug)</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="VD: cham-soc-da"
                className="mt-1 h-10 font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                Đường dẫn liên kết: <strong>/news?category={form.slug || "[slug]"}</strong>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : isCreate ? "Tạo danh mục" : "Lưu cấu hình"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5" /> Xác nhận xóa danh mục
            </DialogTitle>
          </DialogHeader>

          <div className="py-2 text-sm text-gray-600 leading-relaxed">
            <p>
              Bạn đang chuẩn bị xóa danh mục bài viết <strong>"{deletingCat?.name}"</strong> khỏi hệ thống.
            </p>
            {deletingCat && deletingCat.count > 0 && (
              <div className="mt-3 p-3 bg-destructive/5 rounded-lg border border-destructive/10 text-xs text-destructive flex flex-col gap-1">
                <span>
                  ⚠️ Danh mục này đang chứa <strong>{deletingCat.count}</strong> bài viết.
                </span>
                <span>
                  Hành động này sẽ **tự động đổi toàn bộ {deletingCat.count} bài viết này** sang danh mục mặc định là <strong>"Tin Tức"</strong> trước khi xóa.
                </span>
              </div>
            )}
            {deletingCat && !deletingCat.parentId && (
              <p className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                💡 <strong>Chú ý:</strong> Danh mục này đang là danh mục cha. Khi xóa, các danh mục con trực thuộc của nó sẽ tự động được chuyển lên thành danh mục cha.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={saving}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={saving}
            >
              {saving ? "Đang thực thi..." : "Xác nhận xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
