import { VisualizationLayer } from '../../../models';
import { getTableConfiguration } from './get-table-configuration.helper';

export function getTableLayers(
  visualizationLayers: VisualizationLayer[],
  visualizationType: string,
  interventionName: string
) {
  return (visualizationLayers || []).map((layer: any) => {
    return {
      tableConfiguration: getTableConfiguration(
        layer.config || {},
        layer.layout,
        visualizationType,
        layer.dataSelections,
        interventionName
      ),
      analyticsObject: layer.analytics,
    };
  });
}
