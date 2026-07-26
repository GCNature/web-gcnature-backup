import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Mã token đặt lại mật khẩu không hợp lệ hoặc thiếu.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Thiếu mã xác nhận đặt lại mật khẩu. Vui lòng thử lại từ email của bạn.");
      return;
    }
    if (!password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đặt lại mật khẩu thất bại");
      }
      setSuccess(true);
      toast.success(data.message || "Mật khẩu đã được cập nhật thành công.");
    } catch (err: any) {
      toast.error(err.message || "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Header />

      <section className="container py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
              Đặt lại mật khẩu
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8">
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Đổi mật khẩu thành công!</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Bạn có thể đăng nhập bằng mật khẩu mới
                </p>
                <Link
                  to="/login"
                  className="inline-block py-3 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                >
                  {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default ResetPassword;
