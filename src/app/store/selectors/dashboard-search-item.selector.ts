import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
export function dashboardSearchItemsSelector(state: ApplicationState) {
  return state.storeData.dashboardSearchItems;
}
