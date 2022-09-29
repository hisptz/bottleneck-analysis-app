export interface User {
  id: string;
}

export type MapLayerLayout = "basemap" | "overlay";
export type ThematicLayerType = "choropleth" | "bubble";

export interface MapLayer {
  id: string;
  name: string;
  url?: string;
  layout: MapLayerLayout;
  enabled: boolean;
}

export interface BoundaryMapLayer {
  enabled: boolean;
}

export interface FacilityMapLayer {
  enabled: boolean;
  style: {
    groupSet?: string;
    icon?: string;
  };
}

export interface ThematicMapLayer {
  enabled: boolean;
  indicator: {
    id: string;
    name: string;
  };
  legendConfig: {
    legendSet?: string;
    colorClass?: string;
    scale?: number
  };
  type: ThematicLayerType;
}

export interface Map {
  enabled: boolean;
  coreLayers: {
    thematicLayers: ThematicMapLayer[];
    boundaryLayer: BoundaryMapLayer;
    facilityLayer: FacilityMapLayer;
  };
  externalLayers?: MapLayer[];
}

export interface LegendDefinition {
  id: string;
  color: string;
  name: string;
  isDefault?: boolean;
}

export interface Legend {
  id: string;
  endValue: number;
  startValue: number;
}

export interface DataItem {
  id: string;
  name: string;
  label: string;
  type: string;
  shortName?: string;
  legends: Array<Legend>;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  style?: { color: string };
  items: Array<DataItem>;
  sortOrder: number;
}

export interface DataSelection {
  groups: Array<Group>;
  legendDefinitions: Array<LegendDefinition>;
}

export interface OrgUnitSelection {
  orgUnit?: { id: string; type?: string };
  subLevel?: { id: string; level: number };
}

export interface PeriodSelection {
  id: string;
  type: string;
}

export interface Access {
  id: string;
  access: string;
}

export interface InterventionConfig {
  id: string;
  name: string;
  description: string;
  user: User;
  bookmarks?: Array<string>;
  publicAccess: string;
  externalAccess: boolean;
  userAccess: Array<Access>;
  userGroupAccess: Array<Access>;
  dataSelection: DataSelection;
  periodSelection: PeriodSelection;
  orgUnitSelection: OrgUnitSelection;
  map?: Map;
}

export interface InterventionSummary {
  id: string;
  name: string;
  user: User;
  publicAccess: string;
  externalAccess: boolean;
  userAccess: Array<Access>;
  userGroupAccess: Array<Access>;
  bookmarks?: Array<string>;
  orgUnitSelection: OrgUnitSelection;
  periodSelection: PeriodSelection;
}
