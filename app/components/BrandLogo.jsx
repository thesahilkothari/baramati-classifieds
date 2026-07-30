export default function BrandLogo({ compact = false, inverse = false, showTagline = true, className = "" }) {
  const source = compact
    ? "/brand/my-classifieds-header-logo.svg?v=uploaded-style-20260730-v6"
    : "/brand/my-classifieds-logo.svg?v=uploaded-style-20260730-v6";

  const sizeClass = compact
    ? "h-[54px] w-auto max-w-[230px] sm:h-[62px] sm:max-w-[310px]"
    : "h-auto w-full max-w-[420px] sm:max-w-[500px]";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-visible ${className}`}
      aria-label="My Classifieds"
    >
      <img
        src={source}
        alt="My Classifieds - Online Classifieds Platform"
        className={`block shrink-0 object-contain ${sizeClass}`}
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
