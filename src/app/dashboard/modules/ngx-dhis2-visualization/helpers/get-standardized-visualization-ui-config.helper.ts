import { VisualizationUiConfig } from '../models';
import { checkIfVisualizationIsNonVisualizable } from './check-if-visualization-is-non-visualizable.helper';
import { getVisualizationWidthFromShape } from './get-visualization-width-from-shape.helper';

export function getStandardizedVisualizationUiConfig(
  visualizationItem: any,
  currentVisualizationItemId?: string
): VisualizationUiConfig {
  const isNonVisualizable = checkIfVisualizationIsNonVisualizable(
    visualizationItem.type
  );

  const isFullScreen = currentVisualizationItemId === visualizationItem.id;
  return {
    id: visualizationItem.id,
    shape: visualizationItem.shape || 'NORMAL',
    height: isFullScreen ? '99vh' : '450px',
    width: getVisualizationWidthFromShape(visualizationItem.shape || 'NORMAL'),
    showBody: true,
    fullScreen: isFullScreen,
    showFilters: false,
    hideFooter: false,
    hideHeader: false,
    hideManagementBlock: true,
    hideTypeButtons: false,
    showInterpretionBlock: !isNonVisualizable,
    hideResizeButtons: true,
    hideDownloadBlock: false,
    showTitleBlock: false,
    visualizationTypesConfig:
      visualizationItem.type === 'REPORT_TABLE'
        ? {
            switchToMap: true,
            switchToTable: true,
            switchToInfo: true,
            enableLayoutChangeButton: true,
          }
        : null,
  };
}
