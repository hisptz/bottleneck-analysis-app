import { InterventionItem } from "./interventionTemplateConfig";

export interface LegendDefinition {
  id: string;
  color: string;
  name: string;
  endValue: number;
  startValue: number;
}

export interface Legend {
  id: string;
  name: string;
  color: string;
  endValue: number;
  startValue: number;
  default?: boolean;
}

export interface LegendSet {
  id: string;
  legends: Array<Legend>;
}

export interface SelectionItem {
  id: string;
  name: string;
  label: string;
  type?: string;
  legendSet: LegendSet;
}

export interface SelectionGroupMember {
  id: string;
  name: string;
  type: string;
}

export interface SelectionGroup {
  id: string;
  name: string;
  color: string;
  members: Array<SelectionGroupMember>;
  sortOrder: number;
}

export interface GlobalSelection {
  name: string;
  items: Array<SelectionItem>;
  groups: Array<SelectionGroup>;
  layout: "rows" | "columns";
  dimension: "dx" | "ou" | "pe";
  legendSet?: LegendSet;
  optionSet?: any;
  legendDefinitions: Array<LegendDefinition>;
}

export interface OldInterventionConfig {
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
  interventionItems: Array<InterventionItem>;
  globalSelections: Array<GlobalSelection>;
}
