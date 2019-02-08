import * as _ from 'lodash';
export function getDrilldownParentDataFromChildrenSeries(
  drilldownSeries: any[],
  parentId: string
): number {
  let parentData = 0;
  const correspondingSeriesObject = _.find(drilldownSeries, ['id', parentId]);

  if (correspondingSeriesObject) {
    parentData = _.reduce(
      _.map(correspondingSeriesObject.data, data => data.y),
      (sum, n) => {
        const newNumber = !isNaN(n) ? parseInt(n, 10) : 0;
        return parseInt(sum, 10) + newNumber;
      }
    );
  }
  return parentData;
}
