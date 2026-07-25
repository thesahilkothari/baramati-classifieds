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
          "/post-ad",
          "/pricing",
          "/support",
          "/legal",
          "/my-ads"
        ],
        disallow: [
          "/admin",
          "/api",
          "/renew",
          "/sold-status"
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
