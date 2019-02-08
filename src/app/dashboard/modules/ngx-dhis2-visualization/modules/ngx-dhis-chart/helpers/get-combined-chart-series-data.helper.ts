import * as _ from 'lodash';
export function getCombinedChartSeriesData(seriesData: any) {
  let combinedSeriesData = [];
  seriesData.forEach(seriesDataArray => {
    seriesDataArray.forEach(seriesDataObject => {
      const availableSeriesData = _.find(combinedSeriesData, [
        'id',
        seriesDataObject.id
      ]);
      if (!availableSeriesData) {
        combinedSeriesData = [...combinedSeriesData, seriesDataObject];
      } else {
        const seriesDataIndex = _.findIndex(
          combinedSeriesData,
          availableSeriesData
        );
        const newSeriesObject = { ...seriesDataObject };
        newSeriesObject.y += availableSeriesData.y;
        combinedSeriesData = [
          ...combinedSeriesData.slice(0, seriesDataIndex),
          newSeriesObject,
          ...combinedSeriesData.slice(seriesDataIndex + 1)
        ];
      }
    });
  });

  return combinedSeriesData;
}
