import * as _ from 'lodash';
export function getTableDimensionItemsArray(
  dimensionItems: any[],
  analyticsObject
) {
  return _.map(dimensionItems, (dimensionItem: string) => {
    const metadataIds = analyticsObject.metaData[dimensionItem];
    return _.map(metadataIds || [], (metadataId: string) => {
      const metadataName =
        analyticsObject &&
        analyticsObject.metaData &&
        analyticsObject.metaData.names
          ? analyticsObject.metaData.names[metadataId]
          : '';
      return {
        id: metadataId,
        name: metadataName
      };
    });
  });
}
