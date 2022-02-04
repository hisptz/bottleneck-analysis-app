import { colors } from "@dhis2/ui";
import { LeafletMouseEvent } from "leaflet";
import { filter, find, flatten, head } from "lodash";

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

export function highlightFeature(e: LeafletMouseEvent, style: any) {
  const layer = e.target;
  layer.setStyle(style);
  // layer.bringToFront();
}

export function resetHighlight(e: LeafletMouseEvent, defaultStyle: any) {
  const layer = e.target;
  layer.setStyle(defaultStyle);
  // layer.bringToBack();
}

export function getColorFromLegendSet(legendSet: any, value: number): string {
  const legend = find(legendSet.legends, (legend: any) => legend.startValue <= value && legend.endValue >= value) ?? {};
  return legend.color ? legend.color : colors.grey900;
}

export function getLegendCount(legend: any, data: any) {
  const { startValue, endValue } = legend;
  return filter(data, (d: any) => d.data >= startValue && d.data <= endValue).length;
}
