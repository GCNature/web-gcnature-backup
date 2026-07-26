import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, MessageCircle, User, Share2, Facebook, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { apiGet } from "@/lib/api";
import type { Article } from "@/data/articles";
import { makeSiteUrl } from "@/lib/config";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [seoData, setSeoData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const [articleData, relatedData] = await Promise.all([
          apiGet(`/articles/${slug}`),
          apiGet(`/articles/${slug}/related`)
        ]);
        setArticle(articleData);
        if (relatedData && Array.isArray(relatedData)) {
          setRelatedArticles(relatedData);
        }
        if (articleData && articleData.id) {
          apiGet(`/settings/article_seo_${articleData.id}`)
            .then(res => {
              if (res && res.value) {
                setSeoData(JSON.parse(res.value));
              }
            })
            .catch(() => {});
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h2 className="text-4xl font-extrabold text-foreground mb-4">Bài viết không tồn tại</h2>
            <p className="text-muted-foreground mb-6">Bài viết bạn đang tìm kiếm không được tìm thấy.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.fullDate,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: "GCnature" },
    image: article.image || undefined,
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, text: article.excerpt, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
    }
  };

  // Simple markdown-like renderer
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        return <h3 key={i} className="text-lg md:text-xl font-bold text-foreground mt-8 mb-3">{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith("## ")) {
        return <h2 key={i} className="text-xl md:text-2xl font-extrabold text-foreground mt-10 mb-4">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith("| ")) {
        // Table row
        const cells = trimmed.split("|").filter(Boolean).map((c) => c.trim());
        if (cells.every((c) => /^-+$/.test(c))) return null; // separator
        const isHeader = i > 0 && content.split("\n")[i + 1]?.trim().startsWith("|") && content.split("\n")[i + 1]?.includes("---");
        return (
          <tr key={i} className={isHeader ? "bg-muted/50" : "border-b border-border"}>
            {cells.map((cell, j) =>
              isHeader ? (
                <th key={j} className="px-4 py-2.5 text-left text-sm font-semibold text-foreground">{cell}</th>
              ) : (
                <td key={j} className="px-4 py-2.5 text-sm text-muted-foreground">{cell}</td>
              )
            )}
          </tr>
        );
      }
      if (trimmed.startsWith("- **")) {
        const match = trimmed.match(/- \*\*(.+?)\*\*(.*)$/);
        if (match) {
          return (
            <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm md:text-base leading-relaxed ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span><strong className="text-foreground">{match[1]}</strong>{match[2]}</span>
            </li>
          );
        }
      }
      if (trimmed.startsWith("- ")) {
        return (
          <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm md:text-base leading-relaxed ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>{trimmed.slice(2)}</span>
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)\.\s/)?.[1];
        return (
          <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base leading-relaxed ml-1">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{num}</span>
            <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/^\d+\.\s/, "").replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
          </li>
        );
      }
      if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
        return <p key={i} className="text-muted-foreground text-sm md:text-base italic leading-relaxed">{trimmed.slice(1, -1)}</p>;
      }
      if (trimmed === "") return <div key={i} className="h-2" />;

      // Bold text inline
      const html = trimmed
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');

      return <p key={i} className="text-muted-foreground text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  // Check if content is HTML
  const isHtml = article.content.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(article.content);

  // Group table rows (only if not HTML)
  const elements: React.ReactNode[] = [];
  if (!isHtml) {
    const contentLines = article.content.split("\n");
    let tableRows: React.ReactNode[] = [];
    let inTable = false;

    contentLines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("| ")) {
        if (!inTable) inTable = true;
        const row = renderContent(line)[0];
        if (row) tableRows.push(row);
      } else {
        if (inTable) {
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-4 rounded-lg border border-border">
              <table className="w-full"><tbody>{tableRows}</tbody></table>
            </div>
          );
          tableRows = [];
          inTable = false;
        }
        elements.push(...renderContent(line));
      }
    });
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key="table-end" className="overflow-x-auto my-4 rounded-lg border border-border">
          <table className="w-full"><tbody>{tableRows}</tbody></table>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title={seoData?.title || article.title}
        description={seoData?.desc || article.excerpt}
        keywords={seoData?.keywords || ""}
        canonical={makeSiteUrl(`/news/${article.slug}`)}
        jsonLd={jsonLd}
      />
      <Header />

      <main className="container py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{article.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main content */}
          <article className="min-w-0">
            {/* Category badge */}
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight mb-5">
              {article.title}
            </h2>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {article.fullDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {article.views} lượt xem
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                {article.comments} bình luận
              </span>
            </div>

            {/* Featured image */}
            {article.image && (
              <div className="relative rounded-xl overflow-hidden mb-8">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[250px] md:h-[400px] object-cover"
                  width={1200}
                  height={600}
                />
              </div>
            )}

            {/* Content */}
            <div className="prose-gc space-y-1">
              {isHtml ? (
                <div 
                  className="w-full max-w-none text-muted-foreground leading-relaxed space-y-4 text-justify"
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              ) : (
                elements
              )}
            </div>

            {/* Share bar */}
            <div className="flex items-center gap-3 mt-10 pt-6 border-t border-border">
              <span className="text-sm font-semibold text-foreground">Chia sẻ:</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground text-sm px-4 py-2 rounded-lg transition-all duration-200 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                Sao chép link
              </button>
            </div>

            {/* Back link */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm mt-6 hover:gap-3 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related articles */}
            <div className="bg-background rounded-xl border border-border p-5">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Bài viết liên quan
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/news/${related.slug}`}
                    className="group flex gap-3 items-start"
                  >
                    {related.image ? (
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-20 h-16 rounded-lg object-cover shrink-0 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-20 h-16 rounded-lg bg-muted shrink-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-xs font-semibold">GCnature</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {related.title}
                      </h4>
                      <span className="text-xs text-muted-foreground mt-1 block">{related.fullDate}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">Khám phá sản phẩm</h3>
              <p className="text-muted-foreground text-sm mb-4">Khám phá các dòng mỹ phẩm Hàn Quốc hot nhất tại GCnature</p>
              <Link
                to="/shop"
                className="inline-block bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity active:scale-95"
              >
                Xem sản phẩm
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default NewsDetail;
