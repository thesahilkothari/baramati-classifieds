import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileBottomBar from "./components/MobileBottomBar";
import WhatsAppSupportBot from "./components/WhatsAppSupportBot";

export const metadata = {
  title: "My Classifieds | Baramati Classified Ads",
  description:
    "Post and browse local classified ads for Baramati and Maharashtra."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 pb-16 md:pb-0">
        <Header />
        {children}
        <Footer />
        <MobileBottomBar />
        <WhatsAppSupportBot />
      </body>
    </html>
  );
}
