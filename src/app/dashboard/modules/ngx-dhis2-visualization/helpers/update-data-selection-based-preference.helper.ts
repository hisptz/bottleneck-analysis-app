import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models';
import {
  getOrgUnitsWithoutChildrenAndGroups,
  getOrgUnitsWithChildren
} from '@iapps/ngx-dhis2-org-unit-filter';

export function updateDataSelectionBasedOnPreferences(
  dataSelection: VisualizationDataSelection,
  visualizationType,
  favoritePreferences: any
) {
  const preferences = favoritePreferences[_.camelCase(visualizationType)];

  if (!preferences) {
    return dataSelection;
  }

  switch (dataSelection.dimension) {
    case 'ou':
      const dataSelectionItems = !preferences.includeOrgUnitChildren
        ? getOrgUnitsWithoutChildrenAndGroups(dataSelection.items)
        : getOrgUnitsWithChildren(dataSelection.items);

      return {
        ...dataSelection,
        items:
          dataSelectionItems.length > 0
            ? dataSelectionItems
            : dataSelection.items
      };
    default:
      return dataSelection;
  }
}
