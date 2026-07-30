export default function BrandLogo({ compact = false, inverse = false, showTagline = true, className = "" }) {
  const source = "/brand/official-header-logo-uploaded.svg?v=exact-upload-20260730-v1";

  const sizeClass = compact
    ? "h-auto w-[210px] max-w-[72vw] sm:w-[265px] md:w-[300px]"
    : "h-auto w-full max-w-[560px]";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-visible ${className}`}
      aria-label="My Classifieds - Online Classifieds Platform"
    >
      <img
        src={source}
        alt="My Classifieds - Online Classifieds Platform"
        className={`block shrink-0 object-contain ${sizeClass}`}
        width="430"
        height="116"
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
