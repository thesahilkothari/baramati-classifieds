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
  title: "My Classifieds | Online Classifieds Platform",
  description:
    "My Classifieds is an online classifieds platform for Baramati and Maharashtra. Post and browse ads for property, jobs, vehicles, electronics, services and local opportunities.",
  keywords: [
    "My Classifieds",
    "online classifieds platform",
    "Baramati classifieds",
    "classified ads Baramati",
    "Maharashtra classifieds",
    "property ads Baramati",
    "jobs Baramati",
    "local services Baramati",
    "used vehicles Baramati"
  ]
};

export function buildPageMetadata({
  title = defaultSeo.title,
  description = defaultSeo.description,
  path = "/",
  image = "/opengraph-image",
  noIndex = false
} = {}) {
  const url = absoluteUrl(path);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords: defaultSeo.keywords,
    applicationName: defaultSeo.siteName,
    icons: {
      icon: [
        { url: "/icon", type: "image/png", sizes: "512x512" },
        { url: "/brand/my-classifieds-icon.svg", type: "image/svg+xml" }
      ],
      apple: [{ url: "/apple-icon", type: "image/png", sizes: "512x512" }]
    },
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
          alt: "My Classifieds - Online Classifieds Platform"
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
