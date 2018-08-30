import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models';

export function getMergedDataSelections(
  existingDataSelections: VisualizationDataSelection[],
  newDataSelections: VisualizationDataSelection[]
): any[] {
  const unAvaialableDataSelections: VisualizationDataSelection[] = _.filter(
    newDataSelections,
    (dataSelection: VisualizationDataSelection) =>
      !_.find(existingDataSelections, ['dimension', dataSelection.dimension])
  );

  const mergedDataSelections = _.map(
    existingDataSelections,
    (dataSelection: VisualizationDataSelection) => {
      const matchingDataSelection: VisualizationDataSelection = _.find(
        newDataSelections,
        ['dimension', dataSelection.dimension]
      );
      return matchingDataSelection || dataSelection;
    }
  );
  return [...unAvaialableDataSelections, ...mergedDataSelections];
}
