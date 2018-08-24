import { createSelector } from '@ngrx/store';
import { getLegendSetLoadedState, getLegendSetLoadingState, LegendSetAdapter } from '../reducers/legend-set.reducer';
import { getRootState, State } from '../reducers';

export const getLegendSetEntityState = createSelector(getRootState, (state: State) => state.legendSets);

export const {
  selectIds: getLegendSetsIds,
  selectEntities: getLegendSetsEntities,
  selectAll: getAllLegendSets,
  selectTotal: getTotalLegendSets
} = LegendSetAdapter.getSelectors(getLegendSetEntityState);

export const getLegendSetLoaded = createSelector(getLegendSetEntityState, getLegendSetLoadedState);

export const getLegendSetLoading = createSelector(getLegendSetEntityState, getLegendSetLoadingState);
