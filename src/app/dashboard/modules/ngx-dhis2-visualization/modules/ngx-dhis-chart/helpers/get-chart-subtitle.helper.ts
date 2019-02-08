import * as _ from 'lodash';
export function getChartSubtitleObject(
  chartConfiguration: any,
  analyticsObject: any
): any {
  if (chartConfiguration.hideSubtitle) {
    return null;
  }
  return {
    text: _.map(chartConfiguration.zAxisType, (zAxis: string) =>
      _.map(
        analyticsObject && analyticsObject.metaData
          ? analyticsObject.metaData[zAxis] || []
          : [],
        (itemId: string) =>
          analyticsObject &&
          analyticsObject.metaData &&
          analyticsObject.metaData.names
            ? analyticsObject.metaData.names[itemId] || []
            : []
      ).join(', ')
    ).join(' - '),
    align: 'left',
    style: {
      fontWeight: '600',
      fontSize: '13px'
    }
  };
}
