import { User } from '@iapps/ngx-dhis2-http-client';
import * as _ from 'lodash';

import { Dashboard } from '../models';
import { getStandardizedDashboard } from './get-standardized-dashboard.helper';

export function getStandardizedDashboards(
  dashboards: any[],
  currentUser: User
): Dashboard[] {
  return _.map(dashboards || [], dashboard =>
    getStandardizedDashboard(dashboard, currentUser)
  );
}
