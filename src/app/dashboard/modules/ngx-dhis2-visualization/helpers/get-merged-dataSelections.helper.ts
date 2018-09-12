import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models';
import { updateDataSelectionBasedOnPreferences } from './update-data-selection-based-preference.helper';

export function getMergedDataSelections(
  existingDataSelections: VisualizationDataSelection[],
  newDataSelections: VisualizationDataSelection[],
  visualizationType: string,
  favoritePreferences: {
    reportTable: { includeOrgUnitChildren: boolean };
    chart: { includeOrgUnitChildren: boolean };
  } = {
    reportTable: { includeOrgUnitChildren: true },
    chart: { includeOrgUnitChildren: false }
  }
): any[] {
  const unAvailableDataSelections: VisualizationDataSelection[] = _.filter(
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

      return updateDataSelectionBasedOnPreferences(
        matchingDataSelection || dataSelection,
        visualizationType,
        favoritePreferences
      );
    }
  );

  return [...unAvailableDataSelections, ...mergedDataSelections];
}
