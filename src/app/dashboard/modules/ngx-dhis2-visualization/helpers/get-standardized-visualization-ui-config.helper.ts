import { VisualizationUiConfig } from '../models/index';
import { checkIfVisualizationIsNonVisualizable } from './check-if-visualization-is-non-visualizable.helper';
import { getVisualizationWidthFromShape } from './get-visualization-width-from-shape.helper';

export function getStandardizedVisualizationUiConfig(
  visualizationItem: any
): VisualizationUiConfig {
  const isNonVisualizable = checkIfVisualizationIsNonVisualizable(
    visualizationItem.type
  );
  return {
    id: `${visualizationItem.id}_ui_config`,
    shape: visualizationItem.shape || 'NORMAL',
    height: '450px',
    width: getVisualizationWidthFromShape(visualizationItem.shape || 'NORMAL'),
    showBody: true,
    fullScreen: false,
    showFilters: !isNonVisualizable,
    hideTypeButtons: isNonVisualizable,
    showInterpretionBlock: !isNonVisualizable,
    showResizeButton: true,
    showTitleBlock: false
  };
}
