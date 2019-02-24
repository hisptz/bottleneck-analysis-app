import * as _ from 'lodash';
import { getOrgUnitsByType } from './get-org-units-by-type.helper';
import { USER_ORG_UNITS } from '../constants/user-org-units.constants';

export function getOrgUnitsWithoutChildrenAndGroups(orgUnits: any[]) {
  const normalOrgUnits = getOrgUnitsByType(orgUnits, 'ORGANISATION_UNIT');
  if (normalOrgUnits.length > 0) {
    return normalOrgUnits;
  }

  const userOrgUnits = _.filter(
    getOrgUnitsByType(orgUnits, 'USER_ORGANISATION_UNIT') || [],
    (orgUnit: any) => orgUnit && orgUnit.id.indexOf('CHILDREN') === -1
  );

  const userOrgUnit = _.find(USER_ORG_UNITS, ['id', 'USER_ORGUNIT']);

  return userOrgUnits.length > 0
    ? userOrgUnits
    : userOrgUnit
    ? [userOrgUnit]
    : [];
}
