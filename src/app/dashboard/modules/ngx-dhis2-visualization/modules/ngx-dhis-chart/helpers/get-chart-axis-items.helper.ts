import * as _ from 'lodash';
export function getChartAxisItems(
  analyticsObject: any,
  axisTypeArray: any[],
  isCategory: boolean = false
) {
  let items: any[] = [];
  const metadataNames = analyticsObject.metaData.names;
  axisTypeArray.forEach((axisType, axisIndex) => {
    const itemKeys = analyticsObject.metaData[axisType];
    if (itemKeys) {
      if (axisIndex > 0) {
        const availableItems = _.assign([], items);
        items = [];
        itemKeys.forEach(itemKey => {
          availableItems.forEach(item => {
            items.push({
              id: item.id + '_' + itemKey,
              name: item.name + '_' + metadataNames[itemKey].trim()
            });
          });
        });
      } else {
        items = _.map(itemKeys, itemKey => {
          return {
            id: itemKey,
            name: metadataNames[itemKey].trim()
          };
        });
      }
    }
  });

  return items;
}
