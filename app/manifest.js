import { absoluteUrl } from "./lib/seo";

export default function manifest() {
  return {
    name: "My Classifieds",
    short_name: "Classifieds",
    description:
      "Post and browse local classified ads for Baramati and Maharashtra.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f1f5f9",
    theme_color: "#dc2626",
    icons: [
      {
        src: absoluteUrl("/favicon.ico"),
        sizes: "48x48",
        type: "image/x-icon"
      }
    ]
  };
}
