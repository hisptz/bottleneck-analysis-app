export interface DashboardVisualization {
  id: string;
  loading: boolean;
  loaded: boolean;
  error: any;
  hasError: boolean;
  items: Array<string>;
}
