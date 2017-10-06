import {Visualization} from '../../dashboard/model/visualization';
import * as _ from 'lodash';

export function updateVisualizationWithAnalytics(visualizationObject: Visualization, loadedAnalytics: any[]) {
  const newVisualizationObject: Visualization = _.clone(visualizationObject);
  /**
   * Update visualization layer with analytics
   */
  newVisualizationObject.layers = _.map(newVisualizationObject.layers, (layer: any) => {
    const newLayer = _.clone(layer);
    const newSettings = newLayer ? newLayer.settings : null;
    const analyticsObject = _.find(loadedAnalytics, ['id', newSettings !== null ? newSettings.id : '']);
    if (analyticsObject) {
      newLayer.analytics = Object.assign({}, analyticsObject.content);
    }
    return newLayer;
  });

  return newVisualizationObject;
}
