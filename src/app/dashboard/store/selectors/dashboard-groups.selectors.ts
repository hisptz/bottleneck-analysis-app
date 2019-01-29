import { createSelector } from '@ngrx/store';
import * as fromDashboardGroupReducer from '../reducers/dashboard-groups.reducer';

export const getDashboardGroupsLoaded = createSelector(
  fromDashboardGroupReducer.getDashboardGroupState,
  (state: fromDashboardGroupReducer.State) => state.loaded
);

export const getDashboardGroupsLoading = createSelector(
  fromDashboardGroupReducer.getDashboardGroupState,
  (state: fromDashboardGroupReducer.State) => state.loading
);

export const getActiveDashboardGroup = createSelector(
  fromDashboardGroupReducer.getDashboardGroupState,
  (state: fromDashboardGroupReducer.State) => state.activeGroup
);

export const getCurrentDashboardGroup = createSelector(
  fromDashboardGroupReducer.getDashboardGroupEntities,
  getActiveDashboardGroup,
  (dashboardGroupsEntities, activeDashboardId) =>
    dashboardGroupsEntities[activeDashboardId]
);
