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
        src="/brand/my-classifieds-logo.svg?v=tagline-clean-20260801-v1"
        alt="My Classifieds - Online Classifieds Platform"
        className={`block h-auto max-w-full shrink-0 object-contain ${widthClass}`}
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
