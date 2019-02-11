export function getTableTitleIndex(analyticsObjectHeaders, name: string) {
  let index = 0;
  let counter = 0;
  for (const header of analyticsObjectHeaders) {
    if (header.name === name) {
      index = counter;
    }
    counter++;
  }
  return index;
}
