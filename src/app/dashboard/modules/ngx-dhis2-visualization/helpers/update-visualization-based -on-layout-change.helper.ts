import * as _ from 'lodash';

import { VisualizationDataSelection, VisualizationLayer } from '../models';
import { getVisualizationLayout } from './get-visualization-layout.helper';

export function updateVisualizationLayerBasedOnLayoutChange(
  visualizationLayers: VisualizationLayer[]
) {
  return _.map(
    visualizationLayers,
    (visualizationLayer: VisualizationLayer) => {
      const dataSelections = _.map(
        visualizationLayer.dataSelections,
        (dataSelection: VisualizationDataSelection) => {
          return {
            ...dataSelection,
            layout:
              dataSelection.layout === 'columns'
                ? 'rows'
                : dataSelection.layout === 'rows'
                ? 'columns'
                : dataSelection.layout
          };
        }
      );
      return {
        ...visualizationLayer,
        dataSelections,
        layout: getVisualizationLayout(dataSelections)
      };
    }
  );
}
