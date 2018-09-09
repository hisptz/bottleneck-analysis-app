import { DashboardVisualization } from '../models';
import { getVisualizationWidthFromShape } from '../modules/ngx-dhis2-visualization/helpers';
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
    items: dashboardItems.map(({ id, shape, height }) => ({
      id,
      width: getVisualizationWidthFromShape(shape),
      height
    }))
  };
}
