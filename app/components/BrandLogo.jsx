import BrandMark from "./BrandMark";

export default function BrandLogo({ compact = false, inverse = false, showTagline = true }) {
  const classifiedColor = inverse ? "text-white" : "text-[#0F3D5E]";
  const taglineColor = inverse ? "text-slate-200" : "text-[#0F766E]";
  const markSize = compact ? "h-11 w-11" : "h-16 w-16";
  const brandTextSize = compact ? "text-base sm:text-lg" : "text-2xl sm:text-3xl";
  const taglineTextSize = compact ? "text-[8px] sm:text-[9px]" : "text-[10px] sm:text-xs";

  return (
    <div className="flex items-center gap-2.5 overflow-visible py-0.5">
      <BrandMark className={markSize} />
      <div className="min-w-0 overflow-visible leading-normal">
        <p className={`block whitespace-nowrap pb-0.5 font-black leading-[1.16] tracking-tight ${brandTextSize}`}>
          <span className="text-[#C2410C]">My</span>{" "}
          <span className={classifiedColor}>Classifieds</span>
        </p>
        {showTagline && (
          <p className={`block whitespace-nowrap pt-0.5 font-black uppercase leading-[1.25] tracking-[0.18em] ${taglineTextSize} ${taglineColor}`}>
            Online Classifieds Platform
          </p>
        )}
      </div>
    </div>
  );
}
