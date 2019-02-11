import { map as _map } from 'lodash';
import {
  VisualizationLayer,
  VisualizationDataSelection
} from '../modules/ngx-dhis2-visualization/models';
import { getSelectionDimensionsFromAnalytics } from '../modules/ngx-dhis2-visualization/helpers';

export function getDataSelectionsFromVisualizationLayers(
  visualizationLayers: VisualizationLayer[],
  retrieveFromAnalytics?: boolean
): Array<VisualizationDataSelection[]> {
  return _map(visualizationLayers, (visualizationLayer: VisualizationLayer) =>
    retrieveFromAnalytics && visualizationLayer.analytics
      ? getSelectionDimensionsFromAnalytics(visualizationLayer.analytics)
      : visualizationLayer.dataSelections
  );
}
