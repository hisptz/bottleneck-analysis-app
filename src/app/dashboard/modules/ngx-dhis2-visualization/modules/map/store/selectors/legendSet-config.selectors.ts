import { createSelector } from '@ngrx/store';
import {
  getLegendSetLoadedState,
  getLegendSetLoadingState,
  LegendSetAdapter
} from '../reducers/legendSet-config.reducers';
import { getMapState, MapState } from '../reducers';

export const getLegendSetEntityState = createSelector(
  getMapState,
  (state: MapState) => state.legendsetsConfig
);

export const {
  selectIds: getLegendSetsIds,
  selectEntities: getLegendSetsEntities,
  selectAll: getAllLegendSetConfigs,
  selectTotal: getTotalLegendSets
} = LegendSetAdapter.getSelectors(getLegendSetEntityState);

export const getLegendSetLoaded = createSelector(
  getLegendSetEntityState,
  getLegendSetLoadedState
);

export const getLegendSetLoading = createSelector(
  getLegendSetEntityState,
  getLegendSetLoadingState
);
