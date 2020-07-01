import { Intervention } from './intervention.model';
import { Dashboard } from './dashboard.model';
import { VisualizationLayer } from '../modules/ngx-dhis2-visualization/models';

export interface InterventionArchive {
  id: string;
  intervention: Dashboard;
  created: string;
  lastUpdated: string;
  visualizationLayers: VisualizationLayer[];
  user: { id: string };
}
