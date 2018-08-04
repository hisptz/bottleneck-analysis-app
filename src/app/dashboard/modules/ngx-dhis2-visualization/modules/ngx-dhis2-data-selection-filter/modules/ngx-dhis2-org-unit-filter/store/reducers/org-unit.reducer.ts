import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';
import { OrgUnit } from '../../models';
import {
  OrgUnitActions,
  OrgUnitActionsTypes
} from '../actions/org-unit.actions';

/**
 * Org unit level state model
 */
export interface OrgUnitState extends EntityState<OrgUnit> {
  // additional parameters
  loading: boolean;
  loaded: boolean;
  loadInitiated: boolean;
  hasError: boolean;
  error: any;
}

export const OrgUnitAdapter: EntityAdapter<OrgUnit> = createEntityAdapter<
  OrgUnit
>();

export const initialState: OrgUnitState = OrgUnitAdapter.getInitialState({
  loading: false,
  loadInitiated: false,
  loaded: false,
  hasError: false,
  error: null
});

export function orgUnitReducer(
  state: OrgUnitState = initialState,
  action: OrgUnitActions
): OrgUnitState {
  switch (action.type) {
    case OrgUnitActionsTypes.LoadOrgUnits:
      return {
        ...state,
        loading: state.loaded ? false : true,
        loaded: state.loaded,
        hasError: false,
        error: null
      };
    case OrgUnitActionsTypes.LoadOrgUnitsInitiated: {
      return { ...state, loadInitiated: true };
    }
    case OrgUnitActionsTypes.AddOrgUnits: {
      return OrgUnitAdapter.addMany(action.OrgUnits, {
        ...state,
        loaded: true,
        loading: false
      });
    }
  }
  return state;
}

export const getOrgUnitLoadingState = (state: OrgUnitState) => state.loading;
export const getOrgUnitLoadingInitiatedState = (state: OrgUnitState) =>
  state.loadInitiated;
export const getOrgUnitLoadedState = (state: OrgUnitState) => state.loaded;
export const getOrgUnitHasErrorState = (state: OrgUnitState) => state.hasError;
export const getOrgUnitErrorState = (state: OrgUnitState) => state.error;

export const {
  selectAll: selectAllOrgUnits,
  selectEntities: selectOrgUnitEntities
} = OrgUnitAdapter.getSelectors();
