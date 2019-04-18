import * as _ from 'lodash';

import { User } from '../../models';

export function getDashboardAccess(dashboard: any, currentUser: User) {
  let hasAccess = false;
  let manageSharing = false;
  if (dashboard && currentUser) {
    // check if user can manage sharing
    manageSharing = currentUser.isSuperUser;

    if (
      (dashboard.user && dashboard.user.id === currentUser.id) ||
      dashboard.publicAccess === 'rw-------' ||
      _.some(
        dashboard.userAccesses || [],
        (userAccess: any) =>
          userAccess.id === currentUser.id && userAccess.access === 'rw------'
      ) ||
      _.some(
        dashboard.userGroupAccesses || [],
        (userGroupAccess: any) =>
          _.filter(
            currentUser.userGroups || [],
            (userGroup: any) =>
              userGroup.id === userGroupAccess.id &&
              userGroup.access === 'rw------'
          ).length > 0
      ) ||
      !dashboard.user
    ) {
      hasAccess = true;
    }
  }

  return {
    delete: hasAccess,
    externalize: hasAccess,
    manage: hasAccess,
    manageSharing,
    read: hasAccess,
    update: hasAccess,
    write: hasAccess
  };
}
