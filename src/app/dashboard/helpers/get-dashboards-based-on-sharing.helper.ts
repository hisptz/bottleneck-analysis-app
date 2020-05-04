import { User } from '@iapps/ngx-dhis2-http-client';
import { getDashboardAccess } from './get-dashboard-access.helper';

export function getDashboardsBasedOnSharing(
  dashboards: any[],
  currentUser: User
): any[] {
  return dashboards.filter((dashboard) => {
    const dashboardAccess = getDashboardAccess(dashboard, currentUser) || null;
    return dashboardAccess && dashboardAccess.read;
  });
}
