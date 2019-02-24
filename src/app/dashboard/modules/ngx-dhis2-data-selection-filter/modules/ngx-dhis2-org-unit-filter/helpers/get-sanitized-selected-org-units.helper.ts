import { isParentOrgUnitSelected } from './is-parent-org-unit-selected.helper';
import { USER_ORG_UNITS } from '../constants/user-org-units.constants';

export function getSanitizedSelectedOrgUnits(selectedOrgUnits: any[]) {
  return isParentOrgUnitSelected(selectedOrgUnits)
    ? selectedOrgUnits
    : (USER_ORG_UNITS || [])[0]
    ? [USER_ORG_UNITS[0], ...selectedOrgUnits]
    : selectedOrgUnits;
}
