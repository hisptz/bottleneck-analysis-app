
import * as _ from "lodash";
import { OrgUnitFilterConfig } from "../models/org-unit-filter-config.model";
import { OrgUnit } from "../models/org-unit.model";

export function updateOrgUnitListWithTouchedOrgUnit(
  orgUnits: OrgUnit[],
  touchedOrgUnit: OrgUnit,
  orgUnitFilterConfig: OrgUnitFilterConfig
) {
  const orgUnitIndex = orgUnits.indexOf(touchedOrgUnit);

  if (orgUnitIndex !== -1) {
    if (orgUnitFilterConfig && !orgUnitFilterConfig.singleSelection) {
      return [
        ..._.slice(orgUnits, 0, orgUnitIndex),
        { ...touchedOrgUnit, selected: !touchedOrgUnit.selected },
        ..._.slice(orgUnits, orgUnitIndex + 1),
      ];
    } else if (orgUnitFilterConfig && orgUnitFilterConfig.singleSelection) {
      return _.map(orgUnits, (orgUnit: OrgUnit) => {
        return orgUnit.id !== touchedOrgUnit.id
          ? { ...orgUnit, selected: false }
          : { ...orgUnit, selected: !orgUnit.selected };
      });
    }
  }

  return orgUnits;
}
