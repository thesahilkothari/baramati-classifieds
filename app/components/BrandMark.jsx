export default function BrandMark({ className = "h-10 w-10", title = "My Classifieds" }) {
  return (
    <svg
      viewBox="0 0 112 112"
      role="img"
      aria-label={title}
      className={`${className} shrink-0 overflow-visible`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(8 8)">
        <path d="M24 19L64 15L73 52L32 56L24 19Z" fill="#F8FAFC" stroke="#0F3D5E" strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 24L73 24C76.3 24 79 26.7 79 30V57C79 60.3 76.3 63 73 63H26C22.7 63 20 60.3 20 57V24Z" fill="#FFFFFF" stroke="#0F3D5E" strokeWidth="4" strokeLinejoin="round" />
        <path d="M79 30C84 34.8 84 51 79 60" stroke="#0F3D5E" strokeWidth="4" strokeLinecap="round" />
        <rect x="28" y="32" width="14" height="13" rx="2" fill="#0F766E" />
        <rect x="48" y="33" width="20" height="4" rx="2" fill="#0F3D5E" />
        <rect x="48" y="42" width="20" height="4" rx="2" fill="#0F3D5E" />
        <rect x="28" y="50" width="14" height="4" rx="2" fill="#0F3D5E" />
        <rect x="48" y="51" width="16" height="4" rx="2" fill="#0F3D5E" />
        <path d="M27 76L34 62H45L41 76H27Z" fill="#0F766E" opacity="0.95" />
        <path d="M44 76L47 62H58L61 76H44Z" fill="#0F766E" opacity="0.9" />
        <path d="M64 76L60 62H71L78 76H64Z" fill="#0F766E" opacity="0.95" />
        <path d="M48 36C38.7 36 31.2 43.5 31.2 52.8C31.2 65.3 48 80.5 48 80.5S64.8 65.3 64.8 52.8C64.8 43.5 57.3 36 48 36Z" fill="#C2410C" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="48" cy="52.8" r="6.8" fill="#FFFFFF" />
        <circle cx="48" cy="52.8" r="3.2" fill="#C2410C" opacity="0.3" />
      </g>
    </svg>
  );
}
