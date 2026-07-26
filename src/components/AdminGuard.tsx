import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const AdminGuard = ({ children, allowedRoles = ["admin"] }: AdminGuardProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const hasShownToast = useRef(false);

  const hasAccess = user ? allowedRoles.includes(user.role) : false;

  useEffect(() => {
    if (!hasShownToast.current && !isLoading) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        hasShownToast.current = true;
      } else if (!hasAccess) {
        toast.error("Bạn không có quyền truy cập trang này");
        hasShownToast.current = true;
      }
    }
  }, [isAuthenticated, hasAccess, isLoading]);

  if (isLoading) {
    return (
      <div className="flex bg-gray-50 h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    // Redirect staff back to dashboard if they don't have access to this page, or to home page.
    // If they are staff but don't have this page role, we can let them go to their default home /admin
    const isStaff = user && (user.role === "editor" || user.role === "shop_manager");
    if (isStaff) {
      // Editors default to posts, shop managers default to products
      if (user.role === "editor") {
        return <Navigate to="/admin/posts" replace />;
      } else {
        return <Navigate to="/admin/products" replace />;
      }
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
