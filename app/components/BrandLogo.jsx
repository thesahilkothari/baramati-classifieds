import BrandMark from "./BrandMark";

export default function BrandLogo({ compact = false, inverse = false }) {
  const classifiedColor = inverse ? "text-white" : "text-[#0F3D5E]";
  const taglineColor = inverse ? "text-slate-200" : "text-slate-500";

  return (
    <div className="flex items-center gap-2.5">
      <BrandMark className={compact ? "h-9 w-9" : "h-12 w-12"} />
      <div className="min-w-0 leading-none">
        <p className="truncate text-lg font-black tracking-tight sm:text-xl">
          <span className="text-[#C2410C]">My</span>{" "}
          <span className={classifiedColor}>Classifieds</span>
        </p>
        {!compact && (
          <p className={`mt-1 hidden text-[10px] font-black uppercase tracking-[0.24em] sm:block ${taglineColor}`}>
            Online Classifieds Platform
          </p>
        )}
      </div>
    </div>
  );
}
