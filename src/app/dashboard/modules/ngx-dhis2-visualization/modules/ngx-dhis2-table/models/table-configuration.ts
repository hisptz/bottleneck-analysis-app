export interface TableConfiguration {
  id: string;
  title: string;
  subtitle: string;
  showColumnTotal: boolean;
  showColumnSubtotal: boolean;
  showRowTotal: boolean;
  showRowSubtotal: boolean;
  showDimensionLabels: boolean;
  hideEmptyRows: boolean;
  showHierarchy: boolean;
  rows: string[];
  columns: string[];
  filters: string[];
  legendDisplayStrategy: string;
  displayList: boolean;
  legendSet: any;
  styles: any;
  dataSelections?: any[];
}
