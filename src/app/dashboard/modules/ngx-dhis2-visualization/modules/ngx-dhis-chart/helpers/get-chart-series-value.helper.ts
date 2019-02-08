import * as _ from 'lodash';
export function getChartSeriesValue(
  analyticsRows,
  yAxisItemIndex,
  yAxisItemId,
  xAxisItemIndex,
  xAxisItemId,
  dataIndex
) {
  let finalValue = 0;
  const seriesValues = _.map(analyticsRows, row => {
    let seriesValue = 0;
    let xAxisRowId = '';
    _.forEach(xAxisItemIndex.split('_'), (axisIndex: any) => {
      xAxisRowId += xAxisRowId !== '' ? '_' : '';
      xAxisRowId += row[axisIndex];
    });

    if (row[yAxisItemIndex] === yAxisItemId && xAxisRowId === xAxisItemId) {
      const value = parseFloat(row[dataIndex]);
      if (isNaN(value)) {
        return row[dataIndex];
      }
      seriesValue += value;
    }
    return seriesValue;
  }).filter(value => value !== 0);

  if (seriesValues) {
    // Check if series values have non numeric content
    if (_.some(seriesValues, seriesValue => isNaN(seriesValue))) {
      return '';
    }
    // TODO find best way to identify ratios
    const isRatio = _.some(
      seriesValues,
      seriesValue => seriesValue.toString().split('.')[1]
    );

    const valueSum =
      seriesValues.length > 0
        ? seriesValues.reduce((sum, count) => sum + count)
        : 0;

    if (isRatio) {
      finalValue = parseFloat((valueSum / seriesValues.length).toFixed(2));
    } else {
      finalValue = valueSum;
    }
  }

  return finalValue !== 0 ? finalValue : null;
}
