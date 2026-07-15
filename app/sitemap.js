export default function sitemap() {
  const baseUrl = "https://myclassifieds.in";

  const routes = [
    "",
    "/ads",
    "/post-ad",
    "/pricing",
    "/safety",
    "/contact",
    "/terms",
    "/privacy",
    "/refund",
    "/disclaimer",
    "/category/real-estate",
    "/category/jobs",
    "/category/vehicles",
    "/category/electronics",
    "/category/agriculture-equipment",
    "/category/local-services"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
