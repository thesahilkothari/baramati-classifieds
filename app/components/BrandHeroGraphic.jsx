import BrandLogo from "./BrandLogo";
import { ALLOWED_TIER2_LOCATIONS, APPROVED_LOCATION_COUNT } from "../lib/locations";

const categoryChips = [
  { label: "Property", icon: "⌂", className: "bg-[#0F3D5E] text-white" },
  { label: "Jobs", icon: "▣", className: "bg-[#C2410C] text-white" },
  { label: "Vehicles", icon: "▰", className: "bg-[#0F766E] text-white" },
  { label: "Electronics", icon: "▯", className: "bg-[#0F3D5E] text-white" },
  { label: "Local Services", icon: "⚙", className: "bg-[#0F766E] text-white" },
  { label: "Agriculture", icon: "⚑", className: "bg-[#C2410C] text-white" }
];

const launchCityPreview = ALLOWED_TIER2_LOCATIONS.slice(0, 8);
const remainingCityCount = ALLOWED_TIER2_LOCATIONS.length - launchCityPreview.length;

const listings = [
  {
    badge: "PROPERTY",
    title: "2 BHK Duplex House",
    price: "₹45,00,000",
    accent: "bg-blue-50 text-[#0F3D5E]",
    visual: "🏠",
    city: "Baramati"
  },
  {
    badge: "JOBS",
    title: "Field Sales Executive",
    price: "₹18,000 - ₹25,000 / month",
    accent: "bg-orange-50 text-[#C2410C]",
    visual: "💼",
    city: "Satara"
  },
  {
    badge: "SERVICES",
    title: "Local Electrician Available",
    price: "Direct contact",
    accent: "bg-teal-50 text-[#0F766E]",
    visual: "🛠️",
    city: "Kolhapur"
  }
];

export default function BrandHeroGraphic() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
      <div className="absolute right-[-70px] top-16 h-56 w-56 rounded-full bg-[#0F766E]/14" />
      <div className="absolute -left-10 bottom-8 grid grid-cols-5 gap-2 opacity-25">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#0F3D5E]" />
        ))}
      </div>

      <div className="relative z-10">
        <div className="inline-flex rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#CBD5E1]">
          <BrandLogo compact />
        </div>

        <h2 className="mt-5 text-3xl font-black leading-tight text-[#0F3D5E] md:text-4xl">
          Buy, Sell, Rent & Find Jobs
        </h2>
        <p className="mt-2 text-base font-black text-[#0F766E]">
          Tier-II & Tier-III Maharashtra • Local Classifieds • Digital Yellow Page
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3 shadow-sm">
          <span className="text-2xl text-[#64748B]">⌕</span>
          <span className="flex-1 text-sm font-semibold text-[#475569]">Search anything...</span>
          <span className="hidden rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-bold text-[#0F3D5E] sm:block">
            📍 {APPROVED_LOCATION_COUNT} cities & towns
          </span>
          <span className="rounded-xl bg-[#0F3D5E] px-4 py-2 text-sm font-black text-white">
            Search
          </span>
        </div>

        <div className="mt-3 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#0F766E]">
            Current Maharashtra launch locations
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {launchCityPreview.map((city) => (
              <span
                key={city.slug}
                className="rounded-full border border-[#CBD5E1] bg-white px-2.5 py-1 text-[10px] font-black uppercase text-[#475569]"
              >
                {city.name}
              </span>
            ))}
            <span className="rounded-full border border-[#0F3D5E] bg-white px-2.5 py-1 text-[10px] font-black uppercase text-[#0F3D5E]">
              +{remainingCityCount} more
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categoryChips.map((chip) => (
            <span
              key={chip.label}
              className={`rounded-xl px-3 py-2 text-xs font-black ${chip.className}`}
            >
              {chip.icon} {chip.label}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          {listings.map((listing) => (
            <div
              key={listing.title}
              className="grid grid-cols-[82px_1fr] gap-3 rounded-2xl border border-[#CBD5E1] bg-white p-3 shadow-sm"
            >
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-[#F8FAFC] text-3xl">
                {listing.visual}
              </div>
              <div className="min-w-0">
                <span className={`rounded px-2 py-1 text-[10px] font-black ${listing.accent}`}>
                  {listing.badge}
                </span>
                <p className="mt-2 truncate text-sm font-black text-[#0F172A]">
                  {listing.title}
                </p>
                <p className="mt-1 text-xs font-black text-[#C2410C]">
                  {listing.price}
                </p>
                <p className="mt-1 text-xs text-[#475569]">📍 {listing.city}, Maharashtra</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
