import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Baramati Classifieds | Buy, Sell, Rent & Jobs in Baramati",
  description:
    "Post and search classified ads in Baramati for property, jobs, vehicles, electronics, agriculture equipment and local services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Header />
        {children}
      </body>
    </html>
  );
}
