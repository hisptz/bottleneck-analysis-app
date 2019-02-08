import { getMetadataArray } from './get-metadata-array.helper';

export function prepareSingleCategories(
  analyticsObject,
  itemIdentifier,
  preDefinedItems = []
) {
  const structure = [];
  if (preDefinedItems.length === 0) {
    for (const val of getMetadataArray(analyticsObject, itemIdentifier)) {
      structure.push({
        name: analyticsObject.metaData.names[val],
        uid: val,
        type: itemIdentifier
      });
    }
  }
  if (preDefinedItems.length !== 0) {
    for (const val of preDefinedItems) {
      structure.push({
        name: analyticsObject.metaData.names[val],
        uid: val,
        type: itemIdentifier
      });
    }
  }
  return structure;
}
