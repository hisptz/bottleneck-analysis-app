import * as _ from 'lodash';

export function replaceArrayItem(array, replaceCriteriaObject: any, newItem: any) {
  const newArray = _.clone(array);
  const itemIndex = _.findIndex(array, replaceCriteriaObject);
  if (itemIndex !== -1) {
    return _.concat(
      _.slice(array, 0, itemIndex),
      newItem,
      _.slice(array, itemIndex + 1)
    );
  }

  return newArray;
}
