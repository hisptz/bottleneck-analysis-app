import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models';

export function generateDummyAnalytics(
  dataSelections: VisualizationDataSelection[]
) {
  const headers = [
    ..._.map(dataSelections, dataSelection => {
      return {
        name: dataSelection.dimension,
        column: dataSelection.name
      };
    }),
    { name: 'value', column: 'Value' }
  ];

  const metaData = { names: {} };

  _.each(dataSelections, dataSelection => {
    metaData[dataSelection.dimension] = _.map(
      dataSelection.items,
      (item: any) => item.id
    );
    const groupedItems = _.groupBy(dataSelection.items, 'id');

    _.each(_.keys(groupedItems), (itemId: string) => {
      metaData.names[itemId] =
        groupedItems[itemId][0].name || groupedItems[itemId][0].id;
    });
  });

  return {
    headers,
    metaData,
    rows: []
  };
}
