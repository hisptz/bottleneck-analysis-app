import { createSelector, MemoizedSelector } from '@ngrx/store';
import { OrgUnitFilterState, getOrgUnitFilterState } from '../reducers';
import {
  selectAllOrgUnitLevels,
  OrgUnitLevelState
} from '../reducers/org-unit-level.reducer';
import { OrgUnitLevel } from '../../models';

export const getOrgUnitLevelState = createSelector(
  getOrgUnitFilterState,
  (state: OrgUnitFilterState) => state.orgUnitLevel
);

export const getOrgUnitLevels = createSelector(
  getOrgUnitLevelState,
  selectAllOrgUnitLevels
);
