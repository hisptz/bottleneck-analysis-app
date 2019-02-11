import * as _ from 'lodash';
import { getStandardizedDimensions } from './get-standardized-dimensions.helper';

export function getSelectionDimensionsFromFavorite(favoriteLayer) {
  if (!favoriteLayer) {
    return [];
  }

  const favoriteDataElements = _.map(
    favoriteLayer.dataElementDimensions || [],
    dataElementDimension => dataElementDimension.dataElement
  );

  return _.filter(
    [
      ...getStandardizedDimensions(
        favoriteLayer.rows,
        favoriteDataElements,
        'rows'
      ),
      ...getStandardizedDimensions(
        favoriteLayer.columns,
        favoriteDataElements,
        'columns'
      ),
      ...getStandardizedDimensions(
        favoriteLayer.filters,
        favoriteDataElements,
        'filters'
      )
    ],
    dataSelection => dataSelection.dimension !== 'dy'
  );
}
