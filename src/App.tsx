import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { GOOGLE_CLIENT_ID } from "@/lib/config";


const RouteScrollToTop = () => {
  const { pathname, search } = useLocation();
  
  useEffect(() => {
    // Check for Affiliate REF in URL
    const params = new URLSearchParams(search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("gcnature_ref", ref);
    }
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    
    // Push virtual pageview to Google Tag Manager dataLayer
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
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShopProvider } from "@/context/ShopContext";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Compare from "./pages/Compare.tsx";
import About from "./pages/About.tsx";
import Recruitment from "./pages/Recruitment.tsx";
import Contact from "./pages/Contact.tsx";
import FAQ from "./pages/FAQ.tsx";
import NewsDetail from "./pages/NewsDetail.tsx";
import News from "./pages/News.tsx";
import NewsDispatcher from "./pages/NewsDispatcher.tsx";
import NotFound from "./pages/NotFound.tsx";
import OrderWarehouse from "./pages/OrderWarehouse.tsx";
import Policy from "./pages/Policy.tsx";
import Catalog from "./pages/Catalog.tsx";
import AgentPolicy from "./pages/AgentPolicy.tsx";
import OemPolicy from "./pages/OemPolicy.tsx";
import FlashSale from "./pages/FlashSale.tsx";
import Category from "./pages/Category.tsx";
import Account from "./pages/Account.tsx";
import HotProgram from "./pages/HotProgram.tsx";
import Vouchers from "./pages/Vouchers.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminCustomers from "./pages/admin/AdminCustomers.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminPosts from "./pages/admin/AdminPosts.tsx";
import AdminPostCategories from "./pages/admin/AdminPostCategories.tsx";
import AdminNotifications from "./pages/admin/AdminNotifications.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminBanners from "./pages/admin/AdminBanners.tsx";
import AdminMembers from "./pages/admin/AdminMembers.tsx";
import AdminPayments from "./pages/admin/AdminPayments.tsx";
import AdminBankHistory from "./pages/admin/AdminBankHistory.tsx";
import AdminProductEdit from "./pages/admin/AdminProductEdit.tsx";
import AdminCRM from "./pages/admin/AdminCRM.tsx";
import AdminMedia from "./pages/admin/AdminMedia.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminTransactions from "./pages/admin/AdminTransactions.tsx";
import AdminContacts from "./pages/admin/AdminContacts.tsx";
import AdminFlashSale from "./pages/admin/AdminFlashSale.tsx";
import AdminReviews from "./pages/admin/AdminReviews.tsx";
import AdminLivestream from "./pages/admin/AdminLivestream.tsx";
import AdminVouchers from "./pages/admin/AdminVouchers.tsx";
import AdminPages from "./pages/admin/AdminPages.tsx";
import AdminMenu from "./pages/admin/AdminMenu.tsx";
import AdminGuard from "./components/AdminGuard.tsx";

const queryClient = new QueryClient();
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ShopProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </GoogleOAuthProvider>
);

export default App;
