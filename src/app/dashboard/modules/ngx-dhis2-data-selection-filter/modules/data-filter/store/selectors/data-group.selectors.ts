import { createSelector } from '@ngrx/store';
import * as fromDataGroupReducer from '../reducers/data-group.reducer';

export const getDataGroupLoadInitializedStatus = createSelector(
  fromDataGroupReducer.getDataGroupState,
  (state: fromDataGroupReducer.State) => state.loadInitiated
);
