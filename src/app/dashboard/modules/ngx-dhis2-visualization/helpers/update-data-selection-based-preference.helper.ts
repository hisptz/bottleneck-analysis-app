import * as _ from 'lodash';
import { getOrgUnitsWithChildren } from 'src/app/ngx-dhis2-org-unit-filter/helpers/get-org-units-with-children.helper';
import { getOrgUnitsWithoutChildrenAndGroups } from 'src/app/ngx-dhis2-org-unit-filter/helpers/get-org-units-without-children.helper';
import { VisualizationDataSelection } from '../models';

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
