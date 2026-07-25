import { absoluteUrl, defaultSeo } from "../lib/seo";

export default function StructuredData({ type = "website", data = {} }) {
  const schema =
    type === "organization"
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED",
          alternateName: "My Classifieds",
          url: absoluteUrl("/"),
          email: "connect@myclassifieds.in",
          telephone: "+91 9673931166",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui",
            addressLocality: "Baramati",
            addressRegion: "Maharashtra",
            postalCode: "413133",
            addressCountry: "IN"
          },
          ...data
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: defaultSeo.siteName,
          url: absoluteUrl("/"),
          potentialAction: {
            "@type": "SearchAction",
            target: `${absoluteUrl("/ads")}?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          ...data
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
