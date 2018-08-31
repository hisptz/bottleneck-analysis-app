import { Dashboard } from '../dashboard/models';
import * as _ from 'lodash';
import { User, SystemInfo } from '../models';
import { getDashboardBookmarkStatus } from './get-dashboard-bookmark-status.helper';
import { getStandardizedDashboard } from './get-standardized-dashboard.helper';

export function getStandardizedDashboards(
  dashboards: any[],
  currentUser: User,
  systemInfo: SystemInfo
): Dashboard[] {
  return _.map(dashboards || [], dashboard =>
    getStandardizedDashboard(dashboard, currentUser, systemInfo)
  );
}
