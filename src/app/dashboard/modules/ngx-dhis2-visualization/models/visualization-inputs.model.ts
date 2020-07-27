import { VisualizationLayer } from './visualization-layer.model';
import { InterventionArchive } from 'src/app/dashboard/models/intervention-archive.model';

export interface VisualizationInputs {
  id: string;
  type: string;
  name: string;
  visualizationLayers: VisualizationLayer[];
  currentUser: any;
  systemInfo: any;
  interventionArchive: InterventionArchive;
}
