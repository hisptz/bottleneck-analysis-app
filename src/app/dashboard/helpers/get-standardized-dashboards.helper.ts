import * as _ from 'lodash';

import { SystemInfo, User } from '../../models';
import { Dashboard } from '../models';
import { getStandardizedDashboard } from './get-standardized-dashboard.helper';

export function getStandardizedDashboards(
  dashboards: any[],
  currentUser: User,
  dataGroups?: any[]
): Dashboard[] {
  return _.map(dashboards || [], dashboard =>
    getStandardizedDashboard(dashboard, currentUser, dataGroups)
  );
}
