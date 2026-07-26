import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/lib/config";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";
import AdminGuard from "@/components/AdminGuard";

// Primary Fast Pages (Direct Imports for Instant FCP)
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Lazy-Loaded Secondary Customer Pages (Code-Split)
const Catalog = lazy(() => import("./pages/Catalog"));
const Category = lazy(() => import("./pages/Category"));
const FlashSale = lazy(() => import("./pages/FlashSale"));
const HotProgram = lazy(() => import("./pages/HotProgram"));
const Vouchers = lazy(() => import("./pages/Vouchers"));
const Account = lazy(() => import("./pages/Account"));
const OrderWarehouse = lazy(() => import("./pages/OrderWarehouse"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Compare = lazy(() => import("./pages/Compare"));
const Recruitment = lazy(() => import("./pages/Recruitment"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/News"));
const NewsDispatcher = lazy(() => import("./pages/NewsDispatcher"));
const Policy = lazy(() => import("./pages/Policy"));
const AgentPolicy = lazy(() => import("./pages/AgentPolicy"));
const OemPolicy = lazy(() => import("./pages/OemPolicy"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Lazy-Loaded Admin Dashboard & Portal Pages (Loaded Only When Admin Logs In)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductEdit = lazy(() => import("./pages/admin/AdminProductEdit"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts"));
const AdminPostCategories = lazy(() => import("./pages/admin/AdminPostCategories"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));
const AdminMembers = lazy(() => import("./pages/admin/AdminMembers"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminBankHistory = lazy(() => import("./pages/admin/AdminBankHistory"));
const AdminCRM = lazy(() => import("./pages/admin/AdminCRM"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminTransactions = lazy(() => import("./pages/admin/AdminTransactions"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminFlashSale = lazy(() => import("./pages/admin/AdminFlashSale"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminLivestream = lazy(() => import("./pages/admin/AdminLivestream"));
const AdminVouchers = lazy(() => import("./pages/admin/AdminVouchers"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminMenu = lazy(() => import("./pages/admin/AdminMenu"));

// Page Loading Spinner Fallback
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const RouteScrollToTop = () => {
  const { pathname, search } = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("gcnature_ref", ref);
    }
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "virtualPageView",
        page_path: pathname + search,
        page_title: document.title,
      });
    }
  }, [pathname, search]);
  
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache API data for 5 minutes
      gcTime: 1000 * 60 * 15,    // Keep in garbage collection for 15 minutes
      refetchOnWindowFocus: false, // Prevent laggy background re-fetches
    }
  }
});

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ShopProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <RouteScrollToTop />
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:categoryName" element={<Shop />} />
                    <Route path="/danh-muc/:slug" element={<Category />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/orders" element={<OrderWarehouse />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/tuyen-dung" element={<Recruitment />} />
                    <Route path="/lien-he" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/new" element={<News />} />
                    <Route path="/news/:slug" element={<NewsDispatcher />} />
                    <Route path="/news/:parentSlug/:childSlug" element={<News />} />
                    <Route path="/flash-sale" element={<FlashSale />} />
                    <Route path="/chuong-trinh-hot" element={<HotProgram />} />
                    <Route path="/vouchers" element={<Vouchers />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/chinh-sach/dai-ly" element={<AgentPolicy />} />
                    <Route path="/chinh-sach/oem" element={<OemPolicy />} />
                    <Route path="/chinh-sach/:slug" element={<Policy />} />
                    
                    {/* Admin Portal Routes (Lazy Loaded Only For Admins) */}
                    <Route path="/admin" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminDashboard /></AdminGuard>} />
                    <Route path="/admin/orders" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminOrders /></AdminGuard>} />
                    <Route path="/admin/products" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminProducts /></AdminGuard>} />
                    <Route path="/admin/products/:id" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminProductEdit /></AdminGuard>} />
                    <Route path="/admin/customers" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminCustomers /></AdminGuard>} />
                    <Route path="/admin/crm" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminCRM /></AdminGuard>} />
                    <Route path="/admin/analytics" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminAnalytics /></AdminGuard>} />
                    <Route path="/admin/posts" element={<AdminGuard allowedRoles={['admin', 'editor']}><AdminPosts /></AdminGuard>} />
                    <Route path="/admin/post-categories" element={<AdminGuard allowedRoles={['admin', 'editor']}><AdminPostCategories /></AdminGuard>} />
                    <Route path="/admin/notifications" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminNotifications /></AdminGuard>} />
                    <Route path="/admin/banners" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminBanners /></AdminGuard>} />
                    <Route path="/admin/media" element={<AdminGuard allowedRoles={['admin', 'editor', 'shop_manager']}><AdminMedia /></AdminGuard>} />
                    <Route path="/admin/categories" element={<AdminGuard allowedRoles={['admin']}><AdminCategories /></AdminGuard>} />
                    <Route path="/admin/members" element={<AdminGuard allowedRoles={['admin']}><AdminMembers /></AdminGuard>} />
                    <Route path="/admin/contacts" element={<AdminGuard allowedRoles={['admin']}><AdminContacts /></AdminGuard>} />
                    <Route path="/admin/payments" element={<AdminGuard allowedRoles={['admin']}><AdminPayments /></AdminGuard>} />
                    <Route path="/admin/bank-history" element={<AdminGuard allowedRoles={['admin']}><AdminBankHistory /></AdminGuard>} />
                    <Route path="/admin/settings" element={<AdminGuard allowedRoles={['admin']}><AdminSettings /></AdminGuard>} />
                    <Route path="/admin/pages" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminPages /></AdminGuard>} />
                    <Route path="/admin/menu" element={<AdminGuard allowedRoles={['admin']}><AdminMenu /></AdminGuard>} />
                    <Route path="/admin/transactions" element={<AdminGuard allowedRoles={['admin']}><AdminTransactions /></AdminGuard>} />
                    <Route path="/admin/flash-sale" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminFlashSale /></AdminGuard>} />
                    <Route path="/admin/vouchers" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminVouchers /></AdminGuard>} />
                    <Route path="/admin/reviews" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminReviews /></AdminGuard>} />
                    <Route path="/admin/livestream" element={<AdminGuard allowedRoles={['admin', 'shop_manager']}><AdminLivestream /></AdminGuard>} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </ShopProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </GoogleOAuthProvider>
);

export default App;
