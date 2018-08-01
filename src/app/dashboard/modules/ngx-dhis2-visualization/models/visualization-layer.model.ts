import { Analytics } from './analytics.model';
import { VisualizationDataSelection } from './visualization-data-selection.model';
import { VisualizationLayout } from './visualization-layout.model';

export interface VisualizationLayer {
  id: string;
  analytics?: Analytics;
  dataSelections?: VisualizationDataSelection[];
  layout?: VisualizationLayout;
  metadataIdentifiers?: string[];
  layerType?: string;
  config?: { [name: string]: any };
}
