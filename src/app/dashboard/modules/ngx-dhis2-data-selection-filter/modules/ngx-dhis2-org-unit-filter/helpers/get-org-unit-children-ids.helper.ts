import * as _ from 'lodash';
import { OrgUnit } from '../models';
export function getOrgUnitChildrenIds(
  orgUnits: OrgUnit[],
  currentOrgUnit: OrgUnit
): string[] {
  return _.map(
    _.filter(orgUnits, (orgUnit: OrgUnit) => {
      const splitedPath = orgUnit.path.split('/');
      return splitedPath[splitedPath.length - 2] === currentOrgUnit.id;
    }),
    orgUnitChild => orgUnitChild.id
  );
}
