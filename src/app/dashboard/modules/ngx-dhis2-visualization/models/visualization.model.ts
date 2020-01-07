import { VisualizationFavorite } from './visualization-favorite.model';
import { VisualizationProgress } from './visualization-progress.model';

export interface Visualization {
  id: string;
  name: string;
  type?: string;
  title?: string;
  favorite?: VisualizationFavorite;
  created?: string;
  lastUpdated?: string;
  description?: string;
  visualizationConfigId?: string;
  progress?: VisualizationProgress;
  layers: Array<string>;
  isNew?: boolean;
  appKey?: string;
  notification?: any;
  isNonVisualizable?: boolean;
}
