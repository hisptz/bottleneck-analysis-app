export function convertCoordinates([lng, lat]: [number, number]): { lat: number; lng: number } {
  return {
    lat: lat,
    lng: lng,
  };
}
