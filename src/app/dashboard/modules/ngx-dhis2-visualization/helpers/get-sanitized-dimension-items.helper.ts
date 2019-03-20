import { map as _map } from 'lodash';

import { getDimensionItemType } from './get-dimension-item-type.helper';
import { VisualizationDataSelectionItem } from '../models';

export function getSanitizedDimensionItems(
  dimensionObject: any
): VisualizationDataSelectionItem[] {
  return _map(dimensionObject.items, item => {
    return {
      id: item.dimensionItem || item.id,
      name: item.displayName || item.name,
      label: item.label || item.displayName || item.name,
      legendSet: item.legendSet,
      type: getDimensionItemType(dimensionObject.dimension, item)
    };
  });
}
