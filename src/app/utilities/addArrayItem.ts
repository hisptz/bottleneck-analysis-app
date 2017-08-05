import * as _ from 'lodash';

export function addArrayItem(array: any[], newItem: any, identifier: string, addCriteria: string = 'last') {
  const newArray = _.clone(array);
  const availableItem = _.find(array, [identifier, newItem[identifier]]);

  if (!availableItem) {
    if (addCriteria === 'last') {
      return _.concat(array, newItem)
    } else if (addCriteria === 'first') {
      return _.concat(newItem, array)
    }
  }

  return newArray;
}
