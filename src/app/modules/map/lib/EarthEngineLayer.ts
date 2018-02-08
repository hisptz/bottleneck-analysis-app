import { datasets } from '../constants/earthengine.constant';
export const earthEngine = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    opacity,
    id,
    dataSelections,
    legendProperties,
    analyticsData
  } = options;
  const { config } = dataSelections;
  let layerConfig = {};
  let dataset;

  if (typeof config === 'string') {
    // From database as favorite
    layerConfig = JSON.parse(config);

    dataset = datasets[layerConfig['id']];

    if (dataset) {
      dataset.datasetId = layerConfig['id'];
      delete layerConfig['id'];
    }
  } else {
    dataset = datasets[options.datasetId];
  }

  const layer = {
    ...layerConfig,
    ...dataset
  };

  // Create legend items from params
  if (layer.legend && !layer.legend.items && layer.params) {
    const legendSet = {
      name: options.name,
      legend: {
        item: createLegend(layer.params)
      }
    };

    layer.legendSet = legendSet;
  }

  return layer;
};

export const createLegend = params => {
  const min = params.min;
  const max = params.max;
  const palette = params.palette.split(',');
  const step = (params.max - min) / (palette.length - (min > 0 ? 2 : 1));

  let from = min;
  let to = Math.round(min + step);

  return palette.map((color, index) => {
    const item = {
      color: color
    };

    if (index === 0 && min > 0) {
      // Less than min
      item['name'] = '< ' + min;
      to = min;
    } else if (from < max) {
      item['name'] = from + ' - ' + to;
    } else {
      // Higher than max
      item['name'] = '> ' + from;
    }

    from = to;
    to = Math.round(min + step * (index + (min > 0 ? 1 : 2)));

    return item;
  });
};
