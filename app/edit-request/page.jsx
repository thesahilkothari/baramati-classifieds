import { cookies } from "next/headers";
import EditRequestForm from "../components/EditRequestForm";
import { getLanguageFromCookieStore } from "../lib/i18n";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Request Ad Edit | My Classifieds",
  description:
    "Request correction or update for your My Classifieds advertisement.",
  path: "/edit-request",
  noIndex: true
});

export default async function EditRequestPage({ searchParams }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const resolvedSearchParams = await searchParams;

  const adId = String(resolvedSearchParams?.adId || "");
  const mobile = String(resolvedSearchParams?.mobile || "");
  const email = String(resolvedSearchParams?.email || "");

  return (
    <main className="min-h-screen bg-slate-100 px-3 pb-24 pt-6 md:px-4 md:pb-10">
      <section className="mx-auto max-w-5xl">
        <EditRequestForm
          initialAdId={adId}
          initialMobile={mobile}
          initialEmail={email}
          initialLanguage={language}
        />
      </section>
    </main>
  );
}
