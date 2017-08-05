import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
export function visualizationObjectsSelector(state: ApplicationState) {
  return _.filter(state.storeData.visualizationObjects, ['dashboardId', state.uiState.currentDashboard]);

}
