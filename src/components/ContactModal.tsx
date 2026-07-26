import { useState } from "react";
import { X, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRequestType?: string;
}

export function ContactModal({ isOpen, onClose, defaultRequestType = "Tư vấn Affiliate" }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    ward: "",
    city: "",
    country: "Việt Nam",
    requestType: defaultRequestType,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
          requestType: defaultRequestType,
          message: ""
        });
        onClose();
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
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Gửi thông tin liên hệ</h3>
              <p className="text-[10px] text-muted-foreground">Chúng tôi sẽ liên hệ lại bạn sớm nhất</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Họ tên + SĐT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Họ và Tên <span className="text-destructive">*</span></label>
              <input 
                type="text" 
                placeholder="Nguyễn Văn A" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Số điện thoại <span className="text-destructive">*</span></label>
              <input 
                type="tel" 
                placeholder="09xx xxx xxx" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                required
              />
            </div>
          </div>

          {/* Email + Loại yêu cầu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Email liên hệ <span className="text-destructive">*</span></label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Loại yêu cầu <span className="text-destructive">*</span></label>
              <select
                value={formData.requestType}
                onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              >
                <option value="Tư vấn Affiliate">Tư vấn Affiliate</option>
                <option value="OEM sản xuất hóa mỹ phẩm">OEM sản xuất hóa mỹ phẩm</option>
                <option value="Tư vấn/Chăm sóc khách hàng">Tư vấn/Chăm sóc khách hàng</option>
              </select>
            </div>
          </div>

          {/* Địa chỉ cụ thể + Xã/Phường */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Địa chỉ cụ thể (Số nhà, đường...) <span className="text-destructive">*</span></label>
              <input 
                type="text" 
                placeholder="Số 123 Đường Láng" 
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Xã / Phường <span className="text-destructive">*</span></label>
              <input 
                type="text" 
                placeholder="Phường Láng Thượng" 
                value={formData.ward}
                onChange={(e) => setFormData({...formData, ward: e.target.value})}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                required
              />
            </div>
          </div>

          {/* Thành phố + Quốc gia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Thành phố / Tỉnh <span className="text-destructive">*</span></label>
              <input 
                type="text" 
                placeholder="Quận Đống Đa, Hà Nội" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground block">Quốc gia</label>
              <input 
                type="text" 
                value={formData.country}
                disabled
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/50 focus:outline-none cursor-not-allowed text-muted-foreground" 
              />
            </div>
          </div>

          {/* Lời nhắn */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground block">Nội dung yêu cầu <span className="text-destructive">*</span></label>
            <textarea 
              placeholder="Vui lòng nhập chi tiết nội dung tin nhắn hoặc câu hỏi..." 
              rows={4} 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none min-h-[80px]"
              required
            ></textarea>
          </div>

          {/* Footer inside form */}
          <div className="pt-2 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg text-xs font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/10"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                  Đang gửi...
                </>
              ) : "Gửi thông tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
