export const ACTIVE_POLICY_VERSION = "1.0";

export const POLICY_EFFECTIVE_DATE = "2026-07-23";

export const POLICY_EFFECTIVE_DATE_LABEL = "23 July 2026";

export const ADVERTISER_TYPES = [
  {
    value: "OWNER",
    label: "Owner / Seller"
  },
  {
    value: "BROKER_AGENT",
    label: "Broker / Agent / Dealer"
  },
  {
    value: "SERVICE_PROVIDER",
    label: "Service Provider"
  },
  {
    value: "EMPLOYER_RECRUITER",
    label: "Employer / Recruiter"
  },
  {
    value: "OTHER",
    label: "Other"
  }
];

export const REQUIRED_POST_AD_DECLARATIONS = [
  {
    key: "isAdult",
    label: "I confirm that I am 18 years of age or older."
  },
  {
    key: "hasAuthority",
    label:
      "I confirm that I have lawful authority to post this classified advertisement."
  },
  {
    key: "truthfulInfo",
    label:
      "I confirm that the information submitted by me is true, accurate and not misleading."
  },
  {
    key: "notProhibited",
    label:
      "I confirm that this advertisement does not relate to any illegal, prohibited, infringing, fraudulent or unsafe item, service or activity."
  },
  {
    key: "acceptsTerms",
    label: "I accept the Terms of Use of My Classifieds."
  },
  {
    key: "acceptsPrivacy",
    label: "I accept the Privacy Policy of My Classifieds."
  },
  {
    key: "acceptsRefundPolicy",
    label: "I accept the Refund and Cancellation Policy."
  },
  {
    key: "acceptsListingRules",
    label: "I accept the Listing Rules and Prohibited Content Policy."
  },
  {
    key: "acceptsModeration",
    label:
      "I understand that submission/payment does not guarantee publication and the advertisement may be rejected, edited, removed or expired as per platform policy."
  },
  {
    key: "acceptsContactDisplay",
    label:
      "I consent to the display/use of my submitted contact details for buyer/user responses and platform support in relation to this advertisement."
  }
];

export function getPolicyEffectiveDateForDatabase() {
  return new Date(`${POLICY_EFFECTIVE_DATE}T00:00:00.000Z`);
}

export function getAllowedAdvertiserTypeValues() {
  return ADVERTISER_TYPES.map((type) => type.value);
}

export function validatePostAdDeclarations(declarations) {
  const missingDeclarations = REQUIRED_POST_AD_DECLARATIONS.filter(
    (item) => declarations?.[item.key] !== true
  );

  return {
    isValid: missingDeclarations.length === 0,
    missingDeclarations
  };
}
