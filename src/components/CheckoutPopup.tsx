import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X, Check, QrCode, Phone, User, Loader2, MapPin, ShieldCheck, Truck, RotateCcw, Shield, Gift, Info, ChevronDown, ChevronUp, Copy, CheckCheck, Ticket, CreditCard, Sparkles, Building2, ShoppingBag, ArrowRight, FileText } from "lucide-react";
import { formatPrice } from "@/data/products";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { useShop } from "@/context/ShopContext";
import { getNextOrderNumber, generateTransferContent, generateOrderCode, saveOrder, updateOrderInfo, type Order } from "@/data/orders";
import { useAuth } from "@/context/AuthContext";
import { BANK_ACCOUNT, BANK_ACCOUNT_NAME, BANK_CODE, ZALO_URL } from "@/lib/config";
import { toast } from "sonner";

interface CheckoutPopupProps {
  total: number;
  onClose: () => void;
}

type PaymentOption = "cod" | "full";

const CheckoutPopup = ({ total, onClose }: CheckoutPopupProps) => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useShop();
  const { user } = useAuth();

  // Steps: 1=Payment select & Customer Info, 2=QR transfer (if Bank Transfer chosen), 3=Order Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false);
  const termsBoxRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Customer shipping info state (collected at Step 1)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Việt Nam");
  const [notes, setNotes] = useState("");

  const [voucher, setVoucher] = useState<any>(null);

  const displayTotal = cartTotal || total;

  // Auto fill from user profile when user logs in or clicks auto-fill button
  const handleAutoFillFromProfile = () => {
    if (!user) {
      toast.error("Bạn chưa đăng nhập. Vui lòng tự nhập thông tin bên dưới hoặc đăng nhập tài khoản.");
      return;
    }

    const u = user as any;
    const uName = u.full_name || u.name || u.username || u.customer_name || "";
    const uPhone = u.phone || u.customer_phone || "";
    const uAddress = u.address || u.customer_address || u.shipping_address || "";
    const uWard = u.ward || "";
    const uCity = u.city || u.district || "";
    const uCountry = u.country || "Việt Nam";

    if (uName) setName(uName);
    if (uPhone) setPhone(uPhone);
    if (uAddress) setStreetAddress(uAddress);
    if (uWard) setWard(uWard);
    if (uCity) setCity(uCity);
    if (uCountry) setCountry(uCountry);

    toast.success("Đã tự động điền thông tin từ tài khoản của bạn!");
  };

  // Auto-fill on mount if user is logged in
  useEffect(() => {
    if (user) {
      const u = user as any;
      if (u.full_name || u.name || u.username) setName(u.full_name || u.name || u.username || "");
      if (u.phone) setPhone(u.phone);
      if (u.address) setStreetAddress(u.address);
      if (u.ward) setWard(u.ward);
      if (u.city || u.district) setCity(u.city || u.district || "");
    }
  }, [user]);

  // Load vouchers
  useEffect(() => {
    const getBestVoucher = async () => {
      try {
        if (user) {
          const data = await apiGet<any>(`/vouchers/best-for-order?amount=${displayTotal}`);
          if (data?.voucher) {
            setVoucher(data.voucher);
            return;
          }
        }
        
        const active = await apiGet<any>('/vouchers/active');
        if (Array.isArray(active)) {
          const applicable = active.filter((v: any) => displayTotal >= v.min_order_value);
          if (applicable.length > 0) {
            const best = applicable.reduce((prev: any, curr: any) => prev.discount_amount > curr.discount_amount ? prev : curr);
            setVoucher(best);
          } else {
            setVoucher(null);
          }
        } else {
          setVoucher(null);
        }
      } catch (err) {
        console.error("Failed to fetch vouchers in CheckoutPopup:", err);
      }
    };

    if (displayTotal > 0) {
      getBestVoucher();
    } else {
      setVoucher(null);
    }
  }, [user, displayTotal]);

  // GTM begin_checkout event
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      const itemsList = cart.length > 0 ? cart.map(item => ({
        item_id: item.sku || item.productId || String(item.id),
        item_name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        item_brand: item.brand || "GC Nature",
        item_category: item.categoryName || item.category || ""
      })) : [];

      (window as any).dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "VND",
          value: displayTotal,
          items: itemsList
        }
      });
    }
  }, []);

  const voucherDiscount = voucher ? Math.min(voucher.discount_amount, displayTotal) : 0;
  const finalTotal = displayTotal - voucherDiscount;

  // Active Bank Account from Database
  const [bankConfig, setBankConfig] = useState({
    bankCode: BANK_CODE,
    bankName: "Ngân hàng Á Châu",
    accountNumber: BANK_ACCOUNT,
    accountName: BANK_ACCOUNT_NAME,
  });

  useEffect(() => {
    const fetchActiveBank = () => {
      apiGet<any>(`/settings/active-payment-method?_t=${Date.now()}`)
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
    };

    fetchActiveBank();
    window.addEventListener("payment-methods-updated", fetchActiveBank);
    window.addEventListener("storage", fetchActiveBank);
    return () => {
      window.removeEventListener("payment-methods-updated", fetchActiveBank);
      window.removeEventListener("storage", fetchActiveBank);
    };
  }, []);

  const { orderNumber, orderCode, transferContentStr } = useMemo(() => {
    const num = getNextOrderNumber();
    return {
      orderNumber: num,
      orderCode: generateOrderCode(num),
      transferContentStr: generateTransferContent(num),
    };
  }, []);

  const fullAddress = useMemo(() => {
    return [streetAddress.trim(), ward.trim(), city.trim(), country.trim()].filter(Boolean).join(", ");
  }, [streetAddress, ward, city, country]);

  const handlePlaceOrder = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập Họ và tên người nhận!");
      return;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập Số điện thoại liên hệ!");
      return;
    }
    if (!streetAddress.trim()) {
      toast.error("Vui lòng nhập Số nhà, tên đường!");
      return;
    }
    if (!city.trim()) {
      toast.error("Vui lòng nhập Quận / Huyện / Thành phố!");
      return;
    }
    if (!agreeTerms) {
      toast.error("Vui lòng đọc và đồng ý với Điều khoản dịch vụ!");
      return;
    }

    setSubmitting(true);
    try {
      // Create order in MySQL database with full shippingInfo
      await apiPost('/orders', {
        orderCode,
        total: finalTotal,
        userId: user?.id || null,
        voucherCode: voucher?.code || null,
        voucherDiscount,
        items: cart.map(c => ({
          productId: c.id,
          productName: c.name,
          price: c.price,
          quantity: c.quantity || 1,
          imageUrl: c.image,
          originalPrice: c.price
        })),
        shippingInfo: {
          name: name.trim(),
          phone: phone.trim(),
          address: fullAddress,
          notes: notes.trim(),
          paymentMethod: selectedPayment,
        },
        status: "pending"
      });

      // Save order to localStorage
      const newOrder: Order = {
        orderCode,
        orderNumber,
        items: cart.map(c => ({
          id: c.id,
          name: c.name,
          price: c.price,
          image: c.image,
          quantity: c.quantity || 1,
        })),
        total: finalTotal,
        transferAmount: finalTotal,
        paymentMethod: selectedPayment,
        status: "pending",
        createdAt: new Date().toISOString(),
        transferContent: transferContentStr,
        name: name.trim(),
        phone: phone.trim(),
        address: fullAddress,
      };
      saveOrder(newOrder);

      // GTM purchase event
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "purchase",
          ecommerce: {
            transaction_id: orderCode,
            value: finalTotal,
            currency: "VND",
            tax: 0,
            shipping: 0,
            items: cart.map(c => ({
              item_id: c.sku || c.productId || String(c.id),
              item_name: c.name,
              price: Number(c.price),
              quantity: c.quantity || 1,
              item_brand: c.brand || "GC Nature",
              item_category: c.categoryName || c.category || ""
            }))
          }
        });
      }

      clearCart();

      if (selectedPayment === "cod") {
        // COD order goes directly to Step 3
        setSubmitting(false);
        setStep(3);
        toast.success("Đặt hàng COD thành công!");
      } else {
        // Bank transfer order goes to Step 2 for QR payment
        setSubmitting(false);
        setStep(2);
      }
    } catch (err: any) {
      console.error("Gửi đơn hàng thất bại:", err);
      toast.error("Không thể tạo đơn hàng. Vui lòng kiểm tra kết nối mạng và thử lại.");
      setSubmitting(false);
    }
  };

  const finishPayment = useCallback(() => {
    setSubmitting(false);
    setStep(3);
  }, []);

  // Auto-polling for payment verification on Step 2
  useEffect(() => {
    if (step !== 2) return;

    let isPaid = false;
    const interval = setInterval(async () => {
      if (isPaid) return;
      try {
        const response = await apiGet(`/orders/check-payment?amount=${finalTotal}&content=${encodeURIComponent(transferContentStr)}`);
        if (response.paid) {
          isPaid = true;
          clearInterval(interval);
          finishPayment();
        }
      } catch (error) {
        console.error("Payment check error:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [step, finalTotal, transferContentStr, finishPayment]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => { });
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const bankAccount = bankConfig.accountNumber;
  const bankName = bankConfig.bankName || bankConfig.bankCode;
  const accountName = bankConfig.accountName;

  const qrUrl = useMemo(() => {
    const params = new URLSearchParams({
      amount: String(finalTotal),
      addInfo: transferContentStr,
      accountName: accountName,
    });
    return `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankAccount}-compact2.png?${params.toString()}`;
  }, [finalTotal, transferContentStr, bankConfig.bankCode, bankAccount, accountName]);

  const stepLabels = [
    { num: 1, label: "Thông tin & Đặt hàng" },
    { num: 2, label: "Thanh toán" },
    { num: 3, label: "Hoàn tất" },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform-gpu">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-base font-bold tracking-tight">Xác nhận đặt hàng & Thanh toán</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            />
            {stepLabels.map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= s.num
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm"
                      : "bg-white text-gray-400 border border-gray-300"
                  }`}
                >
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-[11px] font-semibold ${step >= s.num ? "text-blue-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 1: PAYMENT METHOD SELECT & CUSTOMER INFO FORM               */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT 7 COLS: CUSTOMER SHIPPING INFO & PAYMENT OPTIONS */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* CUSTOMER SHIPPING INFO FORM */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                          Thông tin người nhận hàng
                        </h3>
                      </div>

                      {/* Auto-fill button if user profile exists */}
                      <button
                        type="button"
                        onClick={handleAutoFillFromProfile}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                        title="Tự động lấy tên, SĐT, địa chỉ đã lưu trong tài khoản của bạn"
                      >
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Dùng thông tin tài khoản đã lưu</span>
                      </button>
                    </div>

                    {/* Customer Inputs Form */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Nguyễn Văn A"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="VD: 0912 345 678"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Address Fields */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Số nhà, tên đường <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="VD: 36 Đường số 5, KĐT Vạn Phúc"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Phường / Xã
                          </label>
                          <input
                            type="text"
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            placeholder="VD: Phường Hiệp Bình Chánh"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Quận / Huyện / TP <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="VD: TP. Thủ Đức, HCM"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Quốc gia
                          </label>
                          <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Việt Nam"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Ghi chú giao hàng (nếu có)
                        </label>
                        <textarea
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Ghi chú thêm cho shipper (VD: Giao giờ hành chính, gọi trước khi giao...)"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT METHOD SELECTION */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Chọn phương thức thanh toán
                    </h3>

                    {/* Option 1: COD */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment("cod")}
                      className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                        selectedPayment === "cod"
                          ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              selectedPayment === "cod" ? "border-blue-600 bg-blue-600" : "border-gray-300"
                            }`}
                          >
                            {selectedPayment === "cod" && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</h4>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              Khách hàng thanh toán tiền mặt 100% khi nhận hàng. <span className="font-bold text-blue-700">Không cần thanh toán trước.</span>
                            </p>
                            <div className="mt-2.5 bg-white rounded-xl p-3 border border-gray-200 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Tổng thanh toán COD</span>
                                <span className="font-extrabold text-blue-600 text-base">{formatPrice(finalTotal)}</span>
                              </div>
                              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                                <Truck className="w-3.5 h-3.5" /> Kiểm tra hàng thoải mái trước khi thanh toán
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Option 2: Bank Transfer */}
                    <button
                      type="button"
                      onClick={() => setSelectedPayment("full")}
                      className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                        selectedPayment === "full"
                          ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              selectedPayment === "full" ? "border-blue-600 bg-blue-600" : "border-gray-300"
                            }`}
                          >
                            {selectedPayment === "full" && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-gray-900">Chuyển khoản ngân hàng</h4>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              Chuyển khoản <span className="font-bold text-blue-600">100%</span> qua mã VietQR quét tự động.
                            </p>
                            <div className="mt-2.5 bg-white rounded-xl p-3 border border-gray-200 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Số tiền chuyển khoản</span>
                                <span className="font-extrabold text-blue-600 text-base">{formatPrice(finalTotal)}</span>
                              </div>
                              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-1">
                                <Sparkles className="w-3.5 h-3.5" /> Quét mã QR tự động điền STK & số tiền
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* RIGHT 5 COLS: ORDER SUMMARY & TERMS / ORDER SUBMIT */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3">
                      Thông tin đơn hàng ({cart.length} sản phẩm)
                    </h3>

                    {/* Cart Items List */}
                    {cart.length > 0 && (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm py-1 border-b border-gray-50 last:border-0">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg border border-gray-200 object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-medium text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500 font-semibold">{formatPrice(item.price)}</p>
                            </div>
                            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">x{item.quantity || 1}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tổng tiền hàng</span>
                        <span className="font-semibold text-gray-800">{formatPrice(displayTotal)}</span>
                      </div>

                      {voucherDiscount > 0 && (
                        <div className="flex justify-between text-green-600 font-semibold">
                          <span>Voucher ưu đãi ({voucher?.code})</span>
                          <span>-{formatPrice(voucherDiscount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phí vận chuyển</span>
                        <span className={`font-semibold ${selectedPayment === "full" ? "text-green-600" : "text-gray-700"}`}>
                          {selectedPayment === "full" ? "Miễn phí toàn quốc (FREESHIP)" : "Theo khu vực"}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-3 mt-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-900">Tổng thanh toán:</span>
                          <span className="text-xl font-extrabold text-blue-600">{formatPrice(finalTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions Box */}
                    <div className="mt-2">
                      <p className="text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Điều khoản giao dịch & Chính sách
                        {!termsScrolledToBottom && <span className="text-[10px] text-orange-500 font-medium">(Cuộn xem hết)</span>}
                        {termsScrolledToBottom && !agreeTerms && <span className="text-[10px] text-blue-500 font-medium">✓ Đã xem</span>}
                        {agreeTerms && <span className="text-[10px] text-green-600 font-medium">✓ Đã đồng ý</span>}
                      </p>
                      <div
                        ref={termsBoxRef}
                        onScroll={(e) => {
                          const el = e.currentTarget;
                          if (el.scrollHeight - el.scrollTop - el.clientHeight < 10) {
                            setTermsScrolledToBottom(true);
                          }
                        }}
                        className={`h-[110px] overflow-y-auto rounded-xl border-2 px-3 py-2 text-[11px] text-gray-600 leading-relaxed bg-gray-50 transition-colors custom-scrollbar ${
                          agreeTerms ? 'border-green-400 bg-green-50/50' : termsScrolledToBottom ? 'border-blue-300' : 'border-gray-200'
                        }`}
                      >
                        <p className="font-bold text-gray-900 text-xs mb-1">ĐIỀU KHOẢN GIAO DỊCH CỦA GCNATURE</p>
                        <p className="mb-1">GCnature cam kết bảo mật 100% thông tin người nhận (Nghị định 13/2023/NĐ-CP) và chỉ sử dụng cho mục đích giao hàng & bảo hành mỹ phẩm.</p>
                        <p className="mb-1">Khách hàng được quyền kiểm tra sản phẩm trước khi thanh toán cho nhân viên giao hàng (COD).</p>
                      </div>

                      {termsScrolledToBottom && !agreeTerms && (
                        <button
                          type="button"
                          onClick={() => setAgreeTerms(true)}
                          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Tôi đã đọc và đồng ý với điều khoản
                        </button>
                      )}
                      {agreeTerms && (
                        <div className="flex items-center gap-1.5 mt-2 text-green-600">
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">Đã đồng ý điều khoản dịch vụ</span>
                        </div>
                      )}
                    </div>

                    {/* Submit Order Button */}
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={submitting || !agreeTerms}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {submitting
                        ? "Đang tạo đơn hàng..."
                        : selectedPayment === "cod"
                          ? `XÁC NHẬN ĐẶT HÀNG COD (${formatPrice(finalTotal)})`
                          : `CHUYỂN KHOẢN NGÂN HÀNG (${formatPrice(finalTotal)})`
                      }
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 2: VIETQR BANK TRANSFER                                   */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="p-5 sm:p-6">
              <div className="max-w-xl mx-auto space-y-5">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="text-sm font-bold text-green-900 flex items-center justify-center gap-1.5">
                    <QrCode className="w-5 h-5 text-green-600" />
                    Chuyển khoản VietQR — <span className="text-blue-600">{formatPrice(finalTotal)}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Mở app ngân hàng quét mã QR bên dưới hoặc chuyển khoản theo STK
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  {/* QR Image */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-3 shadow-md">
                      <img src={qrUrl} alt="VietQR Code" className="w-44 h-44 object-contain rounded-lg" />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1.5">Mở app ngân hàng để quét mã</span>
                  </div>

                  {/* Bank Account Details */}
                  <div className="flex-1 w-full space-y-2 text-sm">
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-xs text-gray-500">Ngân hàng</span>
                      <span className="font-semibold text-gray-800">{bankName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-xs text-gray-500">Số tài khoản</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-blue-600 font-mono text-base">{bankAccount}</span>
                        <button
                          onClick={() => handleCopy(bankAccount, "account")}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Sao chép"
                        >
                          {copied === "account" ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-xs text-gray-500">Chủ tài khoản</span>
                      <span className="font-bold text-gray-800 uppercase">{accountName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                      <span className="text-xs text-gray-500">Số tiền</span>
                      <span className="font-extrabold text-blue-600 text-base">{formatPrice(finalTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-xs text-gray-500">Nội dung CK</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 font-mono">{transferContentStr}</span>
                        <button
                          onClick={() => handleCopy(transferContentStr, "content")}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Sao chép"
                        >
                          {copied === "content" ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm completion button */}
                <div className="flex flex-col items-center gap-3 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-xs font-semibold">Đang chờ nhận tiền tự động từ ngân hàng...</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => finishPayment()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    Tôi đã chuyển khoản thành công — Hoàn tất đơn hàng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 3: ORDER SUCCESS & RECEIPT                                  */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="p-5 sm:p-8">
              <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-10 h-10 text-green-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    Đặt hàng thành công! 🎉
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Cảm ơn bạn đã tin tưởng lựa chọn dòng sản phẩm chăm sóc da <span className="font-bold text-blue-700">GC Nature</span>.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 text-left shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-xs text-gray-500 font-medium">Mã đơn hàng:</span>
                    <span className="text-base font-extrabold text-blue-600 font-mono">{orderCode}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Người nhận:</span>
                      <span className="font-semibold text-gray-900">{name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số điện thoại:</span>
                      <span className="font-semibold text-gray-900">{phone}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-gray-500 shrink-0">Địa chỉ giao:</span>
                      <span className="font-medium text-gray-800 text-right">{fullAddress}</span>
                    </div>
                    {notes && (
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-gray-500 shrink-0">Ghi chú:</span>
                        <span className="font-medium text-gray-700 text-right italic">{notes}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-100 pt-2">
                      <span className="text-gray-500">Hình thức thanh toán:</span>
                      <span className="font-bold text-blue-700">
                        {selectedPayment === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng tiền thanh toán:</span>
                      <span className="font-extrabold text-blue-600 text-lg">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Support note */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 space-y-1">
                  <p className="font-bold text-sm">📞 Bộ phận CSKH GC Nature sẽ sớm gọi điện xác nhận đơn hàng!</p>
                  <p>Nếu cần hỗ trợ gấp, vui lòng gọi Hotline <span className="font-bold">0559.869.392</span> hoặc nhắn qua Zalo.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    Tiếp tục mua sắm
                  </button>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3.5 px-4 rounded-xl text-sm transition-all text-center"
                  >
                    Xem lịch sử đơn hàng
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CheckoutPopup;
