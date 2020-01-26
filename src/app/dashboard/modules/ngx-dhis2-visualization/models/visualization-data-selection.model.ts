import { Determinant } from 'src/app/models';
import { VisualizationDataSelectionItem } from './visualization-data-selection-item.model';
import { Legend } from 'src/app/models/legend.model';

export interface VisualizationDataSelection {
  dimension: string;
  name?: string;
  layout?: string;
  filter?: string;
  optionSet?: any;
  legendSet?: string;
  legendDefinitions?: Legend[];
  useShortNameAsLabel?: boolean;
  items: VisualizationDataSelectionItem[];
  groups?: Determinant[];
}
