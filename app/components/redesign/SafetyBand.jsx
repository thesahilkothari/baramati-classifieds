import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";

export default function SafetyBand({ activeAdsCount = 0 }) {
  return (
    <section className="bg-[#F8FAFC] px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[1fr_340px]">
        <article className="relative overflow-hidden rounded-2xl bg-[#002741] p-5 text-white shadow-[0_4px_12px_rgba(15,61,94,0.08)] md:p-7">
          <div className="relative z-10 max-w-2xl">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/75">
              <ShieldCheck className="h-4 w-4 text-[#F59E0B]" />
              Safety First
            </p>
            <h2 className="mt-2 font-[var(--font-plus-jakarta)] text-xl font-black leading-tight md:text-2xl">
              Never share OTP, UPI PIN, banking password or advance payment details blindly.
            </h2>
            <Link
              href="/safety"
              className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-xs font-black uppercase text-[#002741] hover:bg-[#CEE5FF]"
            >
              Read Safety Tips
            </Link>
          </div>
          <ShieldCheck className="absolute -right-7 -top-9 h-40 w-40 text-white/10" strokeWidth={1.5} />
        </article>

        <article className="rounded-2xl bg-[#FD6B36] p-5 text-white shadow-[0_4px_12px_rgba(15,61,94,0.08)] md:p-7">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/90">
            <MapPin className="h-4 w-4" />
            Live Near You
          </p>
          <h2 className="mt-2 font-[var(--font-plus-jakarta)] text-xl font-black leading-tight">
            Fresh local recommendations in Baramati and Maharashtra
          </h2>
          <p className="mt-2 text-sm font-bold text-white/90">
            {activeAdsCount.toLocaleString("en-IN")} active advertisement{activeAdsCount === 1 ? "" : "s"} visible now
          </p>
        </article>
      </div>
    </section>
  );
}
