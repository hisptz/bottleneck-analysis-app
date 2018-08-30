import { Dashboard } from '../dashboard/models';
import * as _ from 'lodash';
import { User, SystemInfo } from '../models';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';

export function getStandardizedDashboards(
  dashboards: any[],
  currentUser: User,
  systemInfo: SystemInfo
): Dashboard[] {
  return _.map(dashboards || [], dashboard => {
    const orgUnits =
      currentUser.dataViewOrganisationUnits.length > 0
        ? currentUser.dataViewOrganisationUnits
        : currentUser.organisationUnits;
    return {
      id: dashboard.id,
      name: dashboard.name,
      created: dashboard.created,
      lastUpdated: dashboard.lastUpdated,
      description: dashboard.description,
      supportBookmark: dashboard.hasOwnProperty('favorite'),
      bookmarked: getDashboardBookmarkStatus(
        dashboard.favorites || dashboard.bookmarks,
        currentUser ? currentUser.id : ''
      ),
      access: dashboard.access,
      globalSelections: [
        {
          dimension: 'pe',
          layout: 'filters',
          items: [
            {
              id: systemInfo.analysisRelativePeriod
            }
          ]
        },
        {
          dimension: 'ou',
          layout: 'columns',
          items: [
            {
              id: orgUnits[0] ? orgUnits[0].id : '',
              name: orgUnits[0] ? orgUnits[0].name : '',
              type: 'ORGANISATION_UNIT'
            }
          ]
        }
      ]
    };
  });
}
