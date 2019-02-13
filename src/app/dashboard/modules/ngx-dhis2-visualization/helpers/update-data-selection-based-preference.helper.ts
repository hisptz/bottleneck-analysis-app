import * as _ from 'lodash';
import { USER_ORG_UNITS } from '../../ngx-dhis2-data-selection-filter/modules/ngx-dhis2-org-unit-filter/constants/user-org-units.constants';
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

  // TODO: FIND BEST WAY TO UPDATE/REMOVE ITEMS WITH LEVELS BASED ON CONFIGURATIONS
  switch (dataSelection.dimension) {
    case 'ou':
      let dataSelectionItems = [];
      // Set preferences for not including org unit children
      if (!preferences.includeOrgUnitChildren) {
        if (
          _.some(
            dataSelection.items,
            (item: any) =>
              (item.type && item.type.indexOf('LEVEL') !== -1) ||
              (item.id && item.id.indexOf('LEVEL') !== -1)
          )
        ) {
          dataSelectionItems = _.filter(
            dataSelection.items,
            (item: any) =>
              (item.type && item.type.indexOf('LEVEL') === -1) ||
              (item.id && item.id.indexOf('LEVEL') === -1)
          );
        } else if (
          _.some(
            dataSelection.items,
            (item: any) => item.id && item.id.indexOf('CHILDREN') !== -1
          )
        ) {
          const userOrgUnit = _.find(USER_ORG_UNITS, ['id', 'USER_ORGUNIT']);
          dataSelectionItems = [
            {
              id: 'USER_ORGUNIT',
              name: userOrgUnit ? userOrgUnit.name : '',
              type: userOrgUnit ? userOrgUnit.type : 'USER_ORGANISATION_UNIT'
            }
          ];
        }
      }

      // Set preferences for including org unit children
      if (preferences.includeOrgUnitChildren) {
        if (
          _.some(dataSelection.items, (item: any) => {
            if (!item.id) {
              return false;
            }
            return (
              item.type &&
              ((item.type.indexOf('USER') !== -1 &&
                item.id.indexOf('CHILDREN') === -1) ||
                (item.type.indexOf('LEVEL') !== -1 &&
                  item.id.indexOf('LEVEL') === -1) ||
                ((item.type.indexOf('USER') === -1 ||
                  item.type.indexOf('LEVEL') !== -1) &&
                  item.id.indexOf('LEVEL') === -1))
            );
          })
        ) {
          const lowestOrgUnitLevel = _.min(
            _.filter(_.map(dataSelection.items, (item: any) => item.level))
          );

          if (lowestOrgUnitLevel) {
            dataSelectionItems = [
              ...dataSelection.items,
              {
                id: `LEVEL-${lowestOrgUnitLevel + 1}`,
                name: `Level ${lowestOrgUnitLevel + 1}`
              }
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
    default:
      return dataSelection;
  }
}
