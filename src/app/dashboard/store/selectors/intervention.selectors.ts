import { createSelector } from '@ngrx/store';
import * as fromInterventionReducer from '../reducers/intervention.reducer';

export const getInterventionLoading = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.State) => state.loading
);

export const getInterventionLoaded = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.State) => state.loaded
);
