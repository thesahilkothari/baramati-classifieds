import { absoluteUrl } from "./lib/seo";

export default function manifest() {
  return {
    name: "My Classifieds - Online Classifieds Platform",
    short_name: "My Classifieds",
    description:
      "Post and browse local classified ads for Baramati and Maharashtra.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0F3D5E",
    icons: [
      {
        src: absoluteUrl("/icon"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: absoluteUrl("/apple-icon"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: absoluteUrl("/brand/my-classifieds-icon.svg"),
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
