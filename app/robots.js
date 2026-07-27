import { getSiteUrl } from "./lib/seo";

export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/ads",
          "/category",
          "/pricing",
          "/support",
          "/about",
          "/baramati",
          "/maharashtra",
          "/legal"
        ],
        disallow: [
          "/admin",
          "/api",
          "/my-ads",
          "/renew",
          "/sold-status",
          "/edit-request"
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
