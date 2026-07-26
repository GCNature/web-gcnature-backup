import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft, X, ShoppingCart, GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Compare = () => {
  const { compare, toggleCompare, addToCart, products: allProducts } = useShop();

  const getFullProduct = (id: number) => allProducts.find((p) => p.id === id);

  // Collect all unique spec labels
  const allSpecLabels = Array.from(
    new Set(
      compare.flatMap((item) => {
        const full = getFullProduct(item.id);
        return full?.specs.map((s) => s.label) || [];
      })
    )
  );

  const handleAddToCart = (item: typeof compare[0]) => {
    addToCart(item);
    toast.success(`Đã thêm "${item.name}" vào giỏ hàng`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead title="So Sánh Sản Phẩm" description="So sánh chi tiết thông số, tính năng và giá bán các dòng mỹ phẩm Hàn Quốc chính hãng tại GCnature." />
      <Header />
      <main className="flex-1 container py-6 pb-24 md:pb-10">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6">So sánh sản phẩm</h1>

        {compare.length === 0 ? (
          <div className="text-center py-20">
            <GitCompareArrows className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">Chưa có sản phẩm nào để so sánh</p>
            <Button asChild>
              <Link to="/shop">Khám phá sản phẩm</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-muted-foreground bg-muted/30 rounded-tl-lg w-[140px] sticky left-0 z-10">
                    Thông tin
                  </th>
                  {compare.map((item) => (
                    <th key={item.id} className="p-3 bg-muted/30 text-center min-w-[200px]">
                      <div className="relative">
                        <button
                          onClick={() => toggleCompare(item)}
                          className="absolute -top-1 -right-1 p-1 rounded-full bg-background border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-28 object-cover rounded-lg mx-auto mb-2"
                        />
                        <Link
                          to={`/product/${item.productId || item.id}`}
                          className="text-sm font-semibold text-foreground hover:text-primary line-clamp-2"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price row */}
                <tr className="border-b border-border">
                  <td className="p-3 text-sm font-medium text-muted-foreground sticky left-0 bg-background z-10">Giá</td>
                  {compare.map((item) => {
                    const full = getFullProduct(item.id);
                    return (
                      <td key={item.id} className="p-3 text-center">
                        <span className="text-primary font-bold">{formatPrice(item.price)}</span>
                        {full?.originalPrice && (
                          <span className="block text-xs text-muted-foreground line-through mt-1">
                            {formatPrice(full.originalPrice)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Category row */}
                <tr className="border-b border-border bg-muted/10">
                  <td className="p-3 text-sm font-medium text-muted-foreground sticky left-0 bg-muted/10 z-10">Danh mục</td>
                  {compare.map((item) => {
                    const full = getFullProduct(item.id);
                    return (
                      <td key={item.id} className="p-3 text-center text-sm text-foreground">
                        {full?.category || "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Spec rows */}
                {allSpecLabels.map((label, idx) => (
                  <tr key={label} className={`border-b border-border ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className={`p-3 text-sm font-medium text-muted-foreground sticky left-0 z-10 ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                      {label}
                    </td>
                    {compare.map((item) => {
                      const full = getFullProduct(item.id);
                      const spec = full?.specs.find((s) => s.label === label);
                      return (
                        <td key={item.id} className="p-3 text-center text-sm text-foreground">
                          {spec?.value || "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Add to cart row */}
                <tr>
                  <td className="p-3 sticky left-0 bg-background z-10"></td>
                  {compare.map((item) => (
                    <td key={item.id} className="p-3 text-center">
                      <Button size="sm" onClick={() => handleAddToCart(item)} className="gap-2">
                        <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Compare;
