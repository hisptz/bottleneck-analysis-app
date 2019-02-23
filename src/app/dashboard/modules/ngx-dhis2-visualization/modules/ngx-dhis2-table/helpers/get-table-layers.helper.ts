import { getTableConfiguration } from './get-table-configuration.helper';
import { VisualizationLayer } from '../../../models';

export function getTableLayers(
  visualizationLayers: VisualizationLayer[],
  visualizationType: string
) {
  return (visualizationLayers || []).map((layer: any) => {
    return {
      tableConfiguration: getTableConfiguration(
        layer.config || {},
        layer.layout,
        visualizationType,
        layer.dataSelections
      ),
      analyticsObject: layer.analytics
    };
  });
}
