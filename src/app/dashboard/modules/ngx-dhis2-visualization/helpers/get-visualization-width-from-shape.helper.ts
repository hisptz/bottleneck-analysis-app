export function getVisualizationWidthFromShape(dashboardItemShape: string): string {
  switch (dashboardItemShape) {
    case 'DOUBLE_WIDTH':
      return 'span 6';
    case 'FULL_WIDTH':
      return 'span 12';
    default:
      return 'span 4';
  }
}
