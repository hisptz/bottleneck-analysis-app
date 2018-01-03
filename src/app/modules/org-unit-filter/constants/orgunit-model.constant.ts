import {OrgUnitModel} from '../models/orgunit.model';

export const INITIAL_ORG_UNIT_MODEL: OrgUnitModel = {
  selectionMode: 'USER_ORG_UNIT',
  selectedLevels: [],
  showUpdateButton: true,
  selectedGroups: [],
  orgUnits: [],
  orgUnitLevels: [],
  orgUnitGroups: [],
  selectedOrgUnits: [],
  selectedUserOrgUnits: [],
  userOrgUnits: [],
  type: 'report'
};
