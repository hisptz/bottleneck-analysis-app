import * as _ from 'lodash';
export function getDashboardItemsFromDashboards(dashboards: any[]): any[] {
  return _.flatten(
    _.map(dashboards || [], dashboard =>
      _.map(dashboard.dashboardItems, (dashboardItem: any) => {
        return {
          ...dashboardItem,
          isOpen: true,
          dashboardId: dashboard.id
        };
      })
    )
  );
}
