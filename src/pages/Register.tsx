import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { API_BASE, apiPost } from "@/lib/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
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
      // Call backend API
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Không thể đăng ký");
      }
      login(data.user, data.token);
      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const data = await apiPost<any>("/auth/google", { credential: credentialResponse.credential });
      login(data.user, data.token);
      toast.success(`Chào mừng ${data.user.name}!`);
      if (data.isNewUser && data.defaultPassword) {
        toast.info(
          `Hệ thống đã tự động tạo mật khẩu mặc định: ${data.defaultPassword}. Hãy sao chép và cập nhật lại mật khẩu tại trang thông tin cá nhân!`, 
          { duration: 25000 }
        );
      }
      navigate("/");
    } catch (err: any) {
      console.error("Google registration failed:", err);
      toast.error(err.message || "Đăng ký Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />

      <section className="container py-10 md:py-16">
        <div className="max-w-[440px] mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản</h1>
            <p className="text-gray-500 text-sm mt-1.5">Đăng ký để mua sắm và theo dõi đơn hàng</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 md:p-8">
            {/* Google Sign Up */}
            <div className="flex justify-center mb-5">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Đăng ký Google thất bại")}
                theme="outline"
                size="large"
                width="100%"
                text="signup_with"
                shape="rectangular"
                locale="vi"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">hoặc đăng ký bằng email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-red-600 font-bold hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
            <span>🔒 Bảo mật SSL</span>
            <span>🛡 Chính sách bảo mật</span>
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Register;
