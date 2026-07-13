import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://myclassifieds.in"),
  title: "My Classifieds | Baramati Classified Ads",
  description:
    "Buy, sell, rent and find jobs in Baramati and Maharashtra. Post classified ads for property, vehicles, jobs, agriculture equipment and local services.",
  openGraph: {
    title: "My Classifieds | Baramati Classified Ads",
    description:
      "Local classified ads platform for Baramati and Maharashtra.",
    url: "https://myclassifieds.in",
    siteName: "My Classifieds",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
