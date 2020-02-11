import { createSelector } from '@ngrx/store';
import * as fromIndicator from '../reducers/indicator.reducer';

export const getIndicatorsInitiatedStatus = createSelector(
  fromIndicator.getIndicatorState,
  (state: fromIndicator.State) => state.loadInitiated
);

export const getIndicatorsLoadingStatus = createSelector(
  fromIndicator.getIndicatorState,
  (state: fromIndicator.State) => state.loading
);
