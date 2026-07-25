export const ITEM_CONDITIONS = [
  {
    value: "NEW",
    label: "New",
    labelMr: "नवीन"
  },
  {
    value: "USED",
    label: "Used",
    labelMr: "वापरलेले"
  },
  {
    value: "LIKE_NEW",
    label: "Like New",
    labelMr: "नवीनसारखे"
  },
  {
    value: "NOT_APPLICABLE",
    label: "Not Applicable",
    labelMr: "लागू नाही"
  }
];

export function getAllowedConditionValues() {
  return ITEM_CONDITIONS.map((condition) => condition.value);
}

export function getConditionLabel(value, language = "en") {
  const condition = ITEM_CONDITIONS.find((item) => item.value === value);

  if (!condition) {
    return language === "mr" ? "नमूद नाही" : "Not specified";
  }

  return language === "mr" ? condition.labelMr : condition.label;
}
