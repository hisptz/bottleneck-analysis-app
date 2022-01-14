import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";

import { USER_ORG_UNITS } from "../../constants/user-org-units.constants";
import { OrgUnit } from "../../models/org-unit.model";
import {
  addOrgUnits,
  loadOrgUnitFail,
  loadOrgUnits,
  initiateOrgUnits,
  setHighestLevelOrgUnits,
} from "../actions/org-unit.actions";

export interface OrgUnitState extends EntityState<OrgUnit> {
  highestLevelOrgUnits: string[];
  loading: boolean;
  loaded: boolean;
  loadInitiated: boolean;
  hasError: boolean;
  error: any;
}

export const orgUnitAdapter: EntityAdapter<OrgUnit> =
  createEntityAdapter<OrgUnit>();

const initialState = orgUnitAdapter.addMany(
  USER_ORG_UNITS,
  orgUnitAdapter.getInitialState({
    highestLevelOrgUnits: [],
    loading: false,
    loadInitiated: false,
    loaded: false,
    hasError: false,
    error: null,
  })
);

export const reducer = createReducer(
  initialState,
  on(initiateOrgUnits, (state) => ({ ...state, loadInitiated: true })),
  on(loadOrgUnits, (state) => ({
    ...state,
    loading: state.loaded ? false : true,
    loaded: state.loaded,
    hasError: false,
    error: null,
  })),
  on(addOrgUnits, (state, { orgUnits }) => {
    return orgUnitAdapter.addMany(orgUnits, {
      ...state,
      loaded: true,
      loading: false,
    });
  }),
  on(loadOrgUnitFail, (state, { error }) => {
    return { ...state, error };
  }),
  on(setHighestLevelOrgUnits, (state, { highestLevelOrgUnits }) => ({
    ...state,
    highestLevelOrgUnits,
  }))
);

export function orgUnitReducer(
  state: OrgUnitState | undefined,
  action: Action
): OrgUnitState {
  return reducer(state, action);
}
