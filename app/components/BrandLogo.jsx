import BrandMark from "./BrandMark";

export default function BrandLogo({ compact = false, inverse = false, showTagline = true }) {
  const classifiedColor = inverse ? "text-white" : "text-[#0F3D5E]";
  const taglineColor = inverse ? "text-slate-200" : "text-[#0F766E]";
  const markSize = compact ? "h-10 w-10" : "h-16 w-16";
  const brandTextSize = compact ? "text-lg sm:text-xl" : "text-3xl sm:text-4xl";
  const shouldShowTagline = !compact && showTagline;

  return (
    <div className="flex items-center gap-3 overflow-visible">
      <BrandMark className={`${markSize} shrink-0 overflow-visible`} />
      <div className="min-w-0 overflow-visible">
        <div
          className={`block overflow-visible whitespace-nowrap font-black leading-[1.8] tracking-tight ${brandTextSize}`}
        >
          <span className="inline-block overflow-visible align-middle text-[#C2410C]">My</span>{" "}
          <span className={`inline-block overflow-visible align-middle ${classifiedColor}`}>
            Classifieds
          </span>
        </div>
        {shouldShowTagline && (
          <div
            className={`mt-1 block overflow-visible whitespace-nowrap text-xs font-black uppercase leading-[1.9] tracking-[0.18em] ${taglineColor}`}
          >
            Online Classifieds Platform
          </div>
        )}
      </div>
    </div>
  );
}
