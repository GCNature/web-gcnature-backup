import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/data/products";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const handleRemove = (product: any) => {
    toggleWishlist(product);
    toast.success("Đã xoá khỏi yêu thích", { description: product.name });
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success("Đã thêm vào giỏ hàng", { description: product.name });
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead title="Sản Phẩm Yêu Thích" noindex={true} />
      <Header />
      <ScrollToTop />

      {/* Page Header */}
      <section className="bg-gc-warm-bg border-b border-border">
        <div className="container py-10 md:py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground italic" style={{ fontFamily: "Georgia, serif" }}>
            Sản phẩm yêu thích
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {wishlist.length} sản phẩm trong danh sách yêu thích
          </p>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Chưa có sản phẩm yêu thích</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Hãy khám phá và thêm những sản phẩm bạn yêu thích vào danh sách để dễ dàng theo dõi.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 active:scale-95"
            >
              Khám phá sản phẩm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <Link to={`/product/${product.productId || product.id}`} className="block relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-3 md:p-4">
                  <Link to={`/product/${product.productId || product.id}`}>
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors duration-200">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-primary font-bold mt-1 text-sm md:text-base">
                    {formatPrice(product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs md:text-sm font-medium py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Thêm giỏ hàng
                    </button>
                    <button
                      onClick={() => handleRemove(product)}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all duration-200 active:scale-95"
                      title="Xoá khỏi yêu thích"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Wishlist;
