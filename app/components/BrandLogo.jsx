import BrandMark from "./BrandMark";

export default function BrandLogo({ compact = false, inverse = false, showTagline = true }) {
  const classifiedColor = inverse ? "text-white" : "text-[#0F3D5E]";
  const taglineColor = inverse ? "text-slate-200" : "text-[#0F766E]";
  const markSize = compact ? "h-10 w-10" : "h-14 w-14";
  const brandTextSize = compact ? "text-base sm:text-lg" : "text-2xl sm:text-3xl";
  const taglineTextSize = compact ? "text-[8px] sm:text-[9px]" : "text-[10px] sm:text-xs";

  return (
    <div className="flex items-center gap-2.5">
      <BrandMark className={markSize} />
      <div className="min-w-0 leading-none">
        <p className={`truncate font-black tracking-tight ${brandTextSize}`}>
          <span className="text-[#C2410C]">My</span>{" "}
          <span className={classifiedColor}>Classifieds</span>
        </p>
        {showTagline && (
          <p className={`mt-1 truncate font-black uppercase tracking-[0.18em] ${taglineTextSize} ${taglineColor}`}>
            Online Classifieds Platform
          </p>
        )}
      </div>
    </div>
  );
}
