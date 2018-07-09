import { createSelector } from '@ngrx/store';
import { getDashboardState, DashboardState } from '../reducers';
import {
  selectDashboardEntities,
  getCurrentDashboardObjectState,
  getDashboardObjectLoadingState,
  getDashboardObjectLoadedState,
  getDashboardObjectHasErrorState,
  getDashboardObjectErrorState
} from '../reducers/dashboard.reducer';

export const getDashboardObjectState = createSelector(
  getDashboardState,
  (state: DashboardState) => state.dashboardObject
);

export const getDashboardObjectEntities = createSelector(
  getDashboardObjectState,
  selectDashboardEntities
);

export const getCurrentDashboardId = createSelector(
  getDashboardObjectState,
  getCurrentDashboardObjectState
);

export const getCurrentDashboard = createSelector(
  getDashboardObjectEntities,
  getCurrentDashboardId,
  (dashboardEntities, currentDashboardId) =>
    dashboardEntities[currentDashboardId]
);

export const getDashboardObjectLoading = createSelector(
  getDashboardObjectState,
  getDashboardObjectLoadingState
);

export const getDashboardObjectLoaded = createSelector(
  getDashboardObjectState,
  getDashboardObjectLoadedState
);

export const getDashboardObjectHasError = createSelector(
  getDashboardObjectState,
  getDashboardObjectHasErrorState
);

export const getDashboardObjectError = createSelector(
  getDashboardObjectState,
  getDashboardObjectErrorState
);
