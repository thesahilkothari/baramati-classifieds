export default function BrandLogo({ compact = false, inverse = false, showTagline = true }) {
  const sizeClass = compact
    ? "h-[52px] w-auto max-w-[220px] sm:h-[58px] sm:max-w-[280px]"
    : "h-auto w-[260px] max-w-full sm:w-[360px] md:w-[460px]";

  return (
    <span className="inline-flex shrink-0 items-center overflow-visible" aria-label="My Classifieds">
      <img
        src="/brand/my-classifieds-logo.svg?v=official-20260730-v2"
        alt="My Classifieds - Online Classifieds Platform"
        className={`block shrink-0 object-contain ${sizeClass}`}
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
