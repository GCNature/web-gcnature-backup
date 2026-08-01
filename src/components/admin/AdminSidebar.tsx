import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  BarChart3,
  Settings,
  Package,
  Bell,
  LogOut,
  Image,
  UserCheck,
  CreditCard,
  History,
  TrendingUp,
  FolderOpen,
  Layers,
  Wallet,
  Mail,
  Zap,
  Film,
  Radio,
  Ticket,
  Files,
  Menu,
  Gift,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Đơn hàng", url: "/admin/orders", icon: ShoppingBag },
  { title: "Sản phẩm", url: "/admin/products", icon: Package },
  { title: "Flash Sale", url: "/admin/flash-sale", icon: Zap },
  { title: "Voucher", url: "/admin/vouchers", icon: Ticket },
  { title: "Chương trình ưu đãi", url: "/admin/pages?page=page_lucky_wheel", icon: Gift },
  { title: "Livestream", url: "/admin/livestream", icon: Radio },
  { title: "Liên hệ", url: "/admin/contacts", icon: Mail },
  { title: "Thành viên", url: "/admin/members", icon: UserCheck },
  { title: "Khách hàng", url: "/admin/customers", icon: Users },
  { title: "CRM Tăng trưởng", url: "/admin/crm", icon: TrendingUp },
  { title: "Thống kê", url: "/admin/analytics", icon: BarChart3 },
];

const otherItems = [
  { title: "Header & Footer", url: "/admin/header-footer", icon: Sliders },
  { title: "Lịch sử nạp tiền", url: "/admin/bank-history", icon: History },
  { title: "Giao dịch nhận tiền", url: "/admin/transactions", icon: Wallet },
  { title: "Thanh toán", url: "/admin/settings?tab=payment", icon: CreditCard },
  { title: "Danh mục", url: "/admin/categories", icon: Layers },
  { title: "Kho ảnh", url: "/admin/media", icon: FolderOpen },
  { title: "Banner", url: "/admin/banners", icon: Image },
  { title: "Góc Review", url: "/admin/reviews", icon: Film },
  { title: "Bài viết", url: "/admin/posts", icon: FileText },
  { title: "Danh mục bài viết", url: "/admin/post-categories", icon: FolderOpen },
  { title: "Trang", url: "/admin/pages", icon: Files },
  { title: "Menu", url: "/admin/menu", icon: Menu },
  { title: "Thông báo", url: "/admin/notifications", icon: Bell },
  { title: "Cài đặt", url: "/admin/settings", icon: Settings },
];


export function AdminSidebar() {
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user } = useAuth();
  
  const role = user?.role || "customer";

  const isLinkActive = (url: string) => {
    if (url.includes("?")) {
      const [path, query] = url.split("?");
      const params = new URLSearchParams(query);
      const pageVal = params.get("page");
      const currentParams = new URLSearchParams(location.search);
      return location.pathname === path && currentParams.get("page") === pageVal;
    }
    if (location.pathname === "/admin/pages" && location.search.includes("page=")) {
      return false;
    }
    return url === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(url);
  };

  // Filter main navigation menus
  const filteredMainItems = mainItems.filter((item) => {
    if (role === "admin") return true;
    if (role === "editor") {
      return false; 
    }
    if (role === "shop_manager") {
      const allowedPaths = [
        "/admin/products",
        "/admin/flash-sale",
        "/admin/vouchers",
        "/admin/pages?page=page_lucky_wheel",
        "/admin/livestream",
        "/admin/orders",
        "/admin/crm",
        "/admin/analytics"
      ];
      return allowedPaths.includes(item.url);
    }
    return false;
  });

  // Filter other navigation menus
  const filteredOtherItems = otherItems.filter((item) => {
    if (role === "admin") return true;
    if (role === "editor") {
      const allowedPaths = [
        "/admin/posts",
        "/admin/post-categories",
        "/admin/media"
      ];
      return allowedPaths.includes(item.url);
    }
    if (role === "shop_manager") {
      const allowedPaths = [
        "/admin/media",
        "/admin/banners",
        "/admin/reviews"
      ];
      return allowedPaths.includes(item.url);
    }
    return false;
  });

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-border">
      <SidebarContent className="bg-secondary text-secondary-foreground">
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            GC
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight">GCnature Admin</span>
          )}
        </div>

        {filteredMainItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground/60 uppercase text-xs tracking-wider">
              Menu chính
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMainItems.map((item) => {
                  const active = isLinkActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-foreground/70 hover:bg-secondary-foreground/10 transition-colors w-full",
                            active && "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredOtherItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground/60 uppercase text-xs tracking-wider">
              Cấu hình & Tác vụ
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredOtherItems.map((item) => {
                  const active = isLinkActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-foreground/70 hover:bg-secondary-foreground/10 transition-colors w-full",
                            active && "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="bg-secondary border-t border-secondary-foreground/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-secondary-foreground/70 hover:bg-destructive/20 hover:text-destructive transition-colors w-full"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Thoát Admin</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
