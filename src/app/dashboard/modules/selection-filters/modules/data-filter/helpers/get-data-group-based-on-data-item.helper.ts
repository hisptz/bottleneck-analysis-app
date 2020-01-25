import { Determinant } from 'src/app/models';
import * as _ from 'lodash';

export function getDataGroupBasedOnDataItem(
  dataGroups: Determinant[],
  dataItem: any
) {
  if (!dataItem) {
    return null;
  }
  const dataItems = _.flatten(
    _.map(dataGroups || [], (dataGroup: Determinant) => {
      return _.map(dataGroup.members || [], member => {
        return {
          ...member,
          groupId: dataGroup.id,
        };
      });
    })
  );

  const dataItemWithGroup = _.find(dataItems, ['id', dataItem.id]);

  return _.find(dataGroups, [
    'id',
    dataItemWithGroup ? dataItemWithGroup.groupId : undefined,
  ]);
}
