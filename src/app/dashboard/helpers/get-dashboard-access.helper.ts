import { User } from '@iapps/ngx-dhis2-http-client';
import * as _ from 'lodash';
import { SharingAccess } from 'src/app/shared/constants/sharing-access.constant';

import { isDashboardUser } from './is-dashboard-user.helper';
import { isSuperUser } from './is-super-user.helper';

export function getDashboardAccess(dashboard: any, currentUser: User) {
  const dashboardUser = isDashboardUser(dashboard.user, currentUser);

  if (dashboardUser || isSuperUser(currentUser)) {
    return {
      delete: true,
      externalize: true,
      manage: true,
      manageSharing: true,
      read: true,
      update: true,
      write: true,
    };
  }

  let accessEntity = {
    delete: false,
    externalize: false,
    manage: false,
    manageSharing: false,
    read: false,
    update: false,
    write: false,
  };

  const currentUserFromUserList = _.find(dashboard.userAccesses, [
    'id',
    currentUser.id,
  ]);

  if (currentUserFromUserList) {
    if (currentUserFromUserList.access === SharingAccess.CAN_VIEW_ONLY) {
      accessEntity = { ...accessEntity, read: true };
    } else if (currentUserFromUserList.access === SharingAccess.CAN_EDIT) {
      accessEntity = {
        ...accessEntity,
        read: true,
        manage: true,
        delete: true,
      };
    }
  }

  _.forEach(
    _.intersectionBy(dashboard.userGroupAccesses, currentUser.userGroups, 'id'),
    (userGroupAccess: any, index: number) => {
      if (userGroupAccess.access === SharingAccess.CAN_EDIT) {
        accessEntity = {
          ...accessEntity,
          read: true,
          manage: true,
          delete: true,
        };
      } else if (userGroupAccess.access === SharingAccess.CAN_VIEW_ONLY) {
        accessEntity = { ...accessEntity, read: true };
      }
    }
  );

  if (dashboard.publicAccess === SharingAccess.CAN_EDIT) {
    accessEntity = {
      ...accessEntity,
      read: true,
      manage: true,
      delete: true,
    };
  } else if (dashboard.publicAccess === SharingAccess.CAN_VIEW_ONLY) {
    accessEntity = { ...accessEntity, read: true };
  }

  return accessEntity;
}
