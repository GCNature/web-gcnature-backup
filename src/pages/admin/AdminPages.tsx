import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, Edit3, Building2, Info, FileText, Link2, ExternalLink, Settings, Gift, Leaf, Image as ImageIcon, Upload, Search, Camera, Loader2
} from "lucide-react";

// Helper to get URL dynamically based on setting key
const getPageUrl = (key: string) => {
  if (key === "page_home") return "/";
  if (key === "page_about") return "/about";
  if (key === "page_faq") return "/faq";
  if (key === "page_recruitment") return "/tuyen-dung";
  if (key === "page_agent_policy") return "/chinh-sach/dai-ly";
  if (key === "page_catalog") return "/catalog";
  if (key.startsWith("page_policy_")) {
    return `/chinh-sach/${key.replace("page_policy_", "")}`;
  }
  return `/${key}`;
};

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DEFAULT_TABS_CONFIG = {
  npp: {
    name: "Nhà phân phối (NPP)",
    partnerStandard: "Có mặt bằng kinh doanh\nCó văn phòng kinh doanh",
    requiredDocs: "Giấy phép kinh doanh, Thông tin liên hệ, Địa điểm kinh doanh",
    requiredImport: "Đơn hàng tối thiểu 50.000.000 VNĐ",
    discount: "55%",
    bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
    revenueGuarantee: "Được quyền tham gia",
    onlineSale: "Website và Google map",
    exclusive: "Được mở showroom, cửa hàng, thương mại điện tử",
    csmSupport: "Có chuyên gia y dược & Hỗ trợ tổ chức sự kiện hàng tháng",
    mediaSupport: "Cung cấp tư liệu Marketing, hình ảnh sản phẩm, nội dung quảng cáo, và video đào tạo sản phẩm.",
    training: "Tổ chức các buổi huấn luyện về kiến thức sản phẩm, kỹ năng tư vấn khách hàng, và cập nhật xu hướng làm đẹp mới nhất.",
    branding: "Cấp thư ủy quyền phân phối\nCấp Standee chính hãng GCnature",
    debt: "Thỏa thuận"
  },
  bs: {
    name: "Bác sĩ chuyên môn (BS)",
    partnerStandard: "Có mặt bằng kinh doanh",
    requiredDocs: "Giấy phép kinh doanh, Thông tin liên hệ, Địa điểm kinh doanh",
    requiredImport: "Đơn hàng tối thiểu 10.000.000 VNĐ",
    discount: "50%",
    bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
    revenueGuarantee: "Được quyền tham gia",
    onlineSale: "Website và Google map",
    exclusive: "Được mở showroom, cửa hàng, thương mại điện tử",
    csmSupport: "Có chuyên gia y dược & Hỗ trợ tổ chức sự kiện hàng tháng",
    mediaSupport: "Cung cấp tư liệu Marketing, hình ảnh sản phẩm, nội dung quảng cáo, và video đào tạo sản phẩm.",
    training: "Tổ chức các buổi huấn luyện về kiến thức sản phẩm, kỹ năng tư vấn khách hàng, và cập nhật xu hướng làm đẹp mới nhất.",
    branding: "Cấp biển hiệu chính hãng GCnature\nCấp Standee chính hãng GCnature",
    debt: "Thỏa thuận"
  },
  c1: {
    name: "Đại lý cấp 1",
    partnerStandard: "Có mặt bằng kinh doanh",
    requiredDocs: "Giấy phép kinh doanh, Thông tin liên hệ, Địa điểm kinh doanh",
    requiredImport: "Đơn hàng tối thiểu 10.000.000 VNĐ",
    discount: "45%",
    bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
    revenueGuarantee: "Không",
    onlineSale: "Website và Google map",
    exclusive: "Được mở showroom, cửa hàng, thương mại điện tử",
    csmSupport: "Có chuyên gia y dược & Hỗ trợ tổ chức sự kiện hàng tháng",
    mediaSupport: "Cung cấp tư liệu hình ảnh sản phẩm",
    training: "Không",
    branding: "Cấp Standee chính hãng GCnature",
    debt: "Thỏa thuận"
  },
  c2: {
    name: "Đại lý cấp 2",
    partnerStandard: "Có mặt bằng kinh doanh",
    requiredDocs: "Giấy phép kinh doanh, Thông tin liên hệ, Địa điểm kinh doanh",
    requiredImport: "Đơn hàng tối thiểu 5.000.000 VNĐ",
    discount: "40%",
    bonus: "Doanh số từ 50-100 triệu/quý: Thưởng 5%.\nDoanh số từ 100tr - 200 triệu/quý: Thưởng 6%\nDoanh số > 200 triệu/quý: Thưởng 8% + Tour du lịch Hàn Quốc",
    revenueGuarantee: "Không",
    onlineSale: "Website và Google map",
    exclusive: "Được mở showroom, cửa hàng",
    csmSupport: "Không",
    mediaSupport: "Cung cấp tư liệu hình ảnh sản phẩm",
    training: "Không",
    branding: "Cấp Standee chính hãng GCnature",
    debt: "Thỏa thuận"
  }
};

const DEFAULT_LUCKY_WHEEL_CONFIG = {
  title: "CHƯƠNG TRÌNH HOT - VÒNG QUAY MAY MẮN",
  desc: "Quay ngay trúng quà khủng cùng GC Nature",
  introTitle: "/images/popup-hot-sale.png",
  introText: "/chuong-trinh-hot",
  popupDelay: 5,
  popupOpacity: 60,
  popupWidth: 500,
  sections: [],
  tabsConfig: [
    { id: 1, name: "Liệu trình chăm sóc tại đối tác Spa GC Nature", probability: 5, type: "spa" },
    { id: 2, name: "Voucher giảm giá độc quyền 10K đơn từ 100K", probability: 10, type: "voucher", discount: 10000, minOrder: 100000 },
    { id: 3, name: "Voucher giảm giá độc quyền 20K đơn từ 200K", probability: 10, type: "voucher", discount: 20000, minOrder: 200000 },
    { id: 4, name: "Voucher giảm giá độc quyền 30K đơn từ 250K", probability: 10, type: "voucher", discount: 30000, minOrder: 250000 },
    { id: 5, name: "Voucher giảm giá độc quyền 40K đơn từ 350K", probability: 10, type: "voucher", discount: 40000, minOrder: 350000 },
    { id: 6, name: "Voucher giảm giá độc quyền 50K đơn từ 450K", probability: 10, type: "voucher", discount: 50000, minOrder: 450000 },
    { id: 7, name: "Voucher giảm giá độc quyền 100K đơn từ 900K", probability: 10, type: "voucher", discount: 100000, minOrder: 900000 },
    { id: 8, name: "Tặng 10 Mặt Nạ CICA COMPLEX GC NATURE", probability: 5, type: "physical" },
    { id: 9, name: "Tặng 10 Mặt nạ HYALURONIC GC NATURE", probability: 5, type: "physical" },
    { id: 10, name: "Tặng 10 Mặt nạ VITAMIN-C GC NATURE", probability: 5, type: "physical" },
    { id: 11, name: "Tặng chuyến du lịch Hàn Quốc 10.000.000đ", probability: 0, type: "other" },
    { id: 12, name: "Tặng 1 Mặt Nạ CICA COMPLEX GC NATURE", probability: 5, type: "physical" },
    { id: 13, name: "Tặng 1 Mặt nạ HYALURONIC GC NATURE", probability: 5, type: "physical" },
    { id: 14, name: "Tặng 1 Mặt nạ VITAMIN-C GC NATURE", probability: 5, type: "physical" }
  ],
  seoTitle: "Chương Trình Vòng Quay May Mắn - GC Nature",
  seoDesc: "Tham gia vòng quay may mắn rinh quà tặng khủng cùng mỹ phẩm tự nhiên Hàn Quốc GC Nature.",
  seoKeywords: "vòng quay may mắn, khuyến mãi gc nature, quà tặng mỹ phẩm"
};

import { useSearchParams } from "react-router-dom";

