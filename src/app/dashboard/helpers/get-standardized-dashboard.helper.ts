import { User } from '@iapps/ngx-dhis2-http-client';

import { Dashboard } from '../models';
import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';
import { getDashboardAccess } from './get-dashboard-access.helper';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';
import { Determinant } from 'src/app/models';
import { find, sortBy } from 'lodash';

export function getStandardizedDashboard(
  dashboard: any,
  currentUser: User,
  dataSelections?: VisualizationDataSelection[],
  determinants?: Determinant[]
): Dashboard {
  return {
    id: dashboard.id,
    name: dashboard.name,
    created: dashboard.created,
    lastUpdated: dashboard.lastUpdated,
    description: dashboard.description,
    dashboardItems: dashboard.dashboardItems,
    supportBookmark: dashboard.hasOwnProperty('favorite'),
    bookmarked: getDashboardBookmarkStatus(
      dashboard.favorites || dashboard.bookmarks,
      currentUser ? currentUser.id : ''
    ),
    publicAccess: dashboard.publicAccess || '--------',
    externalAccess: dashboard.externalAccess || false,
    userGroupAccesses: dashboard.userGroupAccesses || [],
    userAccesses: dashboard.userAccesses || [],
    user: dashboard.user || {
      id: currentUser.id,
      name: currentUser.name,
    },
    access: getDashboardAccess(dashboard, currentUser),
    globalSelections: sortDeterminantsInDataSelections(
      dashboard.globalSelections || dataSelections,
      determinants
    ),
    bottleneckPeriodType: dashboard.bottleneckPeriodType || 'Yearly',
  };
}

function sortDeterminantsInDataSelections(
  dataSelections: VisualizationDataSelection[],
  determinants: Determinant[]
) {
  return (dataSelections || []).map(
    (dataSelection: VisualizationDataSelection) => {
      switch (dataSelection.dimension) {
        case 'dx':
          return {
            ...dataSelection,
            groups: sortBy(
              (dataSelection.groups || []).map((group: Determinant) => {
                const determinant =
                  find(determinants, ['code', group.code]) ||
                  find(determinants, ['name', group.name]);

                return determinant
                  ? { ...group, sortOrder: determinant.sortOrder }
                  : group;
              }),
              'sortOrder'
            ),
          };
        default:
          return dataSelection;
      }
    }
  );
}
