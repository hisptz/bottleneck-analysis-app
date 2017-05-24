import {ApplicationState} from "../application-state";
import * as _ from 'lodash';
export function currentVisualizationObjectsSelector(state: ApplicationState) {
  let visualizationObjects: any[] = [];

  const newState: ApplicationState = _.clone(state);
  if(newState.storeData.dashboards.length > 0 && state.uiState.currentDashboard != undefined) {
    const currentDashboard: any = _.find(state.storeData.dashboards, ['id', state.uiState.currentDashboard]);

    if(currentDashboard) {
      visualizationObjects = currentDashboard.dashboardItems.map(dashboardItem => {
        return dashboardItem.hasOwnProperty('visualizationObject') ? dashboardItem.visualizationObject : {};
      })
    }
  }

  return visualizationObjects;
}
