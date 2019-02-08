import * as _ from 'lodash';
import { getCombinedChartSeriesData } from './get-combined-chart-series-data.helper';
export function getSortedChartSeries(series, sortOrder) {
  let newSeries = [...series];
  let seriesCategories = [];

  /**
   * Combine all available series for sorting
   */
  const combinedSeriesData = [
    ...getCombinedChartSeriesData(
      _.map(series, seriesObject => seriesObject.data)
    )
  ];

  if (sortOrder === 1) {
    seriesCategories = _.map(
      _.reverse(_.sortBy(combinedSeriesData, ['y'])),
      seriesData => seriesData.id
    );
    newSeries = _.map(newSeries, seriesObject => {
      const newSeriesObject: any = { ...seriesObject };

      if (seriesCategories.length > 0) {
        newSeriesObject.data = [
          ..._.map(seriesCategories, seriesCategory =>
            _.find(seriesObject.data, ['id', seriesCategory])
          )
        ];
      }

      return newSeriesObject;
    });
  } else if (sortOrder === -1) {
    seriesCategories = _.map(
      _.sortBy(combinedSeriesData, ['y']),
      seriesData => seriesData.id
    );
    newSeries = _.map(series, seriesObject => {
      const newSeriesObject: any = { ...seriesObject };

      if (seriesCategories.length > 0) {
        newSeriesObject.data = [
          ..._.map(seriesCategories, seriesCategory =>
            _.find(seriesObject.data, ['id', seriesCategory])
          )
        ];
      }
      return newSeriesObject;
    });
  }
  return newSeries;
}
