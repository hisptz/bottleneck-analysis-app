import { DashboardItem } from "./interventionConfig";

export type LegendDefinition = {
  id: string;
  color: string;
  name: string;
  endValue: number;
  startValue: number;
};

export type Legend = {
  id: string;
  name: string;
  color: string;
  endValue: number;
  startValue: number;
};

export type LegendSet = {
  id: string;
  legends: Array<Legend>;
};

export type SelectionItem = {
  id: string;
  name: string;
  label: string;
  legendSet: LegendSet;
};

export type SelectionGroupMember = {
  id: string;
  name: string;
  type: string;
};

export type SelectionGroup = {
  id: string;
  name: string;
  color: string;
  members: Array<SelectionGroupMember>;
  sortOrder: number;
};

export type GlobalSelection = {
  name: string;
  items: Array<SelectionItem>;
  groups: Array<SelectionGroup>;
  layout: "rows" | "columns";
  dimension: "dx" | "ou" | "pe";
  legendSet?: LegendSet;
  optionSet?: any;
  legendDefinitions: Array<LegendDefinition>;
};

export type DashboardConfig = {
  id: string;
  name: string;
  bookmarked?: boolean;
  bookmarks?: Array<string>;
  user: { name: string; id: string };
  publicAccess: string;
  externalAccess: boolean;
  userAccesses: Array<{ id: string; name: string; type: string; access: string }>;
  supportBookmark: boolean;
  showDeleteDialog: boolean;
  userGroupAccesses: Array<{ id: string; name: string; type: string; access: string; displayName: string }>;
  bottleneckPeriodType: string;
  dashboardItems: Array<DashboardItem>;
  globalSelections: Array<GlobalSelection>;
};
