import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Baramati Classifieds | Buy, Sell, Rent & Jobs in Baramati",
  description:
    "Post and search classified ads in Baramati, Pune, Mumbai, Nagpur and Nashik. Real estate, jobs, vehicles, electronics, agriculture equipment and local services.",
  keywords:
    "Baramati classifieds, Baramati jobs, Baramati property, Baramati rent, used cars Baramati, agriculture equipment Baramati"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
