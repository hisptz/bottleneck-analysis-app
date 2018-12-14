import { VisualizationDataSelection } from '../models';
import * as _ from 'lodash';

export function getDataSelectionsForMetadata(
  dataSelections: VisualizationDataSelection[]
) {
  return _.filter(
    dataSelections,
    (dataSelection: VisualizationDataSelection) =>
      dataSelection.dimension !== 'dx'
  );
}
