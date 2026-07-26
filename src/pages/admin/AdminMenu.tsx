import { useState, useEffect } from "react";
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Save, Folder, Link2, 
  Sparkles, Scissors, Heart, Smile, Gift, Layout, RefreshCw, ChevronDown, ChevronRight, Edit2, RotateCcw
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiGet, apiPut } from "@/lib/api";
import { toast } from "sonner";

interface SubCategoryItem {
  name: string;
  href: string;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
}

interface CategoryGroup {
  groupName: string;
  items: SubCategoryItem[];
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
}

interface MegaCategory {
  name: string;
  englishName: string;
  href: string;
  icon: string;
  groups: CategoryGroup[];
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
}

const AVAILABLE_ICONS = ["Sparkles", "Scissors", "Heart", "Smile", "Gift", "Layout"];

export default function AdminMenu() {
  const [menuData, setMenuData] = useState<MegaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States to control expandable accordions in the tree UI
  const [expandedCats, setExpandedCats] = useState<number[]>([]);
  const [expandedGrps, setExpandedGrps] = useState<string[]>([]); // format: "catIdx-grpIdx"

  // Tracks the currently selected element for the editor form
  // selectedId format: "cat-X", "grp-X-Y", "item-X-Y-Z"
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Load menu data
  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await apiGet<MegaCategory[]>(`/settings/mega-menu?_t=${Date.now()}`);
      if (Array.isArray(data)) {
        setMenuData(data);
      } else {
        toast.error("Không thể lấy dữ liệu menu");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải cấu hình menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Save menu structure
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiPut<any>("/settings", {
        mega_menu: JSON.stringify(menuData)
      });
      if (res) {
        toast.success("Đã lưu cấu hình Menu thành công!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu cấu hình Menu");
    } finally {
      setSaving(false);
    }
  };

  // Restore default menu structure
  const handleRestoreDefault = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục menu về trạng thái mặc định ban đầu không? Mọi chỉnh sửa hiện tại sẽ bị xóa.")) {
      const defaultMenu = [
        {
          "name": "Chăm sóc da mặt",
          "englishName": "SkinCare",
          "href": "/shop/duong-da-mat",
          "icon": "Sparkles",
          "groups": [
            {
              "groupName": "Làm sạch da",
              "items": [
                { "name": "Sữa rửa mặt", "href": "/shop/sua-rua-mat" },
                { "name": "Tẩy trang (Nước/Dầu/Sáp)", "href": "/shop/tay-trang-nuoc-dau-sap" },
                { "name": "Tẩy tế bào chết da mặt", "href": "/shop/tay-te-bao-chet-da-mat" },
                { "name": "Toner / Nước hoa hồng", "href": "/shop/toner-nuoc-hoa-hong" }
              ]
            },
            {
              "groupName": "Đặc trị & Dưỡng sâu",
              "items": [
                { "name": "Serum / Tinh chất đặc trị", "href": "/shop/serum-tinh-chat-dac-tri" },
                { "name": "Ampoule / Siêu tinh chất", "href": "/shop/ampoule-sieu-tinh-chat" },
                { "name": "Mặt nạ (Giấy/Đất sét/Ngủ)", "href": "/shop/mat-na-giay-dat-set-ngu" }
              ]
            },
            {
              "groupName": "Dưỡng ẩm & Khóa ẩm",
              "items": [
                { "name": "Kem dưỡng / Gel dưỡng ẩm", "href": "/shop/kem-duong-gel-duong-am" },
                { "name": "Lotion / Emulsion (Sữa dưỡng)", "href": "/shop/lotion-emulsion-sua-duong" },
                { "name": "Xịt khoáng", "href": "/shop/xit-khoang" }
              ]
            },
            {
              "groupName": "Bảo vệ & Chăm sóc riêng",
              "items": [
                { "name": "Kem chống nắng da dầu/khô", "href": "/shop/kem-chong-nang-da-dau-kho" },
                { "name": "Kem / Serum dưỡng mắt", "href": "/shop/kem-serum-duong-mat" },
                { "name": "Dưỡng môi & Tẩy tế bào chết môi", "href": "/shop/duong-moi-tay-te-bao-chet-moi" }
              ]
            }
          ]
        },
        {
          "name": "Chăm sóc tóc & Da đầu",
          "englishName": "HairCare",
          "href": "/shop/cham-soc-toc",
          "icon": "Scissors",
          "groups": [
            {
              "groupName": "Làm sạch & Xả",
              "items": [
                { "name": "Dầu gội đặc trị/kiềm dầu", "href": "/shop?search=Dầu gội" },
                { "name": "Dầu xả phục hồi", "href": "/shop?search=Dầu xả" },
                { "name": "Kem ủ / Mặt nạ cho tóc", "href": "/shop?search=Ủ tóc" }
              ]
            },
            {
              "groupName": "Đặc trị da đầu",
              "items": [
                { "name": "Serum / Tinh chất mọc tóc", "href": "/shop?search=Tinh chất mọc tóc" },
                { "name": "Tẩy tế bào chết da đầu", "href": "/shop?search=Tẩy tế bào chết da đầu" }
              ]
            },
            {
              "groupName": "Dưỡng tóc & Tạo kiểu",
              "items": [
                { "name": "Dầu dưỡng / Xịt dưỡng tóc", "href": "/shop?search=Dầu dưỡng tóc" },
                { "name": "Gel / Sáp / Keo tạo kiểu", "href": "/shop?search=Tạo kiểu" },
                { "name": "Thuốc nhuộm tóc thảo dược", "href": "/shop?search=Nhuộm tóc" }
              ]
            }
          ]
        },
        {
          "name": "Chăm sóc cơ thể",
          "englishName": "BodyCare",
          "href": "/shop/cham-soc-co-the",
          "icon": "Heart",
          "groups": [
            {
              "groupName": "Làm sạch cơ thể",
              "items": [
                { "name": "Sữa tắm dưỡng ẩm/trị mụn", "href": "/shop?search=Sữa tắm" },
                { "name": "Xà phòng tắm thảo dược", "href": "/shop?search=Xà phòng" },
                { "name": "Tẩy tế bào chết cơ thể", "href": "/shop?search=Tẩy da chết body" },
                { "name": "Dung dịch vệ sinh Nam/Nữ", "href": "/shop?search=Dung dịch vệ sinh" }
              ]
            },
            {
              "groupName": "Dưỡng ẩm & Đặc trị",
              "items": [
                { "name": "Sữa dưỡng thể / Body Lotion", "href": "/shop/sua-duong-the-body-lotion" },
                { "name": "Dầu dưỡng thể (Body Oil)", "href": "/shop/dau-duong-the-body-oil" },
                { "name": "Kem dưỡng da tay / da chân", "href": "/shop/kem-duong-da-tay-da-chan" },
                { "name": "Giảm mỡ thon gọn", "href": "/shop/giam-mo-thon-gon" }
              ]
            },
            {
              "groupName": "Khử mùi & Chống nắng",
              "items": [
                { "name": "Lăn / Xịt khử mùi cơ thể", "href": "/shop?search=Khử mùi" },
                { "name": "Xịt thơm toàn thân (Body Mist)", "href": "/shop?search=Body Mist" },
                { "name": "Kem chống nắng toàn thân", "href": "/shop?search=Chống nắng toàn thân" }
              ]
            }
          ]
        },
        {
          "name": "Trang điểm",
          "englishName": "MakeUp",
          "href": "/shop/trang-diem",
          "icon": "Smile",
          "groups": [
            {
              "groupName": "Trang điểm mặt",
              "items": [
                { "name": "Kem lót (Primer)", "href": "/shop?search=Kem lót" },
                { "name": "Cushion / Phấn nước / Kem nền", "href": "/shop?search=Cushion" },
                { "name": "Kem che khuyết điểm", "href": "/shop?search=Che khuyết điểm" },
                { "name": "Phấn phủ dạng bột/nén", "href": "/shop?search=Phấn phủ" },
                { "name": "Phấn má hồng / Tạo khối", "href": "/shop?search=Má hồng" },
                { "name": "Xịt khóa nền giữ lớp trang điểm", "href": "/shop?search=Khóa nền" }
              ]
            },
            {
              "groupName": "Trang điểm mắt",
              "items": [
                { "name": "Chì kẻ mày / Gel kẻ mày", "href": "/shop?search=Kẻ mày" },
                { "name": "Phấn mắt nhũ / Lỳ", "href": "/shop?search=Phấn mắt" },
                { "name": "Kẻ mắt nước / Dạ (Eyeliner)", "href": "/shop?search=Kẻ mắt" },
                { "name": "Mascara chuốt dài mi", "href": "/shop?search=Mascara" }
              ]
            },
            {
              "groupName": "Trang điểm môi",
              "items": [
                { "name": "Son thỏi lỳ / satin", "href": "/shop?search=Son thỏi" },
                { "name": "Son kem / Son tint Hàn Quốc", "href": "/shop?search=Son kem" },
                { "name": "Son bóng căng mọng môi", "href": "/shop?search=Son bóng" },
                { "name": "Chì kẻ viền môi định hình", "href": "/shop?search=Kẻ viền môi" }
              ]
            }
          ]
        },
        {
          "name": "SET Quà Tặng",
          "englishName": "GiftSets",
          "href": "/shop/Set-quà-tặng",
          "icon": "Gift",
          "groups": [
            {
              "groupName": "Set Quà Dưỡng Da",
              "items": [
                { "name": "Set dưỡng da chống lão hóa", "href": "/shop?search=Set dưỡng da chống lão hóa" },
                { "name": "Set dưỡng sáng da mờ thâm", "href": "/shop?search=Set dưỡng sáng da mờ thâm" },
                { "name": "Set phục hồi & cấp ẩm sâu", "href": "/shop?search=Set phục hồi cấp ẩm" }
              ]
            },
            {
              "groupName": "Set Quà Trang Điểm",
              "items": [
                { "name": "Set son môi & phấn má", "href": "/shop?search=Set son môi" },
                { "name": "Set trang điểm toàn diện", "href": "/shop?search=Set trang điểm" }
              ]
            },
            {
              "groupName": "Dịch vụ quà tặng",
              "items": [
                { "name": "Set quà tặng sinh nhật Nữ", "href": "/shop?search=quà tặng sinh nhật" },
                { "name": "Set quà tặng đối tác & VIP", "href": "/shop?search=quà tặng đối tác" },
                { "name": "Hộp quà & Thiệp handmade", "href": "/shop?search=hộp quà" }
              ]
            }
          ]
        }
      ];
      setMenuData(defaultMenu);
      setSelectedId(null);
      toast.success("Đã hoàn tác về menu mặc định ban đầu. Đừng quên nhấn 'Lưu cấu hình Menu' để lưu lại!");
    }
  };

  // Toggle category expansion
  const toggleCat = (idx: number) => {
    setExpandedCats(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Toggle group expansion
  const toggleGrp = (catIdx: number, grpIdx: number) => {
    const key = `${catIdx}-${grpIdx}`;
    setExpandedGrps(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Parse path from selectedId
  const getSelectedNodeInfo = () => {
    if (!selectedId) return null;
    const parts = selectedId.split("-");
    const type = parts[0];
    
    if (type === "cat") {
      const idx = parseInt(parts[1]);
      return { type: "cat", index: [idx], data: menuData[idx], parent: null };
    }
    if (type === "grp") {
      const catIdx = parseInt(parts[1]);
      const grpIdx = parseInt(parts[2]);
      return { type: "grp", index: [catIdx, grpIdx], data: menuData[catIdx].groups[grpIdx], parent: menuData[catIdx] };
    }
    if (type === "item") {
      const catIdx = parseInt(parts[1]);
      const grpIdx = parseInt(parts[2]);
      const itemIdx = parseInt(parts[3]);
      return { type: "item", index: [catIdx, grpIdx, itemIdx], data: menuData[catIdx].groups[grpIdx].items[itemIdx], parent: menuData[catIdx].groups[grpIdx] };
    }
    return null;
  };

  const activeNode = getSelectedNodeInfo();

  // Update field helper
  const updateField = (field: string, value: any) => {
    if (!activeNode) return;
    const newMenuData = JSON.parse(JSON.stringify(menuData));
    
    if (activeNode.type === "cat") {
      const [idx] = activeNode.index;
      newMenuData[idx][field] = value;
    } else if (activeNode.type === "grp") {
      const [catIdx, grpIdx] = activeNode.index;
      newMenuData[catIdx].groups[grpIdx][field] = value;
    } else if (activeNode.type === "item") {
      const [catIdx, grpIdx, itemIdx] = activeNode.index;
      newMenuData[catIdx].groups[grpIdx].items[itemIdx][field] = value;
    }
    setMenuData(newMenuData);
  };

  // Add items L1, L2, L3
  const addCat = () => {
    const newItem: MegaCategory = {
      name: "Danh mục chính mới",
      englishName: "NewCategory",
      href: "/shop/Danh-mục-mới",
      icon: "Sparkles",
      groups: []
    };
    const newMenuData = JSON.parse(JSON.stringify(menuData));
    newMenuData.push(newItem);
    setMenuData(newMenuData);
    setSelectedId(`cat-${newMenuData.length - 1}`);
    setExpandedCats(prev => [...prev, newMenuData.length - 1]);
    toast.success("Đã thêm danh mục chính mới");
  };

  const addGrp = (catIdx: number) => {
    const newItem: CategoryGroup = {
      groupName: "Nhóm con mới",
      items: []
    };
    const newMenuData = JSON.parse(JSON.stringify(menuData));
    newMenuData[catIdx].groups.push(newItem);
    setMenuData(newMenuData);
    setExpandedCats(prev => Array.from(new Set([...prev, catIdx])));
    const newGrpIdx = newMenuData[catIdx].groups.length - 1;
    setSelectedId(`grp-${catIdx}-${newGrpIdx}`);
    setExpandedGrps(prev => Array.from(new Set([...prev, `${catIdx}-${newGrpIdx}`])));
    toast.success("Đã thêm nhóm con mới");
  };

  const addItem = (catIdx: number, grpIdx: number) => {
    const newItem: SubCategoryItem = {
      name: "Liên kết mới",
      href: "/shop"
    };
    const newMenuData = JSON.parse(JSON.stringify(menuData));
    newMenuData[catIdx].groups[grpIdx].items.push(newItem);
    setMenuData(newMenuData);
    const newItemIdx = newMenuData[catIdx].groups[grpIdx].items.length - 1;
    setSelectedId(`item-${catIdx}-${grpIdx}-${newItemIdx}`);
    toast.success("Đã thêm liên kết con mới");
  };

  // Remove L1, L2, L3
  const removeNode = (type: "cat" | "grp" | "item", index: number[]) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phần tử này cùng tất cả các danh mục con bên trong?")) return;
    const newMenuData = JSON.parse(JSON.stringify(menuData));

    if (type === "cat") {
      const [catIdx] = index;
      newMenuData.splice(catIdx, 1);
      setSelectedId(null);
    } else if (type === "grp") {
      const [catIdx, grpIdx] = index;
      newMenuData[catIdx].groups.splice(grpIdx, 1);
      setSelectedId(null);
    } else if (type === "item") {
      const [catIdx, grpIdx, itemIdx] = index;
      newMenuData[catIdx].groups[grpIdx].items.splice(itemIdx, 1);
      setSelectedId(null);
    }

    setMenuData(newMenuData);
    toast.success("Đã xóa phần tử thành công");
  };

  // Reorder node
  const moveNode = (type: "cat" | "grp" | "item", index: number[], direction: "up" | "down") => {
    const newMenuData = JSON.parse(JSON.stringify(menuData));

    if (type === "cat") {
      const [catIdx] = index;
      const targetIdx = direction === "up" ? catIdx - 1 : catIdx + 1;
      if (targetIdx < 0 || targetIdx >= newMenuData.length) return;
      const [moved] = newMenuData.splice(catIdx, 1);
      newMenuData.splice(targetIdx, 0, moved);
      setMenuData(newMenuData);
      setSelectedId(`cat-${targetIdx}`);
    } else if (type === "grp") {
      const [catIdx, grpIdx] = index;
      const groupArr = newMenuData[catIdx].groups;
      const targetIdx = direction === "up" ? grpIdx - 1 : grpIdx + 1;
      if (targetIdx < 0 || targetIdx >= groupArr.length) return;
      const [moved] = groupArr.splice(grpIdx, 1);
      groupArr.splice(targetIdx, 0, moved);
      setMenuData(newMenuData);
      setSelectedId(`grp-${catIdx}-${targetIdx}`);
    } else if (type === "item") {
      const [catIdx, grpIdx, itemIdx] = index;
      const itemsArr = newMenuData[catIdx].groups[grpIdx].items;
      const targetIdx = direction === "up" ? itemIdx - 1 : itemIdx + 1;
      if (targetIdx < 0 || targetIdx >= itemsArr.length) return;
      const [moved] = itemsArr.splice(itemIdx, 1);
      itemsArr.splice(targetIdx, 0, moved);
      setMenuData(newMenuData);
      setSelectedId(`item-${catIdx}-${grpIdx}-${targetIdx}`);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Sparkles": return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "Scissors": return <Scissors className="w-4 h-4 text-blue-500" />;
      case "Heart": return <Heart className="w-4 h-4 text-red-500" />;
      case "Smile": return <Smile className="w-4 h-4 text-emerald-500" />;
      case "Gift": return <Gift className="w-4 h-4 text-rose-500" />;
      default: return <Layout className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Top bar header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 font-serif">Quản lý Link Danh mục sản phẩm</h1>
            <p className="text-xs text-stone-500 mt-1">
              Tùy chỉnh linh hoạt tất cả các link danh mục trên thanh Menu Header của website.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRestoreDefault}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] border border-rose-200/40"
            >
              <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
            </button>
            <button
              onClick={loadMenu}
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" /> Tải lại
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Đang lưu..." : "Lưu cấu hình Menu"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-12 text-center text-stone-400 font-light rounded-2xl border border-stone-100">
            Đang đồng bộ dữ liệu liên kết từ Database...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Clean Accodion Menu management */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                <span className="text-sm font-extrabold uppercase text-stone-800 tracking-wider">Cấu trúc phân cấp</span>
                <button
                  onClick={addCat}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200/40"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Danh mục L1
                </button>
              </div>

              {/* Nested Accordion Elements */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {menuData.map((cat, catIdx) => {
                  const isExpanded = expandedCats.includes(catIdx);
                  const isSelected = selectedId === `cat-${catIdx}`;
                  
                  return (
                    <div 
                      key={catIdx} 
                      className={`border rounded-xl transition-all ${
                        isSelected 
                          ? "border-emerald-800/40 bg-emerald-50/5" 
                          : "border-stone-200/60 bg-white"
                      }`}
                    >
                      {/* L1 Header */}
                      <div 
                        onClick={() => setSelectedId(`cat-${catIdx}`)}
                        className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-stone-50/50 rounded-xl"
                      >
                        <div className="flex items-center gap-2.5">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleCat(catIdx); }}
                            className="p-1 hover:bg-stone-100 rounded text-stone-400"
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-stone-600" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                          <span className="flex items-center">
                            {getIconComponent(cat.icon)}
                          </span>
                          <span className="text-sm font-bold text-stone-800">{cat.name}</span>
                        </div>

                        {/* Inline control actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveNode("cat", [catIdx], "up"); }}
                            className="p-1 text-stone-400 hover:text-stone-700"
                            title="Lên"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveNode("cat", [catIdx], "down"); }}
                            className="p-1 text-stone-400 hover:text-stone-700"
                            title="Xuống"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addGrp(catIdx); }}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Thêm nhóm con"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeNode("cat", [catIdx]); }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* L2 Groups Area */}
                      {isExpanded && (
                        <div className="border-t border-stone-100 p-3 bg-stone-50/20 space-y-3 pl-8">
                          {cat.groups.length === 0 ? (
                            <div className="text-center py-4 text-stone-400 text-[10px] font-light">Chưa có nhóm con nào. Bấm nút + ở trên để thêm.</div>
                          ) : (
                            cat.groups.map((grp, grpIdx) => {
                              const grpKey = `${catIdx}-${grpIdx}`;
                              const isGrpExpanded = expandedGrps.includes(grpKey);
                              const isGrpSelected = selectedId === `grp-${catIdx}-${grpIdx}`;
                              
                              return (
                                <div 
                                  key={grpIdx} 
                                  className={`border rounded-lg transition-all ${
                                    isGrpSelected 
                                      ? "border-emerald-700/35 bg-emerald-50/10" 
                                      : "border-stone-200/50 bg-white"
                                  }`}
                                >
                                  {/* L2 Group Row */}
                                  <div 
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(`grp-${catIdx}-${grpIdx}`); }}
                                    className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-stone-50/50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); toggleGrp(catIdx, grpIdx); }}
                                        className="p-0.5 hover:bg-stone-100 rounded text-stone-400"
                                      >
                                        {isGrpExpanded ? <ChevronDown className="w-3.5 h-3.5 text-stone-600" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                      </button>
                                      <Folder className="w-3.5 h-3.5 text-emerald-800/70" />
                                      <span className="text-xs font-bold text-stone-700">{grp.groupName}</span>
                                    </div>

                                    {/* L2 Controls */}
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); moveNode("grp", [catIdx, grpIdx], "up"); }}
                                        className="p-0.5 text-stone-400 hover:text-stone-700"
                                        title="Lên"
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); moveNode("grp", [catIdx, grpIdx], "down"); }}
                                        className="p-0.5 text-stone-400 hover:text-stone-700"
                                        title="Xuống"
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); addItem(catIdx, grpIdx); }}
                                        className="p-0.5 text-emerald-600 hover:bg-emerald-50 rounded"
                                        title="Thêm link liên kết"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); removeNode("grp", [catIdx, grpIdx]); }}
                                        className="p-0.5 text-rose-600 hover:bg-rose-50 rounded"
                                        title="Xóa"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* L3 Links List */}
                                  {isGrpExpanded && (
                                    <div className="border-t border-stone-100/60 p-2 bg-stone-50/10 pl-6 space-y-1.5">
                                      {grp.items.length === 0 ? (
                                        <div className="text-center py-2 text-stone-400 text-[10px] font-light">Chưa có liên kết nào.</div>
                                      ) : (
                                        grp.items.map((item, itemIdx) => {
                                          const isItemSelected = selectedId === `item-${catIdx}-${grpIdx}-${itemIdx}`;
                                          
                                          return (
                                            <div 
                                              key={itemIdx}
                                              onClick={(e) => { e.stopPropagation(); setSelectedId(`item-${catIdx}-${grpIdx}-${itemIdx}`); }}
                                              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${
                                                isItemSelected 
                                                  ? "bg-emerald-900 text-white shadow-sm" 
                                                  : "bg-white hover:bg-stone-50 border border-stone-100 text-stone-600"
                                              }`}
                                            >
                                              <div className="flex items-center gap-2 text-xs truncate">
                                                <Link2 className="w-3.5 h-3.5 opacity-60" />
                                                <span className="font-medium truncate">{item.name}</span>
                                                <span className={`text-[9px] font-mono truncate px-2 py-0.5 rounded ${
                                                  isItemSelected ? "bg-white/20 text-white" : "bg-stone-50 text-stone-400"
                                                }`}>{item.href}</span>
                                              </div>

                                              {/* L3 Controls */}
                                              <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); moveNode("item", [catIdx, grpIdx, itemIdx], "up"); }}
                                                  className={`p-0.5 ${isItemSelected ? "text-white/80 hover:text-white" : "text-stone-400 hover:text-stone-700"}`}
                                                  title="Lên"
                                                >
                                                  <ArrowUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); moveNode("item", [catIdx, grpIdx, itemIdx], "down"); }}
                                                  className={`p-0.5 ${isItemSelected ? "text-white/80 hover:text-white" : "text-stone-400 hover:text-stone-700"}`}
                                                  title="Xuống"
                                                >
                                                  <ArrowDown className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); removeNode("item", [catIdx, grpIdx, itemIdx]); }}
                                                  className={`p-0.5 rounded ${isItemSelected ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-rose-600 hover:bg-rose-50"}`}
                                                  title="Xóa"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Edit Form parameters */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5">
                <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-extrabold uppercase text-stone-800 tracking-wider">
                    Chỉnh sửa chi tiết
                  </span>
                </div>

                {!activeNode ? (
                  <div className="text-center py-16 text-stone-400 font-light text-xs">
                    Chọn một danh mục hoặc liên kết ở cột bên trái để bắt đầu tùy chỉnh.
                  </div>
                ) : (
                  <div className="space-y-4 text-xs text-stone-700">
                    <div className="bg-stone-50 border border-stone-200/50 rounded-xl p-3 text-stone-500 font-medium">
                      Cấp bậc: <span className="font-extrabold text-emerald-950 uppercase">{activeNode.type === "cat" ? "Danh mục chính (Cấp 1)" : activeNode.type === "grp" ? "Nhóm con (Cấp 2)" : "Liên kết sản phẩm (Cấp 3)"}</span>
                      {activeNode.parent && (
                        <p className="mt-1 text-[10px]">
                          Thuộc: <strong className="text-stone-700">{activeNode.type === "grp" ? activeNode.parent.name : activeNode.parent.groupName}</strong>
                        </p>
                      )}
                    </div>

                    {/* L1 Form */}
                    {activeNode.type === "cat" && (
                      <>
                        <div className="space-y-1.5">
                          <label className="font-bold text-stone-600 block">Tên hiển thị tiếng Việt</label>
                          <input
                            type="text"
                            value={activeNode.data.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-stone-600 block">Tên tiếng Anh (englishName)</label>
                          <input
                            type="text"
                            value={activeNode.data.englishName || ""}
                            onChange={(e) => updateField("englishName", e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-stone-600 block">Liên kết L1 (href)</label>
                          <input
                            type="text"
                            value={activeNode.data.href || ""}
                            onChange={(e) => updateField("href", e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-stone-600 block">Icon hiển thị (Menu Desktop)</label>
                          <div className="grid grid-cols-3 gap-2">
                            {AVAILABLE_ICONS.map((icon) => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => updateField("icon", icon)}
                                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-[10px] font-bold ${
                                  activeNode.data.icon === icon
                                    ? "border-emerald-800 bg-emerald-50 text-emerald-800"
                                    : "border-stone-200 hover:bg-stone-50 text-stone-600"
                                }`}
                              >
                                {getIconComponent(icon)}
                                <span>{icon}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* L2 Form */}
                    {activeNode.type === "grp" && (
                      <div className="space-y-1.5">
                        <label className="font-bold text-stone-600 block">Tên nhóm danh mục con</label>
                        <input
                          type="text"
                          value={(activeNode.data as any).groupName}
                          onChange={(e) => updateField("groupName", e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                        />
                      </div>
                    )}

                    {/* L3 Form */}
                    {activeNode.type === "item" && (
                      <>
                        <div className="space-y-1.5">
                          <label className="font-bold text-stone-600 block">Tên liên kết sản phẩm</label>
                          <input
                            type="text"
                            value={activeNode.data.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-stone-600 block">Đường dẫn liên kết (href)</label>
                          <input
                            type="text"
                            value={activeNode.data.href}
                            onChange={(e) => updateField("href", e.target.value)}
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                            placeholder="Ví dụ: /shop/Sữa-rửa-mặt"
                          />
                          <p className="text-[9px] text-stone-400 mt-1 leading-normal">
                            Sử dụng dấu gạch ngang không khoảng trắng cho các danh mục sản phẩm, ví dụ: <code>/shop/Tên-Danh-Mục</code>
                          </p>
                        </div>
                      </>
                    )}
                    {/* SEO Google metadata fields */}
                    <div className="border-t border-stone-150 pt-4 mt-4 space-y-3">
                      <h4 className="text-xs font-bold uppercase text-emerald-800">Tối ưu SEO Google</h4>
                      
                      <div className="space-y-1.5">
                        <label className="font-bold text-stone-600 block">Tiêu đề hiển thị trên Google (Meta Title)</label>
                        <input
                          type="text"
                          value={activeNode.data.seoTitle || ""}
                          onChange={(e) => updateField("seoTitle", e.target.value)}
                          placeholder="Mặc định lấy tên danh mục nếu trống..."
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-stone-600 block">Mô tả hiển thị trên Google (Meta Description)</label>
                        <textarea
                          value={activeNode.data.seoDesc || ""}
                          onChange={(e) => updateField("seoDesc", e.target.value)}
                          placeholder="Mô tả tóm tắt danh mục..."
                          rows={2}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-stone-600 block">Từ khóa hiển thị trên Google (Meta Keywords)</label>
                        <input
                          type="text"
                          value={activeNode.data.seoKeywords || ""}
                          onChange={(e) => updateField("seoKeywords", e.target.value)}
                          placeholder="Từ khóa cách nhau bằng dấu phẩy..."
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-stone-800 focus:border-emerald-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Informative Tips Box */}
              <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5 space-y-2.5">
                <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-800" /> Cách hoạt động của Bộ lọc Shop
                </h4>
                <div className="text-[10px] text-stone-500 space-y-2 font-light leading-relaxed">
                  <p>🔹 Đường dẫn của liên kết sản phẩm (href) phải trùng với định dạng danh mục chuẩn SEO, ví dụ: <code>/shop/Tẩy-tế-bào-chết-da-mặt</code>.</p>
                  <p>🔹 Khi khách hàng nhấn vào link, trang Cửa hàng sẽ tự động tách cụm chữ sau <code>/shop/</code> và so khớp với tên danh mục sản phẩm trong cơ sở dữ liệu để lọc chính xác.</p>
                  <p>⚠️ <strong>Lưu ý:</strong> Sau khi thay đổi bất kỳ mục nào, vui lòng nhấn nút <strong>Lưu cấu hình Menu</strong> ở trên đầu để cập nhật thay đổi trực tiếp lên website.</p>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  );
}
