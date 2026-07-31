import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sliders, 
  Save, 
  Plus, 
  Trash2, 
  Phone, 
  Globe, 
  Layers, 
  Image as ImageIcon,
  HardDrive,
  Info,
  ExternalLink,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useSiteConfig, FloatingButton, HeaderBadge, FooterLinkItem, SiteConfig } from "@/context/SiteConfigContext";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AdminHeaderFooter() {
  const { config, updateConfig, loading } = useSiteConfig();
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);

  // Media Picker Modal State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTargetField, setPickerTargetField] = useState<{ type: string; index?: number } | null>(null);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const openMediaPicker = (type: string, index?: number) => {
    setPickerTargetField({ type, index });
    setPickerOpen(true);
  };

  const handleSelectImage = (url: string) => {
    if (!pickerTargetField) return;
    const { type, index } = pickerTargetField;

    if (type === "header_logo") {
      setFormData((prev) => ({ ...prev, header: { ...prev.header, logoUrl: url } }));
    } else if (type === "footer_logo") {
      setFormData((prev) => ({ ...prev, footer: { ...prev.footer, brandLogoUrl: url } }));
    } else if (type === "floating_btn" && typeof index === "number") {
      setFormData((prev) => {
        const updatedBtns = [...prev.floatingButtons];
        updatedBtns[index] = { ...updatedBtns[index], icon: url };
        return { ...prev, floatingButtons: updatedBtns };
      });
    } else if (type === "header_badge" && typeof index === "number") {
      setFormData((prev) => {
        const updatedBadges = [...(prev.header.badges || [])];
        updatedBadges[index] = { ...updatedBadges[index], icon: url };
        return { ...prev, header: { ...prev.header, badges: updatedBadges } };
      });
    }
  };

  const handleHeaderChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  const handleFooterChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [field]: value,
      },
    }));
  };

  const handleFloatingBtnChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedBtns = [...prev.floatingButtons];
      updatedBtns[index] = { ...updatedBtns[index], [field]: value };
      return { ...prev, floatingButtons: updatedBtns };
    });
  };

  const handleAddCustomBtn = () => {
    const newBtn: FloatingButton = {
      id: `custom_${Date.now()}`,
      title: "Nút Liên Hệ Mới",
      type: "custom",
      url: "https://zalo.me/0559869392",
      icon: "MessageSquare",
      bgColor: "#5dc1d1",
      enabled: true,
    };

    setFormData((prev) => ({
      ...prev,
      floatingButtons: [...prev.floatingButtons, newBtn],
    }));
    toast.info("Đã thêm nút nổi mới. Hãy chọn ảnh/icon và nhập đường dẫn!");
  };

  const handleRemoveBtn = (index: number) => {
    setFormData((prev) => {
      const updatedBtns = prev.floatingButtons.filter((_, i) => i !== index);
      return { ...prev, floatingButtons: updatedBtns };
    });
  };

  // Header Badge Handlers
  const handleBadgeChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...(prev.header.badges || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, header: { ...prev.header, badges: updated } };
    });
  };

  const handleAddBadge = () => {
    const newBadge: HeaderBadge = {
      id: `badge_${Date.now()}`,
      text: "Huy hiệu mới",
      icon: "Globe",
      color: "text-blue-600",
      href: "/#",
      enabled: true
    };
    setFormData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        badges: [...(prev.header.badges || []), newBadge]
      }
    }));
  };

  const handleRemoveBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        badges: (prev.header.badges || []).filter((_, i) => i !== index)
      }
    }));
  };

  // Footer Link Column Handlers
  const handleFooterLinkChange = (colKey: "column1Links" | "column2Links" | "column3Links", index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedCol = [...(prev.footer[colKey] || [])];
      updatedCol[index] = { ...updatedCol[index], [field]: value };
      return { ...prev, footer: { ...prev.footer, [colKey]: updatedCol } };
    });
  };

  const handleAddFooterLink = (colKey: "column1Links" | "column2Links" | "column3Links") => {
    const newLink: FooterLinkItem = { name: "Liên kết mới", href: "/#" };
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [colKey]: [...(prev.footer[colKey] || []), newLink]
      }
    }));
  };

  const handleRemoveFooterLink = (colKey: "column1Links" | "column2Links" | "column3Links", index: number) => {
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        [colKey]: (prev.footer[colKey] || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateConfig(formData);
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout title="Cấu hình Header & Footer">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cấu hình Header, Footer & Nút Liên Hệ Nổi">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Sticky Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-xl border border-border shadow-sm sticky top-16 z-20">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Sliders className="w-5 h-5 text-primary" />
              Tùy chỉnh Giao diện Header & Footer
            </h2>
            <p className="text-sm text-muted-foreground">
              Tải ảnh trực tiếp từ máy tính/thư viện và tùy chỉnh không trùng lặp với Cài Đặt chung!
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground font-semibold shadow-md">
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu & Cập nhật Giao diện"}
          </Button>
        </div>

        {/* Info Note: Avoid Duplication */}
        <div className="flex items-start gap-3 p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-0.5">Lưu ý quản lý thông tin chính xác:</p>
            <p>
              Các thông tin hệ thống như <b>Hotline, Địa chỉ TP.HCM/Hà Nội, Zalo OA</b> và <b>Các Kênh Mạng Xã Hội</b> đã được quản lý tập trung ở mục{" "}
              <Link to="/admin/settings" className="underline font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-0.5">
                Cài Đặt Website <ExternalLink className="w-3 h-3" />
              </Link>{" "}
              và mục{" "}
              <Link to="/admin/menu" className="underline font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-0.5">
                Menu Danh Mục <ExternalLink className="w-3 h-3" />
              </Link>.
              Trang này tập trung cho phần hình ảnh, thanh topbar, huy hiệu và nút liên hệ nổi chuyên biệt của Header/Footer.
            </p>
          </div>
        </div>

        {/* Media Picker Modal */}
        <MediaPickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelectImage={handleSelectImage}
        />

        {/* Tabs: Header & Footer Separated */}
        <Tabs defaultValue="header" className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full h-auto p-1 bg-muted rounded-xl">
            <TabsTrigger value="header" className="py-2.5 gap-2 font-medium">
              <Layers className="w-4 h-4" /> Cấu hình Header (Đầu trang)
            </TabsTrigger>
            <TabsTrigger value="footer" className="py-2.5 gap-2 font-medium">
              <Globe className="w-4 h-4" /> Cấu hình Footer (Chân trang)
            </TabsTrigger>
            <TabsTrigger value="floating" className="py-2.5 gap-2 font-medium">
              <Phone className="w-4 h-4 text-emerald-500" /> Nút Liên Hệ Nổi
            </TabsTrigger>
          </TabsList>

          {/* ════ TAB 1: CẤU HÌNH HEADER (ĐẦU TRANG) ════ */}
          <TabsContent value="header" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Logo & Thông Điệp Topbar Đầu Trang</CardTitle>
                <CardDescription>Tải ảnh logo thương hiệu từ máy tính và tùy chỉnh thanh thông báo chạy trên cùng.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload Box */}
                <div className="p-4 border border-border rounded-xl bg-muted/20 space-y-3">
                  <Label className="text-base font-semibold">Logo Chính Thương Hiệu (Header Logo)</Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-28 h-16 rounded-lg border border-border bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
                      <img
                        src={formData.header.logoUrl || "/logo.png"}
                        alt="Header Logo"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <Input
                        value={formData.header.logoUrl}
                        onChange={(e) => handleHeaderChange("logoUrl", e.target.value)}
                        placeholder="/logo.png hoặc URL ảnh logo..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openMediaPicker("header_logo")}
                        className="gap-2 border-primary text-primary hover:bg-primary/10 w-full sm:w-auto font-medium"
                      >
                        <HardDrive className="w-4 h-4" /> Tải ảnh Logo từ Máy Tính / Chọn Kho Ảnh
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="announcementText">Thông điệp thanh thông báo Topbar</Label>
                    <Input
                      id="announcementText"
                      value={formData.header.announcementText}
                      onChange={(e) => handleHeaderChange("announcementText", e.target.value)}
                      placeholder="⚡ MỸ PHẨM HÀN QUỐC CHÍNH HÃNG - GIAO HÀNG TOÀN QUỐC"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="announcementLink">Đường dẫn khi click Topbar</Label>
                    <Input
                      id="announcementLink"
                      value={formData.header.announcementLink}
                      onChange={(e) => handleHeaderChange("announcementLink", e.target.value)}
                      placeholder="/flash-sale"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headerHotline">Hotline phụ hiển thị trên Header (Nếu có)</Label>
                    <Input
                      id="headerHotline"
                      value={formData.header.hotline}
                      onChange={(e) => handleHeaderChange("hotline", e.target.value)}
                      placeholder="0559869392"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Huy hiệu FlashSale</p>
                      <p className="text-xs text-muted-foreground">Bật/Tắt nút FlashSale màu cam trên thanh menu</p>
                    </div>
                    <Switch
                      checked={formData.header.showFlashSaleBadge}
                      onCheckedChange={(val) => handleHeaderChange("showFlashSaleBadge", val)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Huy hiệu Chương Trình HOT</p>
                      <p className="text-xs text-muted-foreground">Bật/Tắt nút Chương trình HOT trên thanh menu</p>
                    </div>
                    <Switch
                      checked={formData.header.showHotProgramBadge}
                      onCheckedChange={(val) => handleHeaderChange("showHotProgramBadge", val)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sub-bar Badges List Editor */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Các Huy Hiệu Khuyến Mãi & Cam Kết (Sub-bar Badges)</CardTitle>
                  <CardDescription>Thêm, sửa, đổi icon/tải ảnh icon từ máy tính cho các huy hiệu chạy dưới Header.</CardDescription>
                </div>
                <Button onClick={handleAddBadge} variant="outline" className="gap-2 border-primary text-primary">
                  <Plus className="w-4 h-4" /> Thêm Huy Hiệu Mới
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.header.badges || []).map((badge, idx) => (
                  <div key={badge.id || idx} className="p-4 border border-border rounded-xl bg-card space-y-3 relative shadow-sm">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="font-semibold text-sm text-foreground">Huy hiệu #{idx + 1}: {badge.text}</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={badge.enabled}
                          onCheckedChange={(val) => handleBadgeChange(idx, "enabled", val)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBadge(idx)}
                          className="text-destructive h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Tên hiển thị huy hiệu</Label>
                        <Input
                          value={badge.text}
                          onChange={(e) => handleBadgeChange(idx, "text", e.target.value)}
                          placeholder="Nhập khẩu Hàn Quốc..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tên Icon hoặc Đường dẫn Ảnh Icon</Label>
                        <div className="flex gap-2">
                          <Input
                            value={badge.icon || ""}
                            onChange={(e) => handleBadgeChange(idx, "icon", e.target.value)}
                            placeholder="Globe, Award, Leaf hoặc URL..."
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => openMediaPicker("header_badge", idx)}
                            title="Tải ảnh icon từ máy tính"
                            className="shrink-0"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Đường dẫn liên kết (Link)</Label>
                        <Input
                          value={badge.href}
                          onChange={(e) => handleBadgeChange(idx, "href", e.target.value)}
                          placeholder="/# hoặc /catalog"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════ TAB 2: CẤU HÌNH FOOTER (CHÂN TRANG) ════ */}
          <TabsContent value="footer" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Banner Tư Vấn & Logo Trắng Chân Trang</CardTitle>
                <CardDescription>Tùy chỉnh dải Banner tư vấn miễn phí màu đen/xanh trên cùng Footer và Logo chân trang.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-xl bg-muted/20">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Tiêu đề Banner Tư Vấn Miễn Phí</Label>
                    <Input
                      value={formData.footer.ctaTitle}
                      onChange={(e) => handleFooterChange("ctaTitle", e.target.value)}
                      placeholder="Liên hệ ngay để được tư vấn miễn phí"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Mô tả ngắn Banner Tư Vấn</Label>
                    <Input
                      value={formData.footer.ctaDescription}
                      onChange={(e) => handleFooterChange("ctaDescription", e.target.value)}
                      placeholder="Đội ngũ chuyên gia GCnature sẵn sàng tư vấn..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Chữ hiển thị trên Nút Hotline Banner</Label>
                    <Input
                      value={formData.footer.ctaPhoneText}
                      onChange={(e) => handleFooterChange("ctaPhoneText", e.target.value)}
                      placeholder="0559.869.392"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Số Điện Thoại Gọi (tel:)</Label>
                    <Input
                      value={formData.footer.ctaPhone}
                      onChange={(e) => handleFooterChange("ctaPhone", e.target.value)}
                      placeholder="0559869392"
                    />
                  </div>
                </div>

                {/* Footer Logo & Tagline */}
                <div className="p-4 border border-border rounded-xl bg-card space-y-4">
                  <Label className="font-semibold text-base">Logo Footer (Ảnh Màu Trắng / Trong Suốt)</Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-28 h-16 rounded-lg border border-border bg-slate-900 flex items-center justify-center p-2 shrink-0">
                      <img
                        src={formData.footer.brandLogoUrl || "/logo-trang.png"}
                        alt="Footer Logo"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <Input
                        value={formData.footer.brandLogoUrl}
                        onChange={(e) => handleFooterChange("brandLogoUrl", e.target.value)}
                        placeholder="/logo-trang.png hoặc URL..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openMediaPicker("footer_logo")}
                        className="gap-2 border-primary text-primary font-medium"
                      >
                        <HardDrive className="w-4 h-4" /> Tải/Chọn Logo Footer từ Máy Tính
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label>Slogan Thương hiệu Footer</Label>
                      <Input
                        value={formData.footer.brandTagline}
                        onChange={(e) => handleFooterChange("brandTagline", e.target.value)}
                        placeholder="SỰ CHĂM SÓC TOÀN DIỆN"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Giờ Làm Việc (Working Hours)</Label>
                      <Input
                        value={formData.footer.workingHours}
                        onChange={(e) => handleFooterChange("workingHours", e.target.value)}
                        placeholder="🕒 9:00 - 21:30 (T2 - CN)"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Links Columns */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Cột Liên Kết Footer: VỀ CHÚNG TÔI</CardTitle>
                  <CardDescription>Tùy chỉnh các đường dẫn liên kết hiển thị trong cột 1 Chân trang.</CardDescription>
                </div>
                <Button onClick={() => handleAddFooterLink("column1Links")} variant="outline" className="gap-2 border-primary text-primary">
                  <Plus className="w-4 h-4" /> Thêm Liên Kết Cột 1
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {(formData.footer.column1Links || []).map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input
                      value={link.name}
                      onChange={(e) => handleFooterLinkChange("column1Links", idx, "name", e.target.value)}
                      placeholder="Tên liên kết"
                      className="w-1/2"
                    />
                    <Input
                      value={link.href}
                      onChange={(e) => handleFooterLinkChange("column1Links", idx, "href", e.target.value)}
                      placeholder="Đường dẫn (/about...)"
                      className="w-1/2"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveFooterLink("column1Links", idx)} className="text-destructive h-9 w-9 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════ TAB 3: NÚT LIÊN HỆ NỔI & TẢI ẢNH ICON ════ */}
          <TabsContent value="floating" className="mt-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Quản Lý Nút Liên Hệ Nổi (Floating Contact Buttons)</CardTitle>
                  <CardDescription>Bật/tắt, tải ảnh icon từ máy tính hoặc kho media và tự thêm nút nổi mới.</CardDescription>
                </div>
                <Button onClick={handleAddCustomBtn} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10 font-semibold">
                  <Plus className="w-4 h-4" /> Thêm Nút Mới
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.floatingButtons.map((btn, index) => (
                  <div key={btn.id || index} className="p-4 border border-border rounded-xl bg-card space-y-4 shadow-sm relative">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <h4 className="font-semibold text-foreground">{btn.title || "Nút Liên Hệ"}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">Bật nút</Label>
                          <Switch
                            checked={btn.enabled}
                            onCheckedChange={(val) => handleFloatingBtnChange(index, "enabled", val)}
                          />
                        </div>
                        {formData.floatingButtons.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveBtn(index)}
                            className="text-destructive hover:bg-destructive/10 h-8 w-8"
                            title="Xóa nút này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Tên Tooltip (Hiển thị khi rê chuột)</Label>
                        <Input
                          value={btn.title}
                          onChange={(e) => handleFloatingBtnChange(index, "title", e.target.value)}
                          placeholder="Chat Zalo / Hotline..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Đường dẫn khi Bấm (URL / Tel / Link)</Label>
                        <Input
                          value={btn.url}
                          onChange={(e) => handleFloatingBtnChange(index, "url", e.target.value)}
                          placeholder="https://zalo.me/0559869392 hoac tel:0559869392"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Màu Nền Nút (Color Hex)</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={btn.bgColor || "#5dc1d1"}
                            onChange={(e) => handleFloatingBtnChange(index, "bgColor", e.target.value)}
                            className="w-9 h-9 rounded cursor-pointer border-0 p-0"
                          />
                          <Input
                            value={btn.bgColor || "#5dc1d1"}
                            onChange={(e) => handleFloatingBtnChange(index, "bgColor", e.target.value)}
                            placeholder="#5dc1d1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-3">
                        <Label>Biểu Tượng Icon hoặc Đường Dẫn Ảnh Icon</Label>
                        <div className="flex gap-2">
                          <Input
                            value={btn.icon || ""}
                            onChange={(e) => handleFloatingBtnChange(index, "icon", e.target.value)}
                            placeholder="Nhập URL ảnh icon (https://...) hoặc chọn icon"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openMediaPicker("floating_btn", index)}
                            className="gap-2 border-primary text-primary shrink-0 font-medium"
                          >
                            <HardDrive className="w-4 h-4" /> Tải/Chọn Ảnh Icon Từ Máy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-center">
                  <Button onClick={handleSave} disabled={saving} className="gap-2 px-8 bg-primary text-primary-foreground font-semibold shadow-md">
                    <Save className="w-4 h-4" />
                    {saving ? "Đang lưu..." : "Lưu tất cả nút nổi"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
