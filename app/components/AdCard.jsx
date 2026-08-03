import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  Car,
  Clock,
  GraduationCap,
  Heart,
  Laptop,
  MapPin,
  ShieldCheck,
  Sprout,
  Store,
  Tag,
  Wrench
} from "lucide-react";
import { t } from "../lib/i18n";
import { mapAdToCard } from "../lib/redesign/adViewModel";

function getCategoryIcon(slug) {
  const normalized = String(slug || "").toLowerCase();

  if (normalized.includes("real") || normalized.includes("property")) return Building2;
  if (normalized.includes("job")) return BriefcaseBusiness;
  if (normalized.includes("vehicle") || normalized.includes("car")) return Car;
  if (normalized.includes("electronic")) return Laptop;
  if (normalized.includes("agriculture")) return Sprout;
  if (normalized.includes("education")) return GraduationCap;
  if (normalized.includes("service")) return Wrench;
  if (normalized.includes("business")) return Store;

  return Tag;
}

function getPrimaryBadge(card, language) {
  if (card.isFeatured && !card.isBusinessAnnual) return t(language, "featured");
  if (card.isBusinessAnnual) return "Annual";
  if (card.isPremium) return "Premium";
  return "Classified";
}

export default function AdCard({ ad, language = "en" }) {
  const card = mapAdToCard(ad, language);
  const Icon = getCategoryIcon(card.categorySlug);
  const primaryBadge = getPrimaryBadge(card, language);

  return (
    <article className="group relative flex h-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(15,61,94,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(15,61,94,0.10)]">
      <div className="flex w-full flex-col">
        <Link href={card.href} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#F2F4F6]">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top_left,#CEE5FF,transparent_38%),linear-gradient(135deg,#F8FAFC,#E0E3E5)] px-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#002741] shadow-sm">
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </span>
                <span className="mt-3 line-clamp-2 text-xs font-black uppercase tracking-wide text-[#002741]/70">
                  {card.category}
                </span>
              </div>
            )}

            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black uppercase text-white backdrop-blur-md">
              <Tag className="h-3 w-3 text-[#F59E0B]" />
              {primaryBadge}
            </span>

            <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#64748B] shadow-sm backdrop-blur-md">
              <Heart className="h-4 w-4" />
            </span>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="font-[var(--font-inter)] text-xl font-black tracking-wide text-[#002741]">
              {card.price}
            </p>
            {card.isVerified && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E6FFFA] px-2 py-1 text-[10px] font-black uppercase text-[#0F766E]">
                <ShieldCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          <Link href={card.href} className="mt-2 block">
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#191C1E] transition group-hover:text-[#002741]">
              {card.title}
            </h3>
          </Link>

          {card.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#64748B]">
              {card.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3 text-[11px] font-bold text-[#72777E]">
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FD6B36]" />
              <span className="truncate">{card.location}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 uppercase text-[#94A3B8]">
              <Clock className="h-3.5 w-3.5" />
              {card.postedAgo}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <Link
              href={card.href}
              className="rounded-full bg-[#002741] px-4 py-2.5 text-center text-xs font-black uppercase text-white transition hover:bg-[#0F3D5E]"
            >
              {t(language, "view")}
            </Link>
            <Link
              href={`/report?adId=${ad.id}&adSlug=${ad.slug}&source=card`}
              className="rounded-full border border-[#E2E8F0] px-3 py-2.5 text-xs font-black uppercase text-[#B91C1C] transition hover:bg-red-50"
            >
              Report
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
