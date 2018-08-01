import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';
import { OrgUnitLevel } from '../../models';
import {
  OrgUnitLevelActions,
  OrgUnitLevelActionsTypes
} from '../actions/org-unit-level.actions';

/**
 * Org unit level state model
 */
export interface OrgUnitLevelState extends EntityState<OrgUnitLevel> {
  // additional parameters
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
}

export const orgUnitLevelAdapter: EntityAdapter<
  OrgUnitLevel
> = createEntityAdapter<OrgUnitLevel>();

export const initialState: OrgUnitLevelState = orgUnitLevelAdapter.getInitialState(
  {
    loading: false,
    loaded: false,
    hasError: false,
    error: null
  }
);

export function orgUnitLevelReducer(
  state: OrgUnitLevelState = initialState,
  action: OrgUnitLevelActions
): OrgUnitLevelState {
  switch (action.type) {
    case OrgUnitLevelActionsTypes.LoadOrgUnitLevels:
      return {
        ...state,
        loading: true,
        loaded: false,
        hasError: false,
        error: null
      };
    case OrgUnitLevelActionsTypes.AddOrgUnitLevels: {
      return orgUnitLevelAdapter.addMany(action.orgUnitLevels, {
        ...state,
        loaded: true,
        loading: false
      });
    }
  }
  return state;
}

export const getOrgUnitLevelLoadingState = (state: OrgUnitLevelState) =>
  state.loading;
export const getOrgUnitLevelLoadedState = (state: OrgUnitLevelState) =>
  state.loaded;
export const getOrgUnitLevelHasErrorState = (state: OrgUnitLevelState) =>
  state.hasError;
export const getOrgUnitLevelErrorState = (state: OrgUnitLevelState) =>
  state.error;

export const {
  selectAll: selectAllOrgUnitLevels
} = orgUnitLevelAdapter.getSelectors();
