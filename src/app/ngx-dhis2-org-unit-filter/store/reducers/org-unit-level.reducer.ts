import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";

import { OrgUnitLevel } from "../../models/org-unit-level.model";
import {
  addOrgUnitLevels,
  initiateOrgUnitLevels,
  loadOrgUnitLevels,
  loadOrgUnitLevelsFail,
} from "../actions/org-unit-level.actions";

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

export const orgUnitLevelAdapter: EntityAdapter<OrgUnitLevel> =
  createEntityAdapter<OrgUnitLevel>({
    sortComparer: sortByLevelNo,
  });

export const initialState: OrgUnitLevelState =
  orgUnitLevelAdapter.getInitialState({
    loading: false,
    loaded: false,
    loadInitiated: false,
    hasError: false,
    error: null,
  });

export const reducer = createReducer(
  initialState,
  on(initiateOrgUnitLevels, (state) => ({ ...state, loadInitiated: true })),
  on(loadOrgUnitLevels, (state) => ({
    ...state,
    loading: state.loaded ? false : true,
    loaded: state.loaded,
    hasError: false,
    error: null,
  })),
  on(addOrgUnitLevels, (state, { orgUnitLevels }) => {
    return orgUnitLevelAdapter.addMany(orgUnitLevels, {
      ...state,
      loaded: true,
      loading: false,
    });
  }),
  on(loadOrgUnitLevelsFail, (state, { error }) => {
    return { ...state, error };
  })
);

export function orgUnitLevelReducer(
  state: OrgUnitLevelState | undefined,
  action: Action
): OrgUnitLevelState {
  return reducer(state, action);
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

export const { selectAll: selectAllOrgUnitLevels } =
  orgUnitLevelAdapter.getSelectors();
