import {
  ActionReducerMap,
  createFeatureSelector,
  MemoizedSelector
} from '@ngrx/store';
import {
  OrgUnitLevelState,
  orgUnitLevelReducer
} from './org-unit-level.reducer';
import {
  OrgUnitGroupState,
  orgUnitGroupReducer
} from './org-unit-group.reducer';
import { OrgUnitState, orgUnitReducer } from './org-unit.reducer';

export interface OrgUnitFilterState {
  orgUnitLevel: OrgUnitLevelState;
  orgUnitGroup: OrgUnitGroupState;
  orgUnit: OrgUnitState;
}

export const orgUnitFilterReducer: ActionReducerMap<OrgUnitFilterState> = {
  orgUnitLevel: orgUnitLevelReducer,
  orgUnitGroup: orgUnitGroupReducer,
  orgUnit: orgUnitReducer
};

export const getOrgUnitFilterState = createFeatureSelector<OrgUnitFilterState>(
  'orgUnitFilter'
);
