import * as _ from 'lodash';
export function getOrgUnitsByType(orgUnits, orgUnitType: string) {
  return _.filter(
    orgUnits || [],
    (orgUnit: any) => orgUnit.type === orgUnitType
  );
}
