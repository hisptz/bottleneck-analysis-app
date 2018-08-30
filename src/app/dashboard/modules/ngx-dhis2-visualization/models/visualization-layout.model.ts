export interface VisualizationLayout {
  rows: Array<{ dimension: string; name: string }>;
  columns: Array<{ dimension: string; name: string }>;
  filters: Array<{ dimension: string; name: string }>;
  excluded?: Array<{ dimension: string; name: string }>;
}
