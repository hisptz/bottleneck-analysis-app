import { map as _map } from 'lodash';
import { getDimensionItemType } from './get-dimension-item-type.helper';
import { generateUid } from 'src/app/helpers';

export function getSanitizedDimensionItems(dimensionObject: any) {
  return _map(dimensionObject.items, item => {
    return {
      id: item.dimensionItem || item.id || generateUid(),
      name: item.displayName || item.name,
      legendSet: item.legendSet,
      type: getDimensionItemType(dimensionObject.dimension, item)
    };
  });
}
