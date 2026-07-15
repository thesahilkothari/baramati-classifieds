export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"]
      }
    ],
    sitemap: "https://myclassifieds.in/sitemap.xml",
    host: "https://myclassifieds.in"
  };
}
