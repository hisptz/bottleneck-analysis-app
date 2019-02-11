export function getMetadataArray(analyticsObject, metadataType: string) {
  let metadataArray = [];
  if (metadataType === 'dx') {
    metadataArray = analyticsObject.metaData.dx;
  } else if (metadataType === 'ou') {
    metadataArray = analyticsObject.metaData.ou;
  } else if (metadataType === 'co') {
    metadataArray = analyticsObject.metaData.co;
  } else if (metadataType === 'pe') {
    metadataArray = analyticsObject.metaData.pe;
  } else {
    metadataArray = analyticsObject.metaData[metadataType];
  }
  return metadataArray;
}
