import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 512,
  height: 512
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <svg width="410" height="410" viewBox="0 0 512 512" fill="none">
          <path d="M256 48C160.5 48 83 125.5 83 221c0 129.6 173 242.5 173 242.5S429 350.6 429 221C429 125.5 351.5 48 256 48Z" fill="#0F3D5E" />
          <ellipse cx="256" cy="456" rx="88" ry="18" fill="#0F3D5E" opacity="0.18" />
          <rect x="156" y="166" width="196" height="136" rx="24" fill="white" />
          <rect x="185" y="198" width="54" height="54" rx="13" fill="#C2410C" />
          <rect x="260" y="204" width="72" height="18" rx="9" fill="#0F3D5E" />
          <rect x="260" y="244" width="78" height="18" rx="9" fill="#0F3D5E" />
          <rect x="185" y="278" width="124" height="18" rx="9" fill="#0F3D5E" />
          <circle cx="331" cy="317" r="69" fill="white" stroke="#0F3D5E" strokeWidth="30" />
          <circle cx="331" cy="317" r="23" fill="#C2410C" />
          <path d="M382 368L435 421" stroke="#0F3D5E" strokeWidth="30" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size
  );
}
