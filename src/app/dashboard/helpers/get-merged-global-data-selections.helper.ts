import * as _ from 'lodash';

import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';
import { getUniqueDataSelectionItems } from './get-unique-data-selection-items.helper';
import { generateUid } from 'src/app/helpers';
import { DataGroup } from 'src/app/models';

export function getMergedGlobalDataSelectionsFromVisualizationLayers(
  dataSelectionsArray: Array<VisualizationDataSelection[]>
) {
  let mergedDataSelections = [];

  _.each(
    dataSelectionsArray,
    (dataSelections: VisualizationDataSelection[]) => {
      _.each(dataSelections, (dataSelection: VisualizationDataSelection) => {
        const availableDataSelection = _.find(mergedDataSelections, [
          'dimension',
          dataSelection.dimension
        ]);

        if (availableDataSelection) {
          const availableDataSelectionIndex = mergedDataSelections.indexOf(
            availableDataSelection
          );

          mergedDataSelections = [
            ..._.slice(mergedDataSelections, 0, availableDataSelectionIndex),
            {
              ...availableDataSelection,
              ...dataSelection,
              items: getUniqueDataSelectionItems([
                ...availableDataSelection.items,
                ...dataSelection.items
              ])
            },
            ..._.slice(mergedDataSelections, availableDataSelectionIndex + 1)
          ];
        } else {
          mergedDataSelections = [...mergedDataSelections, dataSelection];
        }
      });
    }
  );

  return _.map(
    mergedDataSelections,
    (dataSelection: VisualizationDataSelection) => {
      switch (dataSelection.dimension) {
        case 'ou':
          const OuItemsContainUserOrgUnits = _.some(
            dataSelection.items,
            (item: any) => item.id.indexOf('USER') !== -1
          );

          return {
            ...dataSelection,
            items: OuItemsContainUserOrgUnits
              ? _.filter(dataSelection.items, (item: any) => {
                  return item.id !== 'USER_ORGUNIT';
                })
              : dataSelection.items
          };
        case 'dx':
          const dataSelectionItems = _.map(
            dataSelection.items || [],
            (dataSelectionItem: any) => {
              return {
                ...dataSelectionItem,
                id: dataSelectionItem.id || generateUid()
              };
            }
          );
          return {
            ...dataSelection,
            items: dataSelectionItems,
            groups: _.map(
              dataSelection.groups || [],
              (dataSelectionGroup: DataGroup) => {
                return {
                  ...dataSelectionGroup,
                  id: dataSelectionGroup.id || generateUid(),
                  members: _.map(
                    dataSelectionGroup.members || [],
                    (groupMember: any) => {
                      const correspondingMember = _.find(dataSelectionItems, [
                        'name',
                        groupMember.name
                      ]);

                      return {
                        ...groupMember,
                        id:
                          groupMember.id ||
                          (correspondingMember
                            ? correspondingMember.id
                            : generateUid())
                      };
                    }
                  )
                };
              }
            )
          };
        default:
          return dataSelection;
      }
    }
  );
}
