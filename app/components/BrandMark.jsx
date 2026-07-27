export default function BrandMark({ className = "h-10 w-10", title = "My Classifieds" }) {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48 5C28.7 5 13 20.7 13 40c0 26.2 35 51 35 51s35-24.8 35-51C83 20.7 67.3 5 48 5Z"
        fill="#0F3D5E"
      />
      <ellipse cx="48" cy="88" rx="18" ry="4" fill="#0F3D5E" opacity="0.22" />
      <rect x="27" y="28" width="39" height="27" rx="5" fill="#FFFFFF" />
      <rect x="33" y="34" width="11" height="11" rx="2.5" fill="#C2410C" />
      <rect x="48" y="35" width="14" height="4" rx="2" fill="#0F3D5E" />
      <rect x="48" y="44" width="16" height="4" rx="2" fill="#0F3D5E" />
      <rect x="33" y="51" width="25" height="4" rx="2" fill="#0F3D5E" />
      <circle cx="61" cy="58" r="15" fill="#FFFFFF" stroke="#0F3D5E" strokeWidth="7" />
      <circle cx="61" cy="58" r="5" fill="#C2410C" />
      <path d="M72 69L83 80" stroke="#0F3D5E" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}
