import * as _ from "lodash";
import { getOrgUnitsByType } from "./get-org-units-by-type.helper";
import { OrgUnitTypes } from "../constants/org-unit-types.constants";
export function isParentOrgUnitSelected(selectedOrgUnits: any[]) {
  const normalOrgUnits = getOrgUnitsByType(
    selectedOrgUnits,
    OrgUnitTypes.ORGANISATION_UNIT
  );

  const userOrgUnits = getOrgUnitsByType(
    selectedOrgUnits,
    OrgUnitTypes.USER_ORGANISATION_UNIT
  );

  return normalOrgUnits.length + userOrgUnits.length > 0;
}
