import {Visualization} from '../../dashboard/model/visualization';
import * as _ from 'lodash';

export function updateVisualizationObjectWithChartObject(visualizationObject: Visualization) {
  const newVisualizationObject = _.clone(visualizationObject);
  /**
   * Update visualization layers with chart configuration
   */
  const visualizationObjectLayersWithChartConfiguration = _.map(visualizationObject.layers, (layer, layerIndex) => {
    const newLayer = _.clone(layer);
    const newSettings = _.clone(layer.settings);
    newSettings.chartConfiguration = _.assign({}, this.chartService.getChartConfiguration1(newSettings, newSettings.id + '_' + layerIndex));
    newLayer.settings = _.assign({}, newSettings);
    return newLayer;
  });

  /**
   * Update visualization layers with chart object
   */
  const visualizationObjectLayersWithChartObject = _.map(visualizationObjectLayersWithChartConfiguration, (layer) => {
    const newLayer = _.clone(layer);
    newLayer.chartObject = _.assign({}, this.chartService.getChartObject(newLayer.analytics, newLayer.settings.chartConfiguration));
    return newLayer;
  })

  newVisualizationObject.layers = _.assign([], visualizationObjectLayersWithChartObject);

  return newVisualizationObject;
}
