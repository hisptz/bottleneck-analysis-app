import * as _ from 'lodash';
import { VisualizationDataSelection } from '../models';

export function generateDummyAnalytics(
  dataSelections: VisualizationDataSelection[],
  analytics: any
) {
  const headers = getDummyAnalyticsHeaders(dataSelections);

  const metaData = { names: {} };

  const sanitizedDataSelections = getSanitizedDataSelections(
    dataSelections,
    analytics ? analytics.metaData : null
  );
  _.each(sanitizedDataSelections, dataSelection => {
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

function getDummyAnalyticsHeaders(
  dataSelections: VisualizationDataSelection[]
) {
  return [
    ..._.map(dataSelections, dataSelection => {
      return {
        name: dataSelection.dimension,
        column: dataSelection.name
      };
    }),
    { name: 'value', column: 'Value' }
  ];
}
function getSanitizedDataSelections(
  dataSelections: VisualizationDataSelection[],
  analyticsMetadata: any
) {
  return _.map(dataSelections, (dataSelection: VisualizationDataSelection) => {
    const metadataItems = _.map(
      (analyticsMetadata || {})[dataSelection.dimension] || [],
      (metadataItemId: string) => {
        return {
          id: metadataItemId,
          name: analyticsMetadata.names
            ? analyticsMetadata.names[metadataItemId]
            : metadataItemId
        };
      }
    );
    return {
      ...dataSelection,
      items: metadataItems.length > 0 ? metadataItems : dataSelection.items
    };
  });
}
