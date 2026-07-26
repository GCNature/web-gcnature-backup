import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, CreditCard, Globe, Phone, MapPin, Save, AlertCircle, Radio, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiGet, apiPut } from "@/lib/api";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: "GCnature - Sự chăm sóc toàn diện",
    siteUrl: "https://gcnature.com.vn",
    hotline: "0898.273.899",
    zaloUrl: "https://zalo.me/0898273899",
    addressHCM: "36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM",
    addressHN: "S1.06 Vinsmart City, Nam Từ Liêm, Hà Nội",
    productPolicy: "",
  });

  // SMTP Settings
  const [smtpSettings, setSmtpSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "gcnatureofficial@gmail.com",
    smtpPass: "",
    adminEmail: "gcnatureofficial@gmail.com",
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    bankCode: "ACB",
    bankAccount: "24488671",
    bankAccountName: "MAI XUAN ANH",
    enableCOD: true,
    enableBankTransfer: true,
    enableEWallet: true,
  });

  // Social Media
  const [socialSettings, setSocialSettings] = useState({
    facebook: "https://www.facebook.com/GCnature",
    instagram: "https://www.instagram.com/gcnatureofficial",
    tiktok: "https://www.tiktok.com/@gcnaturehcm",
    threads: "https://www.threads.com/@gcnatureofficial",
    pinterest: "https://www.pinterest.com/gcnaturekorea",
    youtube: "https://www.youtube.com/@GCnatureOfficial",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailOnNewOrder: true,
    emailOnLowStock: true,
    weeklyReport: false,
    zaloNotification: true,
  });

  // Livestream Settings
  const [livestreamSettings, setLivestreamSettings] = useState({
    tiktokUrl: "",
    shopeeUrl: "",
  });

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiGet<any>('/settings?_t=' + Date.now());
        if (data.siteName) setSiteSettings(prev => ({...prev, siteName: data.siteName}));
        if (data.siteUrl) setSiteSettings(prev => ({...prev, siteUrl: data.siteUrl}));
        if (data.hotline) setSiteSettings(prev => ({...prev, hotline: data.hotline}));
        if (data.zaloUrl) setSiteSettings(prev => ({...prev, zaloUrl: data.zaloUrl}));
        if (data.addressHCM) setSiteSettings(prev => ({...prev, addressHCM: data.addressHCM}));
        if (data.addressHN) setSiteSettings(prev => ({...prev, addressHN: data.addressHN}));
        if (data.product_policy) setSiteSettings(prev => ({...prev, productPolicy: data.product_policy}));
        
        if (data.smtpHost) setSmtpSettings(prev => ({...prev, smtpHost: data.smtpHost}));
        if (data.smtpPort) setSmtpSettings(prev => ({...prev, smtpPort: data.smtpPort}));
        if (data.smtpUser) setSmtpSettings(prev => ({...prev, smtpUser: data.smtpUser}));
        if (data.smtpPass) setSmtpSettings(prev => ({...prev, smtpPass: data.smtpPass}));
        if (data.adminEmail) setSmtpSettings(prev => ({...prev, adminEmail: data.adminEmail}));
        
        if (data.bankCode) setPaymentSettings(prev => ({...prev, bankCode: data.bankCode}));
        if (data.bankAccount) setPaymentSettings(prev => ({...prev, bankAccount: data.bankAccount}));
        if (data.bankAccountName) setPaymentSettings(prev => ({...prev, bankAccountName: data.bankAccountName}));
        if (data.enableCOD !== undefined) setPaymentSettings(prev => ({...prev, enableCOD: data.enableCOD === 'true'}));
        if (data.enableBankTransfer !== undefined) setPaymentSettings(prev => ({...prev, enableBankTransfer: data.enableBankTransfer === 'true'}));
        if (data.enableEWallet !== undefined) setPaymentSettings(prev => ({...prev, enableEWallet: data.enableEWallet === 'true'}));
        
        if (data.facebook) setSocialSettings(prev => ({...prev, facebook: data.facebook}));
        if (data.instagram) setSocialSettings(prev => ({...prev, instagram: data.instagram}));
        if (data.tiktok) setSocialSettings(prev => ({...prev, tiktok: data.tiktok}));
        if (data.threads) setSocialSettings(prev => ({...prev, threads: data.threads}));
        if (data.pinterest) setSocialSettings(prev => ({...prev, pinterest: data.pinterest}));
        if (data.youtube) setSocialSettings(prev => ({...prev, youtube: data.youtube}));
        
        if (data.emailOnNewOrder !== undefined) setNotifications(prev => ({...prev, emailOnNewOrder: data.emailOnNewOrder === 'true'}));
        if (data.emailOnLowStock !== undefined) setNotifications(prev => ({...prev, emailOnLowStock: data.emailOnLowStock === 'true'}));
        if (data.weeklyReport !== undefined) setNotifications(prev => ({...prev, weeklyReport: data.weeklyReport === 'true'}));
        if (data.zaloNotification !== undefined) setNotifications(prev => ({...prev, zaloNotification: data.zaloNotification === 'true'}));

        // Load livestream settings (stored as JSON in a single key)
        if (data.livestream) {
          try {
            const ls = JSON.parse(data.livestream);
            setLivestreamSettings({
              tiktokUrl: ls.tiktokUrl || '',
              shopeeUrl: ls.shopeeUrl || '',
            });
          } catch {}
        }
      } catch (error) {
        console.error('Load settings error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      let dataToSave = {};
      
      if (section === 'website') {
        dataToSave = {
          siteName: siteSettings.siteName,
          siteUrl: siteSettings.siteUrl,
          hotline: siteSettings.hotline,
          zaloUrl: siteSettings.zaloUrl,
          addressHCM: siteSettings.addressHCM,
          addressHN: siteSettings.addressHN,
          product_policy: siteSettings.productPolicy,
        };
      } else if (section === 'SMTP') {
        dataToSave = {
          smtpHost: smtpSettings.smtpHost,
          smtpPort: smtpSettings.smtpPort,
          smtpUser: smtpSettings.smtpUser,
          smtpPass: smtpSettings.smtpPass,
          adminEmail: smtpSettings.adminEmail,
        };
      } else if (section === 'thanh toán') {
        dataToSave = {
          bankCode: paymentSettings.bankCode,
          bankAccount: paymentSettings.bankAccount,
          bankAccountName: paymentSettings.bankAccountName,
          enableCOD: String(paymentSettings.enableCOD),
          enableBankTransfer: String(paymentSettings.enableBankTransfer),
          enableEWallet: String(paymentSettings.enableEWallet),
        };
      } else if (section === 'mạng xã hội') {
        dataToSave = {
          facebook: socialSettings.facebook,
          instagram: socialSettings.instagram,
          tiktok: socialSettings.tiktok,
          threads: socialSettings.threads,
          pinterest: socialSettings.pinterest,
          youtube: socialSettings.youtube,
        };
      } else if (section === 'thông báo') {
        dataToSave = {
          emailOnNewOrder: String(notifications.emailOnNewOrder),
          emailOnLowStock: String(notifications.emailOnLowStock),
          weeklyReport: String(notifications.weeklyReport),
          zaloNotification: String(notifications.zaloNotification),
        };
      } else if (section === 'livestream') {
        dataToSave = {
          livestream: JSON.stringify({
            tiktokUrl: livestreamSettings.tiktokUrl.trim(),
            shopeeUrl: livestreamSettings.shopeeUrl.trim(),
          }),
        };
      }
      
      await apiPut('/settings', dataToSave);
      toast.success(`Đã lưu cấu hình ${section}`);
    } catch (error: any) {
      toast.error(error.message || 'Không thể kết nối server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Cài đặt">
      <div className="max-w-5xl">
        <Tabs defaultValue="site" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="site" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </TabsTrigger>
            <TabsTrigger value="smtp" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Thanh toán</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Mạng xã hội</span>
            </TabsTrigger>
            <TabsTrigger value="livestream" className="gap-2">
              <Radio className="w-4 h-4" />
              <span className="hidden sm:inline">Livestream</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Thông báo</span>
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="site" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Thông tin website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tên website</Label>
                    <Input 
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL website</Label>
                    <Input 
                      value={siteSettings.siteUrl}
                      onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hotline</Label>
                    <Input 
                      value={siteSettings.hotline}
                      onChange={(e) => setSiteSettings({...siteSettings, hotline: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Zalo OA</Label>
                    <Input 
                      value={siteSettings.zaloUrl}
                      onChange={(e) => setSiteSettings({...siteSettings, zaloUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ CS TP.HCM
                  </Label>
                  <Input 
                    value={siteSettings.addressHCM}
                    onChange={(e) => setSiteSettings({...siteSettings, addressHCM: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ CS Hà Nội
                  </Label>
                  <Input 
                    value={siteSettings.addressHN}
                    onChange={(e) => setSiteSettings({...siteSettings, addressHN: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chính sách sản phẩm mặc định</Label>
                  <Textarea 
                    value={siteSettings.productPolicy}
                    onChange={(e) => setSiteSettings({...siteSettings, productPolicy: e.target.value})}
                    placeholder="Nhập chính sách sản phẩm mặc định (hiển thị trên tất cả trang sản phẩm nếu sản phẩm đó không có chính sách riêng)"
                    rows={6}
                  />
                </div>

                <Button onClick={() => handleSave("website")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMTP Settings */}
          <TabsContent value="smtp" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Cấu hình SMTP Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Để gửi email qua Gmail, bạn cần tạo App Password tại{" "}
                    <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">
                      Google Account Settings
                    </a>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input 
                      value={smtpSettings.smtpHost}
                      onChange={(e) => setSmtpSettings({...smtpSettings, smtpHost: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input 
                      value={smtpSettings.smtpPort}
                      onChange={(e) => setSmtpSettings({...smtpSettings, smtpPort: e.target.value})}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SMTP User (Email)</Label>
                  <Input 
                    type="email"
                    value={smtpSettings.smtpUser}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtpUser: e.target.value})}
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>SMTP Password (App Password)</Label>
                  <Input 
                    type="password"
                    value={smtpSettings.smtpPass}
                    onChange={(e) => setSmtpSettings({...smtpSettings, smtpPass: e.target.value})}
                    placeholder="xxxx xxxx xxxx xxxx"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập App Password từ Google (16 ký tự, có thể có dấu cách)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Email nhận thông báo (Admin)</Label>
                  <Input 
                    type="email"
                    value={smtpSettings.adminEmail}
                    onChange={(e) => setSmtpSettings({...smtpSettings, adminEmail: e.target.value})}
                    placeholder="admin@example.com"
                  />
                </div>

                <Button onClick={() => handleSave("SMTP")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu cấu hình SMTP
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Cấu hình thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">Phương thức thanh toán</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-xs text-muted-foreground">Khách thanh toán khi nhận hàng</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.enableCOD}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableCOD: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                        <p className="text-xs text-muted-foreground">Chuyển khoản qua VietQR</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.enableBankTransfer}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableBankTransfer: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Ví điện tử</p>
                        <p className="text-xs text-muted-foreground">Momo, ZaloPay, VNPay</p>
                      </div>
                      <Switch 
                        checked={paymentSettings.enableEWallet}
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableEWallet: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Thông tin ngân hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mã ngân hàng</Label>
                      <Input 
                        value={paymentSettings.bankCode}
                        onChange={(e) => setPaymentSettings({...paymentSettings, bankCode: e.target.value})}
                        placeholder="ACB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số tài khoản</Label>
                      <Input 
                        value={paymentSettings.bankAccount}
                        onChange={(e) => setPaymentSettings({...paymentSettings, bankAccount: e.target.value})}
                        placeholder="24488671"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Tên chủ tài khoản</Label>
                    <Input 
                      value={paymentSettings.bankAccountName}
                      onChange={(e) => setPaymentSettings({...paymentSettings, bankAccountName: e.target.value})}
                      placeholder="NGUYEN VAN A"
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("thanh toán")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu cấu hình thanh toán
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Mạng xã hội
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Facebook Fanpage</Label>
                    <Input 
                      value={socialSettings.facebook}
                      onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input 
                      value={socialSettings.instagram}
                      onChange={(e) => setSocialSettings({...socialSettings, instagram: e.target.value})}
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>TikTok</Label>
                    <Input 
                      value={socialSettings.tiktok}
                      onChange={(e) => setSocialSettings({...socialSettings, tiktok: e.target.value})}
                      placeholder="https://www.tiktok.com/@..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Threads</Label>
                    <Input 
                      value={socialSettings.threads}
                      onChange={(e) => setSocialSettings({...socialSettings, threads: e.target.value})}
                      placeholder="https://www.threads.com/@..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pinterest</Label>
                    <Input 
                      value={socialSettings.pinterest}
                      onChange={(e) => setSocialSettings({...socialSettings, pinterest: e.target.value})}
                      placeholder="https://www.pinterest.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Youtube</Label>
                    <Input 
                      value={socialSettings.youtube}
                      onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
                      placeholder="https://www.youtube.com/@..."
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("mạng xã hội")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu liên kết mạng xã hội
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Livestream Settings */}
          <TabsContent value="livestream" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500" />
                  Quản lý Livestream
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>Hướng dẫn:</strong> Khi lên live, paste link phòng live vào đây rồi bấm <strong>Lưu</strong>. Nút "Săn Deal trên Live" sẽ tự động hiện trên trang chủ. Khi xuống live, xóa link và bấm Lưu — nút sẽ ẩn đi.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#ee4d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l.867 12.143a2 2 0 0 0 2 1.857h10.276a2 2 0 0 0 2 -1.857l.867 -12.143h-16z" /><path d="M8.5 7c0 -1.653 1.5 -4 3.5 -4s3.5 2.347 3.5 4" /><path d="M9.5 17c.413 .462 1 1 2.5 1s2.5 -.897 2.5 -2s-1 -1.5 -2.5 -2s-2 -1.47 -2 -2c0 -1.104 1 -2 2 -2s1.5 0 2.5 1" /></svg>
                      Link Shopee Live
                    </Label>
                    <Input
                      value={livestreamSettings.shopeeUrl}
                      onChange={(e) => setLivestreamSettings({...livestreamSettings, shopeeUrl: e.target.value})}
                      placeholder="https://shopee.vn/... (để trống nếu không live Shopee)"
                    />
                    {livestreamSettings.shopeeUrl && (
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <span className="text-xs text-green-600 font-medium">Đang hiện trên trang chủ</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#000">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.86a8.28 8.28 0 0 0 4.76 1.5V6.83a4.83 4.83 0 0 1-1-.14z" />
                      </svg>
                      Link TikTok Live
                    </Label>
                    <Input
                      value={livestreamSettings.tiktokUrl}
                      onChange={(e) => setLivestreamSettings({...livestreamSettings, tiktokUrl: e.target.value})}
                      placeholder="https://www.tiktok.com/@.../live (để trống nếu không live TikTok)"
                    />
                    {livestreamSettings.tiktokUrl && (
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <span className="text-xs text-green-600 font-medium">Đang hiện trên trang chủ</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">Trạng thái hiện tại</p>
                      <p className="text-xs text-muted-foreground">
                        {livestreamSettings.shopeeUrl || livestreamSettings.tiktokUrl
                          ? "🟢 Nút 'Săn Deal trên Live' đang hiện trên trang chủ"
                          : "⚪ Chưa có link nào — nút ẩn trên trang chủ"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave("livestream")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  {livestreamSettings.shopeeUrl || livestreamSettings.tiktokUrl ? 'Lưu & Hiện nút Live' : 'Lưu & Ẩn nút Live'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Cài đặt thông báo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email khi có đơn hàng mới</p>
                      <p className="text-xs text-muted-foreground">Nhận email mỗi khi có đơn hàng mới</p>
                    </div>
                    <Switch 
                      checked={notifications.emailOnNewOrder}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailOnNewOrder: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Cảnh báo hết hàng</p>
                      <p className="text-xs text-muted-foreground">Thông báo khi sản phẩm sắp hết tồn kho</p>
                    </div>
                    <Switch 
                      checked={notifications.emailOnLowStock}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailOnLowStock: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Báo cáo hàng tuần</p>
                      <p className="text-xs text-muted-foreground">Nhận email tóm tắt doanh thu mỗi tuần</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Thông báo Zalo OA</p>
                      <p className="text-xs text-muted-foreground">Gửi cập nhật đơn hàng qua Zalo cho khách</p>
                    </div>
                    <Switch 
                      checked={notifications.zaloNotification}
                      onCheckedChange={(checked) => setNotifications({...notifications, zaloNotification: checked})}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("thông báo")} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu cài đặt thông báo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
