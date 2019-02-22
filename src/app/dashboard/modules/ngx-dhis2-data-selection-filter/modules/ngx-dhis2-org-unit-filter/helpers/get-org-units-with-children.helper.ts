import * as _ from 'lodash';
import { getOrgUnitsByType } from './get-org-units-by-type.helper';
import { USER_ORG_UNITS } from '../constants/user-org-units.constants';

export function getOrgUnitsWithChildren(orgUnits: any[]) {
  const orgUnitLevels = getOrgUnitsByType(orgUnits, 'ORGANISATION_UNIT_LEVEL');
  const orgUnitGroups = getOrgUnitsByType(orgUnits, 'ORGANISATION_UNIT_GROUP');

  if (orgUnitLevels.length > 0 || orgUnitGroups.length > 0) {
    return orgUnits;
  }

  const userOrgUnits = getOrgUnitsByType(orgUnits, 'USER_ORGANISATION_UNIT');

  const userOrgUnitChildren = _.filter(
    userOrgUnits,
    (orgUnit: any) => orgUnit.id.indexOf('CHILDREN') !== -1
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
          type: 'ORGANISATION_UNIT_LEVEL'
        }
      ]
    : _.filter(
        [_.find(USER_ORG_UNITS, ['id', 'USER_ORGUNIT_CHILDREN'])],
        (userOrgUnit: any) => userOrgUnit
      );
}
