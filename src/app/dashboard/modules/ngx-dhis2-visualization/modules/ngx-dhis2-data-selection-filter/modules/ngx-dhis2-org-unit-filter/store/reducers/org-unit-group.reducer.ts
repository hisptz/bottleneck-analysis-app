import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';
import { OrgUnitGroup } from '../../models';
import {
  OrgUnitGroupActions,
  OrgUnitGroupActionsTypes
} from '../actions/org-unit-group.actions';

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

export const OrgUnitGroupAdapter: EntityAdapter<
  OrgUnitGroup
> = createEntityAdapter<OrgUnitGroup>();

export const initialState: OrgUnitGroupState = OrgUnitGroupAdapter.getInitialState(
  {
    loading: false,
    loaded: false,
    loadInitiated: false,
    hasError: false,
    error: null
  }
);

export function orgUnitGroupReducer(
  state: OrgUnitGroupState = initialState,
  action: OrgUnitGroupActions
): OrgUnitGroupState {
  switch (action.type) {
    case OrgUnitGroupActionsTypes.InitiateOrgUnitGroups: {
      return { ...state, loadInitiated: true };
    }
    case OrgUnitGroupActionsTypes.LoadOrgUnitGroups:
      return {
        ...state,
        loading: state.loaded ? false : true,
        loaded: state.loaded,
        hasError: false,
        error: null
      };
    case OrgUnitGroupActionsTypes.AddOrgUnitGroups: {
      return OrgUnitGroupAdapter.addMany(action.OrgUnitGroups, {
        ...state,
        loaded: true,
        loading: false
      });
    }
  }
  return state;
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

export const {
  selectAll: selectAllOrgUnitGroups
} = OrgUnitGroupAdapter.getSelectors();
