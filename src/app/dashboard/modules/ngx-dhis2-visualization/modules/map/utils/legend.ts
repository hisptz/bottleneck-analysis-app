import { defaultClasses, defaultColorScale } from './transformVisualizationObject';
import { format, precisionRound } from 'd3-format';
import * as _ from 'lodash';
import { CLASSIFICATION_EQUAL_INTERVALS, CLASSIFICATION_EQUAL_COUNTS } from '../constants/layer.constant';

export const formatLegendItems = legendItems => {
  const sortedItems = _.sortBy(legendItems, 'startValue');
  return sortedItems.map(item => ({
    color: item.color,
    name: item.name,
    range: item.startValue + ' - ' + item.endValue
  }));
};

export const getBinsFromLegendItems = legendItems => {
  const sortedItems = _.sortBy(legendItems, 'startValue');
  const lastItem = sortedItems[sortedItems.length - 1];
  const bins = sortedItems.map(item => item.startValue);

  bins.push(lastItem.endValue);
  return bins;
};

export const getColorScaleFromLegendItems = legendItems => {
  const sortedItems = _.sortBy(legendItems, 'startValue');
  return sortedItems.map(item => item.color);
};

export const getLabelsFromLegendItems = legendItems => {
  const sortedItems = _.sortBy(legendItems, 'startValue');
  return sortedItems.map(item => item.name);
};

// Returns a legend created from a pre-defined legend set
export const getPredefinedLegendItems = legendSet => {
  const pickSome = ['name', 'startValue', 'endValue', 'color'];
  const sortedLegends = _.sortBy(legendSet.legends, 'startValue');
  const items = sortedLegends.map(legend => _.pick(legend, pickSome));

  return items.map(item =>
    item.name === `${item.startValue} - ${item.endValue}`
      ? { ...item, name: '' } // Clear name if same as startValue - endValue
      : item
  );
};

export const getAutomaticLegendItems = (
  data,
  method = CLASSIFICATION_EQUAL_INTERVALS,
  classes = defaultClasses,
  colorScale = defaultColorScale,
  displayName,
  type
) => {
  const items = data.length ? getLegendItems(data, method, classes) : [];
  const colors = colorScale.split(',');

  return {
    title: displayName,
    usePatterns: false,
    error:
      method === CLASSIFICATION_EQUAL_COUNTS && !items.length
        ? 'Error: Equal counts works with atleast 3 values'
        : null,
    type,
    items: items.map((item, index) => ({
      ...item,
      color: colors[index]
    }))
  };
};

export const getLegendItems = (values, method, numClasses) => {
  const minValue = values[0];
  const maxValue = values[values.length - 1];
  let bins;

  if (method === CLASSIFICATION_EQUAL_INTERVALS) {
    bins = getEqualIntervals(minValue, maxValue, numClasses);
  } else if (method === CLASSIFICATION_EQUAL_COUNTS) {
    bins = getQuantiles(values, numClasses);
  }
  const tmpBinValues = [];
  return bins.filter(item => {
    const uniq = !tmpBinValues.includes(item.startValue);
    tmpBinValues.push(item.startValue);
    return uniq;
  });
};

export const getEqualIntervals = (minValue, maxValue, numClasses) => {
  const bins = [];
  const binSize = (maxValue - minValue) / numClasses;
  const precision = precisionRound(binSize, maxValue);

  const valueFormat = format(`.${precision}f`);

  for (let i = 0; i < numClasses; i++) {
    const startValue = minValue + i * binSize;
    const endValue = i < numClasses - 1 ? startValue + binSize : maxValue;

    bins.push({
      startValue: Number(valueFormat(startValue)),
      endValue: Number(valueFormat(endValue))
    });
  }

  return bins;
};

export const getQuantiles = (values, numClasses) => {
  const minValue = values[0];
  const maxValue = values[values.length - 1];
  const bins = [];
  const binCount = values.length / numClasses;
  const precision = precisionRound((maxValue - minValue) / numClasses, maxValue);
  const valueFormat = format(`.${precision}f`);

  let binLastValPos = binCount === 0 ? 0 : binCount;

  if (values.length > 0) {
    bins[0] = minValue;
    for (let i = 1; i < numClasses; i++) {
      bins[i] = values[Math.round(binLastValPos)];
      binLastValPos += binCount;
    }
  }

  // bin can be undefined if few values
  return bins
    .filter(bin => bin !== undefined)
    .map((value, index) => ({
      startValue: Number(valueFormat(value)),
      endValue: Number(valueFormat(bins[index + 1] || maxValue))
    }))
    .filter(item => item.startValue !== item.endValue);
};
