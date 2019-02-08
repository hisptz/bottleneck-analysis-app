export function getaTableDataValueColor(legendItems: any = [], value) {
  const isLast = index => index === legendItems.length - 1;
  const dataItem =
    value &&
    (legendItems || []).find(
      (item, index) =>
        value >= item.startValue &&
        (value < item.endValue || (isLast(index) && value === item.endValue))
    );

  return dataItem && dataItem.color;
}
