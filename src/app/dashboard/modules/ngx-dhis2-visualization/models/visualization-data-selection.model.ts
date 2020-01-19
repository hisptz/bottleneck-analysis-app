import { Determinant } from 'src/app/models';
import { VisualizationDataSelectionItem } from './visualization-data-selection-item.model';

export interface VisualizationDataSelection {
  dimension: string;
  name?: string;
  layout?: string;
  filter?: string;
  optionSet?: any;
  legendSet?: string;
  items: VisualizationDataSelectionItem[];
  groups?: Determinant[];
}
