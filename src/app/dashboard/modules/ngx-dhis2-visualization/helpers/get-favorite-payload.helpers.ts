import * as _ from 'lodash';
import { VisualizationLayer } from '../models';
import { getStandardizedVisualizationType } from './get-standardized-visualization-type.helper';
import { VisualizationDataSelection } from '@hisptz/ngx-dhis2-visualization';
export function getFavoritePayload(
  visualizationLayers: VisualizationLayer[],
  originalType: string,
  currentType: string
) {
  if (visualizationLayers.length === 0) {
    return null;
  }

  // Get standardized visualization type
  const standardizedType = getStandardizedVisualizationType(originalType);

  switch (currentType) {
    case 'TABLE':
    case 'CHART': {
      const favoriteArray = _.map(
        visualizationLayers,
        (visualizationLayer: VisualizationLayer) => {
          const groupedDataSelections = _.groupBy(
            visualizationLayer.dataSelections,
            'layout'
          );
          return {
            ...visualizationLayer.config,
            id: visualizationLayer.id,
            columns: getSanitizedDataSelections(
              groupedDataSelections['columns']
            ),
            rows: getSanitizedDataSelections(groupedDataSelections['rows']),
            filters: getSanitizedDataSelections(
              groupedDataSelections['filters']
            )
          };
        }
      );

      // Get appropriate favorite type based on current selection
      const favoriteType =
        standardizedType === currentType
          ? originalType
          : currentType === 'CHART'
            ? 'CHART'
            : 'REPORT_TABLE';

      return favoriteArray[0]
        ? {
            url: `${_.camelCase(favoriteType)}s`,
            hasDifferentType: standardizedType !== currentType,
            favoriteType,
            favorite: _.omit(favoriteArray[0], [
              'visualizationType',
              'spatialSupport'
            ])
          }
        : null;
    }
  }
}

function getSanitizedDataSelections(dataSelections: any[]) {
  return _.map(dataSelections, dataSelection => {
    return {
      dimension: dataSelection.dimension,
      items: _.map(dataSelection.items || [], item => {
        return {
          id: item.id
        };
      })
    };
  });
}
