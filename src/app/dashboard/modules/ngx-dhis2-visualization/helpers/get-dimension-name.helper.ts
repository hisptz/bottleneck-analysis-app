const defaultDimensionNames = {
  dx: 'Data',
  pe: 'Period',
  ou: 'Organisation unit'
};
export function getDimensionName(dimension: string, dimensionObject: any) {
  return dimensionObject
    ? dimensionObject.name
    : defaultDimensionNames[dimension];
}
