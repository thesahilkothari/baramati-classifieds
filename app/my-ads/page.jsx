import { cookies } from "next/headers";
import UserAdsDashboard from "../components/UserAdsDashboard";
import { getLanguageFromCookieStore } from "../lib/i18n";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "My Ads | Check Ad Status | My Classifieds",
  description:
    "Check your My Classifieds ad approval status, payment verification, expiry, renewal and sold status.",
  path: "/my-ads",
  noIndex: true
});

export default async function MyAdsPage({ searchParams }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const resolvedSearchParams = await searchParams;
  const mobile = String(resolvedSearchParams?.mobile || "");

  return (
    <main className="min-h-screen bg-slate-100 px-3 pb-24 pt-6 md:px-4 md:pb-10">
      <section className="mx-auto max-w-7xl">
        <UserAdsDashboard initialMobile={mobile} initialLanguage={language} />
      </section>
    </main>
  );
}
