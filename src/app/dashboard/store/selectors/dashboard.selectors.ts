import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

// reducers
import * as fromDashboardReducer from '../reducers/dashboard.reducer';

// selectors
import { getCurrentDashboardGroup } from './dashboard-groups.selectors';

// models
import { Dashboard } from '../../models';

export const getAllGroupDashboards = createSelector(
  fromDashboardReducer.getAllDashboards,
  getCurrentDashboardGroup,
  (allDashboards, currentDashboardGroup) => {
    return currentDashboardGroup && currentDashboardGroup.dashboards
      ? allDashboards
          .filter(({ id }) => currentDashboardGroup.dashboards.includes(id))
          .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
      : _.sortBy(allDashboards, ['name']);
  }
);

export const getCurrentVisualizationId = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => state.currentVisualization
);

export const getCurrentDashboardId = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.currentDashboard : '')
);

export const getCurrentDashboard = createSelector(
  fromDashboardReducer.getDashboardObjectEntities,
  getCurrentDashboardId,
  (dashboardEntities, currentDashboardId) =>
    dashboardEntities ? dashboardEntities[currentDashboardId] : null
);

export const getCurrentDashboardGlobalSelections = createSelector(
  getCurrentDashboard,
  (dashboard: Dashboard) => (dashboard ? dashboard.globalSelections : [])
);

export const getDashboardById = id =>
  createSelector(
    fromDashboardReducer.getDashboardObjectEntities,
    (dashboardEntities: any) => dashboardEntities[id]
  );

export const getDashboardLoading = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.loading : false)
);

export const getDashboardLoaded = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.loaded : false)
);
export const getDashboardNotification = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.notification : null)
);

export const getDashboardHasError = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.hasError : false)
);

export const getDashboardError = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.error : null)
);

export const checkIfUnSavedDashboardsExist = createSelector(
  getAllGroupDashboards,
  (dashboards: Dashboard[]) =>
    _.some(dashboards || [], (dashboard: Dashboard) => dashboard.unSaved)
);
