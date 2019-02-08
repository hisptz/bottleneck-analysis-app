import { getTableTitleIndex } from './get-table-index.helper';

export function getTableDataValue(analyticsObject, dataItems = []) {
  let num = null;
  for (const value of analyticsObject.rows) {
    let counter = 0;
    for (const item of dataItems) {
      if (
        value[getTableTitleIndex(analyticsObject.headers, item.type)] ===
        item.value
      ) {
        counter++;
      }
    }
    if (counter === dataItems.length) {
      if (isNaN(value[getTableTitleIndex(analyticsObject.headers, 'value')])) {
        num = value[getTableTitleIndex(analyticsObject.headers, 'value')];
      } else {
        num += parseFloat(
          value[getTableTitleIndex(analyticsObject.headers, 'value')]
        );
      }
    }
  }
  return num;
}
