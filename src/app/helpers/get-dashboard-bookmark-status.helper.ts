import * as _ from 'lodash';
export function getDashboardBookmarkStatus(
  dashboardBookmarks: Array<string>,
  currentUserId: string
) {
  return _.some(
    dashboardBookmarks,
    dashboardBookmarkUserId => dashboardBookmarkUserId === currentUserId
  );
}
