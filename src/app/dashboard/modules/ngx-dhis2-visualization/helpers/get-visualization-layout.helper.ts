import { VisualizationDataSelection, VisualizationLayout } from '../models';
import * as _ from 'lodash';

export function getVisualizationLayout(
  dataSelections: VisualizationDataSelection[]
): VisualizationLayout {
  if (!dataSelections) {
    return null;
  }
  const groupedLayout = _.groupBy(
    _.map(dataSelections, dataSelection => {
      return {
        dimension: dataSelection.dimension,
        layout: dataSelection.layout
      };
    }),
    'layout'
  );

  return getStandardizedLayout(groupedLayout);
}

function getStandardizedLayout(layoutObject: any): VisualizationLayout {
  const layoutKeys = _.keys(layoutObject);
  const newLayout: VisualizationLayout = {
    rows: ['dx'],
    columns: ['ou'],
    filters: []
  };
  _.each(layoutKeys, layoutKey => {
    const layouts = layoutObject[layoutKey];
    newLayout[layoutKey] = _.map(layouts, layout => layout.dimension);
  });
  return newLayout;
}
