import { createSelector, MemoizedSelector } from '@ngrx/store';
import { OrgUnitFilterState, getOrgUnitFilterState } from '../reducers';
import {
  selectAllOrgUnitLevels,
  OrgUnitLevelState,
  getOrgUnitLevelLoadingState
} from '../reducers/org-unit-level.reducer';
import { OrgUnitLevel } from '../../models';

export const getOrgUnitLevelState = createSelector(
  getOrgUnitFilterState,
  (state: OrgUnitFilterState) => state.orgUnitLevel
);

export const getOrgUnitLevelLoading = createSelector(
  getOrgUnitLevelState,
  getOrgUnitLevelLoadingState
);

export const getOrgUnitLevels = createSelector(
  getOrgUnitLevelState,
  selectAllOrgUnitLevels
);
