import { createAction, on, createReducer } from '@ngrx/store';
import {
  loadRootCauseDataIds,
  addRootCauseDataIds
} from '../actions/root-cause-data.actions';

export interface RootCauseData {
  rootCauseDataIds: string[];
  loading: boolean;
}

const initialState = {
  rootCauseDataIds: [],
  loading: false
};

const reducer = createReducer(
  initialState,
  on(loadRootCauseDataIds, state => ({ ...state, loading: true })),
  on(addRootCauseDataIds, (state, { rootCauseDataIds }) => ({
    ...state,
    rootCauseDataIds
  }))
);

export function rootCauseDataReducer(state, action) {
  return reducer(state, action);
}
