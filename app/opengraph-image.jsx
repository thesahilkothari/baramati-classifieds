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
        width: 136,
        height: 136,
        borderRadius: 34,
        background: "#FFFFFF",
        border: "3px solid #CBD5E1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <svg width="110" height="110" viewBox="0 0 96 96" fill="none">
        <path d="M24 19L64 15L73 52L32 56L24 19Z" fill="#F8FAFC" stroke="#0F3D5E" strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 24L73 24C76.3 24 79 26.7 79 30V57C79 60.3 76.3 63 73 63H26C22.7 63 20 60.3 20 57V24Z" fill="#FFFFFF" stroke="#0F3D5E" strokeWidth="4" strokeLinejoin="round" />
        <path d="M79 30C84 34.8 84 51 79 60" stroke="#0F3D5E" strokeWidth="4" strokeLinecap="round" />
        <rect x="28" y="32" width="14" height="13" rx="2" fill="#0F766E" />
        <rect x="48" y="33" width="20" height="4" rx="2" fill="#0F3D5E" />
        <rect x="48" y="42" width="20" height="4" rx="2" fill="#0F3D5E" />
        <rect x="28" y="50" width="14" height="4" rx="2" fill="#0F3D5E" />
        <rect x="48" y="51" width="16" height="4" rx="2" fill="#0F3D5E" />
        <path d="M27 76L34 62H45L41 76H27Z" fill="#0F766E" />
        <path d="M44 76L47 62H58L61 76H44Z" fill="#0F766E" opacity="0.9" />
        <path d="M64 76L60 62H71L78 76H64Z" fill="#0F766E" />
        <path d="M48 36C38.7 36 31.2 43.5 31.2 52.8C31.2 65.3 48 80.5 48 80.5S64.8 65.3 64.8 52.8C64.8 43.5 57.3 36 48 36Z" fill="#C2410C" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="48" cy="52.8" r="6.8" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

function ListingCard({ top, badge, title, price, accent, city, icon }) {
  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        top,
        width: 390,
        height: 118,
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
          height: 90,
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
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
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
        <div style={{ color: "#0F172A", fontSize: 21, fontWeight: 900 }}>
          {title}
        </div>
        <div style={{ color: "#C2410C", fontSize: 18, fontWeight: 900 }}>
          {price}
        </div>
        <div style={{ color: "#475569", fontSize: 14, fontWeight: 700 }}>
          {city}, Maharashtra
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
        <div style={{ padding: "54px 70px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Mark />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: -2 }}>
                <span style={{ color: "#C2410C" }}>My</span>
                <span style={{ color: "#0F3D5E" }}> Classifieds</span>
              </div>
              <div
                style={{
                  color: "#0F766E",
                  fontSize: 25,
                  fontWeight: 900,
                  letterSpacing: 5,
                  marginTop: 6
                }}
              >
                Online Classifieds Platform
              </div>
            </div>
          </div>
          <div style={{ marginTop: 42, color: "#0F3D5E", fontSize: 58, fontWeight: 900 }}>
            Buy, Sell, Rent & Find Jobs
          </div>
          <div style={{ marginTop: 14, color: "#0F766E", fontSize: 31, fontWeight: 900 }}>
            Tier-2 Maharashtra • 13 Launch Cities • Local Classifieds
          </div>
          <div
            style={{
              marginTop: 34,
              width: 640,
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
            <span style={{ marginLeft: "auto", color: "#0F3D5E" }}>13 cities</span>
            <span
              style={{
                background: "#C2410C",
                color: "#FFFFFF",
                borderRadius: 12,
                padding: "12px 24px",
                fontWeight: 900
              }}
            >
              Search
            </span>
          </div>
          <div
            style={{
              marginTop: 24,
              color: "#475569",
              fontSize: 20,
              fontWeight: 800,
              width: 700,
              lineHeight: 1.35
            }}
          >
            Baramati • Phaltan • Akluj • Solapur • Karad • Satara • Sangli • Indapur • Daund • Shirur • Nashik • Sambhajinagar • Ahilyanagar
          </div>
        </div>
        <ListingCard top={142} badge="PROPERTY" title="2 BHK Duplex House" price="₹45,00,000" city="Baramati" accent="#E0F2FE" icon="⌂" />
        <ListingCard top={282} badge="JOBS" title="Field Sales Executive" price="₹18,000 - ₹25,000" city="Satara" accent="#FFEDD5" icon="▣" />
        <ListingCard top={422} badge="VEHICLES" title="Maruti Swift VXI" price="₹6,25,000" city="Phaltan" accent="#CCFBF1" icon="▰" />
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
          <span>Trusted & Secure</span>
          <span>Local & Relevant</span>
          <span>Mobile First</span>
          <span>Connect Directly</span>
        </div>
      </div>
    ),
    size
  );
}
