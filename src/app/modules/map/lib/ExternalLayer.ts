import * as L from 'leaflet';
import { tileLayer } from './TileLayer';

export const external = options => {
  const {
    geofeature,
    layerOptions,
    displaySettings,
    id,
    opacity,
    dataSelections,
    legendProperties,
    analyticsData
  } = options;

  const { config } = dataSelections;

  const layerConfiguration = JSON.parse(config);
  const { name, url, attribution } = layerConfiguration;
  const tileOptions = { name, url, label: name, attribution };
  const geoJsonLayer = tileLayer(tileOptions);
  const legend = {
    title: layerConfiguration.name,
    type: 'external',
    items: [{ name, url, geoJsonLayer }]
  };

  const legendSet = {
    legend,
    layer: id,
    hidden: false,
    opacity
  };
  return {
    ...options,
    geoJsonLayer,
    legendSet
  };
};
