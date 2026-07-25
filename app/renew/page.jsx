import RenewAdForm from "../components/RenewAdForm";

export const metadata = {
  title: "Renew or Upgrade Ad | My Classifieds",
  description:
    "Renew or upgrade your My Classifieds advertisement with paid, premium or featured options."
};

export default async function RenewPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const adId = String(resolvedSearchParams?.adId || "");
  const mobile = String(resolvedSearchParams?.mobile || "");

  return (
    <main className="bg-slate-100 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl border-2 border-slate-900 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-red-600">
            Renew / Upgrade
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase text-slate-950 md:text-5xl">
            Renew or Upgrade Your Classified
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
            Choose Paid or Premium visibility and optionally add Featured
            placement. Submit the UPI transaction reference and admin will apply
            the plan after verification.
          </p>
        </div>

        <RenewAdForm initialAdId={adId} initialMobile={mobile} />
      </section>
    </main>
  );
}
