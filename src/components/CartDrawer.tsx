import { useShop } from "@/context/ShopContext";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";

const CartDrawer = () => {
  const { cart, cartTotal, cartCount, removeFromCart, updateCartQuantity } = useShop();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 bg-primary text-primary-foreground rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Giỏ hàng ({cartCount})</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Giỏ hàng trống</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 border border-border rounded-lg p-3">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">{item.name}</h4>
                      <p className="text-primary font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                          className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                          className="w-7 h-7 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex justify-between text-foreground font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatPrice(cartTotal)}</span>
                </div>
                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Thanh toán
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
