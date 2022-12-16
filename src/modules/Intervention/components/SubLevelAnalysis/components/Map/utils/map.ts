import { set } from "lodash";
import type { OrgUnitSelection } from "@hisptz/dhis2-utils";

export function getOrgUnitSelectionFromOrgUnitList(orgUnits: Array<string>): OrgUnitSelection {
  const orgUnitSelection: OrgUnitSelection = {};

  if (orgUnits.includes("USER_ORGUNIT")) {
    set(orgUnitSelection, "userOrgUnit", true);

  }
  if (orgUnits.includes("USER_ORGUNIT_CHILDREN")) {
    set(orgUnitSelection, "userSubUnit", true);
  }
  if (orgUnits.includes("USER_ORGUNIT_GRANDCHILDREN")) {
    set(orgUnitSelection, "userSubX2Unit", true);
  }
  const levels = orgUnits.filter(ou => ou.match(/LEVEL-/));
  const groups = orgUnits.filter(ou => ou.match(/OU_GROUP-/));
  const orgUnitsIds = orgUnits.filter(ou => ![...levels, ...groups, "USER_ORGUNIT", "USER_ORGUNIT_CHILDREN", "USER_ORGUNIT_GRANDCHILDREN"].includes(ou));

  set(orgUnitSelection, "levels", levels.map(level => level.replaceAll(/LEVEL-/g, "")));
  set(orgUnitSelection, "groups", groups.map(level => level.replaceAll(/OU_GROUP-/g, "")));
  set(orgUnitSelection, "orgUnits", orgUnitsIds.map(ou => ({ id: ou })));

  return orgUnitSelection;

}
