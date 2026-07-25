import { cookies } from "next/headers";
import SoldStatusForm from "../components/SoldStatusForm";
import { getLanguageFromCookieStore, t } from "../lib/i18n";

export const metadata = {
  title: "Confirm Sold Status | My Classifieds",
  description:
    "Confirm whether your listed product or service is sold or still available."
};

export default async function SoldStatusPage({ searchParams }) {
  const cookieStore = await cookies();
  const language = getLanguageFromCookieStore(cookieStore);
  const resolvedSearchParams = await searchParams;
  const adId = String(resolvedSearchParams?.adId || "");
  const mobile = String(resolvedSearchParams?.mobile || "");

  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            {language === "mr" ? "Ad Status Confirmation" : "Ad Status Confirmation"}
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">
            {t(language, "soldStatusTitle")}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            {t(language, "soldStatusIntro")}
          </p>
        </div>

        <SoldStatusForm
          initialAdId={adId}
          initialMobile={mobile}
          initialLanguage={language}
        />
      </section>
    </main>
  );
}
