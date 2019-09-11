import { map as _map } from 'lodash';
import { User } from '@iapps/ngx-dhis2-http-client';

export function getDefaultOrgUnits(
  currentUser: User,
  dashboardPreferences: any
) {
  return dashboardPreferences.startWithDynamicOrgUnits
    ? [
        {
          id: 'USER_ORGUNIT',
          name: 'User Org unit',
          type: 'USER_ORGANISATION_UNIT'
        }
      ]
    : _map(
        currentUser.dataViewOrganisationUnits.length > 0
          ? currentUser.dataViewOrganisationUnits
          : currentUser.organisationUnits,
        (orgUnit: any) => {
          return {
            ...orgUnit,
            type: 'ORGANISATION_UNIT'
          };
        }
      );
}
