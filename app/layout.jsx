import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileBottomBar from "./components/MobileBottomBar";
import WhatsAppSupportBot from "./components/WhatsAppSupportBot";
import { getHtmlLang, getLanguageFromCookieStore } from "./lib/i18n";
import { buildPageMetadata } from "./lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap"
});

export const metadata = buildPageMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002741"
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);

  return (
    <html lang={getHtmlLang(language)} data-language={language}>
      <body className={`${inter.variable} ${plusJakarta.variable} bg-[#F8FAFC] pb-16 font-[var(--font-inter)] text-[#191C1E] antialiased md:pb-0`}>
        <Header />
        {children}
        <Footer />
        <MobileBottomBar />
        <WhatsAppSupportBot initialLanguage={language} />
      </body>
    </html>
  );
}
