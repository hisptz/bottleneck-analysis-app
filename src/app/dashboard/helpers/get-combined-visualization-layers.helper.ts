import { map as _map, flatten as _flatten } from 'lodash';
import { DashboardVisualization } from '../models';

export function getCombinedVisualizationLayers(
  dashboardVisualizationItems: DashboardVisualization[],
  visualizationObjectEntities: any,
  visualizationLayerEntities: any
) {
  return _map(
    _flatten(
      _map(
        _flatten(
          _map(
            dashboardVisualizationItems,
            (dashboardVisualizationItem: any) =>
              visualizationObjectEntities[dashboardVisualizationItem.id]
          )
        ),
        visualization => visualization.layers
      )
    ),
    layerId => visualizationLayerEntities[layerId]
  );
}
