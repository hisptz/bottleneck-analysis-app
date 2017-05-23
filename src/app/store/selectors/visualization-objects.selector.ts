import {ApplicationState} from "../application-state";
import * as _ from 'lodash';
import {Visualization} from "../../model/visualization";
export function visualizationObjectsSelector(state: ApplicationState): Visualization[] {
  const visualizationObjects = _.clone(state.storeData.visualizationObjects);
  return visualizationObjects;
}
