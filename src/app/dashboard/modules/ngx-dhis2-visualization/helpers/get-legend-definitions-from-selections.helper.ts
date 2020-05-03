import { find } from 'lodash';
import { VisualizationDataSelection } from '../models';
import { Legend } from 'src/app/models/legend.model';
export function getLegendDefinitionsFromSelections(
  dataSelections: VisualizationDataSelection[]
): Legend[] {
  const dxSelection = find(dataSelections || [], ['dimension', 'dx']);

  return dxSelection ? dxSelection.legendDefinitions : [];
}
