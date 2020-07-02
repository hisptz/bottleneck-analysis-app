import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { Dashboard, DashboardGroups, Intervention } from '../../models';
import * as fromDashboardReducer from '../reducers/dashboard.reducer';
import { getCurrentDashboardGroup } from './dashboard-groups.selectors';
import {
  getInterventionArchiveLoadingStatus,
  getInterventionArchivesByInterventionId,
  getAllInterventionArchives,
} from './intervention-archive.selectors';
import { InterventionArchive } from '../../models/intervention-archive.model';
import { getInterventionArchiveId } from '../../helpers/get-intervention-archive-id.helper';
import { getCurrentUser } from 'src/app/store';
import { User } from '@iapps/ngx-dhis2-http-client';

export const getAllGroupDashboards = createSelector(
  fromDashboardReducer.getAllDashboards,
  getCurrentDashboardGroup,
  (allDashboards: Dashboard[], currentDashboardGroup: DashboardGroups) => {
    return currentDashboardGroup && currentDashboardGroup.dashboards
      ? (allDashboards || [])
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
  getCurrentUser,
  (dashboardEntities, currentDashboardId, currentUser) => {
    const currentDashboard = dashboardEntities
      ? dashboardEntities[currentDashboardId]
      : null;

    if (!currentDashboard) {
      return null;
    }

    const interventionArchiveId = getInterventionArchiveId(
      currentDashboard.globalSelections,
      currentDashboard.id,
      currentUser
    );

    return currentDashboard;
  }
);

export const getInterventionArchiveByCurrentIntervention = createSelector(
  getAllInterventionArchives,
  getCurrentDashboard,
  getCurrentUser,
  (
    interventionArchives: InterventionArchive[],
    currentDashboard: Dashboard,
    currentUser: User
  ) => {
    if (!currentDashboard) {
      return null;
    }

    const interventionArchiveId = getInterventionArchiveId(
      currentDashboard.globalSelections,
      currentDashboard.id,
      currentUser
    );

    return _.find(interventionArchives, ['id', interventionArchiveId]);
  }
);

export const getCurrentDashboardGlobalSelections = createSelector(
  getCurrentDashboard,
  (dashboard: Dashboard) => (dashboard ? dashboard.globalSelections : [])
);

export const getDashboardById = (id) =>
  createSelector(
    fromDashboardReducer.getDashboardObjectEntities,
    getInterventionArchivesByInterventionId(id),
    (dashboardEntities: any, interventionArchives) => {
      return dashboardEntities[id];
    }
  );

const getDashboardLoadingStatus = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.loading : false)
);

export const getDashboardLoading = createSelector(
  getDashboardLoadingStatus,
  getInterventionArchiveLoadingStatus,
  (dashboardLoadingStatus, interventionArchiveLoadingStatus) =>
    dashboardLoadingStatus || interventionArchiveLoadingStatus
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

export const getDashboardMenuHeight = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.menuHeight : 74)
);

export const getDashboardMenuExpanded = createSelector(
  fromDashboardReducer.getDashboardState,
  (state: fromDashboardReducer.State) => (state ? state.menuExpanded : false)
);

export const getDashboardContentMarginTop = createSelector(
  getDashboardMenuHeight,
  (menuHeight: number) => menuHeight + 150
);
