import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    ward: "",
    city: "",
    country: "Việt Nam",
    requestType: "Tư vấn Affiliate",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.name || 
      !formData.phone || 
      !formData.email || 
      !formData.street || 
      !formData.ward || 
      !formData.city || 
      !formData.message
    ) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    // Phone validation
    const phoneRegex = /^(0[235789])[0-9]{8}$/;
    const cleanPhone = formData.phone.trim().replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: cleanPhone
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Yêu cầu liên hệ của bạn đã được gửi thành công!");
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          street: "",
          ward: "",
          city: "",
          country: "Việt Nam",
          requestType: "Tư vấn sản phẩm",
          message: ""
        });
      } else {
        toast.error(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Liên hệ hợp tác"
        description="Liên hệ và hợp tác cùng GCnature để phát triển kinh doanh mỹ phẩm Hàn Quốc."
        canonical={makeSiteUrl("/lien-he")}
      />
      <Header />

      <main>
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="flex flex-col items-center p-6 bg-card border border-border rounded-xl text-center hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mb-4 text-teal-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Gọi ngay cho chúng tôi</h3>
                  <a href="tel:0559869392" className="text-teal-600 hover:underline font-semibold">0559.869.392</a>
               </div>

               <div className="flex flex-col items-center p-6 bg-card border border-border rounded-xl text-center hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mb-4 text-teal-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Gửi email</h3>
                  <a href="mailto:gcnatureofficial@gmail.com" className="text-teal-600 hover:underline font-semibold">gcnatureofficial@gmail.com</a>
               </div>
            </div>

            <div className="bg-muted/40 p-6 md:p-10 rounded-2xl border border-border/80 shadow-sm">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-extrabold text-foreground">Gửi thông tin liên hệ</h2>
                  <p className="text-xs text-muted-foreground mt-2">Vui lòng hoàn thành các trường dưới đây để gửi hòm thư liên hệ</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Họ tên + SĐT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Họ và Tên <span className="text-destructive">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Họ và tên của bạn" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Số điện thoại <span className="text-destructive">*</span></label>
                        <input 
                          type="tel" 
                          placeholder="Số điện thoại di động" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                          required
                        />
                      </div>
                    </div>

                    {/* Email + Loại yêu cầu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Email liên hệ <span className="text-destructive">*</span></label>
                        <input 
                          type="email" 
                          placeholder="email@example.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Loại yêu cầu <span className="text-destructive">*</span></label>
                        <select
                          value={formData.requestType}
                          onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          required
                        >
                          <option value="Tư vấn Affiliate">Tư vấn Affiliate</option>
                          <option value="OEM sản xuất hóa mỹ phẩm">OEM sản xuất hóa mỹ phẩm</option>
                          <option value="Tư vấn/Chăm sóc khách hàng">Tư vấn/Chăm sóc khách hàng</option>
                        </select>
                      </div>
                    </div>

                    {/* Địa chỉ phân cấp: Đường/Số nhà + Phường/Xã */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Địa chỉ cụ thể (Đường, số nhà...) <span className="text-destructive">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Số 123 Đường Láng" 
                          value={formData.street}
                          onChange={(e) => setFormData({...formData, street: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Xã / Phường <span className="text-destructive">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Phường Láng Thượng" 
                          value={formData.ward}
                          onChange={(e) => setFormData({...formData, ward: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                          required
                        />
                      </div>
                    </div>

                    {/* Thành phố + Quốc gia */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Thành phố / Tỉnh <span className="text-destructive">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Quận Đống Đa, Hà Nội" 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground block">Quốc gia</label>
                        <input 
                          type="text" 
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-muted/50 focus:outline-none cursor-not-allowed" 
                          disabled
                        />
                      </div>
                    </div>

                    {/* Nội dung yêu cầu */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground block">Nội dung yêu cầu <span className="text-destructive">*</span></label>
                      <textarea 
                        placeholder="Vui lòng nhập chi tiết nội dung tin nhắn hoặc câu hỏi của bạn tại đây..." 
                        rows={4} 
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none min-h-[100px]"
                        required
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white font-bold rounded-lg transition-colors text-sm shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Đang gửi yêu cầu...
                        </>
                      ) : "Gửi Yêu Cầu"}
                    </button>
                </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Contact;
