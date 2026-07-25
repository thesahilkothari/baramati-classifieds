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

export const POSTING_TERMS_LABEL =
  "Terms and Conditions for Posting a Classified";

export const POSTING_TERMS_URL = "/legal/posting-terms";

export function getPolicyEffectiveDateForDatabase() {
  return new Date(`${POLICY_EFFECTIVE_DATE}T00:00:00.000Z`);
}

export function getAllowedAdvertiserTypeValues() {
  return ADVERTISER_TYPES.map((type) => type.value);
}

export function hasAcceptedConsolidatedPostingTerms(declarations) {
  return (
    declarations?.acceptsAllTerms === true ||
    declarations?.acceptsPostingTerms === true ||
    declarations?.acceptsTermsAndConditions === true
  );
}

export function validatePostAdDeclarations(declarations) {
  const isValid = hasAcceptedConsolidatedPostingTerms(declarations);

  return {
    isValid,
    missingDeclarations: isValid
      ? []
      : [
          {
            key: "acceptsAllTerms",
            label:
              "I have read and accept all Terms and Conditions for Posting a Classified."
          }
        ]
  };
}
