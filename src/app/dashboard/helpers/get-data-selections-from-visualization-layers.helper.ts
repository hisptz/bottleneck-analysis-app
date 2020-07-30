import { map as _map } from 'lodash';
import {
  VisualizationLayer,
  VisualizationDataSelection,
} from '../modules/ngx-dhis2-visualization/models';
import { getSelectionDimensionsFromAnalytics } from '../modules/ngx-dhis2-visualization/helpers';

export function getDataSelectionsFromVisualizationLayers(
  visualizationLayers: VisualizationLayer[],
  retrieveFromAnalytics?: boolean
): Array<VisualizationDataSelection[]> {
  if (!visualizationLayers) {
    return [];
  }

  return _map(visualizationLayers, (visualizationLayer: VisualizationLayer) => {
    if (!visualizationLayer) {
      return null;
    }
    return retrieveFromAnalytics
      ? getSelectionDimensionsFromAnalytics(visualizationLayer.analytics)
      : visualizationLayer.dataSelections;
  }).filter((visualizationLayer) => visualizationLayer);
}
