import * as _ from 'lodash';
import { getDataItemsFromColumns, getPeriodNameFromId, getPeriodFromFilters } from '../utils/analytics';
import { getLegendItemForValue } from '../utils/classify';
import { toGeoJson } from './GeoJson';
import geoJsonExtended from './Choropleth';
import { getAutomaticLegendItems } from '../utils/legend';
import Patterns from '../utils/patterns';

export const thematic = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    dataSelections,
    legendProperties,
    legendSet,
    analyticsData
  } = options;
  const { radiusLow, radiusHigh } = layerOptions;
  const { labelFontStyle, labelFontSize, labelFontColor, labelFontWeight, labels, values } = displaySettings;
  const features = toGeoJson(geofeature);
  const valueById = getValueById(analyticsData);
  const layerDx = getDx(analyticsData);
  const valueFeatures = features.filter(({ id }) => valueById[id] !== undefined);
  const orderedValues = getOrderedValues(analyticsData);
  const minValue = orderedValues[0];
  const maxValue = orderedValues[orderedValues.length - 1];
  const selectionItems = [...dataSelections.columns, ...dataSelections.rows, ...dataSelections.filters];
  const dataItem = getDataItemsFromColumns(selectionItems)[0];
  const name = options.name || dataItem.name;
  const { method, classes, colorScale } = legendProperties;
  const period = getPeriodFromFilters(selectionItems);
  const legendName = `${dataItem && dataItem.name}-${getPeriodNameFromId(period)}`;
  const legend = legendSet
    ? createLegendFromLegendSet(legendSet, legendName, options.type)
    : getAutomaticLegendItems(orderedValues, method, classes, colorScale, legendName, options.type);
  legend.items.forEach(item => (item.count = 0));
  const getLegendItem = _.curry(getLegendItemForValue)(legend.items);
  legend['period'] = getPeriodNameFromId(period);

  valueFeatures.forEach(({ id, properties }) => {
    const value = valueById[id];
    const item = getLegendItem(value);
    if (item) {
      item.count++;
    }

    properties.value = value;
    properties.label = name;
    properties.dx = layerDx;
    properties.color = item && item.color;
    properties.style = legend.usePatterns
      ? generatePatternStyle(item.pattern, id)
      : {
          color: '#333',
          fillColor: item && item.color,
          fillOpacity: opacity,
          opacity,
          weight: 1,
          fill: true,
          stroke: true
        };
    properties.labelStyle = {
      fontSize: labelFontSize,
      fontStyle: labelFontStyle,
      fontColor: labelFontColor,
      fontWeight: labelFontWeight
    };
    properties.radius = ((value - minValue) / (maxValue - minValue)) * (radiusHigh - radiusLow) + radiusLow;
  });

  valueFeatures.forEach(({ id, properties }) => {
    const value = valueById[id];
    const item = getLegendItem(value);
    if (item) {
      properties.percentage = ((item.count / orderedValues.length) * 100).toFixed(1);
    }
  });

  const _options = {
    label: labels ? (values ? '{name}({value})' : '{name}') : undefined,
    hoverLabel: undefined,
    labelPane: `${options.id}-labels`,
    data: valueFeatures
  };

  const geoJsonLayer = geoJsonExtended(_options);

  const bounds = geoJsonLayer.getBounds();
  const _legendSet = {
    layer: options.id,
    opacity,
    hidden: false,
    legend
  };
  const optionsToReturn = {
    ...options,
    features,
    legendSet: _legendSet,
    geoJsonLayer
  };
  if (bounds.isValid()) {
    return {
      ...optionsToReturn,
      bounds
    };
  }
  return optionsToReturn;
};

// Returns an object mapping org. units and values
const getValueById = data => {
  const { headers, rows } = data;
  const ouIndex = _.findIndex(headers, ['name', 'ou']);
  const valueIndex = _.findIndex(headers, ['name', 'value']);

  return rows.reduce((obj, row) => {
    obj[row[ouIndex]] = parseFloat(row[valueIndex]);
    return obj;
  }, {});
};

export const getDx = data => {
  const { headers, metaData, rows } = data;
  const { names, pe, dx, dimensions, items } = metaData;
  const dxID = (dx && dx[0]) || (dimensions && dimensions.dx[0]);
  return (names && names[dxID]) || items[dxID].name;
};

// Returns an array of ordered values
const getOrderedValues = data => {
  const { headers, rows } = data;
  const valueIndex = _.findIndex(headers, ['name', 'value']);

  return rows.map(row => parseFloat(row[valueIndex])).sort((a, b) => a - b);
};

const createLegendFromLegendSet = (legendSet, displayName, type) => {
  const { name, legends, legendSetType } = legendSet;
  const pickSome = ['name', 'startValue', 'endValue', 'color', 'pattern'];
  const sortedLegends = _.sortBy(legends, 'startValue');
  const items = sortedLegends.map(legend => _.pick(legend, pickSome));
  return {
    usePatterns: legendSetType === 'pattern',
    title: displayName || name,
    type,
    items
  };
};

const generatePatternStyle = (pattern, id) => {
  const color = '#333';
  const fillPattern = getFillPattern(pattern, color, id);
  return {
    color,
    fillPattern
  };
};

const getFillPattern = (pattern, selectedColor, id) => {
  switch (pattern) {
    case 'checkerboardPattern':
      return Patterns.CheckerBoardPattern({
        key: 'checkerboard' + id,
        color: selectedColor,
        width: 20,
        height: 20
      });
    case 'circlePattern':
      return Patterns.CirclePattern({
        x: 7,
        y: 7,
        radius: 5,
        fill: true,
        width: 15,
        height: 15,
        color: selectedColor,
        key: 'circle' + id
      });
    case 'rectPattern':
      return Patterns.RectPattern({
        width: 25,
        height: 25,
        rx: 2,
        ry: 2,
        fill: true,
        color: selectedColor,
        key: 'rect' + id
      });
    case 'stripePattern':
      return Patterns.StripePattern({
        key: 'stripe' + id,
        color: selectedColor
      });
    case 'linesPattern':
      return Patterns.PathPattern({
        d: 'M0 0 V 25',
        stroke: true,
        weight: 4,
        spaceWeight: 4,
        color: selectedColor,
        spaceColor: '#ffffff',
        opacity: 1.0,
        spaceOpacity: 0.0,
        key: 'path' + selectedColor
      });
    case 'chevronPattern':
      return Patterns.PathPattern({
        d: 'M8 2.156l-1.406 1.438-6.594 6.563v5.688l.125-.125 7.875-7.906 8 8v-5.625l-6.594-6.594-1.406-1.438z',
        fill: true,
        key: 'path' + selectedColor,
        width: 25,
        height: 25,
        x: 5,
        y: 5,
        color: selectedColor
      });
    case 'trianglePattern':
      return Patterns.PathPattern({
        d: 'M10 0 L7 20 L25 20 Z',
        fill: true,
        key: 'path' + selectedColor,
        width: 25,
        height: 25,
        x: 5,
        y: 5,
        color: selectedColor
      });
  }
};
