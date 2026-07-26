import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gửi yêu cầu thất bại");
      }
      setSent(true);
      toast.success(data.message || "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
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
              Quên mật khẩu
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Kiểm tra email của bạn</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <span className="font-medium text-foreground">{email}</span>
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Gửi lại email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                >
                  {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default ForgotPassword;
