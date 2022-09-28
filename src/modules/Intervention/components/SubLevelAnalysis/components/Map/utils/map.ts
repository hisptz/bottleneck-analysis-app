import { colors } from "@dhis2/ui";
import { LeafletMouseEvent } from "leaflet";
import { filter, find, flatten, head, set } from "lodash";
import { defaultLegendSet } from "../constants/legendSet";
import type { OrgUnitSelection } from "@hisptz/dhis2-utils";

export function convertCoordinates([lng, lat]: [number, number]): { lat: number; lng: number } {
  return {
    lat: lat,
    lng: lng
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
  const legends = legendSet?.legends ?? defaultLegendSet.legends;
  const legend = find(legends ?? [], (legend: any) => legend?.startValue <= value && legend?.endValue >= value) ?? {};
  return legend.color ? legend.color : colors.grey900;
}

export function getLegendCount(legend: any, data: any) {
  const { startValue, endValue } = legend;
  return filter(data, (d: any) => d.data >= startValue && d.data <= endValue).length;
}


export function getOrgUnitSelectionFromOrgUnitList(orgUnits: Array<string>): OrgUnitSelection {
  const orgUnitSelection: OrgUnitSelection = {};

  if (orgUnits.includes("USER_ORGUNIT")) {
    set(orgUnitSelection, "userOrgUnit", true);

  }
  if (orgUnits.includes("USER_ORGUNIT_CHILDREN")) {
    set(orgUnitSelection, "userSubUnit", true);
  }
  if (orgUnits.includes("USER_ORGUNIT_GRANDCHILDREN")) {
    set(orgUnitSelection, "userSubX2Unit", true);
  }
  const levels = orgUnits.filter(ou => ou.match(/LEVEL-/)).map(level => level.replaceAll(/LEVEL-/g, ""));
  const groups = orgUnits.filter(ou => ou.match(/OU_GROUP-/)).map(level => level.replaceAll(/OU_GROUP-/g, ""));
  const orgUnitsIds = orgUnits.filter(ou => ![...levels, ...groups, "USER_ORGUNIT", "USER_ORGUNIT_CHILDREN", "USER_ORGUNIT_GRANDCHILDREN"].includes(ou));

  set(orgUnitSelection, "levels", levels);
  set(orgUnitSelection, "groups", groups);
  set(orgUnitSelection, "orgUnits", orgUnitsIds);

  return orgUnitSelection;

}
