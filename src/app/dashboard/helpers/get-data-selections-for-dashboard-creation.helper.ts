import {
  map as _map,
  camelCase as _camelCase,
  flatten as _flatten
} from 'lodash';
import { getMergedGlobalDataSelectionsFromVisualizationLayers } from './get-merged-global-data-selections.helper';
import { getSelectionDimensionsFromFavorite } from '../modules/ngx-dhis2-visualization/helpers';
import { DataGroup, SystemInfo, User } from 'src/app/models';
import { getDefaultOrgUnits } from './get-default-org-units.helper';
import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';

export function getDataSelectionsForDashboardCreation(
  dashboardItems: any[],
  defaultDataGroups: DataGroup[],
  systemInfo: SystemInfo,
  currentUser: User,
  dashboardPreferences: { startWithDynamicOrgUnits: boolean } = {
    startWithDynamicOrgUnits: true
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
          items: _flatten(
            _map(
              defaultDataGroups || [],
              (dataGroup: DataGroup) => dataGroup.members
            )
          ),
          groups: defaultDataGroups
        },
        {
          dimension: 'pe',
          layout: 'filters',
          items: [
            {
              id: systemInfo.analysisRelativePeriod
            }
          ]
        },
        {
          dimension: 'ou',
          layout: 'columns',
          items: orgUnits
        }
      ];
}
