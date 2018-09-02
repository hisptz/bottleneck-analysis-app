import { createSelector } from '@ngrx/store';
import * as fromRootReducer from '../reducers/index';
import * as fromDataGroupReducer from '../reducers/data-group.reducer';

export const getDataGroupState = createSelector(
  fromRootReducer.getRootState,
  (state: fromRootReducer.State) => state.dataGroup
);

export const getDataGroupLoadInitializedStatus = createSelector(
  getDataGroupState,
  (dataGroupState: fromDataGroupReducer.State) => dataGroupState.loadInitiated
);

export const getDataGroupLoadedStatus = createSelector(
  getDataGroupState,
  (dataGroupState: fromDataGroupReducer.State) => dataGroupState.loaded
);

export const getDataGroups = createSelector(
  getDataGroupState,
  fromDataGroupReducer.getDataGroupsState
);

export const getDataGroupObjectWithLoadingStatus = createSelector(
  getDataGroups,
  getDataGroupLoadedStatus,
  (dataGroups: any[], loaded: boolean) => {
    return {
      dataGroups,
      loaded
    };
  }
);
