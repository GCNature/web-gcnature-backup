import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Package, Users, PhoneCall, CheckCircle, Check, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface SystemNotification {
  id: number;
  type: 'order_new' | 'order_completed' | 'contact_new' | 'hotline_call';
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const iconMap = {
  order_new: Package,
  order_completed: CheckCircle,
  contact_new: Users,
  hotline_call: PhoneCall,
};

const iconBg: Record<string, string> = {
  order_new: "bg-teal-50 text-teal-600 border border-teal-100",
  order_completed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  contact_new: "bg-blue-50 text-blue-600 border border-blue-100",
  hotline_call: "bg-amber-50 text-amber-600 border border-amber-100",
};

const formatPhoneFront = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

const getShortContent = (content: string) => {
  try {
    const parsed = JSON.parse(content);
    return parsed.message || content;
  } catch {
    return content;
  }
};

const renderMessageWithLinks = (text: string) => {
  if (!text) return "Không có nội dung lời nhắn";
  
  // Regex to detect URLs starting with http:// or https://
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-700 font-bold underline break-all inline-block bg-teal-50 hover:bg-teal-100/70 px-2 py-0.5 rounded transition-colors my-0.5"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const renderNotificationContent = (content: string) => {
  let name = "Không rõ";
  let phone = "Không có";
  let email = "Không có";
  let requestType = "Không xác định";
  let address = "Không có";
  let message = "";

  try {
    const parsed = JSON.parse(content);
    name = parsed.name || "Không rõ";
    phone = parsed.phone || "Không có";
    email = parsed.email || "Không có";
    requestType = parsed.requestType || "Không xác định";
    address = parsed.address || "Không có";
    message = parsed.message || "";
  } catch (err) {
    // If not JSON, parse intelligently from the raw text
    message = content;
    
    // Attempt parsing requestType
    if (content.includes("[ĐĂNG KÝ ĐẠI LÝ]")) {
      requestType = "Đăng ký đại lý mới";
    } else if (content.includes("Đơn hàng mới") || content.includes("đơn hàng mới")) {
      requestType = "Đơn hàng mới";
    } else if (content.includes("Hotline") || content.includes("hotline")) {
      requestType = "Yêu cầu Hotline";
    } else if (content.includes("hoàn thành") || content.includes("hoàn tất")) {
      requestType = "Đơn hàng hoàn thành";
    } else {
      requestType = "Thư liên hệ mới";
    }

    // Extract Name: "Khách hàng: Nguyễn Văn A"
    const nameMatch = content.match(/Khách hàng:\s*([^-.]+)/i);
    if (nameMatch) name = nameMatch[1].trim();

    // Extract Phone: "SĐT: 0901234567"
    const phoneMatch = content.match(/(?:SĐT|SĐT:)\s*([0-9\s]+)/i) || content.match(/SĐT\s*([0-9\s]+)/i);
    if (phoneMatch) {
      phone = phoneMatch[1].trim();
    } else {
      const anyPhone = content.match(/\b(0[1-9][0-9\s]{7,10})\b/);
      if (anyPhone) phone = anyPhone[1].trim();
    }

    // Extract Address/Region: "Khu vực: Hà Nội"
    const areaMatch = content.match(/Khu vực:\s*([^.]+)/i);
    if (areaMatch) address = areaMatch[1].trim();

    // Extract detailed text message
    const msgMatch = content.match(/Lời nhắn:\s*(.+)/i) || content.match(/Lời nhắn:\s*([^.]+)/i);
    if (msgMatch) {
      message = msgMatch[1].trim();
    }
  }

  return (
    <div className="bg-muted/40 rounded-xl p-4 border border-border mt-3 space-y-3 text-xs text-foreground animate-in fade-in duration-200">
      {/* 1. Name */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-1">
        <span className="font-semibold text-muted-foreground w-32 shrink-0">Họ và tên:</span>
        <span className="font-bold text-foreground text-sm flex-1 sm:text-right">{name}</span>
      </div>

      {/* 2. Phone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-1">
        <span className="font-semibold text-muted-foreground w-32 shrink-0">Số điện thoại:</span>
        <span className="font-bold text-foreground text-sm flex-1 sm:text-right">
          {phone !== "Không có" ? formatPhoneFront(phone) : "Không có"}
        </span>
      </div>

      {/* 3. Email */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-1">
        <span className="font-semibold text-muted-foreground w-32 shrink-0">Email:</span>
        <span className="font-bold text-foreground flex-1 sm:text-right break-all">{email}</span>
      </div>

      {/* 4. Request Type */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-1">
        <span className="font-semibold text-muted-foreground w-32 shrink-0">Loại yêu cầu:</span>
        <span className="flex-1 sm:text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
            {requestType}
          </span>
        </span>
      </div>

      {/* 5. Address */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border/40 gap-1">
        <span className="font-semibold text-muted-foreground w-32 shrink-0">Địa chỉ / Khu vực:</span>
        <span className="font-bold text-foreground flex-1 sm:text-right">{address}</span>
      </div>

      {/* 6. Message Body */}
      <div className="space-y-1.5 pt-1">
        <span className="font-semibold text-muted-foreground block">Nội dung chi tiết:</span>
        <div className="bg-background/80 rounded-lg p-3 border border-border/60 whitespace-pre-wrap break-words break-all text-foreground leading-relaxed">
          {renderMessageWithLinks(message)}
        </div>
      </div>
    </div>
  );
};

export default function AdminNotifications() {
  const [list, setList] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setList(data.data);
      } else {
        toast.error(data.error || "Không thể tải danh sách thông báo");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setList(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setList(prev => prev.map(n => ({ ...n, is_read: true })));
        toast.success("Đã đánh dấu tất cả thông báo đã đọc");
      } else {
        toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  const handleCardClick = (n: SystemNotification) => {
    if (expandedId === n.id) {
      setExpandedId(null);
    } else {
      setExpandedId(n.id);
      if (!n.is_read) {
        handleMarkAsRead(n.id);
      }
    }
  };

  const unreadCount = list.filter(n => !n.is_read).length;

  const filteredList = activeTab === "unread" ? list.filter(n => !n.is_read) : list;

  return (
    <AdminLayout title="Thông báo hệ thống">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-muted p-1 rounded-lg self-start">
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "unread"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả ({list.length})
            </button>
          </div>

          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead} 
              className="text-xs md:text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1 self-end sm:self-auto"
            >
              <Check className="w-4 h-4" /> Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        <Card className="border-border">
          <CardContent className="p-0 divide-y divide-border">
            {loading ? (
              <div className="flex justify-center items-center py-16 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : filteredList.length > 0 ? (
              filteredList.map((n) => {
                const Icon = iconMap[n.type] || Bell;
                const isExpanded = expandedId === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleCardClick(n)}
                    className={`flex items-start gap-4 p-4 transition-all duration-200 cursor-pointer hover:bg-muted/10 ${!n.is_read ? "bg-teal-50/20" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconBg[n.type] || "bg-muted"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm break-words break-all ${!n.is_read ? "font-bold text-foreground" : "font-semibold text-foreground/80"}`}>{n.title}</p>
                        {!n.is_read && (
                          <span className="bg-teal-100 text-teal-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">Mới</span>
                        )}
                      </div>
                      
                      {isExpanded ? (
                        renderNotificationContent(n.content)
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap overflow-hidden text-ellipsis break-all">{getShortContent(n.content)}</p>
                      )}
                      
                      <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                        {new Date(n.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 mt-1">
                      {!n.is_read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                          className="bg-teal-50 hover:bg-teal-100 text-teal-600 border border-teal-200 p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                          title="Đánh dấu đã đọc"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Đã đọc</span>
                        </button>
                      )}
                      {n.is_read && !isExpanded && (
                        <span className="text-xs text-muted-foreground/50 font-medium italic flex items-center gap-1 px-2">
                          <Eye className="w-3.5 h-3.5" /> Đã xem
                        </span>
                      )}
                      <div className="text-muted-foreground/60 hover:text-foreground p-1 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bell className="w-12 h-12 mb-3 opacity-30 text-teal-600" />
                <p className="text-sm font-medium">Không có thông báo nào</p>
                <p className="text-xs mt-1">
                  {activeTab === "unread" 
                    ? "Bạn đã đọc hết mọi thông báo!" 
                    : "Thông báo về đơn hàng, liên hệ, hotline sẽ hiển thị tại đây"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
