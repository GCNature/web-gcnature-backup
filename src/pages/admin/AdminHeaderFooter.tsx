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
  MessageSquare, 
  Globe, 
  Share2, 
  Sparkles, 
  Layers, 
  Image,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Send,
  HelpCircle,
  Mail,
  Heart,
  Gift
} from "lucide-react";
import { useSiteConfig, FloatingButton, SiteConfig } from "@/context/SiteConfigContext";
import { toast } from "sonner";

const AVAILABLE_ICONS = [
  { name: "Phone", label: "Điện thoại", icon: Phone },
  { name: "MessageSquare", label: "Tin nhắn", icon: MessageSquare },
  { name: "Send", label: "Gửi / Telegram", icon: Send },
  { name: "Globe", label: "Website", icon: Globe },
  { name: "Mail", label: "Email", icon: Mail },
  { name: "Gift", label: "Quà tặng", icon: Gift },
  { name: "Heart", label: "Yêu thích", icon: Heart },
  { name: "Sparkles", label: "Nổi bật", icon: Sparkles },
  { name: "HelpCircle", label: "Hỗ trợ", icon: HelpCircle },
];

export default function AdminHeaderFooter() {
  const { config, updateConfig, loading } = useSiteConfig();
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

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

  const handleSocialChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
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
    toast.info("Đã thêm nút mới. Hãy điền thông tin và bấm Lưu!");
  };

  const handleRemoveBtn = (index: number) => {
    setFormData((prev) => {
      const updatedBtns = prev.floatingButtons.filter((_, i) => i !== index);
      return { ...prev, floatingButtons: updatedBtns };
    });
    toast.success("Đã xóa nút");
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
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-4 rounded-xl border border-border shadow-sm sticky top-16 z-20">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Sliders className="w-5 h-5 text-primary" />
              Tùy chỉnh Giao diện Header & Footer
            </h2>
            <p className="text-sm text-muted-foreground">
              Mọi thay đổi khi lưu sẽ lập tức cập nhật cho toàn bộ khách hàng trên website!
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground font-semibold shadow-md">
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu & Cập nhật Giao diện"}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="header" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted rounded-xl">
            <TabsTrigger value="header" className="py-2.5 gap-2 font-medium">
              <Layers className="w-4 h-4" /> Header (Đầu trang)
            </TabsTrigger>
            <TabsTrigger value="footer" className="py-2.5 gap-2 font-medium">
              <Globe className="w-4 h-4" /> Footer (Chân trang)
            </TabsTrigger>
            <TabsTrigger value="social" className="py-2.5 gap-2 font-medium">
              <Share2 className="w-4 h-4" /> Mạng Xã Hội
            </TabsTrigger>
            <TabsTrigger value="floating" className="py-2.5 gap-2 font-medium">
              <Phone className="w-4 h-4 text-emerald-500" /> Nút Liên Hệ Nổi
            </TabsTrigger>
          </TabsList>

          {/* ════ TAB 1: HEADER ════ */}
          <TabsContent value="header" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thanh Đầu Trang (Header Topbar & Logo)</CardTitle>
                <CardDescription>Tùy chỉnh thông điệp khuyến mãi, hotline và logo thương hiệu hiển thị trên cùng.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <Label htmlFor="headerHotline">Hotline hiển thị trên Header</Label>
                    <Input
                      id="headerHotline"
                      value={formData.header.hotline}
                      onChange={(e) => handleHeaderChange("hotline", e.target.value)}
                      placeholder="0559869392"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logoUrl">Đường dẫn Logo chính (`/logo.png`)</Label>
                    <Input
                      id="logoUrl"
                      value={formData.header.logoUrl}
                      onChange={(e) => handleHeaderChange("logoUrl", e.target.value)}
                      placeholder="/logo.png"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Huy hiệu FlashSale</p>
                      <p className="text-xs text-muted-foreground">Hiển thị nút FlashSale màu cam trên menu</p>
                    </div>
                    <Switch
                      checked={formData.header.showFlashSaleBadge}
                      onCheckedChange={(val) => handleHeaderChange("showFlashSaleBadge", val)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Huy hiệu Chương Trình HOT</p>
                      <p className="text-xs text-muted-foreground">Hiển thị nút Chương trình HOT trên menu</p>
                    </div>
                    <Switch
                      checked={formData.header.showHotProgramBadge}
                      onCheckedChange={(val) => handleHeaderChange("showHotProgramBadge", val)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════ TAB 2: FOOTER ════ */}
          <TabsContent value="footer" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông Tin Chân Trang (Footer)</CardTitle>
                <CardDescription>Cập nhật tên công ty, địa chỉ trụ sở, mã số thuế và bản quyền.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Tên Công Ty / Doanh Nghiệp</Label>
                  <Input
                    id="companyName"
                    value={formData.footer.companyName}
                    onChange={(e) => handleFooterChange("companyName", e.target.value)}
                    placeholder="CÔNG TY TNHH MỸ PHẨM GCNATURE KOREA"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressHCM">Địa chỉ Trụ sở TP.HCM</Label>
                    <Input
                      id="addressHCM"
                      value={formData.footer.addressHCM}
                      onChange={(e) => handleFooterChange("addressHCM", e.target.value)}
                      placeholder="36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressHN">Địa chỉ Văn phòng Hà Nội</Label>
                    <Input
                      id="addressHN"
                      value={formData.footer.addressHN}
                      onChange={(e) => handleFooterChange("addressHN", e.target.value)}
                      placeholder="S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerEmail">Email Hỗ Trợ Khách Hàng</Label>
                    <Input
                      id="footerEmail"
                      value={formData.footer.email}
                      onChange={(e) => handleFooterChange("email", e.target.value)}
                      placeholder="gcnatureofficial@gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Mã Số Thuế / ĐKKD</Label>
                    <Input
                      id="taxCode"
                      value={formData.footer.taxCode}
                      onChange={(e) => handleFooterChange("taxCode", e.target.value)}
                      placeholder="0316889988"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="copyrightText">Văn Bản Bản Quyền (Copyright)</Label>
                  <Input
                    id="copyrightText"
                    value={formData.footer.copyrightText}
                    onChange={(e) => handleFooterChange("copyrightText", e.target.value)}
                    placeholder="© 2026 GCnature Korea. Tất cả quyền được bảo lưu."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════ TAB 3: MẠNG XÃ HỘI ════ */}
          <TabsContent value="social" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Các Kênh Mạng Xã Hội Chính Thức</CardTitle>
                <CardDescription>Cập nhật liên kết social hiển thị ở Footer và trang Liên hệ.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-600" /> Fanpage Facebook
                    </Label>
                    <Input
                      value={formData.social.facebook}
                      onChange={(e) => handleSocialChange("facebook", e.target.value)}
                      placeholder="https://www.facebook.com/GCnature"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-blue-500" /> Group Facebook Cộng Đồng
                    </Label>
                    <Input
                      value={formData.social.facebookGroup}
                      onChange={(e) => handleSocialChange("facebookGroup", e.target.value)}
                      placeholder="https://facebook.com/groups/koreacosmetics/"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-600" /> Trang Instagram
                    </Label>
                    <Input
                      value={formData.social.instagram}
                      onChange={(e) => handleSocialChange("instagram", e.target.value)}
                      placeholder="https://www.instagram.com/gcnatureofficial/"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-slate-700" /> Kênh Threads
                    </Label>
                    <Input
                      value={formData.social.threads}
                      onChange={(e) => handleSocialChange("threads", e.target.value)}
                      placeholder="https://www.threads.com/@gcnatureofficial"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-600" /> Kênh Youtube
                    </Label>
                    <Input
                      value={formData.social.youtube}
                      onChange={(e) => handleSocialChange("youtube", e.target.value)}
                      placeholder="https://www.youtube.com/@GCnatureOfficial"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-red-700" /> Kênh Pinterest
                    </Label>
                    <Input
                      value={formData.social.pinterest}
                      onChange={(e) => handleSocialChange("pinterest", e.target.value)}
                      placeholder="https://www.pinterest.com/gcnaturekorea/"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-black dark:text-white" /> Trang TikTok
                    </Label>
                    <Input
                      value={formData.social.tiktok}
                      onChange={(e) => handleSocialChange("tiktok", e.target.value)}
                      placeholder="https://www.tiktok.com/@gcnature.com.vn"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════ TAB 4: NÚT LIÊN HỆ NỔI & TỰ THÊM NÚT MỚI ════ */}
          <TabsContent value="floating" className="mt-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg">Quản Lý Nút Liên Hệ Nổi (Floating Buttons)</CardTitle>
                  <CardDescription>Bật/tắt, chỉnh sửa thông tin Zalo, Messenger, Hotline hoặc tự thêm nút mới tùy ý.</CardDescription>
                </div>
                <Button onClick={handleAddCustomBtn} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
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
                        <Label>Tên hiển thị khi Rê chuột (Tooltip Title)</Label>
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
                        <Label>Biểu tượng / Đường dẫn Icon (URL ảnh hoặc Tên Icon)</Label>
                        <Input
                          value={btn.icon || ""}
                          onChange={(e) => handleFloatingBtnChange(index, "icon", e.target.value)}
                          placeholder="Nhập URL ảnh icon (https://...) hoặc chọn icon bên dưới"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-center">
                  <Button onClick={handleSave} disabled={saving} className="gap-2 px-8 bg-primary text-primary-foreground font-semibold">
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
