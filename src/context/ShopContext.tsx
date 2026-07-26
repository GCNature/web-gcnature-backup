import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiGet } from "@/lib/api";
import type { ProductData } from "@/data/products";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  quantity?: number;
  [key: string]: any;
}

interface ShopContextType {
  products: ProductData[];
  isLoadingProducts: boolean;
  cart: Product[];
  wishlist: Product[];
  compare: Product[];
  addToCart: (product: Product) => void;
  addToCartWithQuantity: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  toggleCompare: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
  isInCompare: (id: number) => boolean;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;
}

const ShopContext = createContext<ShopContextType | null>(null);

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be inside ShopProvider");
  return ctx;
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);

  useEffect(() => {
    setIsLoadingProducts(true);
    apiGet('/products').then(data => {
      if (Array.isArray(data)) {
        setProducts(data);
      }
    }).catch(err => {
      console.error('Failed to fetch products', err);
    }).finally(() => {
      setIsLoadingProducts(false);
    });
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Push add_to_cart to Google Tag Manager dataLayer
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "VND",
          value: Number(product.price),
          items: [{
            item_id: product.sku || product.productId || String(product.id),
            item_name: product.name,
            price: Number(product.price),
            quantity: 1,
            item_brand: product.brand || "GC Nature",
            item_category: product.categoryName || product.category || ""
          }]
        }
      });
    }
  };

  const addToCartWithQuantity = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity } : p
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // Push add_to_cart to Google Tag Manager dataLayer
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "VND",
          value: Number(product.price) * quantity,
          items: [{
            item_id: product.sku || product.productId || String(product.id),
            item_name: product.name,
            price: Number(product.price),
            quantity: quantity,
            item_brand: product.brand || "GC Nature",
            item_category: product.categoryName || product.category || ""
          }]
        }
      });
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const toggleCompare = (product: Product) => {
    setCompare((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : prev.length >= 4 ? prev : [...prev, product]
    );
  };

  const isInWishlist = (id: number) => wishlist.some((p) => p.id === id);
  const isInCompare = (id: number) => compare.some((p) => p.id === id);

  const cartTotal = cart.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);
  const cartCount = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const clearCart = () => setCart([]);

  return (
    <ShopContext.Provider
      value={{
        products, isLoadingProducts,
        cart, wishlist, compare,
        addToCart, addToCartWithQuantity, removeFromCart, updateCartQuantity,
        toggleWishlist, toggleCompare,
        isInWishlist, isInCompare,
        cartTotal, cartCount, clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
