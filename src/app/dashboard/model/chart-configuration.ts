export interface ChartConfiguration {
  renderId: string;
  type: string;
  title: string;
  subtitle: string;
  xAxisType: string;
  yAxisType: string;
  showData: boolean;
  hideTitle: boolean;
  hideSubtitle: boolean;
  hideEmptyRows: boolean;
  hideLegend: boolean;
  showLabels: boolean;
  axisCriteria: string;
  multiAxisTypes: any[];
  percentStackedValues: boolean;
}
