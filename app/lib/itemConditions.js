export const ITEM_CONDITIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
  { value: "LIKE_NEW", label: "Like New" },
  { value: "NOT_APPLICABLE", label: "Not Applicable" }
];

export function getAllowedConditionValues() {
  return ITEM_CONDITIONS.map((condition) => condition.value);
}

export function getConditionLabel(value) {
  return (
    ITEM_CONDITIONS.find((condition) => condition.value === value)?.label ||
    "Not specified"
  );
}
