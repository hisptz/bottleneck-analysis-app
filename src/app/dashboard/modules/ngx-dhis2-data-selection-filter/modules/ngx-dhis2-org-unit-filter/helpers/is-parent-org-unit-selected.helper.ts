import * as _ from 'lodash';
import { getOrgUnitsByType } from './get-org-units-by-type.helper';
export function isParentOrgUnitSelected(selectedOrgUnits: any[]) {
  const normalOrgUnits = getOrgUnitsByType(
    selectedOrgUnits,
    'ORGANISATION_UNIT'
  );

  const userOrgUnits = getOrgUnitsByType(
    selectedOrgUnits,
    'USER_ORGANISATION_UNIT'
  );

  return normalOrgUnits.length + userOrgUnits.length > 0;
}
