import * as _ from 'lodash';
export function getDataSelectionUpdatedWithLegendSets(
  legendSets,
  selectedItems,
  selectedGroups
) {
  return {
    items: _.map(selectedItems, (selectedItem: any) => {
      const legendSet = _.find(legendSets, ['id', selectedItem.id]);
      return legendSet
        ? {
            ...selectedItem,
            legendSet
          }
        : selectedItem;
    }),
    groups: selectedGroups,
    dimension: 'dx'
  };
}
