import {
  map as _map,
  camelCase as _camelCase,
  flatten as _flatten,
  sortBy,
} from 'lodash';
import { getMergedGlobalDataSelectionsFromVisualizationLayers } from './get-merged-global-data-selections.helper';
import { getSelectionDimensionsFromFavorite } from '../modules/ngx-dhis2-visualization/helpers';
import { Determinant, SystemInfo } from 'src/app/models';
import { getDefaultOrgUnits } from './get-default-org-units.helper';
import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';
import { User } from '@iapps/ngx-dhis2-http-client';
import { DEFAULT_LEGEND_DEFINITIONS } from '../constants/default-legend-definitions.constant';

export function getDataSelectionsForDashboardCreation(
  dashboardItems: any[],
  defaultDataGroups: Determinant[],
  systemInfo: SystemInfo,
  currentUser: User,
  dashboardPreferences: { startWithDynamicOrgUnits: boolean } = {
    startWithDynamicOrgUnits: true,
  }
): VisualizationDataSelection[] {
  const orgUnits = getDefaultOrgUnits(currentUser, dashboardPreferences);

  const dataSelections = getMergedGlobalDataSelectionsFromVisualizationLayers(
    _map(dashboardItems, (dashboardItem: any) => {
      return getSelectionDimensionsFromFavorite(
        dashboardItem[_camelCase(dashboardItem.type)]
      );
    })
  );

  return dataSelections.length > 0
    ? dataSelections
    : [
        {
          dimension: 'dx',
          layout: 'rows',
          legendDefinitions: DEFAULT_LEGEND_DEFINITIONS,
          useShortNameAsLabel: true,
          items: _flatten(
            _map(
              defaultDataGroups || [],
              (dataGroup: Determinant) => dataGroup.members
            )
          ),
          groups: sortBy(defaultDataGroups, 'sortOrder'),
        },
        {
          dimension: 'pe',
          layout: 'filters',
          items: [
            {
              id: systemInfo.analysisRelativePeriod,
            },
          ],
        },
        {
          dimension: 'ou',
          layout: 'columns',
          items: orgUnits,
        },
      ];
}
