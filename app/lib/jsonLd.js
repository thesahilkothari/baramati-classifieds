import { absoluteUrl, defaultSeo } from "./seo";

const COMPANY_NAME = "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED";
const BRAND_NAME = "My Classifieds";
const CONTACT_EMAIL = "connect@myclassifieds.in";
const CONTACT_PHONE = "+91 9673931166";

function cleanText(value, maxLength = 500) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function getPriceValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return null;
  return number.toFixed(2);
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    alternateName: BRAND_NAME,
    url: absoluteUrl("/"),
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui",
      addressLocality: "Baramati",
      addressRegion: "Maharashtra",
      postalCode: "413133",
      addressCountry: "IN"
    }
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: defaultSeo.siteName,
    url: absoluteUrl("/"),
    inLanguage: ["en-IN", "mr-IN"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/ads")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildBreadcrumbSchema(items = []) {
  const list = items
    .filter((item) => item?.name && item?.path)
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cleanText(item.name, 120),
      item: absoluteUrl(item.path)
    }));

  if (list.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list
  };
}

export function buildCollectionPageSchema({ title, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cleanText(title, 180),
    description: cleanText(description, 300),
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: BRAND_NAME,
      url: absoluteUrl("/")
    },
    inLanguage: ["en-IN", "mr-IN"]
  };
}

export function buildItemListSchema(ads = []) {
  const itemListElement = ads
    .filter((ad) => ad?.slug && ad?.title)
    .slice(0, 24)
    .map((ad, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/ads/${ad.slug}`),
      name: cleanText(ad.title, 160)
    }));

  if (itemListElement.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement
  };
}

export function canUseProductSchemaForAd(ad) {
  const categorySlug = String(ad?.category?.slug || "").toLowerCase();
  const goodsCategories = new Set([
    "vehicles",
    "electronics",
    "agriculture-equipment"
  ]);

  return goodsCategories.has(categorySlug) && Boolean(getPriceValue(ad?.price));
}

export function buildClassifiedProductSchema(ad) {
  if (!canUseProductSchemaForAd(ad)) return null;

  const price = getPriceValue(ad.price);
  const description = cleanText(ad.description, 500);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cleanText(ad.title, 160),
    description,
    category: cleanText(ad.category?.nameEn || ad.category?.slug || "Classified", 120),
    url: absoluteUrl(`/ads/${ad.slug}`),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/ads/${ad.slug}`),
      areaServed: cleanText(ad.city?.name || "Maharashtra", 120),
      seller: {
        "@type": "Person",
        name: "Advertiser on My Classifieds"
      }
    }
  };
}
