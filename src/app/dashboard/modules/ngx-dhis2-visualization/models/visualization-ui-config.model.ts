export interface VisualizationUiConfig {
  id: string;
  shape: string;
  hideBorder?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  showFilters?: boolean;
  hideTypeButtons?: boolean;
  hideManagementBlock?: boolean;
  showBody: boolean;
  height: string;
  width: string;
  fullScreen: boolean;
  showInterpretionBlock: boolean;
  hideResizeButtons: boolean;
  showTitleBlock: boolean;
}
