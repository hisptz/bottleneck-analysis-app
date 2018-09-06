import * as _ from 'lodash';
import { USER_ORG_UNITS } from '../../ngx-dhis2-data-selection-filter/modules/ngx-dhis2-org-unit-filter/constants/user-org-units.constants';
import { VisualizationDataSelection } from '../models';

export function updateDataSelectionBasedOnPreferences(
  dataSelection: VisualizationDataSelection,
  visualizationType,
  favoritePreferences: any
) {
  switch (_.camelCase(visualizationType)) {
    case 'chart': {
      return dataSelection;
    }
    case 'reportTable': {
      const reportTablePreferences =
        favoritePreferences[_.camelCase(visualizationType)];

      if (!reportTablePreferences) {
        return dataSelection;
      }

      let dataSelectionItems = [];
      if (
        reportTablePreferences.preferOrgUnitChildren &&
        dataSelection.dimension === 'ou'
      ) {
        if (
          !_.some(
            dataSelection.items,
            (item: any) =>
              item.type.indexOf('LEVEL') !== -1 ||
              item.id.indexOf('CHILDREN') !== -1
          )
        ) {
          const lowestOrgUnitLevel = _.min(
            _.filter(_.map(dataSelection.items, (item: any) => item.level))
          );

          if (lowestOrgUnitLevel) {
            dataSelectionItems = [
              ...dataSelection.items,
              { id: `LEVEL-${lowestOrgUnitLevel + 1}`, name: 'Level 2' }
            ];
          } else {
            const userOrgUnitChildren = _.find(USER_ORG_UNITS, [
              'id',
              'USER_ORGUNIT_CHILDREN'
            ]);
            dataSelectionItems = [
              {
                id: 'USER_ORGUNIT_CHILDREN',
                name: userOrgUnitChildren ? userOrgUnitChildren.name : '',
                type: userOrgUnitChildren
                  ? userOrgUnitChildren.type
                  : 'USER_ORGANISATION_UNIT'
              }
            ];
          }
        }
      }

      return {
        ...dataSelection,
        items:
          dataSelectionItems.length > 0
            ? dataSelectionItems
            : dataSelection.items
      };
    }
    default:
      return dataSelection;
  }
}
