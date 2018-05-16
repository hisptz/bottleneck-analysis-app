import * as _ from 'lodash';
export function sortDashboardMenuItemsByBookmark(dashboardMenuItems: any[]) {
  const bookmarkedDashboards = _.filter(dashboardMenuItems,
    dashboardMenuItem => dashboardMenuItem.details ? dashboardMenuItem.details.bookmarked : false);
  const unBookmarkedDashboards = _.filter(dashboardMenuItems,
    dashboardMenuItem => dashboardMenuItem.details ? !dashboardMenuItem.details.bookmarked : false);
  return [...bookmarkedDashboards, ...unBookmarkedDashboards];
}
