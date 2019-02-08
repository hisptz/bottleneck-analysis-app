import * as _ from 'lodash';
export function getCumulativeFormatForAnalytics(
  analyticsObject: any,
  xAxisType,
  yAxisType
) {
  const newAnalyticsObject = _.clone(analyticsObject);

  if (analyticsObject) {
    const yAxisDimensionArray = analyticsObject.metaData[yAxisType];
    const xAxisDimensionArray = [
      ..._.reverse([...analyticsObject.metaData[xAxisType]])
    ];
    const yAxisDimensionIndex = _.findIndex(
      analyticsObject.headers,
      _.find(analyticsObject.headers, ['name', yAxisType])
    );
    const xAxisDimensionIndex = _.findIndex(
      analyticsObject.headers,
      _.find(analyticsObject.headers, ['name', xAxisType])
    );
    const dataValueIndex = _.findIndex(
      analyticsObject.headers,
      _.find(analyticsObject.headers, ['name', 'value'])
    );
    const newRows: any[] = [];
    yAxisDimensionArray.forEach(yAxisDimensionValue => {
      let initialValue = 0;
      xAxisDimensionArray.forEach(xAxisDimensionValue => {
        analyticsObject.rows.forEach(row => {
          if (
            row[yAxisDimensionIndex] === yAxisDimensionValue &&
            row[xAxisDimensionIndex] === xAxisDimensionValue
          ) {
            initialValue += parseInt(row[dataValueIndex], 10);
            const newRow = _.clone(row);
            newRow[dataValueIndex] = initialValue;
            newRows.push(newRow);
          }
        });
      });
    });
    newAnalyticsObject.rows = _.assign([], newRows);
  }
  return newAnalyticsObject;
}
