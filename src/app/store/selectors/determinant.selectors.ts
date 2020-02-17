import { createSelector } from '@ngrx/store';
import * as fromRootReducer from '../reducers/index';
import * as fromDeterminantReducer from '../reducers/determinant.reducer';

export const getDeterminantState = createSelector(
  fromRootReducer.getRootState,
  (state: fromRootReducer.State) => state.determinant
);

export const getDeterminantLoadInitializedStatus = createSelector(
  getDeterminantState,
  (determinantState: fromDeterminantReducer.State) =>
    determinantState.loadInitiated
);

export const getDeterminantLoadedStatus = createSelector(
  getDeterminantState,
  (determinantState: fromDeterminantReducer.State) => determinantState.loaded
);

export const getDeterminants = createSelector(
  getDeterminantState,
  fromDeterminantReducer.getDeterminantsState
);

export const getDeterminantObjectWithLoadingStatus = createSelector(
  getDeterminants,
  getDeterminantLoadedStatus,
  (determinants: any[], loaded: boolean) => {
    return {
      determinants,
      loaded,
    };
  }
);
