import * as _ from 'lodash';

import { getDimensionName } from './get-dimension-name.helper';
import { getSanitizedDimensionGroups } from './get-sanitized-dimension-groups.helper';
import { getSanitizedDimensionItems } from './get-sanitized-dimension-items.helper';

export function getStandardizedDimensions(
  dimensions: any[],
  dataElements: any[],
  dimensionLayout: string
) {
  return _.map(dimensions, dimensionObject => {
    const dimensionObjectInfo = _.find(dataElements, [
      'id',
      dimensionObject.dimension,
    ]);

    const dimensionItems = getSanitizedDimensionItems(dimensionObject);

    return {
      dimension: dimensionObject.dimension,
      name: getDimensionName(dimensionObject.dimension, dimensionObjectInfo),
      layout: dimensionLayout,
      filter: dimensionObject.filter,
      legendSet: dimensionObject.legendSet ? dimensionObject.legendSet.id : '',
      optionSet: dimensionObjectInfo ? dimensionObjectInfo.optionSet : null,
      items: dimensionItems,
      groups: getSanitizedDimensionGroups(
        dimensionObject.groups || [],
        dimensionItems
      ),
    };
  });
}
