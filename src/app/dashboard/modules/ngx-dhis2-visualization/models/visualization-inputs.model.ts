import { VisualizationLayer } from './visualization-layer.model';

export interface VisualizationInputs {
  id: string;
  type: string;
  name: string;
  visualizationLayers: VisualizationLayer[];
  currentUser: any;
  systemInfo: any;
}
