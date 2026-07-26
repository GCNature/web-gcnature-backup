import { Link } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "đ";

const CompareBar = () => {
  const { compare, toggleCompare } = useShop();

  if (compare.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300">
      <div className="container py-3">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-bold text-foreground">So sánh ({compare.length}/4)</h3>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {compare.map((item) => (
            <div key={item.id} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 pr-3 shrink-0">
              <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate max-w-[120px]">{item.name}</p>
                <p className="text-xs text-primary font-bold">{formatPrice(item.price)}</p>
              </div>
              <button
                onClick={() => toggleCompare(item)}
                className="text-muted-foreground hover:text-destructive ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <Button asChild size="sm" className="shrink-0 gap-1.5 ml-auto">
            <Link to="/compare">
              So sánh ngay <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
