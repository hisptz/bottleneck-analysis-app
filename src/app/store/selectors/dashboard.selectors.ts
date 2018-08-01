import { createSelector } from '@ngrx/store';
import {
  getDashboardObjectEntitiesState,
  getCurrentDashboardObjectState,
  getDashboardObjectLoadingState,
  getDashboardObjectLoadedState,
  getDashboardObjectHasErrorState,
  getDashboardObjectErrorState,
  getAllDashboardsState
} from '../reducers/dashboard.reducer';
import { getRootState, State } from '../reducers';
import { getSystemInfo } from './system-info.selectors';
import { getCurrentUser } from './user.selectors';

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

export const getDefaultVisualizationLayers = createSelector(
  getSystemInfo,
  getCurrentUser,
  (systemInfo, currentUser) => {
    console.log(systemInfo, currentUser);
    const orgUnits =
      currentUser.dataViewOrganisationUnits.length > 0
        ? currentUser.dataViewOrganisationUnits
        : currentUser.organisationUnits;

    return [
      {
        id: '',
        name: 'Untitled',
        dataSelections: [
          {
            dimension: 'pe',
            layout: 'rows',
            items: [
              {
                id: systemInfo.analysisRelativePeriod
              }
            ]
          },
          {
            dimension: 'ou',
            layout: 'filters',
            items: [
              {
                id: orgUnits[0] ? orgUnits[0].id : '',
                name: orgUnits[0] ? orgUnits[0].name : ''
              }
            ]
          }
        ]
      }
    ];
  }
);
