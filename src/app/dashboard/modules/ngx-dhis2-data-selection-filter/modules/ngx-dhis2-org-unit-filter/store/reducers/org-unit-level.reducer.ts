import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';
import { OrgUnitLevel } from '../../models';
import {
  OrgUnitLevelActions,
  OrgUnitLevelActionsTypes
} from '../actions/org-unit-level.actions';

function sortByLevelNo(
  currentOrgUnitLevel: OrgUnitLevel,
  nextOrgUnitLevel: OrgUnitLevel
) {
  return currentOrgUnitLevel.level - nextOrgUnitLevel.level;
}

/**
 * Org unit level state model
 */
export interface OrgUnitLevelState extends EntityState<OrgUnitLevel> {
  // additional parameters
  loading: boolean;
  loadInitiated: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
}

export const orgUnitLevelAdapter: EntityAdapter<
  OrgUnitLevel
> = createEntityAdapter<OrgUnitLevel>({
  sortComparer: sortByLevelNo
});

export const initialState: OrgUnitLevelState = orgUnitLevelAdapter.getInitialState(
  {
    loading: false,
    loaded: false,
    loadInitiated: false,
    hasError: false,
    error: null
  }
);

export function orgUnitLevelReducer(
  state: OrgUnitLevelState = initialState,
  action: OrgUnitLevelActions
): OrgUnitLevelState {
  switch (action.type) {
    case OrgUnitLevelActionsTypes.InitiateOrgUnitLevels: {
      return { ...state, loadInitiated: true };
    }
    case OrgUnitLevelActionsTypes.LoadOrgUnitLevels:
      return {
        ...state,
        loading: state.loaded ? false : true,
        loaded: state.loaded,
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
export const getOrgUnitLevelLoadInitiatedState = (state: OrgUnitLevelState) =>
  state.loadInitiated;
export const getOrgUnitLevelLoadedState = (state: OrgUnitLevelState) =>
  state.loaded;
export const getOrgUnitLevelHasErrorState = (state: OrgUnitLevelState) =>
  state.hasError;
export const getOrgUnitLevelErrorState = (state: OrgUnitLevelState) =>
  state.error;

export const {
  selectAll: selectAllOrgUnitLevels
} = orgUnitLevelAdapter.getSelectors();
