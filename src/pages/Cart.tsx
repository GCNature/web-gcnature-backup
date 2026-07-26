import SEOHead from "@/components/SEOHead";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import CheckoutPopup from "@/components/CheckoutPopup";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/data/products";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check, Gift } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, cartCount, addToCart, clearCart, products } = useShop();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCombos, setSelectedCombos] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  // Upsell combo products
  const comboProducts = useMemo(() => {
    return products.filter(p => p.price < 2000000).slice(0, 4);
  }, [products]);

  const handleRemove = (id: number, name: string) => {
    removeFromCart(id);
    toast.success("Đã xoá khỏi giỏ hàng", { description: name });
  };

  const toggleCombo = (productId: number) => {
    const next = new Set(selectedCombos);
    if (next.has(productId)) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    setSelectedCombos(next);
  };

  const comboTotal = Array.from(selectedCombos).reduce((sum, id) => {
    const p = products.find(pr => pr.id === id);
    return sum + (p?.price || 0);
  }, 0);

  const grandTotal = cartTotal + comboTotal;

  const handleCheckout = () => {
    // Add selected combos to cart
    selectedCombos.forEach(id => {
      const p = products.find(pr => pr.id === id);
      if (p) addToCart(p);
    });
    setShowCheckout(true);
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    clearCart();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <SEOHead title="Giỏ Hàng" noindex={true} />
      <Header />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Giỏ hàng ({cartCount})</span>
        </div>
      </nav>

      <div className="container py-6">
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-9 h-9 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-400 text-sm mb-6">Hãy thêm sản phẩm yêu thích vào giỏ hàng</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Tiếp tục mua sắm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left: Cart Items */}
            <div className="flex-1 space-y-4">
              {/* Cart Items */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 text-sm">
                    Chọn tất cả ({cartCount})
                  </h2>
                </div>

                <div className="divide-y divide-gray-50">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex gap-4">
                        {/* Checkbox + Image */}
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 mt-1 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <Link to={`/product/${item.productId || item.id}`}>
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                          </Link>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.productId || item.id}`} className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-red-600 transition-colors">
                            {item.name}
                          </Link>

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-red-600 font-bold text-base">{formatPrice(item.price)}</span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:border-cyan-300 hover:text-[#5dc1d1] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-gray-800">{item.quantity || 1}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:border-cyan-300 hover:text-[#5dc1d1] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleRemove(item.id, item.name)}
                                className="ml-2 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ═══ Combo Upsell Section ═══ */}
              {comboProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-orange-500" />
                    <h3 className="font-bold text-gray-800 text-sm">Combo ưu đãi – Mua kèm giá tốt hơn</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {comboProducts.map((p) => {
                      const isSelected = selectedCombos.has(p.id);
                      const comboDis = p.originalPrice
                        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                        : 0;
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleCombo(p.id)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? "bg-[#5dc1d1] border-[#5dc1d1]" : "border-gray-300"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <img src={p.image} alt={p.name} className="w-14 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 line-clamp-1">{p.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-red-600">{formatPrice(p.price)}</span>
                              {p.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</span>
                              )}
                              {comboDis > 0 && (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                  Tiết kiệm {comboDis}%
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedCombos.size > 0 && (
                    <div className="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Combo +{selectedCombos.size} sản phẩm
                      </span>
                      <span className="text-sm font-bold text-red-600">+{formatPrice(comboTotal)}</span>
                    </div>
                  )}
                </div>
              )}

              <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-red-600 transition-colors">
                ← Tiếp tục mua sắm
              </Link>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:w-[340px] shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 space-y-4">
                <h2 className="text-base font-bold text-gray-800">Thông tin đơn hàng</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tổng tiền</span>
                    <span className="font-semibold text-gray-800">{formatPrice(cartTotal)}</span>
                  </div>
                  {selectedCombos.size > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Combo mua kèm</span>
                      <span className="font-semibold text-orange-600">+{formatPrice(comboTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-semibold text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Voucher</span>
                    <span className="font-semibold text-gray-400">0đ</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Cần thanh toán</span>
                    <span className="text-xl font-extrabold text-red-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl text-sm active:scale-[0.98] transition-all shadow-lg shadow-teal-600/20"
                >
                  Xác nhận đơn
                </button>

                <p className="text-[10px] text-gray-400 text-center">
                  Bằng việc xác nhận đơn, bạn đồng ý với điều khoản và chính sách của GCnature
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
      <ScrollToTop />

      {/* Checkout Popup */}
      {showCheckout && (
        <CheckoutPopup
          total={grandTotal}
          onClose={handleCheckoutClose}
        />
      )}
    </div>
  );
};

export default Cart;
