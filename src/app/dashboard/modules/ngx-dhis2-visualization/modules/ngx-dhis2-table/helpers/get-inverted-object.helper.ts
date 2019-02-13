import * as _ from 'lodash';
export function getInvertedObject(originalObject) {
  const invertedObject = _.invert(originalObject);
  const invertedObjectKeys = _.keys(invertedObject);
  return invertedObjectKeys
    .join(',')
    .split(',')
    .map(item => {
      const matchingKeyArray = invertedObjectKeys.filter(
        invertedKey => invertedKey.indexOf(item) > -1
      );
      return {
        item,
        value: invertedObject[matchingKeyArray[0]]
      };
    })
    .reduce((key, keyItem) => {
      key[keyItem.item] = keyItem.value;
      return key;
    }, {});
}
