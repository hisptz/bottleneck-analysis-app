export interface OrgUnitModel {
  selectionMode: string;
  selectedLevels: any[];
  showUpdateButton: boolean;
  selectedGroups: any[];
  orgUnitLevels: any[];
  orgUnitGroups: any[];
  selectedOrgUnits: any[];
  selectedUserOrgUnit: any[];
  userOrgUnits: any[];
  type: string;
  nodes: any[]
}

export interface OrgUnitTreeConfiguration {
  showSearch: boolean;
  searchText: string;
  level: string;
  loading: boolean;
  loadingMessage: string;
  multiple: boolean;
  multipleKey: string;
  placeholder: string;
  orgUnitTreeOptions: any;
}

export interface OrgUnitTemplateOptions {
  orgUnitButtonName: string;
}

export const INITIAL_ORG_UNIT_MODEL: OrgUnitModel = {
  selectionMode: 'Usr_orgUnit',
  selectedLevels: [],
  showUpdateButton: true,
  selectedGroups: [],
  orgUnitLevels: [],
  orgUnitGroups: [],
  selectedOrgUnits: [],
  selectedUserOrgUnit: [],
  userOrgUnits: [],
  type: 'report',
  nodes: []
}

export const INITIAL_ORG_UNIT_TREE_CONFIGURATION = {
  showSearch: true,
  searchText: 'Search',
  level: null,
  loading: true,
  loadingMessage: 'Loading Organisation units...',
  multiple: true,
  multipleKey: 'none',
  placeholder: 'Select Organisation Unit',
  orgUnitTreeOptions: null
}

export const INITIAL_ORG_UNIT_TEMPLATE_OPTIONS: OrgUnitTemplateOptions = {
  orgUnitButtonName: 'Organisation unit',
}
