import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturesBar from "@/components/FeaturesBar";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import CheckoutPopup from "@/components/CheckoutPopup";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/data/products";
import { useProductFlashSale } from "@/hooks/useFlashSale";
import { Heart, RefreshCw, ChevronRight, ChevronLeft, Truck, ShieldCheck, RotateCcw, Star, Phone, Headphones, Check, X, Loader2, Minus, Plus, ExternalLink, Gift, Globe, Camera, Ticket } from "lucide-react";
import { toast } from "sonner";
import { getReviewSummary, type Review } from "@/data/reviews";
import { apiGet, apiPost } from "@/lib/api";
import { makeSiteUrl } from "@/lib/config";

// Gift packaging options (keeps variable name warrantyPackages for backward compatibility)
const warrantyPackages = [
  { name: "Hộp Quà Thường (GCbox)", price: 30000, badge: "" },
  { name: "Hộp Quà Cao Cấp (Premium Box)", price: 50000, badge: "Phổ biến" },
  { name: "Combo Quà Tặng & Thiệp Hoa", price: 80000, badge: "Ý nghĩa" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCartWithQuantity, toggleWishlist, toggleCompare, isInWishlist, isInCompare, products } = useShop();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWarranty, setSelectedWarranty] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"info" | "desc" | "specs" | "reviews">("info");
  const [scrolled, setScrolled] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Review system state
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(3);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [globalPolicy, setGlobalPolicy] = useState<string | null>(null);

  const [reviewEligibility, setReviewEligibility] = useState<{ canReview: boolean; reason?: string } | null>(null);

  const checkReviewEligibility = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setReviewEligibility({ canReview: false, reason: "unauthorized" });
      return;
    }
    if (!product?.productId) return;
    try {
      const data = await apiGet(`/reviews/can-review/${product.productId}`);
      setReviewEligibility({ canReview: data.canReview, reason: data.reason });
    } catch (e) {
      setReviewEligibility({ canReview: false, reason: "error" });
    }
  };

  useEffect(() => {
    if (product?.productId) {
      checkReviewEligibility();
    } else {
      setReviewEligibility(null);
    }
  }, [product?.productId, user]);

  useEffect(() => {
    if (user?.name) {
      setNewReviewName(user.name);
    }
  }, [user]);

  const handleWriteReviewClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Đăng nhập để đánh giá");
      return;
    }
    if (!reviewEligibility) {
      checkReviewEligibility().then(() => {
        toast.info("Đang xác thực điều kiện đánh giá, vui lòng bấm lại sau giây lát.");
      });
      return;
    }
    if (!reviewEligibility.canReview) {
      toast.error("Mua hàng để đánh giá sản phẩm");
      return;
    }
    setShowWriteReview(true);
  };

  const [reviewImage, setReviewImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeVouchers, setActiveVouchers] = useState<any[]>([]);

  useEffect(() => {
    const fetchActiveVouchers = async () => {
      try {
        const data = await apiGet('/vouchers/active');
        if (Array.isArray(data)) {
          setActiveVouchers(data);
        }
      } catch (err) {
        console.error("Failed to fetch active vouchers", err);
      }
    };
    fetchActiveVouchers();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/reviews/upload", {
        method: "POST",
        body: formData,
      });
      const resData = await response.json();
      if (resData && resData.url) {
        setReviewImage(resData.url);
        toast.success("Đã tải ảnh lên thành công");
      } else {
        toast.error("Tải ảnh lên thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối khi tải ảnh");
    } finally {
      setUploadingImage(false);
    }
  };

  // Flash sale lookup — must be called unconditionally per hook rules
  const flashSale = useProductFlashSale(product?.productId || product?.sku || product?.id);

  // Fetch global product policy
  useEffect(() => {
    const fetchGlobalPolicy = async () => {
      try {
        const response = await fetch('/api/settings/product-policy');
        const data = await response.json();
        if (data && data.value) {
          setGlobalPolicy(data.value);
        }
      } catch (error) {
        console.error("Failed to fetch global product policy", error);
      }
    };
    fetchGlobalPolicy();
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await apiGet<any>(`/products/${id}`);
        
        // Auto-redirect if accessed via ID number or different identifier
        if (data && data.productId && id !== data.productId) {
          navigate(`/product/${data.productId}`, { replace: true });
          return;
        }

        if (data && (!data.images || data.images.length === 0)) {
          data.images = [data.image || ""];
        }
        setProduct(data);
      } catch (err: any) {
        console.error("API failed, fallback to local:", err);
        const localProduct = products.find((p) => p.id === Number(id)) || products.find((p) => p.sku === id);
        if (localProduct) {
          if (localProduct.productId && id !== localProduct.productId) {
            navigate(`/product/${localProduct.productId}`, { replace: true });
            return;
          }
          setProduct(localProduct);
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews data
  const fetchReviews = async () => {
    if (!product?.productId) return;
    try {
      const data = await apiGet(`/reviews/${product.productId}?limit=50`);
      if (Array.isArray(data)) setAllReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const parsePolicyText = (text: string) => {
    if (!text) return [];
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const cleanText = line.replace(/^[\s\-\*\•\d\.\)]+/, '').trim();
        
        let icon = Check;
        let color = "text-green-600 bg-green-50";
        let iconColor = "text-green-600";
        
        const lower = cleanText.toLowerCase();
        if (lower.includes("chính hãng") || lower.includes("cam kết") || lower.includes("chinh hang") || lower.includes("cam ket")) {
          icon = ShieldCheck;
          color = "text-emerald-600 bg-emerald-50";
          iconColor = "text-emerald-600";
        } else if (lower.includes("tư vấn") || lower.includes("hỗ trợ") || lower.includes("hotline") || lower.includes("tu van") || lower.includes("ho tro")) {
          icon = Headphones;
          color = "text-violet-600 bg-violet-50";
          iconColor = "text-violet-600";
        } else if (lower.includes("vận chuyển") || lower.includes("giao hàng") || lower.includes("ship") || lower.includes("van chuyen") || lower.includes("giao hang")) {
          icon = Truck;
          color = "text-blue-600 bg-blue-50";
          iconColor = "text-blue-600";
        } else if (lower.includes("nhập khẩu") || lower.includes("hàn quốc") || lower.includes("korea") || lower.includes("nhap khau") || lower.includes("han quoc")) {
          icon = Globe;
          color = "text-indigo-600 bg-indigo-50";
          iconColor = "text-indigo-600";
        } else if (lower.includes("đổi trả") || lower.includes("bảo hành") || lower.includes("doi tra") || lower.includes("bao hanh")) {
          icon = RotateCcw;
          color = "text-amber-600 bg-amber-50";
          iconColor = "text-amber-600";
        }
        
        return { icon, text: cleanText, color, iconColor };
      });
  };

  const getPolicyItems = () => {
    const rawText = product?.footerInfo || globalPolicy;
    if (rawText) {
      return parsePolicyText(rawText);
    }
    return [
      { icon: ShieldCheck, text: "Cam kết chính hãng", color: "text-emerald-600 bg-emerald-50", iconColor: "text-emerald-600" },
      { icon: Headphones, text: "Tư vấn 24/7", color: "text-violet-600 bg-violet-50", iconColor: "text-violet-600" },
      { icon: Globe, text: "Nhập khẩu chính hãng Hàn Quốc", color: "text-indigo-600 bg-indigo-50", iconColor: "text-indigo-600" },
    ];
  };



  useEffect(() => {
    fetchReviews();
  }, [product?.id, product?.productId]);

  // Push view_item to Google Tag Manager dataLayer
  useEffect(() => {
    if (product) {
      const price = Number(product.price);
      if (typeof window !== "undefined") {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          event: "view_item",
          ecommerce: {
            currency: "VND",
            value: price,
            items: [{
              item_id: product.sku || product.productId || String(product.id),
              item_name: product.name,
              price: price,
              quantity: 1,
              item_brand: product.brand || "GC Nature",
              item_category: product.categoryName || product.category || ""
            }]
          }
        });
      }
    }
  }, [product]);

  // Sticky buy bar on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sản phẩm không tồn tại</h2>
            <Link to="/shop" className="text-red-600 hover:underline">← Quay lại cửa hàng</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);
  const upsellProducts = products.filter((p) => p.id !== product.id && p.price < product.price).slice(0, 3);

  // Apply running flash-sale price if the product is part of a live campaign
  const effectivePrice = flashSale?.salePrice ?? product.price;
  const effectiveOriginal = product.originalPrice && product.originalPrice > effectivePrice
    ? product.originalPrice
    : (flashSale ? product.price : null);
  const discount = effectiveOriginal
    ? Math.round(((effectiveOriginal - effectivePrice) / effectiveOriginal) * 100)
    : 0;

  const totalPrice = effectivePrice * quantity + (selectedWarranty !== null ? warrantyPackages[selectedWarranty].price : 0);

  // Review summaries
  const parsedReviews: Review[] = allReviews.map(r => ({
    name: r.name,
    avatar: r.avatarLetter,
    color: r.avatarColor,
    rating: r.rating,
    date: r.date,
    verified: r.verified,
    text: r.text,
    helpful: r.helpful,
    images: r.imageUrl ? [r.imageUrl] : []
  }));

  const reviewSummary = getReviewSummary(parsedReviews);
  const visibleReviews = parsedReviews.slice(0, reviewsToShow);
  const remainingReviews = parsedReviews.length - reviewsToShow;

  const handleSubmitReview = async () => {
    if (!newReviewName.trim() || !newReviewText.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSubmittingReview(true);
    try {
      await apiPost('/reviews', {
        productId: product.productId || String(product.id),
        name: newReviewName.trim(),
        rating: newReviewRating,
        text: newReviewText.trim(),
        image_url: reviewImage || "",
      });
      await fetchReviews();
      setShowWriteReview(false);
      setNewReviewName("");
      setNewReviewRating(5);
      setNewReviewText("");
      setReviewImage(null);
      toast.success("Đã gửi đánh giá thành công! 🎉");
    } catch (error) {
      toast.error("Gửi đánh giá thất bại.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    // Apply flash-sale price when adding to cart so the cart total matches what the user sees
    const productForCart = flashSale
      ? { ...product, price: effectivePrice, originalPrice: product.originalPrice ?? product.price }
      : product;
    addToCartWithQuantity(productForCart, quantity);
    if (selectedWarranty !== null) {
      const wp = warrantyPackages[selectedWarranty];
      addToCartWithQuantity({
        id: product.id + 10000,
        name: `${wp.name} - ${product.name}`,
        price: wp.price,
        image: product.image,
        images: [product.image],
        description: `Gói bảo hành ${wp.name}`,
        specs: [],
        category: "Bảo hành",
        sku: `BH-${product.sku}`,
      }, 1);
    }
    setShowCheckout(true);
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
    },
  };

  // Parse SEO settings from seoTags
  let seoTitle = product.name;
  let seoDesc = product.featuresVn || product.description || "";
  let seoKeywords = "";

  if (product.seoTags) {
    try {
      if (product.seoTags.trim().startsWith("{")) {
        const parsed = JSON.parse(product.seoTags);
        seoTitle = parsed.title || product.name;
        seoDesc = parsed.desc || product.featuresVn || product.description || "";
        seoKeywords = parsed.keywords || "";
      } else {
        seoKeywords = product.seoTags;
      }
    } catch {
      seoKeywords = product.seoTags;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <SEOHead
        title={seoTitle}
        description={seoDesc.substring(0, 160)}
        keywords={seoKeywords}
        canonical={makeSiteUrl(`/product/${product.productId || product.id}`)}
        ogType="product"
        jsonLd={productJsonLd}
        pureTitle={true}
      />
      <Header />

      {/* ═══ Sticky Buy Bar (shows on scroll) ═══ */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ${scrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
        <div className="container flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover border" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sku}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-lg font-bold text-red-600">{formatPrice(effectivePrice)}</span>
            {effectiveOriginal && (
              <span className="text-sm text-gray-400 line-through hidden sm:inline">{formatPrice(effectiveOriginal)}</span>
            )}
            <button
              onClick={handleBuyNow}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm active:scale-95 transition-all"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Breadcrumb ═══ */}
      <nav className="bg-white border-b border-gray-100">
        <ol className="container py-3 flex items-center gap-2 text-sm text-gray-500 list-none">
          <li><Link to="/" className="hover:text-red-600 transition-colors">Trang chủ</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5" /></li>
          <li><Link to="/shop" className="hover:text-red-600 transition-colors">Cửa hàng</Link></li>
          <li><ChevronRight className="w-3.5 h-3.5" /></li>
          <li className="text-gray-800 truncate font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* ═══ Product Main Section ═══ */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-20">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Nav arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                {/* Discount badge */}
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    -{discount}%
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      i === selectedImage ? "border-red-500 shadow-md" : "border-gray-200 hover:border-red-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-7 space-y-4">
            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
                {product.brand && (
                  <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    Thương hiệu: {product.brand}
                  </span>
                )}
                {product.origin && (
                  <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    Xuất xứ: {product.origin}
                  </span>
                )}
                {product.volume && (
                  <span className="text-[11px] font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200/50">
                    Định lượng: {product.volume}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  <span className="text-sm font-bold text-gray-800">{reviewSummary.avgRating}</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(reviewSummary.avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400">{reviewSummary.totalReviews} đánh giá</span>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-gray-400">Đã bán 156</span>
              </div>

              {/* Price Block */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {flashSale && (
                  <div className="mb-2 inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
                    FLASH SALE • {flashSale.campaign.name.replace(/^\[SEED\]\s*/i, "")}
                    <span className="ml-1">
                      Còn {String(flashSale.timing.hours).padStart(2, "0")}:{String(flashSale.timing.minutes).padStart(2, "0")}:{String(flashSale.timing.seconds).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <span className="text-2xl md:text-3xl font-extrabold text-red-600">{formatPrice(effectivePrice)}</span>
                  {effectiveOriginal && (
                    <>
                      <span className="text-base text-gray-400 line-through">{formatPrice(effectiveOriginal)}</span>
                      <span className="text-sm text-red-600 font-bold">-{discount}%</span>
                    </>
                  )}
                </div>
                {flashSale?.stockLeft !== null && flashSale?.stockLeft !== undefined && flashSale.stockLeft > 0 && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">
                    🔥 Chỉ còn {flashSale.stockLeft} suất ưu đãi với giá flash sale
                  </p>
                )}
              </div>
            </div>

            {/* Warranty Packages */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#5dc1d1]" />
                Chọn hộp quà & dịch vụ quà tặng
              </h3>
              <div className="space-y-2">
                {warrantyPackages.map((wp, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedWarranty(selectedWarranty === i ? null : i)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      selectedWarranty === i
                        ? "border-red-500 bg-red-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedWarranty === i ? "border-red-600 bg-red-600" : "border-gray-300"
                      }`}>
                        {selectedWarranty === i && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{wp.name}</span>
                      {wp.badge && (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">{wp.badge}</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-red-600">+{formatPrice(wp.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voucher Section */}
            {activeVouchers.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-red-500" />
                    Mã giảm giá dành cho bạn
                  </h3>
                  <Link to="/vouchers" className="text-[11px] text-cyan-600 hover:text-cyan-700 font-bold hover:underline">
                    Xem tất cả ({activeVouchers.length}) →
                  </Link>
                </div>
                
                {/* Horizontal scroll of compact coupons */}
                <div className="flex gap-3 overflow-x-auto pb-2 pt-0.5 scrollbar-thin scrollbar-thumb-gray-200">
                  {activeVouchers.map((v) => {
                    const currentVal = effectivePrice * quantity;
                    const isApplicable = currentVal >= v.min_order_value;
                    const needed = v.min_order_value - currentVal;
                    const minQty = Math.ceil(v.min_order_value / effectivePrice);

                    return (
                      <div
                        key={v.id}
                        className={`min-w-[210px] max-w-[210px] rounded-xl border p-2.5 transition-all flex flex-col justify-between shrink-0 relative ${
                          isApplicable
                            ? "border-green-200 bg-green-50/30"
                            : "border-gray-200 bg-gray-50/30"
                        }`}
                      >
                        {/* Cutouts on left/right edges for a coupon ticket look */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full bg-white border-r border-gray-200" />
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full bg-white border-l border-gray-200" />

                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <code className="font-mono font-bold text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                              {v.code}
                            </code>
                            {isApplicable ? (
                              <span className="text-[10px] font-bold text-green-600 flex items-center gap-0.5">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                Đã áp dụng
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-gray-400">
                                Đơn từ {v.min_order_value >= 1000000 ? `${v.min_order_value/1000000}tr` : `${v.min_order_value/1000}k`}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs font-bold text-gray-800">
                            Giảm {formatPrice(v.discount_amount)}
                          </p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                          {isApplicable ? (
                            <span className="text-[9px] text-green-600 font-medium truncate">
                              Đã chọn tự động
                            </span>
                          ) : (
                            <>
                              <span className="text-[9px] text-orange-600 font-semibold truncate">
                                Thiếu {formatPrice(needed)}
                              </span>
                              {minQty <= 10 && (
                                <button
                                  onClick={() => {
                                    setQuantity(minQty);
                                    toast.success(`Đã chọn ${minQty} sản phẩm để áp dụng mã ${v.code}!`);
                                  }}
                                  className="text-[9px] font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50/80 hover:bg-cyan-100/80 px-2 py-1 rounded transition-colors border border-cyan-150 shrink-0"
                                >
                                  Mua {minQty} cái
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trust Badges - Grid layout with boxes and matched icons */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3.5">Chính sách sản phẩm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getPolicyItems().map(({ icon: Icon, text, color, iconColor }, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50/60 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.split(' ')[1]} flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${iconColor}`} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 leading-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector + Price Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-800">Số lượng</span>
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <div className="w-12 h-9 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                    <span className="text-sm font-bold text-gray-900">{quantity}</span>
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Price summary */}
              {(() => {
                const basePrice = effectiveOriginal || effectivePrice;
                const originalProductTotal = basePrice * quantity;
                const warrantyPrice = selectedWarranty !== null ? warrantyPackages[selectedWarranty].price : 0;
                const originalTotal = originalProductTotal + warrantyPrice;
                
                const campaignDiscount = effectiveOriginal ? (effectiveOriginal - effectivePrice) * quantity : 0;
                
                // Find highest applicable voucher
                const currentTotalForVoucher = effectivePrice * quantity + warrantyPrice;
                const applicableVouchers = activeVouchers.filter(v => currentTotalForVoucher >= v.min_order_value);
                const bestVoucher = applicableVouchers.length > 0
                  ? applicableVouchers.reduce((prev, curr) => prev.discount_amount > curr.discount_amount ? prev : curr)
                  : null;
                const voucherDiscount = bestVoucher ? Math.min(bestVoucher.discount_amount, currentTotalForVoucher) : 0;
                
                const finalSubtotal = originalTotal - campaignDiscount - voucherDiscount;

                return (
                  <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Giá gốc</span>
                      <span className="font-semibold text-gray-800">{formatPrice(originalTotal)}</span>
                    </div>
                    
                    {campaignDiscount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Giảm giá</span>
                        <span className="font-semibold">-{formatPrice(campaignDiscount)}</span>
                      </div>
                    )}
                    
                    {voucherDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Voucher ({bestVoucher?.code})</span>
                        <span>-{formatPrice(voucherDiscount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Vận chuyển</span>
                      <span className="text-green-600 font-bold">Miễn phí</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-2.5 flex justify-between items-end">
                      <div>
                        <span className="text-xs font-bold text-gray-800 block">Tạm tính</span>
                        <span className="text-[10px] text-gray-400 font-medium">(Đã áp dụng tất cả ưu đãi)</span>
                      </div>
                      <span className="text-xl font-extrabold text-red-600 leading-none">
                        {formatPrice(finalSubtotal)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* CTA Buttons */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#5dc1d1] hover:bg-[#4bb4c4] text-white font-bold py-4 rounded-xl text-base active:scale-[0.98] transition-all"
              >
                Mua ngay
              </button>
              <a
                href="tel:0898273899"
                className="w-full flex items-center justify-center gap-2 border-2 border-[#5dc1d1] text-[#5dc1d1] font-bold py-3.5 rounded-xl text-sm hover:bg-cyan-50/50 transition-all active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                Gọi tư vấn: 0898.273.899
              </a>

              {/* Shopee + TikTok Shop reference buttons */}
              {(product.shopeeUrl || product.tiktokUrl) && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {product.shopeeUrl && (
                    <a
                      href={product.shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l.867 12.143a2 2 0 0 0 2 1.857h10.276a2 2 0 0 0 2 -1.857l.867 -12.143h-16z" /><path d="M8.5 7c0 -1.653 1.5 -4 3.5 -4s3.5 2.347 3.5 4" /><path d="M9.5 17c.413 .462 1 1 2.5 1s2.5 -.897 2.5 -2s-1 -1.5 -2.5 -2s-2 -1.47 -2 -2c0 -1.104 1 -2 2 -2s1.5 0 2.5 1" /></svg>
                      Xem trên Shopee
                    </a>
                  )}
                  {product.tiktokUrl && (
                    <a
                      href={product.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] bg-gradient-to-r from-gray-900 to-gray-700 text-white hover:from-black hover:to-gray-800 shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.86a8.28 8.28 0 0 0 4.76 1.5V6.83a4.83 4.83 0 0 1-1-.14z"/></svg>
                      Xem trên TikTok
                    </a>
                  )}
                </div>
              )}

              {/* Wishlist + Compare */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    toast(isInWishlist(product.id) ? "Đã xoá khỏi yêu thích" : "Đã thêm vào yêu thích");
                  }}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isInWishlist(product.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  Yêu thích
                </button>
                <button
                  onClick={() => {
                    toggleCompare(product);
                    toast(isInCompare(product.id) ? "Đã xoá khỏi so sánh" : "Đã thêm vào so sánh");
                  }}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    isInCompare(product.id) ? "text-red-600" : "text-gray-400 hover:text-red-600"
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  So sánh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Tabs Section ═══ */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <div className="flex border-b border-slate-200/60 overflow-x-auto bg-slate-50/70">
            {[
              { key: "info" as const, label: "✨ Công dụng & Thành phần" },
              { key: "desc" as const, label: "📖 Mô tả chi tiết" },
              { key: "specs" as const, label: "📋 Thông số kỹ thuật" },
              { key: "reviews" as const, label: `⭐ Đánh giá (${reviewSummary.totalReviews})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-7 py-4 text-sm font-bold tracking-tight whitespace-nowrap transition-all relative ${
                  activeTab === tab.key
                    ? "text-teal-900 bg-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-600 rounded-t-md" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "info" && (
              <div className="space-y-6">
                {/* Highlight Attribute Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {product.volume && (
                    <div className="bg-gradient-to-br from-teal-50/90 to-emerald-50/40 p-4 rounded-2xl border border-teal-100/80 flex items-center gap-3.5 shadow-2xs">
                      <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                        🧪
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-teal-800/80 uppercase tracking-wider">Định lượng / Dung tích</p>
                        <p className="text-base font-extrabold text-teal-950 tracking-tight">{product.volume}</p>
                      </div>
                    </div>
                  )}
                  {product.origin && (
                    <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/40 p-4 rounded-2xl border border-blue-100/80 flex items-center gap-3.5 shadow-2xs">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                        🌐
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-blue-800/80 uppercase tracking-wider">Nguồn gốc xuất xứ</p>
                        <p className="text-base font-extrabold text-blue-950 tracking-tight">{product.origin}</p>
                      </div>
                    </div>
                  )}
                  {product.brand && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100/60 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3.5 shadow-2xs">
                      <div className="w-11 h-11 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                        ✨
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thương hiệu chính hãng</p>
                        <p className="text-base font-extrabold text-slate-900 tracking-tight">{product.brand}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Features Box (Công dụng nổi bật) */}
                {product.featuresVn && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-base">
                        ✨
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Công dụng nổi bật</h3>
                        <p className="text-xs text-slate-500">Hiệu quả chăm sóc da vượt trội từ công thức độc quyền</p>
                      </div>
                    </div>
                    <div className="text-slate-700 leading-relaxed text-sm md:text-[15px] space-y-2.5 font-normal">
                      {product.featuresVn.split('\n').map((line: string, i: number) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        return (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-100/80 hover:bg-slate-50 transition-colors">
                            <span className="text-teal-600 font-bold shrink-0 mt-0.5">✓</span>
                            <span className="leading-snug">{trimmed.replace(/^(\?\?|🌿|💧|🔒|🌸|✅|⚡|\?|•|-|\*)\s*/, '')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Ingredients Box (Bảng thành phần chính) */}
                {product.ingredients && (
                  <div className="bg-emerald-50/30 rounded-2xl border border-emerald-100 p-6 space-y-5">
                    <div className="flex items-center gap-3 pb-3.5 border-b border-emerald-100">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold text-base">
                        🌿
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-emerald-950 tracking-tight">Bảng thành phần chính</h3>
                        <p className="text-xs text-emerald-700 font-medium">Chiết xuất thiên nhiên an toàn & dược mỹ phẩm Hàn Quốc</p>
                      </div>
                    </div>

                    {/* Key active ingredient pills */}
                    {product.ingredients.includes(',') && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Hoạt chất tiêu biểu:</p>
                        <div className="flex flex-wrap gap-2">
                          {product.ingredients.split(',').slice(0, 10).map((ing: string, i: number) => (
                            <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-emerald-900 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {ing.trim()}
                            </span>
                          ))}
                          {product.ingredients.split(',').length > 10 && (
                            <span className="inline-flex items-center text-xs font-bold bg-emerald-100/80 text-emerald-800 px-3 py-1.5 rounded-full">
                              +{product.ingredients.split(',').length - 10} thành phần khác
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bảng thành phần đầy đủ (INCI):</p>
                      <div className="bg-white/90 rounded-xl p-4 border border-emerald-100 text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
                        {product.ingredients}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "desc" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: product.description }} />
            )}
            {activeTab === "specs" && (() => {
              const basicSpecs = [
                { label: "Tên sản phẩm", value: product.name },
                { label: "Thương hiệu", value: product.brand || "GCnature" },
                { label: "Nguồn gốc xuất xứ", value: product.origin || "Hàn Quốc" },
                { label: "Định lượng / Dung tích", value: product.volume },
                { label: "Danh mục sản phẩm", value: product.categoryName },
                { label: "Mã sản phẩm (SKU)", value: product.sku },
                { label: "Năm sản xuất", value: product.productionYear ? String(product.productionYear) : "2026" },
              ].filter(s => s.value);

              return (
                <div className="max-w-3xl space-y-6">
                  <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xs">
                    <table className="w-full text-left text-sm border-collapse">
                      <tbody>
                        {basicSpecs.map((spec, i) => (
                          <tr key={i} className={i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}>
                            <td className="py-3.5 px-6 font-semibold text-slate-500 w-1/3 border-b border-slate-100 border-r">{spec.label}</td>
                            <td className="py-3.5 px-6 font-bold text-slate-900 w-2/3 border-b border-slate-100">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {product.ingredients && (
                    <div className="bg-slate-50/60 rounded-2xl border border-slate-200/80 p-6 space-y-2.5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thành phần chi tiết đầy đủ:</p>
                      <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans font-normal">{product.ingredients}</p>
                    </div>
                  )}
                </div>
              );
            })()}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Overall score */}
                  <div className="text-center px-6 py-4 bg-gray-50 rounded-xl border border-gray-100 min-w-[160px]">
                    <div className="text-4xl font-extrabold text-gray-900">{reviewSummary.avgRating}</div>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(reviewSummary.avgRating) ? "text-amber-400 fill-amber-400" : "text-amber-400 fill-amber-400/30"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 font-medium">{reviewSummary.totalReviews} đánh giá</p>
                  </div>
                  {/* Star distribution */}
                  <div className="flex-1 space-y-1.5 min-w-[200px]">
                    {reviewSummary.distribution.map(row => (
                      <div key={row.stars} className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 w-8 text-right">{row.stars} ★</span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {visibleReviews.map((review, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full ${review.color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                          {review.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Name + badge + date */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-gray-900">{review.name}</span>
                            {review.verified && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">
                                <Check className="w-2.5 h-2.5" /> Đã mua hàng
                              </span>
                            )}
                            <span className="text-[11px] text-gray-400 ml-auto">{review.date}</span>
                          </div>
                          {/* Stars */}
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                          {/* Text */}
                          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.text}</p>
                          {/* Images */}
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mt-2.5">
                              {review.images.map((img, i) => (
                                <img key={i} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover border border-gray-100 hover:scale-105 transition-transform cursor-pointer" />
                              ))}
                            </div>
                          )}
                          {/* Helpful */}
                          <div className="flex items-center gap-4 mt-3">
                            <button className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
                              👍 Hữu ích ({review.helpful})
                            </button>
                            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                              Trả lời
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load more + write review */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {remainingReviews > 0 && (
                    <button
                      onClick={() => setReviewsToShow(prev => prev + 5)}
                      className="flex-1 sm:flex-none px-6 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Xem thêm {remainingReviews} đánh giá
                    </button>
                  )}
                  <button
                    onClick={handleWriteReviewClick}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer text-center"
                  >
                    ✍️ Viết đánh giá
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ YouTube Video Section ═══ */}
        {product.youtubeUrl && (() => {
          // Extract YouTube video ID from various URL formats
          const url = product.youtubeUrl;
          let videoId = '';
          try {
            if (url.includes('youtu.be/')) {
              videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
            } else if (url.includes('youtube.com/watch')) {
              videoId = new URL(url).searchParams.get('v') || '';
            } else if (url.includes('youtube.com/embed/')) {
              videoId = url.split('youtube.com/embed/')[1]?.split(/[?&#]/)[0] || '';
            } else if (url.includes('youtube.com/shorts/')) {
              videoId = url.split('youtube.com/shorts/')[1]?.split(/[?&#]/)[0] || '';
            }
          } catch {}
          if (!videoId) return null;
          return (
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <h3 className="text-base font-bold text-gray-900">Video sản phẩm</h3>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                  title={`Video: ${product.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          );
        })()}

        {/* ═══ Upsell Section ═══ */}
        {upsellProducts.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              🔥 Giảm thêm khi mua kèm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {upsellProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.productId || p.id}`}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-red-600 transition-colors">{p.name}</p>
                    <p className="text-sm font-bold text-red-600 mt-1">{formatPrice(p.price)}</p>
                    {p.originalPrice && (
                      <p className="text-[10px] text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Related Products ═══ */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.productId || p.id}`}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-medium text-gray-700 line-clamp-2 group-hover:text-red-600 transition-colors">{p.name}</h3>
                  <p className="text-red-600 font-bold text-sm mt-1.5">{formatPrice(p.price)}</p>
                  {p.originalPrice && (
                    <p className="text-[10px] text-gray-400 line-through">{formatPrice(p.originalPrice)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <FeaturesBar />
      <Footer />
      <BottomNav />
      <ScrollToTop />

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutPopup
          total={totalPrice}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWriteReview(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 text-white px-5 py-3.5 flex items-center justify-between">
              <h2 className="font-bold text-lg">✍️ Viết đánh giá</h2>
              <button onClick={() => setShowWriteReview(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {/* Product preview */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                <p className="text-sm font-medium text-gray-700 line-clamp-2">{product.name}</p>
              </div>
              
              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Đánh giá của bạn</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewReviewRating(s)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star className={`w-7 h-7 transition-colors ${s <= (hoverRating || newReviewRating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    {newReviewRating === 5 ? "Cực kỳ hài lòng" :
                     newReviewRating === 4 ? "Hài lòng" :
                     newReviewRating === 3 ? "Bình thường" :
                     newReviewRating === 2 ? "Không hài lòng" : "Rất tệ"}
                  </span>
                </div>
              </div>
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tên hiển thị <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="Họ và tên của bạn"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              
              {/* Review text */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nội dung đánh giá <span className="text-red-500">*</span></label>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 focus:bg-white transition-all resize-none"
                />
              </div>
              
              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Hình ảnh thực tế (tùy chọn)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50/10 cursor-pointer transition-all text-xs font-medium text-gray-600">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <span>{uploadingImage ? "Đang tải..." : "Chọn ảnh"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  
                  {reviewImage && (
                    <div className="relative w-12 h-12 rounded-lg border overflow-hidden group">
                      <img src={reviewImage} alt="Review Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReviewImage(null)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa ảnh"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Submit */}
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !newReviewName.trim() || !newReviewText.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
