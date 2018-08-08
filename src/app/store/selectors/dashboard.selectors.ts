import { createSelector } from '@ngrx/store';
import {
  getDashboardObjectEntitiesState,
  getCurrentDashboardObjectState,
  getDashboardObjectLoadingState,
  getDashboardObjectLoadedState,
  getDashboardObjectHasErrorState,
  getDashboardObjectErrorState,
  getAllDashboardsState,
  getCurrentVisualizationState
} from '../reducers/dashboard.reducer';
import { getRootState, State } from '../reducers';
import { getSystemInfo } from './system-info.selectors';
import { getCurrentUser } from './user.selectors';
import { systemInfoReducer } from '../reducers/system-info.reducer';
import { generateUid } from '../../helpers/generate-uid.helper';

export const getDashboardObjectState = createSelector(
  getRootState,
  (state: State) => state.dashboardObject
);

export const getDashboardObjectEntities = createSelector(
  getDashboardObjectState,
  getDashboardObjectEntitiesState
);

export const getAllDashboards = createSelector(
  getDashboardObjectState,
  getAllDashboardsState
);

export const getCurrentVisualizationId = createSelector(
  getDashboardObjectState,
  getCurrentVisualizationState
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
