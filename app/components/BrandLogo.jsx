import BrandMark from "./BrandMark";

export default function BrandLogo({ compact = false, inverse = false, showTagline = true }) {
  const classifiedColor = inverse ? "text-white" : "text-[#0F3D5E]";
  const taglineColor = inverse ? "text-slate-200" : "text-[#0F766E]";
  const markSize = compact ? "h-10 w-10 sm:h-11 sm:w-11" : "h-16 w-16";
  const brandTextSize = compact ? "text-lg sm:text-xl" : "text-3xl sm:text-4xl";
  const taglineTextSize = compact ? "text-[8px] sm:text-[9px]" : "text-[10px] sm:text-xs";

  return (
    <div className="flex items-center gap-3 overflow-visible py-1">
      <BrandMark className={`${markSize} shrink-0 overflow-visible`} />
      <div className="min-w-0 overflow-visible py-1">
        <div
          className={`block overflow-visible whitespace-nowrap pb-1 font-black leading-[1.45] tracking-tight ${brandTextSize}`}
        >
          <span className="inline-block overflow-visible align-baseline text-[#C2410C]">My</span>{" "}
          <span className={`inline-block overflow-visible align-baseline ${classifiedColor}`}>
            Classifieds
          </span>
        </div>
        {showTagline && (
          <div
            className={`block overflow-visible whitespace-nowrap pt-0.5 font-black uppercase leading-[1.6] tracking-[0.16em] ${taglineTextSize} ${taglineColor}`}
          >
            Online Classifieds Platform
          </div>
        )}
      </div>
    </div>
  );
}
