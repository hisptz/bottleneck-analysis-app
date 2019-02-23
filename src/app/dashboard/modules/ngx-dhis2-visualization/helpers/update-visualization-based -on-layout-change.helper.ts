import * as _ from 'lodash';

import { VisualizationDataSelection, VisualizationLayer } from '../models';

export function updateVisualizationLayerBasedOnLayoutChange(
  visualizationLayers: VisualizationLayer[]
) {
  return _.map(
    visualizationLayers,
    (visualizationLayer: VisualizationLayer) => {
      return {
        id: visualizationLayer.id,
        dataSelections: _.map(
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
        )
      };
    }
  );
}
