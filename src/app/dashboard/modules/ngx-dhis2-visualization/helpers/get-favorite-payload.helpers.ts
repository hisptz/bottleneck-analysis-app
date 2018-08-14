import * as _ from 'lodash';
import { VisualizationLayer } from '../models';
import { getStandardizedVisualizationType } from './get-standardized-visualization-type.helper';
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
            ...getFavoriteOptionsByType(visualizationLayer.config, currentType),
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

function getFavoriteOptionsByType(favoriteDetails: any, favoriteType: string) {
  switch (favoriteType) {
    case 'CHART': {
      return {
        type: favoriteDetails.type || 'COLUMN',
        name: favoriteDetails.name || 'Untitled',
        title: favoriteDetails.title || null,
        description: favoriteDetails.description || '',
        prototype: favoriteDetails.prototype || {},
        percentStackedValues: favoriteDetails.percentStackedValues || false,
        cumulativeValues: favoriteDetails.cumulativeValues || false,
        hideEmptyRowItems: favoriteDetails.hideEmptyRowItems || 'NONE',
        regressionType: favoriteDetails.regressionType || 'NONE',
        completedOnly: favoriteDetails.completedOnly || false,
        targetLineValue: favoriteDetails.targetLineValue || null,
        baseLineValue: favoriteDetails.baseLineValue || null,
        sortOrder: favoriteDetails.sortOrder || 0,
        aggregationType: favoriteDetails.aggregationType || 'DEFAULT',
        rangeAxisMaxValue: favoriteDetails.rangeAxisMaxValue || null,
        rangeAxisMinValue: favoriteDetails.rangeAxisMinValue || null,
        rangeAxisSteps: favoriteDetails.rangeAxisSteps || null,
        rangeAxisDecimals: favoriteDetails.rangeAxisDecimals || null,
        noSpaceBetweenColumns: favoriteDetails.noSpaceBetweenColumns || false,
        hideLegend: favoriteDetails.hideLegend || false,
        hideTitle: favoriteDetails.hideTitle || false,
        hideSubtitle: favoriteDetails.hideSubtitle || false,
        subtitle: favoriteDetails.subtitle || null,
        reportParams: favoriteDetails.reportParams || {},
        showData: favoriteDetails.showData || true,
        targetLineLabel: favoriteDetails.targetLineLabel || null,
        baseLineLabel: favoriteDetails.baseLineLabel || null,
        domainAxisLabel: favoriteDetails.domainAxisLabel || null,
        rangeAxisLabel: favoriteDetails.rangeAxisLabel || null
      };
    }
    case 'TABLE': {
      return favoriteDetails;
    }
    default:
      return {};
  }
}
