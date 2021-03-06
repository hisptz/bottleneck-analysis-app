import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models';
import { updateDataSelectionBasedOnPreferences } from './update-data-selection-based-preference.helper';

// TODO FIND BEST WAY TO HANDLE VISUALIZATION PREFERENCES
export function getMergedDataSelections(
  existingDataSelections: VisualizationDataSelection[],
  newDataSelections: VisualizationDataSelection[],
  visualizationType: string,
  favoritePreferences: {
    reportTable: { includeOrgUnitChildren: boolean };
    chart: { includeOrgUnitChildren: boolean };
    app: { includeOrgUnitChildren: boolean };
  } = {
    reportTable: { includeOrgUnitChildren: true },
    chart: { includeOrgUnitChildren: false },
    app: { includeOrgUnitChildren: false }
  }
): any[] {
  return [
    ..._.filter(
      newDataSelections || [],
      (dataSelection: VisualizationDataSelection) =>
        !_.find(existingDataSelections, ['dimension', dataSelection.dimension])
    ),
    ..._.map(
      existingDataSelections || [],
      (dataSelection: VisualizationDataSelection) =>
        updateDataSelectionBasedOnPreferences(
          _.find(newDataSelections, ['dimension', dataSelection.dimension]) ||
            dataSelection,
          visualizationType,
          favoritePreferences
        )
    )
  ];
}
