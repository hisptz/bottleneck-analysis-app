import { User } from '@iapps/ngx-dhis2-http-client';

export function isDashboardUser(dashboardUser: any, currentUser: User) {
  if (!dashboardUser) {
    return false;
  }
  return currentUser && dashboardUser.id === currentUser.id;
}
