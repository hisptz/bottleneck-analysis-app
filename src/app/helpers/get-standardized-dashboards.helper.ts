import { Dashboard } from '../dashboard/models';
import * as _ from 'lodash';
import { User } from '../models';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';

export function getStandardizedDashboards(
  dashboards: any[],
  currentUser: User
): Dashboard[] {
  return _.map(dashboards || [], dashboard => {
    return {
      id: dashboard.id,
      name: dashboard.name,
      created: dashboard.created,
      lastUpdated: dashboard.lastUpdated,
      description: dashboard.description,
      supportBookmark: dashboard.hasOwnProperty('favorite'),
      bookmarked: dashboard.hasOwnProperty('favorite')
        ? dashboard.favorite
        : getDashboardBookmarkStatus(
            dashboard.favorites,
            currentUser ? currentUser.id : ''
          ),
      access: dashboard.access
    };
  });
}
