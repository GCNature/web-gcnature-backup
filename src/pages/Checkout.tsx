import SEOHead from "@/components/SEOHead";
import { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { apiGet, apiPost, API_BASE } from "@/lib/api";
import { BANK_ACCOUNT, BANK_ACCOUNT_NAME, BANK_CODE, makeVietQrUrl } from "@/lib/config";
import { Ticket, X } from "lucide-react";

interface AppliedVoucher {
  id: number;
  code: string;
  name: string;
  discount_amount: number;
}

const Checkout = () => {
  const { cartTotal, cart, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutInitiated, setCheckoutInitiated] = useState(false);
  const [orderId] = useState(`GCN${Math.floor(10000 + Math.random() * 90000)}`);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [validating, setValidating] = useState(false);

  // Affiliate code checking from localStorage
  const refCode = localStorage.getItem("gcnature_ref");

  const shippingFee = cartTotal >= 500000 ? 0 : 30000;
  const voucherDiscount = appliedVoucher ? Math.min(appliedVoucher.discount_amount, cartTotal) : 0;
  const totalWithShipping = cartTotal + shippingFee - voucherDiscount;

  // Bank Info loaded from active payment method in Database
  const [bankConfig, setBankConfig] = useState({
    bankCode: BANK_CODE,
    bankName: "Ngân hàng Á Châu",
    accountNumber: BANK_ACCOUNT,
    accountName: BANK_ACCOUNT_NAME,
  });

  useEffect(() => {
    apiGet<any>('/settings/active-payment-method')
      .then(data => {
        if (data && data.success && data.accountNumber) {
          setBankConfig({
            bankCode: data.bankCode || BANK_CODE,
            bankName: data.bankName || data.bankCode || "Ngân hàng Á Châu",
            accountNumber: data.accountNumber,
            accountName: data.accountName,
          });
        }
      })
      .catch(err => {
        console.error("Failed to load active bank payment method:", err);
      });
  }, []);

  const BANK_ACCOUNT_NUMBER = bankConfig.accountNumber;
  const BANK_NAME = bankConfig.bankName || bankConfig.bankCode;
  const ACCOUNT_NAME = bankConfig.accountName;
  const description = `ThanhToan${orderId}`;

  // Generate VietQR image dynamically
  const qrUrl = `https://img.vietqr.io/image/${bankConfig.bankCode}-${BANK_ACCOUNT_NUMBER}-compact2.png?amount=${totalWithShipping}&addInfo=${description}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      navigate('/shop');
    }
  }, [cart, navigate, isSuccess]);

  useEffect(() => {
    if (cart.length > 0 && !checkoutInitiated) {
      setCheckoutInitiated(true);
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "begin_checkout",
          ecommerce: {
            currency: "VND",
            value: cartTotal,
            items: cart.map(item => ({
              item_id: item.sku || item.productId || String(item.id),
              item_name: item.name,
              price: Number(item.price),
              quantity: item.quantity,
              item_brand: item.brand || "GC Nature",
              item_category: item.categoryName || item.category || ""
            }))
          }
        });
      }
    }
  }, [cart, cartTotal, checkoutInitiated]);

  // Auto-fetch best voucher for logged-in user
  useEffect(() => {
    if (!user || cartTotal === 0) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/vouchers/best-for-order?amount=${cartTotal}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.voucher) {
          setAppliedVoucher(data.voucher);
          toast.success(`Đã tự động áp dụng voucher ${data.voucher.code} (-${data.voucher.discount_amount.toLocaleString("vi-VN")}đ)`);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, cartTotal]);

  const handleValidateVoucher = async () => {
    if (!manualCode.trim()) return;
    if (!user) {
      toast.error("Vui lòng đăng nhập để dùng voucher");
      return;
    }
    const token = localStorage.getItem("token");
    setValidating(true);
    try {
      const res = await fetch(`${API_BASE}/vouchers/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: manualCode.toUpperCase(), orderAmount: cartTotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedVoucher(data.voucher);
        setManualCode("");
        toast.success(`Áp dụng voucher ${data.voucher.code} thành công!`);
      } else {
        toast.error(data.error || "Mã voucher không hợp lệ");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setValidating(false);
    }
  };

  // Polling to verify payment
  useEffect(() => {
    if (isSuccess || cartTotal === 0) return;

    const checkPayment = async () => {
      try {
        const json = await apiGet<{ paid: boolean }>(`/orders/check-payment?amount=${totalWithShipping}&content=${encodeURIComponent(orderId)}`);

        if (json.paid) {
          setIsSuccess(true);
          toast.success("Thanh toán thành công! Cảm ơn bạn.");

          // Push GTM purchase event
          if (typeof window !== "undefined") {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
              event: "purchase",
              ecommerce: {
                transaction_id: orderId,
                value: totalWithShipping,
                currency: "VND",
                tax: 0,
                shipping: shippingFee,
                items: cart.map(item => ({
                  item_id: item.sku || item.productId || String(item.id),
                  item_name: item.name,
                  price: Number(item.price),
                  quantity: item.quantity,
                  item_brand: item.brand || "GC Nature",
                  item_category: item.categoryName || item.category || ""
                }))
              }
            });
          }

          apiPost("/orders", {
            total: totalWithShipping,
            orderCode: orderId,
            affiliateCode: refCode,
            userId: user?.id || null,
            voucherCode: appliedVoucher?.code || null,
            voucherDiscount: voucherDiscount || 0,
            items: cart.map(c => ({
              productId: c.id,
              productName: c.name,
              price: c.price,
              quantity: c.quantity || 1,
              imageUrl: c.image,
              originalPrice: c.price
            })),
            shippingInfo: {
              name: user?.name || "Khách hàng",
              email: user?.email || "",
              phone: user?.phone || "",
              address: "",
              paymentMethod: "chuyen_khoan",
              notes: description
            },
            status: "confirmed"
          }).then(() => {
            clearCart();
          }).catch(e => console.error("Could not save order", e));
        }
      } catch (err) {
        console.error("Lỗi kiểm tra lịch sử thanh toán", err);
      }
    };

    const interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [cart, cartTotal, isSuccess, orderId, totalWithShipping, clearCart, refCode, user, appliedVoucher, voucherDiscount]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SEOHead title="Thanh Toán Thành Công" noindex={true} />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thanh toán thành công</h1>
          <p className="text-muted-foreground text-center mb-8">
            Đơn hàng <strong>{orderId}</strong> của bạn đã được xác nhận thanh toán. Chúng tôi sẽ sớm liên hệ để giao hàng.
          </p>
          <Link to="/" className="px-8 py-3 bg-primary text-white rounded-xl font-medium">Trở về trang chủ</Link>
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead title="Thanh Toán Đơn Hàng" noindex={true} />
      <Header />
      
      <section className="bg-muted/50 border-b border-border py-10 text-center">
        <h1 className="text-3xl font-bold italic" style={{ fontFamily: "Georgia, serif" }}>Thanh toán</h1>
      </section>

      <div className="container py-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code and Info */}
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-md">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Chuyển khoản để hoàn tất</h2>
            <div className="flex flex-col items-center justify-center space-y-6">
              <img src={qrUrl} alt="Mã QR Thanh Toán" className="w-64 h-64 object-contain rounded-xl border border-gray-100 shadow-sm" />
              
              <div className="w-full space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Ngân hàng</span>
                  <span className="font-semibold">{BANK_NAME}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Số tài khoản</span>
                  <span className="font-bold text-primary text-lg">{BANK_ACCOUNT_NUMBER}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Chủ tài khoản</span>
                  <span className="font-semibold uppercase">{ACCOUNT_NAME}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Số tiền</span>
                  <span className="font-bold text-lg text-primary">{formatPrice(totalWithShipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nội dung CK</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded text-primary font-bold">{description}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-500/10 text-yellow-700 rounded-xl text-center text-sm w-full">
                <p className="flex items-center justify-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                  Đang tự động chờ xác nhận thanh toán...
                </p>
                <p className="text-xs mt-2 opacity-80">Giao dịch sẽ được ghi nhận ngay sau khi chuyển khoản thành công</p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-2xl border border-border">
              <h3 className="font-semibold mb-4">Thông tin mua hàng</h3>
              {user ? (
                <div className="text-sm">
                  <p><strong>Người nhận:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-4">Bạn chưa đăng nhập. Nên đăng nhập để theo dõi đơn hàng và nhận voucher!</p>
                  <Link to="/login" className="text-primary hover:underline font-medium">Đăng nhập tại đây</Link>
                </div>
              )}
            </div>

            {/* Voucher Section */}
            {user && (
              <div className="bg-card p-6 rounded-2xl border border-border shadow-md">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary" /> Mã giảm giá
                </h3>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                    <div>
                      <code className="font-mono font-bold text-green-700 text-sm">{appliedVoucher.code}</code>
                      <p className="text-xs text-green-600 mt-0.5">{appliedVoucher.name} — Tiết kiệm {formatPrice(voucherDiscount)}</p>
                    </div>
                    <button
                      onClick={() => setAppliedVoucher(null)}
                      className="p-1 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã voucher..."
                      value={manualCode}
                      onChange={e => setManualCode(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === "Enter" && handleValidateVoucher()}
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                    />
                    <button
                      onClick={handleValidateVoucher}
                      disabled={validating || !manualCode.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                    >
                      {validating ? "..." : "Áp dụng"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-card p-6 rounded-2xl border border-border shadow-md">
              <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 text-sm items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span>{formatPrice(item.price * (item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Giảm giá ({appliedVoucher?.code})</span>
                    <span>-{formatPrice(voucherDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-border mt-2 pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatPrice(totalWithShipping)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Checkout;
