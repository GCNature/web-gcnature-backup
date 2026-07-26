import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, QrCode, Phone, User, Loader2, MapPin, ShieldCheck, Truck, RotateCcw, Shield, Gift, Info, ChevronDown, ChevronUp, Copy, CheckCheck, Ticket } from "lucide-react";
import { formatPrice } from "@/data/products";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { useShop } from "@/context/ShopContext";
import { getNextOrderNumber, generateTransferContent, generateOrderCode, saveOrder, updateOrderInfo, type Order } from "@/data/orders";
import { useAuth } from "@/context/AuthContext";
import { BANK_ACCOUNT, BANK_ACCOUNT_NAME, BANK_CODE, ZALO_URL, makeVietQrUrl } from "@/lib/config";

interface CheckoutPopupProps {
  total: number;
  onClose: () => void;
}

type PaymentOption = "deposit" | "full";

const CheckoutPopup = ({ total, onClose }: CheckoutPopupProps) => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useShop();
  const { user } = useAuth();

  // Steps: 1=Payment select, 2=QR transfer, 3=Success+Info
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>("deposit");
  const [submitting, setSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false);
  const termsBoxRef = useRef<HTMLDivElement>(null);
  const [expandDepositInfo, setExpandDepositInfo] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Checkout state
  const [countdownActive, setCountdownActive] = useState(false);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Customer info - filled AFTER payment in step 3
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [infoSubmitted, setInfoSubmitted] = useState(false);
  const [infoSubmitting, setInfoSubmitting] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [voucher, setVoucher] = useState<any>(null);

  const displayTotal = cartTotal || total;

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
        
        // Fallback for guests (logged out) or if no personal voucher found
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

  // Push GTM begin_checkout event on popup mount
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
  const depositAmount = Math.ceil(finalTotal * 0.1);
  const remainingCOD = finalTotal - depositAmount;
  const transferAmount = selectedPayment === "deposit" ? depositAmount : finalTotal;

  // Generate order code with incrementing number
  const { orderNumber, orderCode, transferContentStr } = useMemo(() => {
    const num = getNextOrderNumber();
    return {
      orderNumber: num,
      orderCode: generateOrderCode(num),
      transferContentStr: generateTransferContent(num),
    };
  }, []);

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      // CREATE ORDER IMMEDIATELY SO IT'S SAVED EVEN IF POPUP IS CLOSED
      await apiPost('/orders', {
        orderCode,
        total: finalTotal,
        userId: user?.id || null,
        voucherCode: voucher?.code || null,
        voucherDiscount: voucherDiscount,
        items: cart.map(c => ({
          productId: c.id,
          productName: c.name,
          price: c.price,
          quantity: c.quantity || 1,
          imageUrl: c.image,
          originalPrice: c.price // Fallback if no originalPrice
        })),
        shippingInfo: {
          name: 'Khách hàng', // Placeholder until step 3
          phone: '',
          address: '',
          notes: transferContentStr,
          paymentMethod: selectedPayment,
        },
        status: "pending"
      });
    } catch(err) {
      console.error("Gửi đơn nháp thất bại:", err);
    }
    setSubmitting(false);
    setStep(2);
  };

  const finishPayment = useCallback(() => {
    // Save order to localStorage + cookie
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
      transferAmount,
      paymentMethod: selectedPayment,
      depositAmount: selectedPayment === "deposit" ? depositAmount : undefined,
      remainingCOD: selectedPayment === "deposit" ? remainingCOD : undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
      transferContent: transferContentStr,
    };
    saveOrder(newOrder);

    // Push purchase to GTM dataLayer
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

    setCountdownActive(false);
    setSubmitting(false);
    setStep(3);
  }, [orderCode, orderNumber, cart, finalTotal, transferAmount, selectedPayment, depositAmount, remainingCOD, transferContentStr]);

  const handleConfirmPayment = () => {
    // Legacy function, now auto-polling takes over
  };

  // Auto-polling for payment verification
  useEffect(() => {
    if (step !== 2) return;

    let isPaid = false;
    const interval = setInterval(async () => {
      if (isPaid) return;
      try {
        const response = await apiGet(`/orders/check-payment?amount=${transferAmount}&content=${encodeURIComponent(transferContentStr)}`);
        if (response.paid) {
          isPaid = true;
          clearInterval(interval);
          finishPayment();
        }
      } catch (error) {
        console.error("Payment check error:", error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [step, transferAmount, transferContentStr, finishPayment]);

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    setInfoSubmitting(true);

    // Update local order info
    updateOrderInfo(orderCode, { name: name.trim(), phone: phone.trim(), address: address.trim() });

    try {
      // PUT TO BACKEND API TO UPDATE MISSING INFO
      await apiPut(`/orders/${orderCode}`, {
        shippingInfo: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: transferContentStr,
          paymentMethod: selectedPayment,
        },
        status: "confirmed"
      });
    } catch (err) {
      console.error("Lưu thông tin đơn hàng thất bại:", err);
    }

    setTimeout(() => {
      setInfoSubmitting(false);
      setInfoSubmitted(true);
    }, 800);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => { });
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  // Bank info
  const bankAccount = BANK_ACCOUNT;
  const bankName = BANK_CODE;
  const accountName = BANK_ACCOUNT_NAME;
  const transferContent = transferContentStr;
  const qrUrl = makeVietQrUrl(transferAmount, transferContent);

  const stepLabels = [
    { num: 1, label: "Thanh toán" },
    { num: 2, label: "Chuyển khoản" },
    { num: 3, label: "Hoàn tất" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-lg">
            {step === 1 && "Chọn phương thức thanh toán"}
            {step === 2 && "Chuyển khoản thanh toán"}
            {step === 3 && (infoSubmitted ? "Đặt hàng thành công!" : "Hoàn tất đơn hàng")}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center px-5 py-3 bg-white border-b border-gray-200 shrink-0">
          {stepLabels.map((s, idx) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s.num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                  }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${step >= s.num ? "text-blue-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.num ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 1: Payment Method Selection                                */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="flex flex-col lg:flex-row min-h-0">
              {/* Left: Payment Options */}
              <div className="flex-1 p-5">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  Chọn phương thức thanh toán
                </h3>

                <div className="space-y-3">
                  {/* ── Option 1: Cọc đảm bảo 10% ── */}
                  <button
                    onClick={() => setSelectedPayment("deposit")}
                    className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${selectedPayment === "deposit"
                        ? "border-blue-500 shadow-lg shadow-blue-500/10"
                        : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <div className={`p-4 ${selectedPayment === "deposit" ? "bg-blue-50" : "bg-white"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedPayment === "deposit" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}>
                          {selectedPayment === "deposit" && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-gray-900">Chuyển khoản cọc đảm bảo</h4>
                            <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">PHỔ BIẾN</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Cọc <span className="font-bold text-blue-600">10%</span> giá trị đơn hàng · Thanh toán phần còn lại khi nhận hàng
                          </p>
                          <div className="mt-3 bg-white rounded-xl p-3 border border-blue-100 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Tổng tiền hàng</span>
                              <span className="text-xs font-semibold text-gray-800">{formatPrice(displayTotal)}</span>
                            </div>
                            {voucherDiscount > 0 && (
                              <div className="flex items-center justify-between text-green-600">
                                <span className="text-xs font-medium">Voucher ({voucher?.code})</span>
                                <span className="text-xs font-bold">-{formatPrice(voucherDiscount)}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-1.5">
                              <span className="text-xs text-gray-700 font-bold">Số tiền cọc (10%)</span>
                              <span className="text-lg font-extrabold text-blue-600">{formatPrice(depositAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-xs text-gray-400">Còn lại khi nhận hàng</span>
                              <span className="text-sm font-semibold text-gray-600">{formatPrice(remainingCOD)}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setExpandDepositInfo(!expandDepositInfo); }}
                            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors"
                          >
                            <Info className="w-3 h-3" />
                            Chính sách cọc đảm bảo
                            {expandDepositInfo ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    {expandDepositInfo && selectedPayment === "deposit" && (
                      <div className="px-4 pb-4 bg-blue-50 border-t border-blue-100" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-xl p-3 mt-2 space-y-2">
                          <div className="flex items-start gap-2">
                            <Shield className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              <span className="font-semibold text-gray-800">Hoàn tiền cọc 100%</span> — Sau khi giao hàng thành công, khoản cọc đảm bảo sẽ được <span className="font-bold text-green-600">hoàn trả lại</span> cho bạn.
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              <span className="font-semibold text-gray-800">Bảo vệ đôi bên</span> — Cọc đảm bảo giúp xác nhận đơn hàng nghiêm túc.
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <RotateCcw className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-gray-600 leading-relaxed">
                              <span className="font-semibold text-gray-800">Hoàn cọc nếu hủy</span> — Đơn bị hủy từ phía GCnature, cọc hoàn trả 100% ngay lập tức.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* ── Option 2: Thanh toán full ── */}
                  <button
                    onClick={() => setSelectedPayment("full")}
                    className={`w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${selectedPayment === "full"
                        ? "border-blue-500 shadow-lg shadow-blue-500/10"
                        : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <div className={`p-4 ${selectedPayment === "full" ? "bg-blue-50" : "bg-white"}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedPayment === "full" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}>
                          {selectedPayment === "full" && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-gray-900">Thanh toán toàn bộ</h4>
                            <span className="text-[10px] font-bold bg-green-600 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Gift className="w-2.5 h-2.5" /> FREESHIP
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Chuyển khoản <span className="font-bold text-blue-600">100%</span> giá trị đơn hàng · <span className="font-semibold text-green-600"> Hỗ trợ 100K phí vận chuyển toàn cầu</span>
                          </p>
                           <div className="mt-3 bg-white rounded-xl p-3 border border-green-100 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Tổng tiền hàng</span>
                              <span className="text-xs font-semibold text-gray-800">{formatPrice(displayTotal)}</span>
                            </div>
                            {voucherDiscount > 0 && (
                              <div className="flex items-center justify-between text-green-600">
                                <span className="text-xs font-medium">Voucher ({voucher?.code})</span>
                                <span className="text-xs font-bold">-{formatPrice(voucherDiscount)}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-1.5">
                              <span className="text-xs text-gray-700 font-bold">Tổng thanh toán</span>
                              <span className="text-lg font-extrabold text-blue-600">{formatPrice(finalTotal)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Truck className="w-3 h-3 text-green-600" />
                              <span className="text-[11px] font-semibold text-green-600">✓ Miễn phí vận chuyển toàn quốc</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <ShieldCheck className="w-3 h-3 text-green-600" />
                              <span className="text-[11px] font-semibold text-green-600">✓ Ưu tiên xử lý đơn hàng nhanh</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:w-[320px] p-5 bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  Thông tin đơn hàng
                </h3>

                {/* Cart items */}
                {cart.length > 0 && (
                  <div className="space-y-2 mb-4 max-h-[120px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm">
                        <img src={item.image} alt="" className="w-8 h-8 rounded border border-gray-100 object-cover shrink-0" />
                        <span className="flex-1 truncate text-gray-600 text-xs">{item.name}</span>
                        <span className="text-xs font-medium text-gray-800 whitespace-nowrap">x{item.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price breakdown */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tổng tiền hàng</span>
                    <span className="font-semibold text-gray-800">{formatPrice(displayTotal)}</span>
                  </div>

                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>Voucher ({voucher?.code})</span>
                      <span>-{formatPrice(voucherDiscount)}</span>
                    </div>
                  )}

                  {selectedPayment === "deposit" ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cọc đảm bảo (10%)</span>
                        <span className="font-bold text-blue-600">{formatPrice(depositAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Trả khi nhận hàng</span>
                        <span className="font-semibold text-gray-600">{formatPrice(remainingCOD)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Phí vận chuyển</span>
                        <span className="font-semibold text-gray-400">Theo khu vực</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-1">
                        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                          🔄 Tiền cọc sẽ được <span className="font-bold">hoàn trả 100%</span> khi giao hàng thành công
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phí vận chuyển</span>
                      <span className="font-semibold text-green-600">Miễn phí</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-1">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-sm font-bold text-gray-800">Cần thanh toán</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">Chuyển khoản ngay</p>
                      </div>
                      <span className="text-xl font-extrabold text-blue-600">{formatPrice(transferAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Note about filling info later */}
                <div className="mt-3 bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                  <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                    📝 Thông tin giao hàng (tên, SĐT, địa chỉ) sẽ được điền <span className="font-bold">sau khi thanh toán</span>
                  </p>
                </div>

                {/* Terms - Scrollable Box */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Điều khoản giao dịch & Chính sách dịch vụ
                    {!termsScrolledToBottom && <span className="text-[10px] text-orange-500 font-medium">(Vui lòng cuộn đọc hết)</span>}
                    {termsScrolledToBottom && !agreeTerms && <span className="text-[10px] text-blue-500 font-medium">✓ Đã đọc xong</span>}
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
                    className={`h-[130px] overflow-y-auto rounded-xl border-2 px-3 py-2.5 text-[11px] text-gray-600 leading-relaxed bg-gray-50 transition-colors custom-scrollbar ${
                      agreeTerms ? 'border-green-300 bg-green-50/50' : termsScrolledToBottom ? 'border-blue-300' : 'border-gray-200'
                    }`}
                  >
                    <p className="font-bold text-gray-900 text-xs mb-2">ĐIỀU KHOẢN GIAO DỊCH VÀ CHÍNH SÁCH DỊCH VỤ CỦA GCNATURE</p>
                    <p className="mb-2">Chào mừng quý khách đến với GCnature. Để đảm bảo quyền lợi, vui lòng đọc kỹ các điều khoản dưới đây trước khi hoàn tất đặt hàng.</p>
                    
                    <p className="font-bold text-gray-800 mb-1">1. Chính sách bảo mật dữ liệu (Tuân thủ Nghị định 13/2023/NĐ-CP)</p>
                    <p className="mb-1">GCnature cam kết bảo mật tuyệt đối thông tin cá nhân của bạn (họ tên, số điện thoại, địa chỉ, thông tin thanh toán).</p>
                    <p className="mb-1">Dữ liệu chỉ được thu thập và sử dụng cho mục đích: xử lý đơn hàng, giao nhận, chăm sóc khách hàng và thực hiện bảo hành/đổi trả nếu có kích ứng.</p>
                    <p className="mb-2">Chúng tôi không bán, chia sẻ hoặc cung cấp dữ liệu của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại nếu không có sự đồng ý của bạn.</p>
                    
                    <p className="font-bold text-gray-800 mb-1">2. Chính sách Đổi trả & Hoàn tiền</p>
                    <p className="mb-1">Sản phẩm mỹ phẩm GCnature được cam kết chính hãng 100%. Nếu gặp tình trạng kích ứng da (trong vòng 7 ngày kể từ khi mua), vui lòng liên hệ hotline để được đổi trả hoặc hoàn tiền.</p>
                    <p className="mb-1">Từ chối đổi trả: Sản phẩm bị hư hỏng do bảo quan không đúng cách hoặc đã qua sử dụng quá 7 ngày mà không phải do kích ứng da sẽ không được áp dụng đổi trả.</p>
                    <p className="mb-2">Khách hàng cần cung cấp số điện thoại đặt hàng hoặc hóa đơn để được hỗ trợ.</p>
                    
                    <p className="font-bold text-gray-800 mb-1">3. Chính sách Thanh toán</p>
                    <p className="mb-1">Thanh toán & Đặt cọc: Đối với đơn hàng có yêu cầu cọc, số tiền cọc sẽ được trừ trực tiếp vào tổng giá trị thanh toán. Khoản cọc sẽ được hoàn trả 100% nếu giao dịch không thành công do lỗi hệ thống hoặc hết hàng từ phía GCnature.</p>
                    <p className="mb-2">Giao hàng: GCnature hỗ trợ giao hàng toàn quốc và kiểm tra hàng trước khi thanh toán (đối với hình thức COD).</p>
                    
                    <p className="font-semibold text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-100 mt-2">
                      Bằng việc cuộn đến cuối văn bản này và xác nhận Đặt hàng, bạn xác nhận đã đọc, hiểu rõ và đồng ý toàn bộ với các Chính sách bảo mật, Đổi trả và Thanh toán của GCnature.
                    </p>
                  </div>
                  
                  {/* Agree button - only visible after scrolling to bottom */}
                  {termsScrolledToBottom && !agreeTerms && (
                    <button
                      type="button"
                      onClick={() => setAgreeTerms(true)}
                      className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md"
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

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !agreeTerms}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {submitting
                    ? "Đang xử lý..."
                    : selectedPayment === "deposit"
                      ? `Đặt cọc ${formatPrice(depositAmount)}`
                      : `Thanh toán ${formatPrice(finalTotal)}`
                  }
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 2: QR Code Payment                                        */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="p-5">
              <div className="max-w-lg mx-auto">
                {/* Payment type indicator */}
                <div className={`rounded-xl p-3 mb-4 text-center ${selectedPayment === "deposit" ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"
                  }`}>
                  {selectedPayment === "deposit" ? (
                    <p className="text-sm font-semibold text-amber-800">
                      🔒 Chuyển khoản cọc đảm bảo — <span className="text-blue-600">{formatPrice(depositAmount)}</span>
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-green-800">
                      ✅ Chuyển khoản toàn bộ — <span className="text-blue-600">{formatPrice(finalTotal)}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Quét mã QR hoặc chuyển khoản thủ công theo thông tin bên dưới
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* QR Code */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="bg-white border-2 border-gray-100 rounded-2xl p-3 shadow-lg">
                      <img
                        src={qrUrl}
                        alt="QR Code chuyển khoản"
                        className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const placeholder = document.getElementById("qr-fallback-v2");
                          if (placeholder) placeholder.style.display = "flex";
                        }}
                      />
                      <div id="qr-fallback-v2" className="hidden flex-col items-center justify-center w-48 h-48 bg-gray-100 rounded-xl">
                        <QrCode className="w-12 h-12 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">QR Code</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">Mở app ngân hàng &amp; quét mã</p>
                  </div>

                  {/* Bank details */}
                  <div className="flex-1 space-y-3">
                    <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                      {[
                        { label: "Ngân hàng", value: bankName, key: "bank" },
                        { label: "Số tài khoản", value: bankAccount, key: "account", mono: true },
                        { label: "Chủ tài khoản", value: accountName, key: "name" },
                        { label: "Số tiền", value: formatPrice(transferAmount), key: "amount", highlight: true },
                        { label: "Nội dung CK", value: transferContent, key: "content" },
                      ].map((row) => (
                        <div key={row.key} className="flex justify-between items-center px-3.5 py-2.5 group">
                          <span className="text-xs text-gray-500">{row.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm text-right ${row.highlight ? "font-extrabold text-blue-600 text-base" :
                                row.mono ? "font-semibold text-gray-800 font-mono tracking-wider" :
                                  "font-semibold text-gray-800"
                              }`}>
                              {row.value}
                            </span>
                            {(row.key === "account" || row.key === "content") && (
                              <button
                                onClick={() => handleCopy(row.key === "account" ? bankAccount : transferContent, row.key)}
                                className="text-gray-300 hover:text-blue-500 transition-colors p-0.5"
                                title="Sao chép"
                              >
                                {copied === row.key ? <CheckCheck className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deposit refund reminder */}
                    {selectedPayment === "deposit" && (
                      <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                        <div className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-green-800">Cam kết hoàn tiền cọc</p>
                            <p className="text-[11px] text-green-700 mt-0.5 leading-relaxed">
                              Cọc <strong>{formatPrice(depositAmount)}</strong> hoàn trả 100% khi giao thành công. Còn lại <strong>{formatPrice(remainingCOD)}</strong> trả khi nhận hàng.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Polling waiting indicator */}
                <div className="mt-5 flex flex-col items-center gap-3 py-4">
                  <div className="relative w-16 h-16 flex items-center justify-center bg-green-50 rounded-full animate-pulse border border-green-100">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-800 flex items-center justify-center">
                      Hệ thống đang chờ nhận tiền...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Màn hình này sẽ tự động chuyển khi mã quét thành công</p>
                  </div>
                </div>
                <p className="text-center text-[11px] text-gray-400 mt-2">
                  Bước tiếp theo: Điền thông tin nhận hàng
                </p>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════ */}
          {/* STEP 3: Success + Customer Info Form                           */}
          {/* ════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="p-5">
              <div className="max-w-2xl mx-auto">
                {/* Success indicator */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {infoSubmitted ? "Đặt hàng hoàn tất! 🎉" : "Thanh toán thành công! ✅"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {infoSubmitted
                      ? "Kỹ thuật viên sẽ liên hệ qua Zalo trong vòng 30 phút"
                      : "Vui lòng điền thông tin giao hàng để hoàn tất đơn hàng"
                    }
                  </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Left: Customer Info Form / Submitted Info */}
                  <div className="flex-1">
                    {!infoSubmitted ? (
                      <form onSubmit={handleSubmitInfo} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <MapPin className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900">Thông tin giao hàng</h4>
                          <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">Bắt buộc</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              <User className="w-3 h-3 inline mr-1" />
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Nguyễn Văn A"
                              required
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                              <Phone className="w-3 h-3 inline mr-1" />
                              Số điện thoại Zalo <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                              placeholder="0912 345 678"
                              required
                              minLength={9}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            Địa chỉ nhận hàng <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={infoSubmitting || !name.trim() || !phone.trim() || !address.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                        >
                          {infoSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          {infoSubmitting ? "Đang gửi..." : "Xác nhận thông tin giao hàng"}
                        </button>
                      </form>
                    ) : (
                      /* Show submitted info */
                      <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-green-200 p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900">Thông tin giao hàng đã xác nhận</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-700"><span className="font-medium">Họ tên:</span> {name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-700"><span className="font-medium">Zalo:</span> {phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-700"><span className="font-medium">Địa chỉ:</span> {address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Zalo contact */}
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                          <p className="text-sm text-blue-800 font-medium mb-2">
                            💬 Liên hệ trực tiếp qua Zalo:
                          </p>
                          <a
                            href={ZALO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-all active:scale-95"
                          >
                            Nhắn Zalo ngay
                          </a>
                        </div>
                        <button
                          onClick={() => {
                            clearCart();
                            onClose();
                            navigate("/orders");
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          📦 Vào Kho Hàng xác nhận đơn
                        </button>
                        <button
                          onClick={() => {
                            clearCart();
                            onClose();
                          }}
                          className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition-all"
                        >
                          Quay lại trang chủ
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Order Recap */}
                  <div className="lg:w-[280px] shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Đơn hàng #{orderCode}</h4>

                      {/* Cart items mini */}
                      {cart.length > 0 && (
                        <div className="space-y-2 pb-3 border-b border-gray-100">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <img src={item.image} alt="" className="w-8 h-8 rounded border border-gray-100 object-cover shrink-0" />
                              <span className="flex-1 truncate text-xs text-gray-600">{item.name}</span>
                              <span className="text-xs font-medium text-gray-800">x{item.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Phương thức</span>
                          <span className="font-semibold text-gray-800">
                            {selectedPayment === "deposit" ? "Cọc 10%" : "Thanh toán full"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Tổng tiền hàng</span>
                          <span className="font-semibold text-gray-800">{formatPrice(displayTotal)}</span>
                        </div>
                        {voucherDiscount > 0 && (
                          <div className="flex justify-between text-xs text-green-600 font-semibold">
                            <span>Voucher ({voucher?.code})</span>
                            <span>-{formatPrice(voucherDiscount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Đã chuyển khoản</span>
                          <span className="font-bold text-green-600">{formatPrice(transferAmount)}</span>
                        </div>
                        {selectedPayment === "deposit" && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Trả khi nhận</span>
                            <span className="font-semibold text-gray-800">{formatPrice(remainingCOD)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-100 pt-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-800">Tổng đơn</span>
                            <span className="font-extrabold text-blue-600">{formatPrice(finalTotal)}</span>
                          </div>
                        </div>
                      </div>

                      {selectedPayment === "deposit" && (
                        <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                          <p className="text-[10px] text-green-700 font-medium leading-relaxed">
                            🔄 Cọc {formatPrice(depositAmount)} hoàn trả sau giao hàng thành công
                          </p>
                        </div>
                      )}

                      {/* Trust badges mini */}
                      <div className="pt-2 border-t border-gray-100 space-y-1.5">
                        {[
                          { icon: ShieldCheck, text: "Hàng chính hãng 100%", color: "text-green-600" },
                          { icon: Truck, text: selectedPayment === "full" ? "Miễn phí vận chuyển" : "Giao hàng toàn quốc", color: "text-blue-600" },
                        ].map(({ icon: Icon, text, color }, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Icon className={`w-3 h-3 ${color} shrink-0`} />
                            <span className="text-[10px] text-gray-500 font-medium">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms of Service Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowTermsPopup(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">ĐIỀU KHOẢN DỊCH VỤ & CHÍNH SÁCH BÁN HÀNG</h3>
              <button 
                onClick={() => setShowTermsPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto min-h-0 text-sm text-gray-600 space-y-4 custom-scrollbar">
              <p className="font-medium text-gray-900">Chào mừng Quý khách đến với GCnature. Việc Quý khách thực hiện đặt hàng trên website đồng nghĩa với việc Quý khách đã đọc, hiểu và đồng ý với các điều khoản và chính sách dưới đây.</p>
              
              <h4 className="font-bold text-gray-900 mt-4 text-base">1. THÔNG TIN ĐƠN VỊ CHỦ QUẢN</h4>
              <ul className="list-none space-y-1 pl-0">
                <li><span className="font-semibold text-gray-800">Tên đơn vị:</span> GCnature Vietnam</li>
                <li><span className="font-semibold text-gray-800">Địa chỉ:</span> 36 đường số 5 KĐT Vạn Phúc, Thủ Đức, HCM</li>
                <li><span className="font-semibold text-gray-800">Hotline:</span> 0898273899</li>
                <li><span className="font-semibold text-gray-800">Email:</span> gcnatureofficial@gmail.com</li>
              </ul>
 
              <h4 className="font-bold text-gray-900 mt-4 text-base">2. PHƯƠNG THỨC THANH TOÁN & ĐẶT CỌC</h4>
              <p>Chúng tôi cung cấp các lựa chọn thanh toán linh hoạt để thuận tiện nhất cho Quý khách:</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden my-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-2.5 px-3 font-semibold text-gray-900 w-[140px] md:w-1/3">Phương thức</th>
                      <th className="py-2.5 px-3 font-semibold text-gray-900">Chi tiết thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2.5 px-3 font-medium text-gray-800">Thanh toán 100%</td>
                      <td className="py-2.5 px-3">Quý khách chuyển khoản toàn bộ giá trị đơn hàng trước khi giao hàng.</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2.5 px-3 font-medium text-gray-800">Ship COD</td>
                      <td className="py-2.5 px-3">Quý khách thanh toán toàn bộ giá trị đơn hàng khi nhận hàng từ nhân viên bưu điện.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-gray-800">Đặt cọc 10% + COD</td>
                      <td className="py-2.5 px-3">Quý khách đặt cọc trước 10% giá trị sản phẩm để xác nhận đơn hàng. Số tiền còn lại (đã trừ tiền cọc) sẽ được thanh toán theo hình thức COD khi nhận hàng.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
 
              <h4 className="font-bold text-gray-900 mt-4 text-base">3. CHÍNH SÁCH VẬN CHUYỂN</h4>
              <ul className="list-disc space-y-1 pl-5">
                <li><span className="font-semibold text-gray-800">Khu vực Nội thành (TP.HCM, Hà Nội):</span> Thời gian giao hàng dự kiến từ 1 - 2 ngày làm việc.</li>
                <li><span className="font-semibold text-gray-800">Khu vực Ngoại tỉnh:</span> Thời gian giao hàng dự kiến từ 3 - 5 ngày làm việc.</li>
              </ul>
 
              <h4 className="font-bold text-gray-900 mt-4 text-base">4. CHÍNH SÁCH ĐỔI TRẢ VÀ HOÀN TIỀN</h4>
              <p>GCnature cam kết mang lại sản phẩm chất lượng cao nhất và hỗ trợ tối đa cho khách hàng:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li><span className="font-semibold text-gray-800">Chính sách kích ứng:</span> Đổi trả hàng hoặc hoàn tiền trong vòng 7 ngày kể từ khi mua hàng nếu phát sinh tình trạng kích ứng da do sản phẩm.</li>
                <li><span className="font-semibold text-gray-800">Đổi hàng lỗi:</span> Đổi sản phẩm mới 100% nếu có lỗi từ nhà sản xuất hoặc hư hại trong quá trình vận chuyển.</li>
              </ul>
              <p className="font-semibold text-gray-800 mt-3">Trường hợp từ chối đổi trả:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Sản phẩm đã qua sử dụng quá 7 ngày mà không phải do nguyên nhân kích ứng da.</li>
                <li>Sản phẩm bị bể vỡ, hỏng hóc hoặc biến dạng do khách hàng bảo quản không đúng cách.</li>
                <li>Khách hàng không cung cấp được hóa đơn mua hàng hoặc thông tin số điện thoại đặt hàng.</li>
              </ul>
 
              <h4 className="font-bold text-gray-900 mt-4 text-base">6. CAM KẾT BẢO MẬT THÔNG TIN</h4>
              <p>GCnature cam kết bảo vệ thông tin cá nhân của Quý khách:</p>
              <ul className="list-disc space-y-1 pl-5 mb-4">
                <li>Thông tin (SĐT, địa chỉ, tên) chỉ được sử dụng cho mục đích giao hàng, thực hiện các chương trình hậu mãi và hỗ trợ tư vấn chăm sóc da.</li>
                <li>Chúng tôi tuyệt đối không cung cấp, chia sẻ thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại mà không có sự đồng ý của Quý khách.</li>
              </ul>
              <p className="font-medium text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                Mọi thắc mắc hoặc yêu cầu hỗ trợ, Quý khách vui lòng liên hệ Hotline 0898 273 899 để được giải quyết nhanh nhất.
              </p>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowTermsPopup(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors active:scale-95 shadow-md"
              >
                Tôi đã hiểu & Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPopup;
