import * as _ from "lodash";
export function getUserOrgUnitIds(userInfo: any, isForReport: boolean) {
  return _.uniq(
    _.map(
      isForReport
        ? userInfo.dataViewOrganisationUnits || []
        : userInfo.organisationUnits || [],
      (orgUnit) => orgUnit.id
    )
  );
}
