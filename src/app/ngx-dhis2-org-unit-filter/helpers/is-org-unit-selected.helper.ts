export function isOrgUnitSelected(orgUnitId: string, selectedOrgUnits) {
  return (selectedOrgUnits || []).some((orgUnit) => orgUnit.id === orgUnitId);
}
