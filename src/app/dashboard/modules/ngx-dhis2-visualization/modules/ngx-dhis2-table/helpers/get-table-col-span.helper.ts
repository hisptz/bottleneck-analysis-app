import { prepareSingleCategories } from './prepare-single-categories.helper';

export function getTableColSpan(analyticsObject, array, item) {
  const indexOfItem = array.indexOf(item);
  const array_length = array.length;
  const last_index = array_length - 1;
  const dimensions = { col_span: 1, duplication: 1 };
  for (let i = last_index; i > indexOfItem; i--) {
    const arr = prepareSingleCategories(analyticsObject, array[i]);
    dimensions.col_span = dimensions.col_span * arr.length;
  }
  for (let i = 0; i < indexOfItem; i++) {
    const arr = prepareSingleCategories(analyticsObject, array[i]);
    dimensions.duplication = dimensions.duplication * arr.length;
  }
  return dimensions;
}
