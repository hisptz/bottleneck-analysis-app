import { User } from '@iapps/ngx-dhis2-http-client';
import * as _ from 'lodash';

import { Dashboard } from '../models';
import { getStandardizedDashboard } from './get-standardized-dashboard.helper';
import { Determinant } from 'src/app/models';

export function getStandardizedDashboards(
  dashboards: any[],
  currentUser: User,
  determinants: Determinant[]
): Dashboard[] {
  return _.map(dashboards || [], dashboard =>
    getStandardizedDashboard(dashboard, currentUser, [], determinants)
  );
}
