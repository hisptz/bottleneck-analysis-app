import { map as _map } from 'lodash';
export function getDashboardVisualizationsFromDashboardItems(
  dashboardItems: any[],
  dashboardId: string
) {
  return _map(dashboardItems || [], (dashboardItem: any) => {
    return {
      ...dashboardItem,
      isOpen: true,
      dashboardId
    };
  });
}
