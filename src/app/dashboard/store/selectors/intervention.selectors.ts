import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import * as fromInterventionReducer from '../reducers/intervention.reducer';
import { Intervention } from '../../models/intervention.model';

export const getInterventionLoading = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.InterventionState) =>
    state ? state.loading : false
);

export const getInterventionLoaded = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.InterventionState) =>
    state ? state.loaded : false
);

export const getInterventionNotification = createSelector(
  fromInterventionReducer.getInterventionState,
  (state: fromInterventionReducer.InterventionState) =>
    state ? state.notification : null
);

export const getSortedInterventions = createSelector(
  fromInterventionReducer.getInterventions,
  (interventions: Intervention[]) => _.sortBy(interventions, 'name')
);
