import { VisualizationFavorite } from './visualization-favorite.model';
import { VisualizationProgress } from './visualization-progress.model';
import { VisualizationNotification } from './visualization-notification.model';

export interface Visualization {
  id: string;
  name: string;
  type?: string;
  favorite?: VisualizationFavorite;
  created?: string;
  lastUpdated?: string;
  description?: string;
  visualizationConfigId?: string;
  progress?: VisualizationProgress;
  layers: Array<string>;
  isNew?: boolean;
  appKey?: string;
  notification?: VisualizationNotification;
  isNonVisualizable?: boolean;
}
