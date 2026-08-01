export default function BrandLogo({ compact = false }) {
  const widthClass = compact
    ? "w-[190px] sm:w-[230px]"
    : "w-[260px] sm:w-[320px] md:w-[360px]";

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-visible"
      aria-label="My Classifieds"
    >
      <img
        src="/brand/my-classifieds-logo.svg?v=official-20260730-v3"
        alt="My Classifieds - Online Classifieds Platform"
        className={`block h-auto max-w-full shrink-0 object-contain ${widthClass}`}
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
