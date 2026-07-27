import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "My Classifieds - Online Classifieds Platform";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

function Mark() {
  return (
    <div
      style={{
        width: 126,
        height: 126,
        borderRadius: 34,
        background: "#F8FAFC",
        border: "3px solid #CBD5E1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
        <path d="M48 5C28.7 5 13 20.7 13 40c0 26.2 35 51 35 51s35-24.8 35-51C83 20.7 67.3 5 48 5Z" fill="#0F3D5E" />
        <rect x="27" y="28" width="39" height="27" rx="5" fill="#FFFFFF" />
        <rect x="33" y="34" width="11" height="11" rx="2.5" fill="#C2410C" />
        <rect x="48" y="35" width="14" height="4" rx="2" fill="#0F3D5E" />
        <rect x="48" y="44" width="16" height="4" rx="2" fill="#0F3D5E" />
        <rect x="33" y="51" width="25" height="4" rx="2" fill="#0F3D5E" />
        <circle cx="61" cy="58" r="15" fill="#FFFFFF" stroke="#0F3D5E" strokeWidth="7" />
        <circle cx="61" cy="58" r="5" fill="#C2410C" />
        <path d="M72 69L83 80" stroke="#0F3D5E" strokeWidth="7" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function ListingCard({ top, badge, title, price, accent }) {
  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        top,
        width: 390,
        height: 112,
        borderRadius: 22,
        background: "#FFFFFF",
        border: "2px solid #CBD5E1",
        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.13)",
        display: "flex",
        gap: 16,
        padding: 14
      }}
    >
      <div
        style={{
          width: 112,
          height: 84,
          borderRadius: 16,
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0F3D5E",
          fontSize: 40,
          fontWeight: 900
        }}
      >
        ●
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            alignSelf: "flex-start",
            borderRadius: 8,
            padding: "4px 8px",
            background: accent,
            color: "#0F3D5E",
            fontSize: 13,
            fontWeight: 900
          }}
        >
          {badge}
        </div>
        <div style={{ color: "#0F172A", fontSize: 22, fontWeight: 900 }}>
          {title}
        </div>
        <div style={{ color: "#C2410C", fontSize: 20, fontWeight: 900 }}>
          {price}
        </div>
      </div>
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F8FAFC",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: 120,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(15,118,110,0.18)"
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: 82,
            background: "#0F3D5E"
          }}
        />
        <div style={{ padding: "72px 70px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Mark />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -2 }}>
                <span style={{ color: "#C2410C" }}>My</span>
                <span style={{ color: "#0F3D5E" }}> Classifieds</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  color: "#0F3D5E",
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 6
                }}
              >
                <span style={{ width: 54, height: 5, borderRadius: 3, background: "#0F766E" }} />
                ONLINE CLASSIFIEDS PLATFORM
                <span style={{ width: 54, height: 5, borderRadius: 3, background: "#0F766E" }} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 52, color: "#0F3D5E", fontSize: 60, fontWeight: 900 }}>
            Buy, Sell, Rent & Find Jobs
          </div>
          <div style={{ marginTop: 14, color: "#0F766E", fontSize: 34, fontWeight: 900 }}>
            Baramati • Maharashtra • Local Classifieds
          </div>
          <div
            style={{
              marginTop: 38,
              width: 600,
              height: 66,
              borderRadius: 18,
              background: "#FFFFFF",
              border: "2px solid #CBD5E1",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 18,
              color: "#64748B",
              fontSize: 24,
              fontWeight: 700
            }}
          >
            <span>⌕</span>
            <span>Search anything...</span>
            <span style={{ marginLeft: "auto", color: "#0F3D5E" }}>Baramati</span>
            <span
              style={{
                background: "#0F3D5E",
                color: "#FFFFFF",
                borderRadius: 12,
                padding: "12px 24px",
                fontWeight: 900
              }}
            >
              Search
            </span>
          </div>
        </div>
        <ListingCard top={158} badge="PROPERTY" title="2 BHK Duplex House" price="₹45,00,000" accent="#E0F2FE" />
        <ListingCard top={292} badge="JOBS" title="Field Sales Executive" price="₹18,000 - ₹25,000" accent="#FFEDD5" />
        <ListingCard top={426} badge="VEHICLES" title="Maruti Swift VXI" price="₹6,25,000" accent="#CCFBF1" />
        <div
          style={{
            position: "absolute",
            left: 78,
            bottom: 24,
            color: "white",
            display: "flex",
            gap: 52,
            fontSize: 18,
            fontWeight: 800
          }}
        >
          <span>Trusted & Safe</span>
          <span>Local & Relevant</span>
          <span>Mobile First</span>
          <span>Connect Directly</span>
        </div>
      </div>
    ),
    size
  );
}
