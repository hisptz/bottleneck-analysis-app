export function getOrgUnitSelection(selectedOrgUnitItems: any[]) {
  return {
    dimension: "ou",
    items: selectedOrgUnitItems || [],
    changed: true,
  };
}
