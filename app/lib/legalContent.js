import fs from "fs/promises";
import path from "path";
import { normalizeCorporateText } from "./companyDetails";

export const POLICY_VERSION = "1.0";
export const POLICY_EFFECTIVE_DATE = "23 July 2026";

export const LEGAL_PAGES = [
  {
    slug: "terms",
    enTitle: "Terms of Use and User Agreement",
    mrTitle: "वापराच्या अटी व वापरकर्ता करार",
    file: "01-TERMS-OF-USE.md"
  },
  {
    slug: "privacy",
    enTitle: "Privacy and Cookies Policy",
    mrTitle: "गोपनीयता व कुकीज धोरण",
    file: "02-PRIVACY-AND-COOKIES.md"
  },
  {
    slug: "listing-rules",
    enTitle: "Listing Rules and Prohibited/Restricted Listings",
    mrTitle: "लिस्टिंग नियम व प्रतिबंधित/नियंत्रित जाहिरात धोरण",
    file: "03-LISTING-RULES.md"
  },
  {
    slug: "advertiser-policy",
    enTitle: "Advertiser, Seller and Service-Provider Policy",
    mrTitle: "जाहिरातदार, विक्रेता व सेवा-पुरवठादार धोरण",
    file: "04-ADVERTISER-POLICY.md"
  },
  {
    slug: "grievance",
    enTitle: "Grievance, Report Abuse and Takedown Policy",
    mrTitle: "तक्रार निवारण, Report Abuse व सामग्री काढणे धोरण",
    file: "05-GRIEVANCE-AND-TAKEDOWN.md"
  },
  {
    slug: "refunds",
    enTitle: "Paid Listings, Billing, Cancellation and Refund Policy",
    mrTitle: "सशुल्क लिस्टिंग, बिलिंग, रद्द करणे व परतावा धोरण",
    file: "06-PAID-LISTINGS-REFUNDS.md"
  },
  {
    slug: "safety",
    enTitle: "Transaction Safety and Platform Disclaimer",
    mrTitle: "व्यवहार-सुरक्षा व प्लॅटफॉर्म अस्वीकरण",
    file: "07-SAFETY-AND-DISCLAIMER.md"
  },
  {
    slug: "ip",
    enTitle: "Intellectual Property Complaint Policy",
    mrTitle: "बौद्धिक संपदा तक्रार धोरण",
    file: "08-IP-COMPLAINTS.md"
  },
  {
    slug: "ranking",
    enTitle: "Sponsored Listings and Ranking Disclosure",
    mrTitle: "प्रायोजित लिस्टिंग व क्रमवारी प्रकटीकरण",
    file: "09-RANKING-DISCLOSURE.md"
  },
  {
    slug: "ai-content",
    enTitle: "Synthetic and AI-Generated Content Policy",
    mrTitle: "कृत्रिम व AI-निर्मित सामग्री धोरण",
    file: "10-AI-CONTENT-POLICY.md"
  },
  {
    slug: "business-terms",
    enTitle: "Additional Terms for Business Advertisers",
    mrTitle: "व्यावसायिक जाहिरातदारांच्या अतिरिक्त अटी",
    file: "11-BUSINESS-ADVERTISER-TERMS.md"
  },
  {
    slug: "corporate",
    enTitle: "Legal and Corporate Information",
    mrTitle: "कायदेशीर व कॉर्पोरेट माहिती",
    file: "12-CORPORATE-INFORMATION.md"
  },
  {
    slug: "accessibility",
    enTitle: "Accessibility Statement",
    mrTitle: "सुलभता निवेदन",
    file: "13-ACCESSIBILITY.md"
  }
];

export function getLegalPage(slug) {
  return LEGAL_PAGES.find((page) => page.slug === slug) || null;
}

export function getLegalTitle(page, lang = "en") {
  return lang === "mr" ? page.mrTitle : page.enTitle;
}

export function normalizeLegalLanguage(lang) {
  return lang === "mr" ? "mr" : "en";
}

export async function readLegalMarkdown({ slug, lang = "en" }) {
  const page = getLegalPage(slug);

  if (!page) {
    return null;
  }

  const safeLang = normalizeLegalLanguage(lang);
  const filePath = path.join(
    process.cwd(),
    "content",
    "legal",
    safeLang,
    page.file
  );

  try {
    const markdown = await fs.readFile(filePath, "utf8");
    return normalizeCorporateText(markdown);
  } catch (error) {
    console.error("Legal content read failed:", error);
    return null;
  }
}
