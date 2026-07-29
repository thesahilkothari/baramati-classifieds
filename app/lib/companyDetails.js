export const COMPANY_LEGAL_NAME = "SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED";
export const COMPANY_CIN = "U85101PN2014PTC150594";
export const COMPANY_REGISTERED_OFFICE =
  "G. NO. 42/1, Plot No 13, RUI, NEAR MOTA NAGAR, Pune, BARAMATI, Maharashtra, India, 413102";
export const COMPANY_PUBLIC_EMAIL = "connect@myclassifieds.in";
export const COMPANY_PUBLIC_PHONE = "+91 9673931166";
export const COMPANY_PUBLIC_PHONE_COMPACT = "9673931166";
export const COMPANY_GSTIN = "27AAUCS3079C1ZZ";
export const COMPANY_RULE_26_CONTACT = "Shekhar V. K.";
export const COMPANY_GRIEVANCE_OFFICER = "Shekhar V. K.";

export const COMPANY_RULE26_DISCLOSURE_EN =
  "My Classifieds is owned and operated by SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED | CIN: U85101PN2014PTC150594 | Registered Office: G. NO. 42/1, Plot No 13, RUI, NEAR MOTA NAGAR, Pune, BARAMATI, Maharashtra, India, 413102 | Support: connect@myclassifieds.in | +91 9673931166 | Grievance contact: Shekhar V. K.";

export const COMPANY_RULE26_DISCLOSURE_MR =
  "My Classifieds हे SAHIL KOTHARI ENTERPRISES PRIVATE LIMITED या कंपनीद्वारे मालकी व संचालन केले जाते | CIN: U85101PN2014PTC150594 | नोंदणीकृत कार्यालय: G. NO. 42/1, Plot No 13, RUI, NEAR MOTA NAGAR, Pune, BARAMATI, Maharashtra, India, 413102 | Support: connect@myclassifieds.in | +91 9673931166 | तक्रार संपर्क: Shekhar V. K.";

const CORPORATE_REPLACEMENTS = [
  ["U74999PN2014PTC150594", COMPANY_CIN],
  [
    "Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui, Taluka Baramati, District Pune, Maharashtra – 413133",
    COMPANY_REGISTERED_OFFICE
  ],
  [
    "Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui, Tal - Baramati, Dist - Pune, Pin - 413133",
    COMPANY_REGISTERED_OFFICE
  ],
  [
    "Vardhaman Capital, Plot No. 13, Gat no. 42/1, Mouje Rui, Tal - Baramati, Dist - Pune, Pin - 413133",
    COMPANY_REGISTERED_OFFICE
  ],
  [
    "Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui, Taluka Baramati, District Pune, Maharashtra - 413133",
    COMPANY_REGISTERED_OFFICE
  ],
  [
    "Vardhaman Capital, Plot No. 13, Gat No. 42/1, Mouje Rui, Taluka Baramati, District Pune, Maharashtra – 413133",
    COMPANY_REGISTERED_OFFICE
  ]
];

export function normalizeCorporateText(value) {
  return CORPORATE_REPLACEMENTS.reduce(
    (text, [from, to]) => text.split(from).join(to),
    String(value || "")
  );
}

export const COMPANY_POSTAL_ADDRESS_SCHEMA = {
  streetAddress: "G. NO. 42/1, Plot No 13, RUI, NEAR MOTA NAGAR",
  addressLocality: "BARAMATI",
  addressRegion: "Maharashtra",
  postalCode: "413102",
  addressCountry: "IN"
};
