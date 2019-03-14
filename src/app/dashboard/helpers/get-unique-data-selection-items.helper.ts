import * as _ from 'lodash';
export function getUniqueDataSelectionItems(dataSelectionItems: any[]) {
  const dataSelectionItemsHaveIds =
    _.filter(
      _.map(
        dataSelectionItems,
        (dataSelectionItem: any) => dataSelectionItem.id
      ),
      dataSelectionItemId => dataSelectionItemId
    ).length > 0;

  return dataSelectionItemsHaveIds
    ? _.uniqBy(dataSelectionItems, 'id')
    : _.uniqBy(dataSelectionItems, 'name');
}
