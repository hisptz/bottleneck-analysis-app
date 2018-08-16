import { DashboardVisualization } from '../dashboard/models';
import * as _ from 'lodash';
export function getStandardizedDashboardVisualization(
  dashboardId: string,
  dashboardItems: any[],
  initialStage: boolean = false
): DashboardVisualization {
  return {
    id: dashboardId,
    loading: initialStage,
    loaded: !initialStage,
    hasError: false,
    error: null,
    items: _.map(dashboardItems || [], dashboardItem => dashboardItem.id)
  };
}
