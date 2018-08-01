import { createSelector, MemoizedSelector } from '@ngrx/store';
import { OrgUnitFilterState, getOrgUnitFilterState } from '../reducers';
import {
  selectAllOrgUnitGroups,
  OrgUnitGroupState
} from '../reducers/org-unit-group.reducer';
import { OrgUnitGroup } from '../../models';

export const getOrgUnitGroupState = createSelector(
  getOrgUnitFilterState,
  (state: OrgUnitFilterState) => state.orgUnitGroup
);

export const getOrgUnitGroups = createSelector(
  getOrgUnitGroupState,
  selectAllOrgUnitGroups
);
