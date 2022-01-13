import * as _ from "lodash";
import { getOrgUnitsByType } from "./get-org-units-by-type.helper";
import { USER_ORG_UNITS } from "../constants/user-org-units.constants";
import { OrgUnitTypes } from "../constants/org-unit-types.constants";

export function getOrgUnitsWithChildren(orgUnits: any[]) {
  const orgUnitLevels = getOrgUnitsByType(
    orgUnits,
    OrgUnitTypes.ORGANISATION_UNIT_LEVEL
  );
  const orgUnitGroups = getOrgUnitsByType(
    orgUnits,
    OrgUnitTypes.ORGANISATION_UNIT_GROUP
  );

  if (orgUnitLevels.length > 0 || orgUnitGroups.length > 0) {
    return orgUnits;
  }

  const userOrgUnits = getOrgUnitsByType(
    orgUnits,
    OrgUnitTypes.USER_ORGANISATION_UNIT
  );

  const userOrgUnitChildren = _.filter(
    userOrgUnits,
    (orgUnit: any) => orgUnit.id.indexOf("CHILDREN") !== -1
  );

  if (userOrgUnitChildren.length > 0) {
    return orgUnits;
  }

  const highestOrgUnitLevel = _.min(
    _.filter(_.map(orgUnits, (item: any) => item.level))
  );

  return highestOrgUnitLevel
    ? [
        ...orgUnits,
        {
          id: `LEVEL-${highestOrgUnitLevel + 1}`,
          name: `Level ${highestOrgUnitLevel + 1}`,
          type: OrgUnitTypes.ORGANISATION_UNIT_LEVEL,
        },
      ]
    : _.filter(
        [_.find(USER_ORG_UNITS, ["id", "USER_ORGUNIT_CHILDREN"])],
        (userOrgUnit: any) => userOrgUnit
      );
}
