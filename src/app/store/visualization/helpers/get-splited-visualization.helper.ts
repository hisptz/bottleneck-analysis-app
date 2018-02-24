import { Visualization } from '../visualization.state';
import { getISOFormatFromRelativePeriod } from './get-iso-format-from-relative-period.helper';
import { getSplitedAnalytics } from './get-splited-analytics.helper';
import { getSplitedFavorite } from './get-splited-favorite.helper';
import * as _ from 'lodash';

export function getSplitedVisualization(visualization: Visualization) {
  const visualizationObject: Visualization = { ...visualization };
  const { layers, type } = visualizationObject;
  if (type === 'MAP') {
    return visualization;
  }

  let newSplitedLayers: any[] = [];
  const favoriteObjectArray = layers.map(layer => splitPeriodISo(layer.settings, layer.analytics));

  const analyticsObjectArray = layers.map(layer => layer.analytics);

  /**
   * Split analytics
   */

  const splitedAnalytics = analyticsObjectArray.map(analyticsObject => {
    if (analyticsObject) {
      return getSplitedAnalytics(analyticsObject, ['dx', 'pe']);
    }
  })[0];

  const splitedFavourite = favoriteObjectArray.map(favoriteObject =>
    getSplitedFavorite(favoriteObject, ['dx', 'pe'])
  )[0];
  splitedFavourite.map(favoriteObject => {
    splitedAnalytics.map(analytics => {
      const analyticsId = favoriteObject.analyticsIdentifier;
      const dataDimension = analytics.metaData['dx'][0];
      const periodDimension = analytics.metaData['pe'][0];
      const isSplited =
        analyticsId === `${dataDimension}_${periodDimension}` ||
        analyticsId === `${periodDimension}_${dataDimension}`;
      if (isSplited) {
        newSplitedLayers = [
          ...newSplitedLayers,
          {
            settings: favoriteObject,
            analytics: analytics
          }
        ];
      }
    });
  });

  /**
   * Split favorite
   */

  visualizationObject.layers = [...newSplitedLayers];

  return visualizationObject;
}

export const splitPeriodISo = (settings, analytics) => {
  const metaData = analytics.metaData;
  const { pe, names } = metaData;

  const { rows, columns, filters } = settings;

  const items = pe.map(id => {
    return {
      id,
      dimensionItemType: 'PERIOD',
      displayName: names[id],
      dimensionItem: id
    };
  });
  const parentdimension = getPeriodParentDimension(settings);
  const periodIndex = _.findIndex(settings[parentdimension], ['dimension', 'pe']);
  const dimensions = settings[parentdimension].map((dimension, index) => {
    if (index === periodIndex) {
      return { dimension: 'pe', items };
    }
    return dimension;
  });
  const data = { [parentdimension]: dimensions };
  return { ...settings, ...data };
};

const getDimension = (dimension, arr) => arr.filter(item => item.dimension === dimension)[0];

const getDimensionItems = (dimension, arr) => {
  const dataItems = getDimension(dimension, arr);
  return dataItems && dataItems.items ? arr : [];
};

const getPeriodParentDimension = settings => {
  const keys = ['rows', 'columns', 'filters'];
  const parentdimensions = keys.filter(key => getDimensionItems('pe', settings[key]).length);
  return parentdimensions[0];
};
