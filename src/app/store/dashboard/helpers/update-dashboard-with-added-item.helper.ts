import {mergeRelatedItems} from './map-state-to-dashboard-object.helper';
import * as _ from 'lodash';
import {Dashboard} from '../dashboard.state';

export function updateDashboardWithAddedItem(currentDashboard, dashboardItems): Dashboard {
  const newDashboardItem: any = dashboardItems.length > 1 ?
    mergeRelatedItems(dashboardItems)[0] : dashboardItems[0];

  let newDashboardItems: any[] = [];

  if (newDashboardItem) {
    if (currentDashboard) {
      const availableDashboardItem = _.find(currentDashboard.dashboardItems, ['id', newDashboardItem.id]);

      /**
       * Update for list like items .ie. users , reports ,etc
       */
      if (availableDashboardItem) {

        if (availableDashboardItem.type[availableDashboardItem.type.length - 1] === 'S') {
          const availableDashboardItemIndex = _.findIndex(currentDashboard.dashboardItems, availableDashboardItem);

          /**
           * Update the item in its corresponding dashboard
           * @type {[any , {} , any]}
           */

          newDashboardItems = [
            ...currentDashboard.dashboardItems.slice(0, availableDashboardItemIndex),
            {...mergeRelatedItems([newDashboardItem, availableDashboardItem])[0]},
            ...currentDashboard.dashboardItems.slice(availableDashboardItemIndex + 1)
          ];
        }
      } else {

        if (newDashboardItem.type === 'APP') {
          if (!_.find(currentDashboard.dashboardItems, ['appKey', newDashboardItem.appKey])) {
            newDashboardItem.isNew = true;
            newDashboardItems = [newDashboardItem, ...currentDashboard.dashboardItems];
          }
        } else {
          newDashboardItem.isNew = true;
          newDashboardItems = [newDashboardItem, ...currentDashboard.dashboardItems];
        }
      }
    }
  }

  return {
    ...currentDashboard,
    dashboardItems: newDashboardItems
  };
}
