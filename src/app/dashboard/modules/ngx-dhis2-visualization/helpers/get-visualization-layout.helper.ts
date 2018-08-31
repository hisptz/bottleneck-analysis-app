import { VisualizationDataSelection, VisualizationLayout } from '../models';
import * as _ from 'lodash';

export function getVisualizationLayout(
  dataSelections: VisualizationDataSelection[]
): VisualizationLayout {
  if (!dataSelections) {
    return null;
  }
  const groupedLayout = _.groupBy(dataSelections, 'layout');

  return getStandardizedLayout(groupedLayout);
}

function getStandardizedLayout(layoutObject: any): VisualizationLayout {
  const layoutKeys = _.keys(layoutObject);
  const newLayout: VisualizationLayout = {
    rows: [{ dimension: 'dx', name: 'Data' }],
    columns: [{ dimension: 'ou', name: 'Organisation unit' }],
    filters: []
  };
  _.each(layoutKeys, layoutKey => {
    const layouts = _.some(
      layoutObject[layoutKey],
      (layout: any) => layout.groups && layout.groups.length > 0
    )
      ? [...layoutObject[layoutKey], { dimension: 'groups', name: 'Groups' }]
      : layoutObject[layoutKey];

    newLayout[layoutKey] = _.map(layouts, layout => {
      return { dimension: layout.dimension, name: layout.name };
    });
  });
  return newLayout;
}
