import "./globals.css";
import { cookies } from "next/headers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileBottomBar from "./components/MobileBottomBar";
import WhatsAppSupportBot from "./components/WhatsAppSupportBot";
import { getHtmlLang, getLanguageFromCookieStore } from "./lib/i18n";

export const metadata = {
  title: "My Classifieds | Baramati Classified Ads",
  description:
    "Post and browse local classified ads for Baramati and Maharashtra."
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <html lang={getHtmlLang(language)} data-language={language}>
      <body className="bg-slate-100 pb-16 md:pb-0">
        <Header />
        {children}
        <Footer />
        <MobileBottomBar />
        <WhatsAppSupportBot initialLanguage={language} />
      </body>
    </html>
  );
}
