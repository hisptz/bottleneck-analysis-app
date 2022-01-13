import { OrgUnit, OrgUnitFilterConfig } from "../models";
import * as _ from "lodash";

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
