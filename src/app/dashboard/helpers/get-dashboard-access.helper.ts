import * as _ from "lodash";
import { User } from "@iapps/ngx-dhis2-http-client";
import { isSuperUser } from "./is-super-user.helper";

export function getDashboardAccess(dashboard: any, currentUser: User) {
  let hasAccess = false;
  let manageSharing = false;
  let canRead = false;
  if (dashboard && currentUser) {
    // check if user can manage sharing
    manageSharing =
      isSuperUser(currentUser) ||
      (dashboard.user && dashboard.user.id === currentUser.id);

    if (dashboard.user && dashboard.user.id === currentUser.id) {
      hasAccess = canRead = true;
    } else if (dashboard.publicAccess === "r-------") {
      canRead = true;
    } else if (
      dashboard.publicAccess === "rw------" ||
      _.some(
        dashboard.userAccesses || [],
        (userAccess: any) =>
          userAccess.id === currentUser.id && userAccess.access === "rw------"
      ) ||
      _.some(
        dashboard.userGroupAccesses || [],
        (userGroupAccess: any) =>
          _.filter(
            currentUser.userGroups || [],
            (userGroup: any) =>
              userGroup.id === userGroupAccess.id &&
              userGroup.access === "rw------"
          ).length > 0
      )
    ) {
      hasAccess = true;
    }
  }

  return {
    delete: hasAccess,
    externalize: hasAccess,
    manage: hasAccess,
    manageSharing,
    read: canRead,
    update: hasAccess,
    write: hasAccess
  };
}
