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
        <svg width="430" height="430" viewBox="0 0 512 512" fill="none">
          <path d="M128 104L342 82L390 278L171 300L128 104Z" fill="#F8FAFC" stroke="#0F3D5E" strokeWidth="18" strokeLinejoin="round" />
          <path d="M108 132H390C408 132 422 146 422 164V306C422 324 408 338 390 338H140C122 338 108 324 108 306V132Z" fill="#FFFFFF" stroke="#0F3D5E" strokeWidth="22" strokeLinejoin="round" />
          <path d="M422 164C448 190 448 274 422 316" stroke="#0F3D5E" strokeWidth="22" strokeLinecap="round" />
          <rect x="150" y="174" width="74" height="68" rx="10" fill="#0F766E" />
          <rect x="254" y="180" width="108" height="21" rx="10.5" fill="#0F3D5E" />
          <rect x="254" y="227" width="104" height="21" rx="10.5" fill="#0F3D5E" />
          <rect x="150" y="270" width="76" height="21" rx="10.5" fill="#0F3D5E" />
          <rect x="254" y="274" width="86" height="21" rx="10.5" fill="#0F3D5E" />
          <path d="M145 422L184 338H242L221 422H145Z" fill="#0F766E" />
          <path d="M236 422L252 338H310L326 422H236Z" fill="#0F766E" opacity="0.92" />
          <path d="M342 422L321 338H379L418 422H342Z" fill="#0F766E" />
          <path d="M256 196C207 196 167 236 167 285C167 351 256 432 256 432S345 351 345 285C345 236 305 196 256 196Z" fill="#C2410C" stroke="#FFFFFF" strokeWidth="24" strokeLinejoin="round" />
          <circle cx="256" cy="285" r="37" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    size
  );
}
