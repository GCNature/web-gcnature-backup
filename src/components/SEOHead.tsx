import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
  pureTitle?: boolean;
}

const SITE_NAME = "GCnature - Sự chăm sóc toàn diện | Mỹ phẩm Hàn Quốc";
const DEFAULT_DESCRIPTION =
  "GC Nature - Sự chăm sóc toàn diện (GC 네이처 - 온전한 케어) là thương hiệu nhập khẩu và thương mại các dòng mỹ phẩm Hàn Quốc số 1 Việt Nam.";
const DEFAULT_KEYWORDS =
  "mỹ phẩm hàn quốc, gc nature, gcnature, son môi, kem chống nắng, dưỡng da mặt, sữa rửa mặt, olive young, coupang";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  jsonLd,
  breadcrumbs,
  pureTitle = false,
}: SEOHeadProps) => {
  const fullTitle = pureTitle && title ? title : (title ? `${title} | ${SITE_NAME}` : SITE_NAME);

  // Generate BreadcrumbList JSON-LD
  const breadcrumbJsonLd = breadcrumbs && breadcrumbs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "item": item.url,
        })),
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="vi_VN" />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
