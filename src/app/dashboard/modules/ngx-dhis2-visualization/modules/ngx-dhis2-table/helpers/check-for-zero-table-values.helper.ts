export function checkForZeroTableValues(stating_length, array): boolean {
  let checker = true;
  for (let i = stating_length; i < array.length; i++) {
    if (array[i].name === '' && array[i].val != null) {
      checker = false;
    }
  }
  return checker;
}
