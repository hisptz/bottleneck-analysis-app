import * as _ from 'lodash';
import { User } from '@iapps/ngx-dhis2-http-client';

export function getFilteredDashboardBasedOnSharing(
  dashboards: any[],
  currentUser: User
): any[] {
  if (!dashboards || !currentUser) {
    return [];
  }

  // get user dashboards
  const userDashboards = _.filter(
    dashboards,
    (dashboard: any) => dashboard.user && dashboard.user.id === currentUser.id
  );

  // get dashboards based on user groups accesses
  const dashboardsByUserGroupsAccess = _.filter(dashboards, (dashboard: any) =>
    _.some(
      dashboard.userGroupAccesses || [],
      (userGroupAccess: any) =>
        _.filter(
          currentUser.userGroups || [],
          (userGroup: any) => userGroup.id === userGroupAccess.id
        ).length > 0
    )
  );

  // get dashboards based on user accesses
  const dashboardsByUsersAccess = _.filter(dashboards, (dashboard: any) =>
    _.some(
      dashboard.userAccesses || [],
      (userAccess: any) => userAccess.id === currentUser.id
    )
  );

  // get dashboard based on public or external access
  const dashboardsByPublicOrExternalAccess = _.filter(
    dashboards,
    (dashboard: any) =>
      dashboard.externalAccess || dashboard.publicAccess !== '--------'
  );

  return _.uniqBy(
    [
      ...userDashboards,
      ...dashboardsByUserGroupsAccess,
      ...dashboardsByUsersAccess,
      ...dashboardsByPublicOrExternalAccess
    ],
    'id'
  );
}
