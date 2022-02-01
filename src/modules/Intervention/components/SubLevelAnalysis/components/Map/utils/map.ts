import { flatten, flattenDeep, flattenDepth, head } from "lodash";

export function convertCoordinates([lng, lat]: [number, number]): { lat: number; lng: number } {
  return {
    lat: lat,
    lng: lng,
  };
}

export function getOrgUnitBoundaries(points: Array<any>, depth: number): Array<{ lat: number; lng: number }> {
  if (typeof head(points) === "number" || typeof head(points) === "string") {
    return [convertCoordinates(points as [number, number])];
  }
  return flatten(points.map(getOrgUnitBoundaries));
}
