export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://myclassifieds.in";

  return configuredUrl.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export const defaultSeo = {
  siteName: "My Classifieds",
  title: "My Classifieds | Baramati Classified Ads",
  description:
    "Post and browse local classified ads for Baramati and Maharashtra. Find property, jobs, vehicles, services and local opportunities.",
  keywords: [
    "Baramati classifieds",
    "classified ads Baramati",
    "Maharashtra classifieds",
    "property ads Baramati",
    "jobs Baramati",
    "local services Baramati",
    "used vehicles Baramati",
    "My Classifieds"
  ]
};

export function buildPageMetadata({
  title = defaultSeo.title,
  description = defaultSeo.description,
  path = "/",
  image = "/og-image.jpg",
  noIndex = false
} = {}) {
  const url = absoluteUrl(path);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords: defaultSeo.keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "website",
      siteName: defaultSeo.siteName,
      title,
      description,
      url,
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: defaultSeo.siteName
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : {
          index: true,
          follow: true
        }
  };
}
