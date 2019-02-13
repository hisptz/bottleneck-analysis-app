import * as _ from 'lodash';
import { User, SystemInfo } from '../../models';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';
import { Dashboard } from '../models';
import { DataGroup } from '../../models/data-group.model';
import { getDashboardAccess } from './get-dashboard-access.helper';
import { getDefaultOrgUnits } from './get-default-org-units.helper';
import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';

export function getStandardizedDashboard(
  dashboard: any,
  currentUser: User,
  dataSelections?: VisualizationDataSelection[]
): Dashboard {
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
    publicAccess: dashboard.publicAccess || '--------',
    externalAccess: dashboard.externalAccess || false,
    userGroupAccesses: dashboard.userGroupAccesses || [],
    userAccesses: dashboard.userAccesses || [],
    user: dashboard.user || {
      id: currentUser.id,
      name: currentUser.name
    },
    access: getDashboardAccess(dashboard, currentUser),
    globalSelections: dashboard.globalSelections || dataSelections
  };
}
