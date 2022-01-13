import { OrgUnit } from "../models/org-unit.model";

export function updateOrgUnitListWithSelectionStatus(
  orgUnits: OrgUnit[],
  selectedOrgUnits: any[]
) {
  return (orgUnits || []).map((orgUnit: OrgUnit) => {
    return {
      ...orgUnit,
      selected: (selectedOrgUnits || []).some(
        (selectedOrgUnit: any) => selectedOrgUnit.id === orgUnit.id
      ),
    };
  });
}
