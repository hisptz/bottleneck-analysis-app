export interface User {
  id: string;
}

export interface Map {
  indicators: Array<DataItem>;
  config: {
    enabled: {
      boundary: boolean;
      thematic: boolean;
      facility: boolean;
    };
  };
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
