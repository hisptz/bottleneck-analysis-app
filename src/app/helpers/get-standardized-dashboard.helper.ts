import * as _ from 'lodash';
import { User, SystemInfo } from '../models';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';
import { Dashboard } from '../dashboard/models';
import { DataGroup } from '../dashboard/modules/ngx-dhis2-data-selection-filter/modules/data-filter/models/data-group.model';

export function getStandardizedDashboard(
  dashboard: any,
  currentUser: User,
  systemInfo: SystemInfo,
  defaultDataGroups?: DataGroup[]
): Dashboard {
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
}