export default function AdminPages() {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // CMS Static Pages State
  const [allSettings, setAllSettings] = useState<Record<string, string>>({});
  const [selectedPageKey, setSelectedPageKey] = useState<string>("page_about");

  useEffect(() => {
    if (pageParam) {
      setSelectedPageKey(pageParam);
    }
  }, [pageParam]);

  const [pageContent, setPageContent] = useState<{
    title: string;
    desc: string;
    sections: { title: string; content: string }[];
    tabsConfig?: any;
    introTitle?: string;
    introText?: string;
    updatedAt?: string;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
    heroImage?: string;
    showroomImage?: string;
    koreaImage?: string;
    bannerImage?: string;
  }>({
    title: "",
    desc: "",
    sections: [],
    tabsConfig: null,
    introTitle: "",
    introText: "",
    seoTitle: "",
    seoDesc: "",
    seoKeywords: "",
    heroImage: "",
    showroomImage: "",
    koreaImage: "",
    bannerImage: ""
  });

  const [activeAgentTab, setActiveAgentTab] = useState<string>("npp");
  const editInputClass = "bg-transparent border border-dashed border-gray-300/40 hover:border-teal-500 focus:border-teal-600 focus:bg-white/10 rounded px-1.5 py-0.5 w-full transition-all focus:outline-none";
  const editTextAreaClass = "bg-transparent border border-dashed border-gray-300/40 hover:border-teal-500 focus:border-teal-600 focus:bg-white/10 rounded px-2 py-1 w-full transition-all focus:outline-none resize-y";

  // State to edit page slug for dynamic policies
  const [editingSlug, setEditingSlug] = useState("");

  // Image Picker Dialog States
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerCallback, setImagePickerCallback] = useState<((url: string) => void) | null>(null);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [searchMedia, setSearchMedia] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const openImagePicker = (onSelect: (url: string) => void) => {
    setImagePickerCallback(() => onSelect);
    setImagePickerOpen(true);
    loadMediaFiles();
  };

  const loadMediaFiles = async () => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch('/api/media/list', { headers });
      if (res.ok) {
        const data = await res.json();
        setMediaFiles(data.files || []);
      }
    } catch (err) {
      console.error("Load media files error:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleUploadMedia = async (file: File) => {
    setUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append("images", file);
      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch('/api/media/upload', {
        method: "POST",
        body: formData,
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Tải ảnh lên thành công!");
        if (data.files && data.files.length > 0 && imagePickerCallback) {
          imagePickerCallback(data.files[0].url);
        }
        setImagePickerOpen(false);
      } else {
        toast.error("Tải ảnh thất bại.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Lỗi khi tải ảnh lên.");
    } finally {
      setUploadingMedia(false);
    }
  };

  // States for new policy page dialog
  const [newPolicyOpen, setNewPolicyOpen] = useState(false);
  const [newPolicyTitle, setNewPolicyTitle] = useState("");
  const [newPolicySlug, setNewPolicySlug] = useState("");

  // Gift spins state
  const [giftEmail, setGiftEmail] = useState("");
  const [giftSpins, setGiftSpins] = useState(1);
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftResult, setGiftResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleGiftSpins = async () => {
    if (!giftEmail.trim()) { toast.error('Vui lòng nhập email người dùng.'); return; }
    if (giftSpins < 1) { toast.error('Số lượt quay phải >= 1.'); return; }
    setGiftLoading(true);
    setGiftResult(null);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/lucky-wheel/gift-spins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: giftEmail.trim(), spins: giftSpins })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setGiftResult({ success: true, message: data.message });
        setGiftEmail('');
        setGiftSpins(1);
      } else {
        toast.error(data.error || 'Có lỗi xảy ra');
        setGiftResult({ success: false, message: data.error });
      }
    } catch (err) {
      toast.error('Lỗi kết nối server');
    } finally {
      setGiftLoading(false);
    }
  };

  // Load settings from API on mount
  const loadSettings = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`/api/settings?_t=${Date.now()}`, { headers });
      const data = await response.json();
      setAllSettings(data);
    } catch (error) {
      console.error('Load settings error:', error);
      toast.error('Không thể tải cấu hình từ server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Sync editingSlug when selectedPageKey changes
  useEffect(() => {
    if (selectedPageKey.startsWith("page_policy_")) {
      setEditingSlug(selectedPageKey.replace("page_policy_", ""));
    } else {
      setEditingSlug(selectedPageKey);
    }
  }, [selectedPageKey]);

  // Load page content when page selection changes
  useEffect(() => {
    const val = allSettings[selectedPageKey];
    if (val) {
      try {
        const parsed = JSON.parse(val);
        setPageContent({
          title: parsed.title || "",
          desc: parsed.desc || "",
          sections: parsed.sections || [],
          tabsConfig: parsed.tabsConfig || (selectedPageKey === "page_agent_policy" ? DEFAULT_TABS_CONFIG : selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG.tabsConfig : null),
          introTitle: parsed.introTitle || (selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG.introTitle : ""),
          introText: parsed.introText || (selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG.introText : ""),
          popupDelay: parsed.popupDelay !== undefined ? parsed.popupDelay : (selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG.popupDelay : 5),
          popupOpacity: parsed.popupOpacity !== undefined ? parsed.popupOpacity : (selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG.popupOpacity : 60),
          popupWidth: parsed.popupWidth !== undefined ? parsed.popupWidth : (selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG.popupWidth : 500),
          updatedAt: parsed.updatedAt || undefined,
          seoTitle: parsed.seoTitle || "",
          seoDesc: parsed.seoDesc || "",
          seoKeywords: parsed.seoKeywords || "",
          heroImage: parsed.heroImage || "",
          showroomImage: parsed.showroomImage || "",
          koreaImage: parsed.koreaImage || "",
          bannerImage: parsed.bannerImage || ""
        });
      } catch {
        setPageContent(selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG : { title: "", desc: "", sections: [], tabsConfig: selectedPageKey === "page_agent_policy" ? DEFAULT_TABS_CONFIG : null, introTitle: "", introText: "", popupDelay: 5, popupOpacity: 60, popupWidth: 500, seoTitle: "", seoDesc: "", seoKeywords: "", heroImage: "", showroomImage: "", koreaImage: "", bannerImage: "" });
      }
    } else {
      setPageContent(selectedPageKey === "page_lucky_wheel" ? DEFAULT_LUCKY_WHEEL_CONFIG : {
        title: "",
        desc: "",
        sections: [],
        tabsConfig: selectedPageKey === "page_agent_policy" ? DEFAULT_TABS_CONFIG : null,
        introTitle: "",
        introText: "",
        popupDelay: 5,
        popupOpacity: 60,
        popupWidth: 500,
        seoTitle: "",
        seoDesc: "",
        seoKeywords: "",
        heroImage: "",
        showroomImage: "",
        koreaImage: "",
        bannerImage: ""
      });
    }
  }, [selectedPageKey, allSettings]);

  const handleSavePage = async () => {
    if (selectedPageKey.startsWith("page_policy_") && !editingSlug.trim()) {
      toast.error("Vui lòng nhập slug đường dẫn hợp lệ");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: pageContent.title,
        desc: pageContent.desc,
        sections: pageContent.sections,
        tabsConfig: pageContent.tabsConfig || null,
        introTitle: pageContent.introTitle || null,
        introText: pageContent.introText || null,
        popupDelay: pageContent.popupDelay !== undefined ? pageContent.popupDelay : 5,
        popupOpacity: pageContent.popupOpacity !== undefined ? pageContent.popupOpacity : 60,
        popupWidth: pageContent.popupWidth !== undefined ? pageContent.popupWidth : 500,
        updatedAt: new Date().toISOString(),
        seoTitle: pageContent.seoTitle || "",
        seoDesc: pageContent.seoDesc || "",
        seoKeywords: pageContent.seoKeywords || "",
        heroImage: pageContent.heroImage || "",
        showroomImage: pageContent.showroomImage || "",
        koreaImage: pageContent.koreaImage || "",
        bannerImage: pageContent.bannerImage || ""
      };

      let targetKey = selectedPageKey;
      let keyToDelete = null;

      // Handle custom policy slug change
      if (selectedPageKey.startsWith("page_policy_")) {
        const oldSlug = selectedPageKey.replace("page_policy_", "");
        if (editingSlug !== oldSlug) {
          targetKey = `page_policy_${editingSlug}`;
          keyToDelete = selectedPageKey;
        }
      }

      const dataToSave = {
        [targetKey]: JSON.stringify(payload)
      };

      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 1. Save new page configuration
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        // 2. Delete old config if slug changed
        if (keyToDelete) {
          await fetch(`/api/settings/${keyToDelete}`, {
            method: 'DELETE',
            headers
          });
        }

        toast.success("Đã lưu và cập nhật trang thành công!");
        
        // Update local settings state
        setAllSettings(prev => {
          const next = { ...prev, [targetKey]: JSON.stringify(payload) };
          if (keyToDelete) delete next[keyToDelete];
          return next;
        });

        setSelectedPageKey(targetKey);
      } else {
        toast.error("Có lỗi xảy ra khi lưu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối server");
    } finally {
      setSaving(false);
    }
  };

  // Delete page config
  const handleDeletePage = async () => {
    const isDefault = [
      "page_about", "page_faq", "page_recruitment", "page_agent_policy", "page_lucky_wheel",
      "page_policy_mua-hang", "page_policy_bao-mat", "page_policy_thanh-toan"
    ].includes(selectedPageKey);

    if (isDefault) {
      toast.error("Không thể xóa trang hệ thống mặc định");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa trang chính sách này?")) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/settings/${selectedPageKey}`, {
        method: 'DELETE',
        headers
      });

      if (res.ok) {
        toast.success("Đã xóa trang chính sách thành công!");
        setAllSettings(prev => {
          const next = { ...prev };
          delete next[selectedPageKey];
          return next;
        });
        setSelectedPageKey("page_about");
      } else {
        toast.error("Lỗi khi xóa trang");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  // Create new policy page
  const handleCreatePolicy = async () => {
    if (!newPolicyTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    const slug = newPolicySlug.trim() 
      ? newPolicySlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') 
      : newPolicyTitle.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 30);

    const targetKey = `page_policy_${slug}`;

    if (allSettings[targetKey]) {
      toast.error("Slug đường dẫn này đã tồn tại");
      return;
    }

    const payload = {
      title: newPolicyTitle,
      desc: `Mô tả chính sách ${newPolicyTitle}`,
      sections: [{ title: "Điều 1: Quy định chung", content: "Nội dung điều 1..." }],
      updatedAt: new Date().toISOString()
    };

    setSaving(true);
    try {
      const token = localStorage.getItem("token") || "";
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ [targetKey]: JSON.stringify(payload) })
      });

      if (response.ok) {
        toast.success("Đã tạo trang chính sách mới!");
        setAllSettings(prev => ({ ...prev, [targetKey]: JSON.stringify(payload) }));
        setSelectedPageKey(targetKey);
        setNewPolicyOpen(false);
        setNewPolicyTitle("");
        setNewPolicySlug("");
      } else {
        toast.error("Lỗi khi tạo trang chính sách mới");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  // Render options dynamically based on allSettings
  const getPageOptions = () => {
    const options = [
      { key: "page_home", name: "Trang chủ (Home Page)" },
      { key: "page_about", name: "Trang Giới thiệu (About)" },
      { key: "page_faq", name: "Trang Câu hỏi thường gặp (FAQ)" },
      { key: "page_recruitment", name: "Trang Tuyển dụng (Recruitment)" },
      { key: "page_agent_policy", name: "Chính sách Đại lý (Các gói)" },
      { key: "page_catalog", name: "Trang Catalog sản phẩm (Catalog)" },
      { key: "page_lucky_wheel", name: "Vòng quay may mắn (Chương trình Hot)" },
    ];

    // Read policy pages in allSettings
    const policyKeys = Object.keys(allSettings).filter(k => k.startsWith("page_policy_"));
    
    // Core default policy keys to initialize if not exist
    const defaultPolicies = [
      "page_policy_mua-hang",
      "page_policy_bao-mat",
      "page_policy_thanh-toan",
      "page_policy_khach-hang-than-thiet",
      "page_policy_khieu-nai",
      "page_policy_oem",
      "page_policy_affiliate",
    ];

    const uniqueKeys = Array.from(new Set([...defaultPolicies, ...policyKeys]));

    uniqueKeys.forEach(k => {
      let label = "";
      try {
        const val = allSettings[k];
        const parsed = val ? JSON.parse(val) : null;
        label = parsed?.title || k.replace("page_policy_", "").replace(/-/g, " ");
      } catch {
        label = k.replace("page_policy_", "").replace(/-/g, " ");
      }
      options.push({ key: k, name: `Chính sách: ${label}` });
    });

    return options;
  };

  const handleAddSection = () => {
    setPageContent(prev => ({
      ...prev,
      sections: [...prev.sections, { title: "Mục mới", content: "" }]
    }));
  };

  const handleRemoveSection = (index: number) => {
    setPageContent(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
    setPageContent(prev => {
      const newSecs = [...prev.sections];
      newSecs[index] = { ...newSecs[index], [field]: value };
      return { ...prev, sections: newSecs };
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    setPageContent(prev => {
      const newSecs = [...prev.sections];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newSecs.length) return prev;
      
      const temp = newSecs[index];
      newSecs[index] = newSecs[targetIndex];
      newSecs[targetIndex] = temp;
      
      return { ...prev, sections: newSecs };
    });
  };

  const isDefaultSystemPage = [
    "page_home", "page_about", "page_faq", "page_recruitment", "page_agent_policy", "page_catalog", "page_lucky_wheel",
    "page_policy_mua-hang", "page_policy_bao-mat", "page_policy_thanh-toan"
  ].includes(selectedPageKey);

  return (
    <AdminLayout title="Quản lý trang">
      <div className="max-w-5xl space-y-6">
        
        {/* Floating/Sticky Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20">
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Edit3 className="w-5 h-5 text-teal-600 shrink-0" />
            <select
              value={selectedPageKey}
              onChange={(e) => setSelectedPageKey(e.target.value)}
              className="flex h-10 w-full md:w-72 rounded-lg border border-input bg-background px-3 py-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
            >
              {getPageOptions().map(opt => (
                <option key={opt.key} value={opt.key}>{opt.name}</option>
              ))}
            </select>
            <Button
              onClick={() => setNewPolicyOpen(true)}
              type="button"
              variant="outline"
              size="sm"
              className="h-10 shrink-0"
              title="Tạo trang chính sách mới"
            >
              <Plus className="w-4 h-4 mr-1" /> Trang mới
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {!isDefaultSystemPage && (
              <Button
                onClick={handleDeletePage}
                type="button"
                variant="destructive"
                className="gap-2 font-bold"
                title="Xóa trang chính sách này"
              >
                <Trash2 className="w-4 h-4" />
                Xóa trang
              </Button>
            )}
            <Button
              onClick={handleAddSection}
              type="button"
              variant="outline"
              className="gap-2 border-dashed border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              <Plus className="w-4 h-4" />
              Thêm phần nội dung
            </Button>
            <Button
              onClick={handleSavePage}
              disabled={saving || loading}
              className="gap-2 bg-teal-600 hover:bg-teal-700 font-bold"
            >
              <Save className="w-4 h-4" />
              Lưu & Xuất bản
            </Button>
          </div>
        </div>

        {/* URL info bar */}
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-teal-700 shrink-0">
            <Link2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">Đường dẫn trang</span>
          </div>
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <span className="text-xs text-gray-400 font-mono shrink-0">
              {selectedPageKey.startsWith("page_policy_") ? "gcnature.com.vn/chinh-sach/" : "gcnature.com.vn/"}
            </span>
            <Input
              value={editingSlug}
              onChange={(e) => {
                if (selectedPageKey.startsWith("page_policy_")) {
                  setEditingSlug(e.target.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'));
                }
              }}
              readOnly={!selectedPageKey.startsWith("page_policy_")}
              className={`font-mono text-xs h-8 text-gray-700 ${!selectedPageKey.startsWith("page_policy_") ? "bg-gray-50 cursor-default border-dashed" : "bg-white border-solid border-teal-300"}`}
              placeholder="slug-duong-dan"
              title={selectedPageKey.startsWith("page_policy_") ? "Bạn có thể chỉnh sửa slug cho trang chính sách này" : "Đường dẫn này được cố định theo cấu hình hệ thống"}
            />
            <a
              href={getPageUrl(selectedPageKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 px-2 py-1 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Xem trang
            </a>
          </div>
        </div>

        {/* Date updated indicator */}
        {pageContent.updatedAt && (
          <div className="text-xs text-gray-500 italic bg-teal-50/50 border border-teal-100 rounded-lg p-3 flex items-center justify-between">
            <span>Trang này đã được lưu và cập nhật lần cuối: <strong>{new Date(pageContent.updatedAt).toLocaleString('vi-VN')}</strong></span>
            <span className="text-[10px] uppercase font-bold text-teal-600 bg-white px-2 py-0.5 rounded border border-teal-100">Live</span>
          </div>
        )}

        {/* Visual Live Editor Canvas */}
        <div className="border border-gray-200/80 rounded-3xl bg-[#f8fafc] overflow-hidden shadow-inner p-4 md:p-8 min-h-[500px]">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Đang tải cấu trúc trang con...</div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Tối ưu SEO Google */}
              <div className="bg-white rounded-3xl border border-gray-200/50 p-6 md:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <div className="bg-teal-50 p-2 rounded-xl text-teal-600">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Tối ưu SEO Google cho Trang này</h3>
                    <p className="text-[10px] text-gray-400">Các thẻ meta tiêu đề, mô tả và từ khóa xuất hiện trên Google</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700">Tiêu đề hiển thị trên Google (Meta Title)</Label>
                    <Input
                      value={pageContent.seoTitle || ""}
                      onChange={(e) => setPageContent({ ...pageContent, seoTitle: e.target.value })}
                      placeholder="Nhập tiêu đề SEO..."
                      className="w-full text-sm border border-gray-200 rounded-lg p-2.5"
                    />
                    <p className="text-[10px] text-gray-400">Độ dài tối ưu: 50 - 60 ký tự. Mặc định sẽ lấy tiêu đề trang chính nếu bỏ trống.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700">Mô tả hiển thị trên Google (Meta Description)</Label>
                    <textarea
                      value={pageContent.seoDesc || ""}
                      onChange={(e) => setPageContent({ ...pageContent, seoDesc: e.target.value })}
                      placeholder="Nhập mô tả SEO..."
                      className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-transparent"
                      rows={2}
                    />
                    <p className="text-[10px] text-gray-400">Độ dài tối ưu: 150 - 160 ký tự. Mặc định sẽ lấy mô tả trang chính nếu bỏ trống.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-700">Từ khóa hiển thị trên Google (Meta Keywords)</Label>
                    <Input
                      value={pageContent.seoKeywords || ""}
                      onChange={(e) => setPageContent({ ...pageContent, seoKeywords: e.target.value })}
                      placeholder="mỹ phẩm hàn quốc, gcnature, giới thiệu..."
                      className="w-full text-sm border border-gray-200 rounded-lg p-2.5"
                    />
                    <p className="text-[10px] text-gray-400">Các từ khóa cách nhau bằng dấu phẩy.</p>
                  </div>
                </div>
              </div>
              
              {/* RENDER DYNAMIC AGENT POLICY PAGE VISUALLY */}
              {selectedPageKey === "page_agent_policy" && (() => {
                const tabsConfig = pageContent.tabsConfig || DEFAULT_TABS_CONFIG;
                return (
                  <div className="space-y-8">
                    
                    {/* Hero Banner Visual */}
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-teal-950 text-white min-h-[220px] flex items-center p-6 md:p-10 border border-teal-500/20 shadow-md group/hero">
                      <div className="absolute inset-0">
                        <img src={pageContent.heroImage || "/banners/agent_policy_banner.png"} className="w-full h-full object-cover opacity-40" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/60 to-transparent" />
                      </div>
                      {/* ALWAYS AT THE TOP LAYER (z-40) & FLOATING TOP-RIGHT */}
                      <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/hero:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, heroImage: url }))}
                          className="bg-white hover:bg-teal-50 text-teal-950 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md border border-teal-100"
                        >
                          <Camera className="w-4 h-4 text-teal-600" /> Thay ảnh Banner
                        </Button>
                      </div>
                      <div className="relative z-10 w-full space-y-3">
                        <span className="text-[9px] uppercase font-black tracking-widest text-teal-300 bg-teal-900/50 px-3 py-1 rounded-full border border-teal-500/30">
                          Hero Banner (Click chữ để sửa trực tiếp)
                        </span>
                        <input
                          value={pageContent.title}
                          onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                          className={`${editInputClass} text-2xl md:text-4xl font-black text-white`}
                          placeholder="CHÍNH SÁCH ĐẠI LÝ TOÀN QUỐC"
                        />
                        <input
                          value={pageContent.desc}
                          onChange={(e) => setPageContent({ ...pageContent, desc: e.target.value })}
                          className={`${editInputClass} text-xs md:text-sm text-teal-200 uppercase tracking-widest`}
                          placeholder="CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI GC NATURE"
                        />
                      </div>
                    </div>

                    {/* Brand Intro 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-gray-150 p-6 md:p-8 rounded-[2rem] shadow-sm">
                      <div className="md:col-span-7 space-y-4">
                        <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase">
                          Giới thiệu thương hiệu
                        </span>
                        <input
                          value={pageContent.sections[0]?.title || ""}
                          onChange={(e) => handleSectionChange(0, 'title', e.target.value)}
                          className={`${editInputClass} text-lg md:text-xl font-extrabold text-gray-900`}
                          placeholder="Giới thiệu thương hiệu..."
                        />
                        <textarea
                          value={pageContent.sections[0]?.content || ""}
                          onChange={(e) => handleSectionChange(0, 'content', e.target.value)}
                          className={`${editTextAreaClass} text-gray-600 text-sm leading-relaxed`}
                          rows={8}
                          placeholder="Nội dung giới thiệu..."
                        />
                      </div>
                      <div className="md:col-span-5 relative border border-gray-100 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-gray-50 group/showroom">
                        <img src={pageContent.showroomImage || "/banners/agent_showroom.png"} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/showroom:opacity-100 transition-opacity bg-black/40 z-30">
                          <Button
                            type="button"
                            onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, showroomImage: url }))}
                            className="bg-white hover:bg-teal-50 text-teal-950 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md border border-teal-100"
                          >
                            <Camera className="w-4 h-4 text-teal-600" /> Thay ảnh Showroom
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2 bg-teal-950/75 text-white text-[10px] p-2 rounded-lg text-center font-medium truncate z-10">
                          Ảnh: {pageContent.showroomImage || "/banners/agent_showroom.png"}
                        </div>
                      </div>
                    </div>

                    {/* KPI Horizontal Banner Visual Preview */}
                    <div className="relative rounded-[2rem] overflow-hidden shadow-md border border-teal-100/50 aspect-[3/1] min-h-[160px] flex items-center bg-teal-950 p-6 group/korea">
                      <img src={pageContent.koreaImage || "/banners/korea_travel_banner.png"} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] bg-gradient-to-r from-white/95 via-white/80 to-transparent animate-none" />
                      {/* ALWAYS AT THE TOP LAYER (z-40) & FLOATING TOP-RIGHT */}
                      <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/korea:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, koreaImage: url }))}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md"
                        >
                          <Camera className="w-4 h-4" /> Thay ảnh Nền Thưởng Quý
                        </Button>
                      </div>
                      <div className="relative z-10 max-w-2xl space-y-2">
                        <span className="bg-teal-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                          Banner ngang thưởng quý (Visual Preview)
                        </span>
                        <h3 className="text-lg md:text-xl font-black text-teal-950 uppercase leading-tight">
                          Chương trình đại lý THƯỞNG KPI QUÝ &amp; DU LỊCH HÀN QUỐC
                        </h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">
                          Mốc thưởng quý (áp dụng cho tất cả đại lý): 50-100tr (+5%), 100-200tr (+6%), &gt;200tr (+8% + Tour Hàn Quốc)
                        </p>
                      </div>
                    </div>

                    {/* Config grid inside live template */}
                    <div className="bg-white rounded-[2rem] border border-gray-150 p-6 md:p-8 shadow-sm space-y-6">
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="bg-teal-50 p-2 rounded-xl text-teal-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">Cấu hình Chi tiết cho từng Gói Đại lý</h3>
                          <p className="text-xs text-gray-400">Chọn cấp đại lý bên dưới để chỉnh sửa thông số tương ứng trực quan</p>
                        </div>
                      </div>

                      {/* Tab select buttons */}
                      <div className="grid grid-cols-4 gap-2 bg-gray-50 p-1 rounded-xl">
                        {["npp", "bs", "c1", "c2"].map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveAgentTab(key)}
                            className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold tracking-wide transition-all ${
                              activeAgentTab === key
                                ? "bg-teal-600 text-white shadow"
                                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                            }`}
                          >
                            {tabsConfig[key]?.name || key.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      {/* Details block for active agent tab */}
                      {(() => {
                        const pkgKey = activeAgentTab;
                        const currentPkg = tabsConfig[pkgKey] || DEFAULT_TABS_CONFIG[pkgKey as keyof typeof DEFAULT_TABS_CONFIG];
                        if (!currentPkg) return null;

                        const updateField = (field: string, val: string) => {
                          const tabs = pageContent.tabsConfig || { ...DEFAULT_TABS_CONFIG };
                          const updatedPkg = { ...tabs[pkgKey], [field]: val };
                          setPageContent({
                            ...pageContent,
                            tabsConfig: {
                              ...tabs,
                              [pkgKey]: updatedPkg
                            }
                          });
                        };

                        return (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                            {/* Left columns */}
                            <div className="lg:col-span-8 space-y-6">
                              {/* Section 1: Điều kiện */}
                              <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5 space-y-4">
                                <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider pb-2 border-b border-gray-200/50">
                                  1. Tiêu chuẩn &amp; Điều kiện đăng ký
                                </h4>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Tiêu chuẩn mặt bằng:</div>
                                    <div className="md:col-span-8">
                                      <textarea
                                        value={currentPkg.partnerStandard || ""}
                                        onChange={(e) => updateField("partnerStandard", e.target.value)}
                                        className={`${editTextAreaClass} text-xs`}
                                        rows={2}
                                        placeholder="Yêu cầu về mặt bằng..."
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs border-t border-gray-200/40 pt-3">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Hồ sơ cần cung cấp:</div>
                                    <div className="md:col-span-8">
                                      <textarea
                                        value={currentPkg.requiredDocs || ""}
                                        onChange={(e) => updateField("requiredDocs", e.target.value)}
                                        className={`${editTextAreaClass} text-xs`}
                                        rows={2}
                                        placeholder="Giấy tờ hồ sơ yêu cầu..."
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs border-t border-gray-200/40 pt-3">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Định mức nhập hàng:</div>
                                    <div className="md:col-span-8">
                                      <textarea
                                        value={currentPkg.requiredImport || ""}
                                        onChange={(e) => updateField("requiredImport", e.target.value)}
                                        className={`${editTextAreaClass} text-xs font-bold text-teal-700`}
                                        rows={2}
                                        placeholder="Định mức đơn tối thiểu..."
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Section 2: Quyền lợi */}
                              <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5 space-y-4">
                                <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider pb-2 border-b border-gray-200/50">
                                  2. Quyền lợi &amp; Hỗ trợ từ Hãng
                                </h4>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Phạm vi trực tuyến:</div>
                                    <div className="md:col-span-8">
                                      <input
                                        value={currentPkg.onlineSale || ""}
                                        onChange={(e) => updateField("onlineSale", e.target.value)}
                                        className={`${editInputClass} text-xs`}
                                        placeholder="Phạm vi bán hàng online..."
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs border-t border-gray-200/40 pt-3">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Độc quyền / Kinh doanh:</div>
                                    <div className="md:col-span-8">
                                      <input
                                        value={currentPkg.exclusive || ""}
                                        onChange={(e) => updateField("exclusive", e.target.value)}
                                        className={`${editInputClass} text-xs`}
                                        placeholder="Quy chế độc quyền..."
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs border-t border-gray-200/40 pt-3">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Hỗ trợ sự kiện &amp; y tế:</div>
                                    <div className="md:col-span-8">
                                      <input
                                        value={currentPkg.csmSupport || ""}
                                        onChange={(e) => updateField("csmSupport", e.target.value)}
                                        className={`${editInputClass} text-xs`}
                                        placeholder="Tổ chức sự kiện..."
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs border-t border-gray-200/40 pt-3">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Tư liệu truyền thông:</div>
                                    <div className="md:col-span-8">
                                      <textarea
                                        value={currentPkg.mediaSupport || ""}
                                        onChange={(e) => updateField("mediaSupport", e.target.value)}
                                        className={`${editTextAreaClass} text-xs`}
                                        rows={2}
                                        placeholder="Hỗ trợ marketing hình ảnh..."
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs border-t border-gray-200/40 pt-3">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Khóa học đào tạo:</div>
                                    <div className="md:col-span-8">
                                      <textarea
                                        value={currentPkg.training || ""}
                                        onChange={(e) => updateField("training", e.target.value)}
                                        className={`${editTextAreaClass} text-xs`}
                                        rows={2}
                                        placeholder="Đào tạo huấn luyện..."
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start text-xs border-t border-gray-200/40 pt-3">
                                    <div className="md:col-span-4 font-bold text-gray-500 pt-2">Nhận diện thương hiệu:</div>
                                    <div className="md:col-span-8">
                                      <textarea
                                        value={currentPkg.branding || ""}
                                        onChange={(e) => updateField("branding", e.target.value)}
                                        className={`${editTextAreaClass} text-xs`}
                                        rows={2}
                                        placeholder="Ủy quyền, bảng hiệu..."
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right columns */}
                            <div className="lg:col-span-4 space-y-6">
                              <div className="bg-gradient-to-br from-teal-900 to-teal-950 text-white rounded-2xl p-5 space-y-4 shadow">
                                <div>
                                  <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider block mb-1">Mức chiết khấu cố định</span>
                                  <input
                                    value={currentPkg.discount || ""}
                                    onChange={(e) => updateField("discount", e.target.value)}
                                    className={`${editInputClass} text-3xl font-black text-white border-white/20`}
                                    placeholder="55%"
                                  />
                                </div>
                                <div className="border-t border-teal-800/60 pt-3">
                                  <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider block mb-1">Hỗ trợ công nợ</span>
                                  <input
                                    value={currentPkg.debt || ""}
                                    onChange={(e) => updateField("debt", e.target.value)}
                                    className={`${editInputClass} text-xs font-semibold text-white border-white/20`}
                                    placeholder="Công nợ linh hoạt..."
                                  />
                                </div>
                                <div className="border-t border-teal-800/60 pt-3">
                                  <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider block mb-1">Bao tiêu &amp; Hỗ trợ đầu ra</span>
                                  <input
                                    value={currentPkg.revenueGuarantee || ""}
                                    onChange={(e) => updateField("revenueGuarantee", e.target.value)}
                                    className={`${editInputClass} text-xs font-semibold text-white border-white/20`}
                                    placeholder="Bao tiêu đầu ra..."
                                  />
                                </div>
                              </div>

                              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 space-y-2">
                                <span className="text-teal-800 text-[10px] font-bold uppercase tracking-wider block">Thưởng doanh số bổ sung</span>
                                <textarea
                                  value={currentPkg.bonus || ""}
                                  onChange={(e) => updateField("bonus", e.target.value)}
                                  className={`${editTextAreaClass} text-xs text-gray-700 bg-white`}
                                  rows={6}
                                  placeholder="Doanh số quý..."
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* RENDER DYNAMIC POLICY PAGES VISUALLY */}
              {selectedPageKey.startsWith("page_policy_") && selectedPageKey !== "page_policy_oem" && (
                <div className="max-w-4xl mx-auto bg-white rounded-[2rem] border border-gray-150 p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center space-y-3 border-b border-gray-100 pb-6">
                    <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase">
                      Văn bản chính sách (Chỉnh sửa trực quan)
                    </span>
                    <input
                      value={pageContent.title}
                      onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                      className={`${editInputClass} text-2xl md:text-3xl font-black text-center text-gray-900`}
                      placeholder="Tiêu đề chính sách"
                    />
                    <textarea
                      value={pageContent.desc}
                      onChange={(e) => setPageContent({ ...pageContent, desc: e.target.value })}
                      className={`${editTextAreaClass} text-center text-gray-500 text-xs md:text-sm`}
                      rows={2}
                      placeholder="Mô tả chính sách..."
                    />
                  </div>

                  <div className="space-y-6">
                    {pageContent.sections.map((sec, idx) => (
                      <div key={idx} className="relative group hover:bg-gray-50/50 p-4 rounded-2xl transition-all border border-transparent hover:border-gray-200/50">
                        {/* Section Controls */}
                        <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg border border-gray-100 shadow-sm z-10">
                          <Button onClick={() => handleMoveSection(idx, 'up')} disabled={idx === 0} variant="ghost" size="icon" className="h-7 w-7"><ArrowUp className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => handleMoveSection(idx, 'down')} disabled={idx === pageContent.sections.length - 1} variant="ghost" size="icon" className="h-7 w-7"><ArrowDown className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => handleRemoveSection(idx)} variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                        <div className="flex gap-4">
                          <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-extrabold shrink-0">
                            {idx + 1}
                          </span>
                          <div className="w-full space-y-3">
                            <input
                              value={sec.title}
                              onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                              className={`${editInputClass} font-bold text-gray-900 text-sm md:text-base`}
                              placeholder="Nhập tiêu đề điều khoản (VD: Điều 1)..."
                            />
                            <textarea
                              value={sec.content}
                              onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                              className={`${editTextAreaClass} text-gray-600 text-xs md:text-sm font-normal leading-relaxed`}
                              rows={4}
                              placeholder="Nội dung chi tiết từng khoản, xuống dòng để tạo ý mới..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center pt-2">
                      <Button
                        onClick={() => handleAddSection({ title: `Điều ${pageContent.sections.length + 1}: Quy định mới`, content: "1. Chi tiết..." })}
                        variant="outline"
                        className="border-dashed border-teal-300 hover:border-teal-500 text-teal-600"
                      >
                        + Thêm Điều khoản mới
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER DYNAMIC OEM POLICY PAGE VISUALLY */}
              {selectedPageKey === "page_policy_oem" && (
                <div className="space-y-8">
                  {/* Hero Banner Visual */}
                  <div className="relative rounded-[2.5rem] overflow-hidden bg-teal-950 text-white min-h-[220px] flex items-center p-6 md:p-10 border border-teal-500/20 shadow-md group/hero">
                    <div className="absolute inset-0">
                      <img src={pageContent.heroImage || "/banners/oem_factory_hero.png"} className="w-full h-full object-cover opacity-40" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/60 to-transparent" />
                    </div>
                    {/* ALWAYS AT THE TOP LAYER (z-40) & FLOATING TOP-RIGHT */}
                    <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/hero:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, heroImage: url }))}
                        className="bg-white hover:bg-teal-50 text-teal-950 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md border border-teal-100"
                      >
                        <Camera className="w-4 h-4 text-teal-600" /> Thay ảnh Banner
                      </Button>
                    </div>
                    <div className="relative z-10 w-full space-y-3 text-center">
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Chuẩn CGMP Y khoa Hàn Quốc
                      </span>
                      <input
                        value={pageContent.title}
                        onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                        className={`${editInputClass} text-2xl md:text-4xl font-black text-white text-center`}
                        placeholder="HỢP TÁC SẢN XUẤT OEM/ODM MỸ PHẨM"
                      />
                      <input
                        value={pageContent.desc}
                        onChange={(e) => setPageContent({ ...pageContent, desc: e.target.value })}
                        className={`${editInputClass} text-xs md:text-sm text-emerald-300 uppercase tracking-widest text-center`}
                        placeholder="GIẢI PHÁP GIA CÔNG MỸ PHẨM TRỌN GÓI ĐỘC QUYỀN CHUẨN CGMP Y KHOA"
                      />
                    </div>
                  </div>

                  {/* Brand Intro & Showroom / Laboratory row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-gray-150 p-6 md:p-8 rounded-[2rem] shadow-sm">
                    <div className="md:col-span-7 space-y-4">
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                        Gia công trọn gói
                      </span>
                      <input
                        value={pageContent.sections[0]?.title || ""}
                        onChange={(e) => handleSectionChange(0, 'title', e.target.value)}
                        className={`${editInputClass} text-lg md:text-xl font-extrabold text-gray-900`}
                        placeholder="Giới thiệu dịch vụ gia công..."
                      />
                      <textarea
                        value={pageContent.sections[0]?.content || ""}
                        onChange={(e) => handleSectionChange(0, 'content', e.target.value)}
                        className={`${editTextAreaClass} text-gray-600 text-sm leading-relaxed`}
                        rows={6}
                        placeholder="Nội dung giới thiệu..."
                      />
                    </div>
                    <div className="md:col-span-5 relative border border-gray-100 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-gray-50 group/showroom">
                      <img src={pageContent.showroomImage || "/banners/oem_laboratory_rd.png"} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/showroom:opacity-100 transition-opacity bg-black/40 z-30">
                        <Button
                          type="button"
                          onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, showroomImage: url }))}
                          className="bg-white hover:bg-emerald-50 text-teal-950 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md border border-emerald-100"
                        >
                          <Camera className="w-4 h-4 text-emerald-600" /> Thay ảnh R&D
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-teal-950/75 text-white text-[10px] p-2 rounded-lg text-center font-medium truncate z-10">
                        Ảnh R&D: {pageContent.showroomImage || "/banners/oem_laboratory_rd.png"}
                      </div>
                    </div>
                  </div>

                  {/* R&D & Sterile packaging row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-gray-150 p-6 md:p-8 rounded-[2rem] shadow-sm">
                    <div className="md:col-span-5 relative border border-gray-100 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-gray-50 group/korea">
                      <img src={pageContent.koreaImage || "/banners/oem_sterile_packaging.png"} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/korea:opacity-100 transition-opacity bg-black/40 z-30">
                        <Button
                          type="button"
                          onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, koreaImage: url }))}
                          className="bg-white hover:bg-emerald-50 text-teal-950 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md border border-emerald-100"
                        >
                          <Camera className="w-4 h-4 text-emerald-600" /> Thay ảnh Đóng gói
                        </Button>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-teal-950/75 text-white text-[10px] p-2 rounded-lg text-center font-medium truncate z-10">
                        Ảnh Đóng gói: {pageContent.koreaImage || "/banners/oem_sterile_packaging.png"}
                      </div>
                    </div>
                    <div className="md:col-span-7 space-y-4">
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                        Tiêu chuẩn quốc tế
                      </span>
                      <input
                        value={pageContent.sections[1]?.title || ""}
                        onChange={(e) => handleSectionChange(1, 'title', e.target.value)}
                        className={`${editInputClass} text-lg md:text-xl font-extrabold text-gray-900`}
                        placeholder="Năng lực Nghiên cứu &amp; Phát triển..."
                      />
                      <textarea
                        value={pageContent.sections[1]?.content || ""}
                        onChange={(e) => handleSectionChange(1, 'content', e.target.value)}
                        className={`${editTextAreaClass} text-gray-600 text-sm leading-relaxed`}
                        rows={4}
                        placeholder="Nội dung năng lực R&amp;D..."
                      />
                      <input
                        value={pageContent.sections[2]?.title || ""}
                        onChange={(e) => handleSectionChange(2, 'title', e.target.value)}
                        className={`${editInputClass} font-bold text-gray-900 text-sm md:text-base border-t border-gray-100 pt-3`}
                        placeholder="Quy trình đóng gói..."
                      />
                      <textarea
                        value={pageContent.sections[2]?.content || ""}
                        onChange={(e) => handleSectionChange(2, 'content', e.target.value)}
                        className={`${editTextAreaClass} text-gray-600 text-xs md:text-sm`}
                        rows={4}
                        placeholder="Nội dung quy trình đóng gói..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER DYNAMIC FAQ PAGE VISUALLY */}
              {selectedPageKey === "page_faq" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="text-center space-y-3">
                    <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase">
                      Trang FAQ (Chỉnh sửa trực quan)
                    </span>
                    <input
                      value={pageContent.title}
                      onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                      className={`${editInputClass} text-3xl md:text-4xl font-black text-center text-gray-900`}
                      placeholder="Câu hỏi thường gặp"
                    />
                    <textarea
                      value={pageContent.desc}
                      onChange={(e) => setPageContent({ ...pageContent, desc: e.target.value })}
                      className={`${editTextAreaClass} text-center text-gray-600 max-w-2xl mx-auto text-sm md:text-base`}
                      rows={2}
                      placeholder="Mô tả ngắn..."
                    />
                  </div>

                  <div className="space-y-4">
                    {pageContent.sections.map((sec, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl bg-white p-5 relative group hover:border-teal-200 transition-colors shadow-sm">
                        <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg border border-gray-100 shadow-sm">
                          <Button onClick={() => handleMoveSection(idx, 'up')} disabled={idx === 0} variant="ghost" size="icon" className="h-7 w-7"><ArrowUp className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => handleMoveSection(idx, 'down')} disabled={idx === pageContent.sections.length - 1} variant="ghost" size="icon" className="h-7 w-7"><ArrowDown className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => handleRemoveSection(idx)} variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 pr-12">
                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded shrink-0">Hỏi</span>
                            <input
                              value={sec.title}
                              onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                              className={`${editInputClass} font-semibold text-gray-900 text-sm`}
                              placeholder="Nhập câu hỏi..."
                            />
                          </div>
                          <div className="flex items-start gap-2 border-t border-gray-100 pt-3">
                            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded shrink-0 mt-1">Đáp</span>
                            <textarea
                              value={sec.content}
                              onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                              className={`${editTextAreaClass} text-gray-600 text-xs md:text-sm`}
                              rows={3}
                              placeholder="Nhập câu trả lời..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center pt-2">
                      <Button
                        onClick={() => handleAddSection({ title: "Câu hỏi mới", content: "Câu trả lời giải thích..." })}
                        variant="outline"
                        className="border-dashed border-teal-300 hover:border-teal-500 text-teal-600 shadow-sm"
                      >
                        + Thêm câu hỏi thường gặp
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER DYNAMIC CATALOG PAGE VISUALLY */}
              {selectedPageKey === "page_catalog" && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 text-white rounded-[2rem] p-6 md:p-10 shadow-md relative overflow-hidden group/catalog bg-cover bg-center">
                    {pageContent.bannerImage && (
                      <img src={pageContent.bannerImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                    )}
                    {/* ALWAYS AT THE TOP LAYER (z-40) & FLOATING TOP-RIGHT */}
                    <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/catalog:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, bannerImage: url }))}
                        className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md border border-emerald-100"
                      >
                        <Camera className="w-4 h-4 text-emerald-600" /> Thay ảnh Banner
                      </Button>
                    </div>
                    <div className="relative z-10 max-w-3xl space-y-3">
                      <span className="bg-emerald-500/30 text-emerald-100 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/20">
                        Banner Catalog (Chỉnh sửa trực quan)
                      </span>
                      <input
                        value={pageContent.title}
                        onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                        className={`${editInputClass} text-xl md:text-3xl font-black text-white`}
                        placeholder="DIGITAL CATALOG - GC NATURE"
                      />
                      <textarea
                        value={pageContent.desc}
                        onChange={(e) => setPageContent({ ...pageContent, desc: e.target.value })}
                        className={`${editTextAreaClass} text-xs md:text-sm text-emerald-200`}
                        placeholder="Mô tả phụ cho Banner Catalog..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Brand Philosophy Intro Box */}
                  <div className="bg-white rounded-[2rem] border border-gray-150 p-6 md:p-8 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Phần Giới thiệu Tinh hoa Thương hiệu</h3>
                        <p className="text-[10px] text-gray-400">Trình bày triết lý tự nhiên & xuất xứ Hàn Quốc</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        value={pageContent.introTitle || ""}
                        onChange={(e) => setPageContent({ ...pageContent, introTitle: e.target.value })}
                        className={`${editInputClass} font-bold text-gray-900 text-sm md:text-base`}
                        placeholder="Tiêu đề giới thiệu (VD: Tinh Hoa Mỹ Phẩm Tự Nhiên)..."
                      />
                      <textarea
                        value={pageContent.introText || ""}
                        onChange={(e) => setPageContent({ ...pageContent, introText: e.target.value })}
                        className={`${editTextAreaClass} text-gray-600 text-xs md:text-sm font-light leading-relaxed`}
                        rows={4}
                        placeholder="Chào mừng bạn đến với Catalog..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER DYNAMIC LUCKY WHEEL CONFIGURATION VISUALLY */}
              {selectedPageKey === "page_lucky_wheel" && (
                <div className="space-y-6 pt-4">
                  <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 border-b border-gray-100 pb-3">
                    <Settings className="w-5 h-5 text-teal-600" /> Cấu hình Popup & Chương trình Hot
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700 uppercase">Ảnh Popup quảng cáo (URL)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={pageContent.introTitle || ""}
                          onChange={(e) => setPageContent(prev => ({ ...prev, introTitle: e.target.value }))}
                          placeholder="Ví dụ: /images/popup-hot-sale.png"
                          className="flex-1"
                        />
                        <input
                          type="file"
                          id="popup-image-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error("File quá lớn (tối đa 10MB)");
                              return;
                            }
                            const formData = new FormData();
                            formData.append("image", file);
                            try {
                              const res = await fetch('/api/banners/upload', {
                                method: "POST",
                                body: formData,
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                                },
                              });
                              if (!res.ok) throw new Error("Upload failed");
                              const data = await res.json();
                              setPageContent(prev => ({ ...prev, introTitle: data.url }));
                              toast.success("Tải ảnh lên thành công!");
                            } catch (err) {
                              console.error(err);
                              toast.error("Tải ảnh lên thất bại");
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('popup-image-upload')?.click()}
                          className="shrink-0 text-xs px-3 border-gray-300 h-10"
                        >
                          Tải ảnh lên
                        </Button>
                      </div>
                      <p className="text-[10px] text-gray-400">Đường dẫn ảnh hiển thị ở popup hoặc bấm Tải ảnh lên để tải từ máy.</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-700 uppercase">Link dẫn khi bấm vào Popup</Label>
                      <Input
                        value={pageContent.introText || ""}
                        onChange={(e) => setPageContent(prev => ({ ...prev, introText: e.target.value }))}
                        placeholder="Ví dụ: /chuong-trinh-hot"
                        className="h-10"
                      />
                      <p className="text-[10px] text-gray-400">Đường dẫn của trang đích khi người dùng click vào popup.</p>
                    </div>

                    <div className="space-y-1.5 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-3 mt-1">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700 uppercase flex justify-between">
                          <span>Số giây chờ hiện popup (giây)</span>
                          <span className="text-teal-600 font-extrabold">{pageContent.popupDelay !== undefined ? pageContent.popupDelay : 5}s</span>
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={60}
                          value={pageContent.popupDelay !== undefined ? pageContent.popupDelay : 5}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setPageContent(prev => ({ ...prev, popupDelay: isNaN(val) ? 0 : val }));
                          }}
                          placeholder="Mặc định: 5"
                        />
                        <p className="text-[10px] text-gray-400">Thời gian trễ trước khi popup xuất hiện sau khi tải xong trang chủ.</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700 uppercase flex justify-between">
                          <span>Độ mờ nền toàn trang (%)</span>
                          <span className="text-teal-600 font-extrabold">{pageContent.popupOpacity !== undefined ? pageContent.popupOpacity : 60}%</span>
                        </Label>
                        <div className="flex items-center gap-3 h-10">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={pageContent.popupOpacity !== undefined ? pageContent.popupOpacity : 60}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setPageContent(prev => ({ ...prev, popupOpacity: isNaN(val) ? 60 : val }));
                            }}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400">Điều chỉnh độ tối/trong suốt của lớp nền che phía sau popup.</p>
                      </div>

                      <div className="space-y-1.5 col-span-1 md:col-span-2 border-t border-gray-100/50 pt-3 mt-1">
                        <Label className="text-xs font-bold text-gray-700 uppercase flex justify-between">
                          <span>Chiều rộng tối đa của popup (px)</span>
                          <span className="text-teal-600 font-extrabold">{pageContent.popupWidth !== undefined ? pageContent.popupWidth : 500}px</span>
                        </Label>
                        <div className="flex items-center gap-3 h-10">
                          <input
                            type="range"
                            min="320"
                            max="800"
                            step="10"
                            value={pageContent.popupWidth !== undefined ? pageContent.popupWidth : 500}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setPageContent(prev => ({ ...prev, popupWidth: isNaN(val) ? 500 : val }));
                            }}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                          />
                        </div>
                        <p className="text-[10px] text-gray-400">Điều chỉnh kích thước chiều ngang hiển thị của popup quảng cáo (mặc định 500px).</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Danh sách phần thưởng vòng quay</h4>
                      <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2.5 py-1 rounded-full">Tổng tỉ lệ trúng phải là 100%</span>
                    </div>
                    
                    <div className="space-y-3">
                      {pageContent.tabsConfig && Array.isArray(pageContent.tabsConfig) ? (
                        pageContent.tabsConfig.map((reward: any, idx: number) => (
                          <div key={idx} className="flex flex-col md:flex-row items-stretch gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                            <div className="flex-1 space-y-1.5">
                              <Label className="text-[10px] font-bold text-gray-500 uppercase">Tên phần thưởng {idx + 1}</Label>
                              <Input
                                value={reward.name}
                                onChange={(e) => {
                                  const nextRewards = [...pageContent.tabsConfig];
                                  nextRewards[idx] = { ...reward, name: e.target.value };
                                  setPageContent(prev => ({ ...prev, tabsConfig: nextRewards }));
                                }}
                                className="h-9"
                              />
                            </div>
                            <div className="w-full md:w-24 space-y-1.5">
                              <Label className="text-[10px] font-bold text-gray-500 uppercase">Tỉ lệ (%)</Label>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={reward.probability}
                                onChange={(e) => {
                                  const nextRewards = [...pageContent.tabsConfig];
                                  nextRewards[idx] = { ...reward, probability: parseInt(e.target.value) || 0 };
                                  setPageContent(prev => ({ ...prev, tabsConfig: nextRewards }));
                                }}
                                className="h-9"
                              />
                            </div>
                            {reward.type === 'voucher' && (
                              <>
                                <div className="w-full md:w-28 space-y-1.5">
                                  <Label className="text-[10px] font-bold text-gray-500 uppercase">Số tiền giảm (đ)</Label>
                                  <Input
                                    type="number"
                                    value={reward.discount || 0}
                                    onChange={(e) => {
                                      const nextRewards = [...pageContent.tabsConfig];
                                      nextRewards[idx] = { ...reward, discount: parseInt(e.target.value) || 0 };
                                      setPageContent(prev => ({ ...prev, tabsConfig: nextRewards }));
                                    }}
                                    className="h-9 font-mono"
                                  />
                                </div>
                                <div className="w-full md:w-28 space-y-1.5">
                                  <Label className="text-[10px] font-bold text-gray-500 uppercase">Đơn tối thiểu (đ)</Label>
                                  <Input
                                    type="number"
                                    value={reward.minOrder || 0}
                                    onChange={(e) => {
                                      const nextRewards = [...pageContent.tabsConfig];
                                      nextRewards[idx] = { ...reward, minOrder: parseInt(e.target.value) || 0 };
                                      setPageContent(prev => ({ ...prev, tabsConfig: nextRewards }));
                                    }}
                                    className="h-9 font-mono"
                                  />
                                </div>
                              </>
                            )}
                            <div className="w-full md:w-32 space-y-1.5">
                              <Label className="text-[10px] font-bold text-gray-500 uppercase">Loại</Label>
                              <select
                                value={reward.type}
                                onChange={(e) => {
                                  const nextRewards = [...pageContent.tabsConfig];
                                  nextRewards[idx] = { ...reward, type: e.target.value };
                                  if (e.target.value === 'voucher' && !reward.discount) {
                                    nextRewards[idx].discount = 10000;
                                    nextRewards[idx].minOrder = 100000;
                                  }
                                  setPageContent(prev => ({ ...prev, tabsConfig: nextRewards }));
                                }}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 h-9"
                              >
                                <option value="voucher">Voucher giảm giá</option>
                                <option value="spa">Liệu trình Spa</option>
                                <option value="physical">Mặt nạ / Hiện vật</option>
                                <option value="other">Chuyến du lịch / Khác</option>
                              </select>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-gray-400">
                          Chưa có danh sách phần thưởng. Vui lòng ấn "Mặc định" hoặc lưu cấu hình mới.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Gift Spins Section - only visible when lucky wheel page is selected */}
              {selectedPageKey === "page_lucky_wheel" && (
                <div className="bg-white rounded-3xl border border-gray-200/50 p-8 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Gift size={22} className="text-orange-500" />
                    <h3 className="text-lg font-bold text-gray-800">🎁 Tặng lượt quay cho người dùng</h3>
                  </div>
                  <p className="text-sm text-gray-500">Nhập email người dùng và số lượt quay bạn muốn tặng. Lượt quay sẽ được cộng thêm vào tài khoản của họ.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email người dùng</label>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        value={giftEmail}
                        onChange={(e) => setGiftEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số lượt quay tặng</label>
                      <Input
                        type="number"
                        min={1}
                        value={giftSpins}
                        onChange={(e) => setGiftSpins(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Button
                        onClick={handleGiftSpins}
                        disabled={giftLoading}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 px-6 py-2 rounded-xl w-full"
                      >
                        {giftLoading ? 'Đang xử lý...' : '🎁 Tặng lượt quay'}
                      </Button>
                    </div>
                  </div>
                  {giftResult && (
                    <div className={`mt-3 p-3 rounded-xl text-sm ${
                      giftResult.success
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {giftResult.message}
                    </div>
                  )}
                </div>
              )}

              {/* RENDER HOME PAGE VISUALLY */}
              {selectedPageKey === "page_home" && (
                <div className="max-w-4xl mx-auto bg-white rounded-[2rem] border border-gray-150 p-6 md:p-10 shadow-sm space-y-8">
                  <div className="text-center space-y-2 border-b border-gray-100 pb-4">
                    <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase">
                      Khối nội dung Trang chủ (Chỉnh sửa trực quan)
                    </span>
                  </div>

                  <div className="space-y-12">
                    {pageContent.sections.map((sec, idx) => (
                      <div key={idx} className="relative group hover:bg-gray-50/50 p-4 rounded-2xl transition-all border border-transparent hover:border-gray-200/50 space-y-4">
                        {/* Section Controls */}
                        <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg border border-gray-100 shadow-sm z-10">
                          <Button onClick={() => handleMoveSection(idx, 'up')} disabled={idx === 0} variant="ghost" size="icon" className="h-7 w-7"><ArrowUp className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => handleMoveSection(idx, 'down')} disabled={idx === pageContent.sections.length - 1} variant="ghost" size="icon" className="h-7 w-7"><ArrowDown className="w-3.5 h-3.5" /></Button>
                          <Button onClick={() => handleRemoveSection(idx)} variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                        
                        <div className="text-center space-y-4">
                          <div className="max-w-md mx-auto">
                            <input
                              value={sec.title}
                              onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                              className={`${editInputClass} text-xl md:text-2xl font-bold text-center text-teal-950 font-serif`}
                              placeholder="Nhập tiêu đề mục Trang chủ..."
                            />
                          </div>
                          <div className="max-w-2xl mx-auto">
                            <textarea
                              value={sec.content}
                              onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                              className={`${editTextAreaClass} text-center text-gray-600 text-xs md:text-sm font-light leading-relaxed`}
                              rows={4}
                              placeholder="Nhập mô tả chi tiết..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center pt-2">
                      <Button
                        onClick={() => handleAddSection({ title: "Tiêu đề khối mới", content: "Nội dung chi tiết..." })}
                        variant="outline"
                        className="border-dashed border-teal-300 hover:border-teal-500 text-teal-600 shadow-sm"
                      >
                        + Thêm khối nội dung Trang chủ
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER ABOUT & RECRUITMENT PAGES VISUALLY */}
              {(selectedPageKey === "page_about" || selectedPageKey === "page_recruitment") && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 text-white min-h-[180px] flex items-center p-6 md:p-8 border border-slate-800 shadow-md group/about bg-cover bg-center">
                    {pageContent.bannerImage && (
                      <img src={pageContent.bannerImage} className="absolute inset-0 w-full h-full object-cover opacity-30" alt="" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 opacity-80" />
                    {/* ALWAYS AT THE TOP LAYER (z-40) & FLOATING TOP-RIGHT */}
                    <div className="absolute top-4 right-4 z-40 opacity-0 group-hover/about:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        onClick={() => openImagePicker((url) => setPageContent({ ...pageContent, bannerImage: url }))}
                        className="bg-white hover:bg-slate-50 text-slate-950 font-bold text-xs gap-1.5 px-4 py-2.5 rounded-xl shadow-md border border-slate-100"
                      >
                        <Camera className="w-4 h-4 text-slate-600" /> Thay ảnh Banner
                      </Button>
                    </div>
                    <div className="relative z-10 w-full space-y-2">
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        {selectedPageKey === "page_about" ? "Banner Trang Giới thiệu (Chỉnh sửa trực quan)" : "Banner Trang Tuyển dụng (Chỉnh sửa trực quan)"}
                      </span>
                      <input
                        value={pageContent.title}
                        onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                        className={`${editInputClass} text-xl md:text-3xl font-black text-white`}
                        placeholder="Tiêu đề trang..."
                      />
                      <textarea
                        value={pageContent.desc}
                        onChange={(e) => setPageContent({ ...pageContent, desc: e.target.value })}
                        className={`${editTextAreaClass} text-xs md:text-sm text-slate-300`}
                        placeholder="Mô tả trang..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Sections List */}
                  <div className="bg-white rounded-[2rem] border border-gray-150 p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase">Các khối văn bản bổ sung</span>
                    </div>
                    
                    <div className="space-y-6">
                      {pageContent.sections.map((sec, idx) => (
                        <div key={idx} className="relative group bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
                          {/* Section Controls */}
                          <div className="absolute right-4 top-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg border border-gray-100 shadow-sm z-10">
                            <Button onClick={() => handleMoveSection(idx, 'up')} disabled={idx === 0} variant="ghost" size="icon" className="h-7 w-7"><ArrowUp className="w-3.5 h-3.5" /></Button>
                            <Button onClick={() => handleMoveSection(idx, 'down')} disabled={idx === pageContent.sections.length - 1} variant="ghost" size="icon" className="h-7 w-7"><ArrowDown className="w-3.5 h-3.5" /></Button>
                            <Button onClick={() => handleRemoveSection(idx)} variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                          <input
                            value={sec.title}
                            onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                            className={`${editInputClass} font-bold text-gray-900 text-sm md:text-base`}
                            placeholder="Tiêu đề mục..."
                          />
                          <textarea
                            value={sec.content}
                            onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                            className={`${editTextAreaClass} text-gray-600 text-xs md:text-sm`}
                            rows={4}
                            placeholder="Nội dung chi tiết..."
                          />
                        </div>
                      ))}
                      
                      <div className="text-center pt-2">
                        <Button
                          onClick={() => handleAddSection({ title: "Mục mới", content: "Nội dung mới..." })}
                          variant="outline"
                          className="border-dashed border-gray-300 text-gray-600"
                        >
                          + Thêm phần nội dung
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
      {/* ═══ Create New Policy Page Dialog ═══ */}
      <Dialog open={newPolicyOpen} onOpenChange={setNewPolicyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo trang chính sách mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tiêu đề trang *</Label>
              <Input
                value={newPolicyTitle}
                onChange={(e) => setNewPolicyTitle(e.target.value)}
                placeholder="VD: Chính sách bảo hành"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Đường dẫn tĩnh (Slug)</Label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 font-mono">/chinh-sach/</span>
                <Input
                  value={newPolicySlug}
                  onChange={(e) => setNewPolicySlug(e.target.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                  placeholder="bao-hanh-san-pham (để trống tự tạo)"
                  className="h-9 font-mono text-xs flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPolicyOpen(false)}>Hủy</Button>
            <Button onClick={handleCreatePolicy} className="bg-teal-600 hover:bg-teal-700">Tạo trang</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ Image Picker Dialog ═══ */}
      <Dialog open={imagePickerOpen} onOpenChange={setImagePickerOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-6">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-teal-600" /> Chọn hình ảnh
            </DialogTitle>
          </DialogHeader>

          {/* Quick tab controls */}
          <div className="flex border-b border-gray-150 mb-4">
            <button
              onClick={() => setSearchMedia("")}
              className="py-2.5 px-4 border-b-2 border-teal-600 text-teal-600 font-bold text-sm"
            >
              Kho ảnh hệ thống &amp; Tải lên
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 bg-white">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hình ảnh trong kho..."
                  value={searchMedia}
                  onChange={(e) => setSearchMedia(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none border-none py-0.5 text-gray-700"
                />
              </div>

              <div className="relative shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadMedia(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingMedia}
                />
                <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold gap-1.5 px-4 rounded-xl">
                  {uploadingMedia ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Tải ảnh mới từ máy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {mediaLoading ? (
              <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Đang tải kho ảnh...
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1">
                {mediaFiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Kho ảnh trống. Hãy tải ảnh mới lên!</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-4">
                    {mediaFiles
                      .filter(f => f.type === 'image' && f.filename.toLowerCase().includes(searchMedia.toLowerCase()))
                      .map((file, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            if (imagePickerCallback) imagePickerCallback(file.url);
                            setImagePickerOpen(false);
                          }}
                          className="group relative aspect-square bg-gray-50 border border-gray-150 rounded-xl overflow-hidden cursor-pointer hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <img src={file.url} className="w-full h-full object-cover" alt="" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold bg-teal-600 px-2 py-1 rounded-lg">Chọn ảnh</span>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] truncate p-1">
                            {file.filename}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-gray-100 pt-4 mt-4 shrink-0">
            <Button variant="outline" onClick={() => setImagePickerOpen(false)}>Hủy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
