import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import * as fromInterventionReducer from '../reducers/intervention.reducer';
import { Intervention } from '../models/intervention.model';

export const getInterventionLoading = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.State) => state.loading
);

export const getInterventionLoaded = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.State) => state.loaded
);

export const getInterventionNotification = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.State) => state.notification
);

export const getSortedInterventions = createSelector(
  fromInterventionReducer.getInterventions,
  (interventions: Intervention[]) => _.sortBy(interventions, 'name')
);
