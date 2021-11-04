export interface User {
  id: string;
}

export interface LegendDefinition {
  id: string;
  color: string;
  name: string;
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
  orgUnit?: { id: string; type: string };
  subLevelAnalysisOrgUnitLevel?: { id: string; type: string };
}

export interface PeriodSelection {
  id: string;
  type: string;
}

export interface InterventionConfig {
  id: string;
  name: string;
  user: { id: string };
  bookmarks?: Array<string>;
  publicAccess: string;
  externalAccess: boolean;
  userAccess: Array<{ id: string }>;
  useGroupAccess: Array<{ id: string }>;
  dataSelection: DataSelection;
  periodSelection: PeriodSelection;
  periodType: string;
  orgUnitSelection: OrgUnitSelection;
}
