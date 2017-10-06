import {ApplicationState} from '../application-state';
import {visualizationObjectsSelector} from './visualization-objects.selector';
import {Visualization} from '../../dashboard/model/visualization';
import * as _ from 'lodash';
export function progressMessagesSelector(state: ApplicationState) {
  const visualizationObjects: Visualization[] = visualizationObjectsSelector(state);
  if (visualizationObjects.length === 0) {
    return {
      totalItems: 0,
      loadedItems: 0,
      progress: 0
    }
  }

  const totalItems = visualizationObjects.length;
  const loadedVisualizations: Visualization[] = visualizationObjects.filter(visualizationObject => {
    return visualizationObject.details.loaded
  });
  const loadingVisualizations: Visualization[] = visualizationObjects.filter(visualizationObject => {
    return !visualizationObject.details.loaded
  });
  const lastVisualizationObject: Visualization = _.last(loadingVisualizations);
  const loadedItems = loadedVisualizations.length;
  const progressMessage = lastVisualizationObject ? 'Loading ' + lastVisualizationObject.name : 'Loading Dashboards';
  return {
    totalItems: totalItems,
    loadedItems: loadedItems,
    progressMessage: progressMessage,
    progress: calculateProgress(loadedItems, totalItems)
  }
}

function calculateProgress(loaded, total) {
  return total === 0 ? 0 : ((loaded / total) * 100).toFixed(0);
}
