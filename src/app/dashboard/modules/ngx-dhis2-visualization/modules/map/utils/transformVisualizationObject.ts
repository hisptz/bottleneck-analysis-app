import * as _ from 'lodash';
import { MapConfiguration } from '../models/map-configuration.model';
import { Layer } from '../models/layer.model';
import { getBboxBounds } from './layers';
import { getColorScale } from './colorBrewer';
import { config } from 'rxjs';

export function transformVisualizationObject(visualizationConfig, visualizationLayers, vizId) {
  if (!visualizationConfig || !visualizationLayers || !vizId) {
    return { visObject: {} };
  }
  let visObject = {};
  let geofeatures = {};
  let analytics = {};
  let orgUnitGroupSet = {};
  let serverSideConfig = {};
  const { id, name, subtitle, latitude, longitude, basemap, zoom, fullScreen = false } = visualizationConfig;
  const mapConfiguration: MapConfiguration = {
    id: id || vizId,
    name,
    subtitle,
    latitude,
    longitude,
    basemap,
    zoom,
    fullScreen
  };

  let layers: Layer[] = [];

  visualizationLayers.forEach(mapview => {
    const settings = mapview.config || mapview.settings || mapview;
    const layer = {
      id: settings.id,
      name: settings.name,
      overlay: true,
      visible: true,
      areaRadius: settings.areaRadius,
      displayName: settings.displayName,
      opacity: settings.opacity || 1,
      hidden: settings.hidden,
      type: settings.layer ? settings.layer.replace(/\d$/, '') : 'thematic' // Replace number in thematic layers
    };

    const _layerOptions = _.pick(settings, [
      'eventClustering',
      'eventPointRadius',
      'eventPointColor',
      'radiusHigh',
      'radiusLow'
    ]);

    const serverClustering = mapview.analytics && mapview.analytics.hasOwnProperty('count');
    if (serverClustering) {
      const bounds = getBboxBounds(mapview.analytics['extent']);
      serverSideConfig = { ...serverSideConfig, bounds };
    }
    const layerOptions = {
      ..._layerOptions,
      serverClustering,
      serverSideConfig
    };

    const legendProperties = {
      colorLow: settings.colorLow,
      colorHigh: settings.colorHigh,
      colorScale: settings.colorScale || defaultColorScale,
      classes: settings.classes || defaultClasses,
      method: settings.method || 2
    };

    const labelFontColor = settings.labelFontColor || '#000000';
    const labelFontSize = settings.labelFontSize || 12;
    const labelFontStyle = settings.labelFontStyle || 'normal';

    const displaySettings = {
      ..._.pick(settings, ['labelFontWeight', 'labels', 'hideTitle', 'hideSubtitle']),
      labelFontColor,
      labelFontSize,
      labelFontStyle
    };

    // const rows = (mapview.dataSelections || []).filter(dt => dt.dimension === 'ou');
    // const columns = (mapview.dataSelections || []).filter(dt => dt.dimension === 'dx');
    // const filters = (mapview.dataSelections || []).filter(dt => dt.dimension === 'pe');

    const { rows, columns, filters } = settings;

    const dataSelections = Object.assign(
      {},
      _.pick(settings, [
        'config',
        'parentLevel',
        'completedOnly',
        'translations',
        'interpretations',
        'program',
        'programStage',
        'columns',
        'rows',
        'filters',
        'aggregationType',
        'organisationUnitGroupSet',
        'startDate',
        'endDate'
      ]),
      { rows, columns, filters }
    );

    const legendSet = settings.legendSet;

    const layerObj = {
      ...layer,
      layerOptions,
      legendProperties,
      displaySettings,
      legendSet,
      dataSelections
    };

    const geoFeature = { [settings.id]: settings.geoFeature };
    const analytic = { [settings.id]: mapview.analytics };
    const orgGroupSet = { [settings.id]: settings.organisationUnitGroupSet };
    geofeatures = { ...geofeatures, ...geoFeature };
    analytics = { ...analytics, ...analytic };
    orgUnitGroupSet = { ...orgUnitGroupSet, ...orgGroupSet };
    layers = [...layers, layerObj];
  });

  visObject = {
    ...visObject,
    mapConfiguration,
    orgUnitGroupSet,
    layers,
    geofeatures,
    analytics
  };

  return {
    visObject
  };
}

const defaultScaleKey = 'YlOrBr';
const defaultClasses = 5;
const isVersionGreater = Number(localStorage.getItem('version')) >= 2.28;
const defaultColorScale = getColorScale(defaultScaleKey, defaultClasses);
