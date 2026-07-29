import { ImageResponse } from "next/og";
import { APPROVED_LOCATION_COUNT } from "./lib/locations";

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
        <path d="M47 6C32 6 20 18 20 33c0 22 27 49 27 49s27-27 27-49C74 18 62 6 47 6Z" fill="#0F3D5E" />
        <path d="M31 20h31v31H31z" fill="#FFFFFF" />
        <rect x="35" y="25" width="9" height="9" rx="2" fill="#C2410C" />
        <rect x="48" y="26" width="12" height="3" rx="1.5" fill="#0F3D5E" />
        <rect x="48" y="34" width="14" height="3" rx="1.5" fill="#0F3D5E" />
        <rect x="35" y="42" width="20" height="3" rx="1.5" fill="#0F3D5E" />
        <path d="M61 78c7.732 0 14-6.268 14-14s-6.268-14-14-14-14 6.268-14 14 6.268 14 14 14Z" fill="#FFFFFF" stroke="#0F3D5E" strokeWidth="7" />
        <path d="M72 74l12 12" stroke="#0F3D5E" strokeWidth="7" strokeLinecap="round" />
        <circle cx="61" cy="64" r="4" fill="#C2410C" />
        <path d="M34 53h34l-6 7H40l-6-7Z" fill="#0F766E" />
      </svg>
    </div>
  );
}

function ListingCard({ top, badge, title, price, accent, city }) {
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
        ●
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
          <div style={{ marginTop: 42, color: "#0F3D5E", fontSize: 58, fontWeight: 900 }}>
            Buy, Sell, Rent & Find Jobs
          </div>
          <div style={{ marginTop: 14, color: "#0F766E", fontSize: 30, fontWeight: 900 }}>
            Tier-II & Tier-III Maharashtra • {APPROVED_LOCATION_COUNT} Cities & Towns
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
            <span style={{ marginLeft: "auto", color: "#0F3D5E" }}>{APPROVED_LOCATION_COUNT} locations</span>
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
            Baramati • Satara • Sangli • Kolhapur • Nashik • Solapur • Ahilyanagar • Marathwada • Vidarbha • Konkan
          </div>
        </div>
        <ListingCard top={142} badge="PROPERTY" title="2 BHK Duplex House" price="₹45,00,000" city="Baramati" accent="#E0F2FE" />
        <ListingCard top={282} badge="JOBS" title="Field Sales Executive" price="₹18,000 - ₹25,000" city="Satara" accent="#FFEDD5" />
        <ListingCard top={422} badge="SERVICES" title="Local Electrician" price="Direct contact" city="Kolhapur" accent="#CCFBF1" />
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
