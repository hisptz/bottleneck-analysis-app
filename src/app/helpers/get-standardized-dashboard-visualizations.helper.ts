import { DashboardVisualization } from '../dashboard/models';
import * as _ from 'lodash';
export function getStandardizedDashboardVisualizations(
  dashboards: any[]
): DashboardVisualization[] {
  return _.map(dashboards || [], dashboard => {
    return {
      id: dashboard.id,
      items: _.map(
        dashboard.dashboardItems || [],
        dashboardItem => dashboardItem.id
      )
    };
  });
}
