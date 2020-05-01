import { getTableConfiguration } from './get-table-configuration.helper';
import { VisualizationLayer } from '../../../models';
import { Intervention } from 'src/app/dashboard/models';

export function getTableLayers(
  visualizationLayers: VisualizationLayer[],
  visualizationType: string,
  intervention: Intervention
) {
  return (visualizationLayers || []).map((layer: any) => {
    return {
      tableConfiguration: getTableConfiguration(
        layer.config || {},
        layer.layout,
        visualizationType,
        layer.dataSelections,
        intervention
      ),
      analyticsObject: layer.analytics,
    };
  });
}
