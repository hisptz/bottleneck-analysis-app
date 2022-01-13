import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";

import { OrgUnitGroup } from "../../models/org-unit-group.model";
import {
  addOrgUnitGroups,
  initiateOrgUnitGroups,
  loadOrgUnitGroups,
  loadOrgUnitGroupsFail,
} from "../actions/org-unit-group.actions";

/**
 * Org unit group state model
 */
export interface OrgUnitGroupState extends EntityState<OrgUnitGroup> {
  // additional parameters
  loading: boolean;
  loaded: boolean;
  loadInitiated: boolean;
  hasError: boolean;
  error: any;
}

export const orgUnitGroupAdapter: EntityAdapter<OrgUnitGroup> =
  createEntityAdapter<OrgUnitGroup>();

export const initialState: OrgUnitGroupState =
  orgUnitGroupAdapter.getInitialState({
    loading: false,
    loaded: false,
    loadInitiated: false,
    hasError: false,
    error: null,
  });

export const reducer = createReducer(
  initialState,
  on(initiateOrgUnitGroups, (state) => ({ ...state, loadInitiated: true })),
  on(loadOrgUnitGroups, (state) => ({
    ...state,
    loading: state.loaded ? false : true,
    loaded: state.loaded,
    hasError: false,
    error: null,
  })),
  on(addOrgUnitGroups, (state, { orgUnitGroups }) => {
    return orgUnitGroupAdapter.addMany(orgUnitGroups, {
      ...state,
      loaded: true,
      loading: false,
    });
  }),
  on(loadOrgUnitGroupsFail, (state, { error }) => {
    return { ...state, error };
  })
);

export function orgUnitGroupReducer(
  state: OrgUnitGroupState | undefined,
  action: Action
): OrgUnitGroupState {
  return reducer(state, action);
}

export const getOrgUnitGroupLoadingState = (state: OrgUnitGroupState) =>
  state.loading;
export const getOrgUnitGroupLoadInitiatedState = (state: OrgUnitGroupState) =>
  state.loadInitiated;
export const getOrgUnitGroupLoadedState = (state: OrgUnitGroupState) =>
  state.loaded;
export const getOrgUnitGroupHasErrorState = (state: OrgUnitGroupState) =>
  state.hasError;
export const getOrgUnitGroupErrorState = (state: OrgUnitGroupState) =>
  state.error;

export const { selectAll: selectAllOrgUnitGroups } =
  orgUnitGroupAdapter.getSelectors();
