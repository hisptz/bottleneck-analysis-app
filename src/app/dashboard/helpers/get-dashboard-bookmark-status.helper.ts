import * as _ from 'lodash';
export function getDashboardBookmarkStatus(
  dashboardBookmarks: Array<string>,
  currentUserId: string
) {
  console.log(dashboardBookmarks, currentUserId);
  return _.some(
    dashboardBookmarks,
    dashboardBookmarkUserId => dashboardBookmarkUserId === currentUserId
  );
}
