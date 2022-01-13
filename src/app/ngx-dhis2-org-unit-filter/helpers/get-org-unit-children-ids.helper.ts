import * as _ from "lodash";
import { OrgUnit } from "../models/org-unit.model";
export function getOrgUnitChildrenIds(
  orgUnits: OrgUnit[],
  currentOrgUnit: OrgUnit
): string[] {
  return _.map(
    _.sortBy(
      _.filter(orgUnits, (orgUnit: OrgUnit) =>
        orgUnit && orgUnit.parent
          ? orgUnit.parent.id === currentOrgUnit.id
          : false
      ),
      "name"
    ),
    (orgUnitChild) => orgUnitChild.id
  );
}
