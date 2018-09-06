import * as _ from 'lodash';
import { User, SystemInfo } from '../models';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';
import { Dashboard } from '../dashboard/models';
import { DataGroup } from '../models/data-group.model';

export function getStandardizedDashboard(
  dashboard: any,
  currentUser: User,
  systemInfo: SystemInfo,
  defaultDataGroups?: DataGroup[],
  dashboardPreferences?: { startWithDynamicOrgUnits: boolean }
): Dashboard {
  dashboardPreferences = {
    startWithDynamicOrgUnits: true
  };
  const orgUnits = dashboardPreferences.startWithDynamicOrgUnits
    ? [
        {
          id: 'USER_ORGUNIT',
          name: 'User Org unit',
          type: 'USER_ORGANISATION_UNIT'
        }
      ]
    : _.map(
        currentUser.dataViewOrganisationUnits.length > 0
          ? currentUser.dataViewOrganisationUnits
          : currentUser.organisationUnits,
        (orgUnit: any) => {
          return {
            ...orgUnit,
            type: 'ORGANISATION_UNIT'
          };
        }
      );
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
    globalSelections: !dashboard.globalSelections
      ? [
          {
            dimension: 'dx',
            layout: 'rows',
            items: _.flatten(
              _.map(
                defaultDataGroups || [],
                (dataGroup: DataGroup) => dataGroup.members
              )
            ),
            groups: defaultDataGroups
          },
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
            items: orgUnits
          }
        ]
      : dashboard.globalSelections
  };
}
