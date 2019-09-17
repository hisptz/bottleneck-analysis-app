import { getRootState, State } from '../reducers';
import { createSelector } from '@ngrx/store';
import { RootCauseData } from '../reducers/root-cause-data.reducer';

export const getRootCauseDataState = createSelector(
  getRootState,
  (state: State) => state.rootCauseData
);

export const getRootCauseDataIds = createSelector(
  getRootCauseDataState,
  (rootCauseData: RootCauseData) => rootCauseData.rootCauseDataIds
);
