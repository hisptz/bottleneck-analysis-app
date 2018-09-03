import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dashboard } from '../../dashboard/models';
import {
  DashboardActions,
  DashboardActionTypes
} from '../actions/dashboard.actions';
import { getStandardizedDashboards } from '../../helpers';

export interface DashboardObjectState extends EntityState<Dashboard> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  currentDashboard: string;
  currentVisualization: string;
  notification: { message: string };
}

export const dashboardObjectAdapter: EntityAdapter<
  Dashboard
> = createEntityAdapter<Dashboard>();

const initialState: DashboardObjectState = dashboardObjectAdapter.getInitialState(
  {
    // additional entity state properties
    loading: true,
    loaded: false,
    hasError: false,
    error: null,
    currentDashboard: '',
    currentVisualization: '',
    notification: null
  }
);

export function dashboardObjectReducer(
  state = initialState,
  action: DashboardActions
): DashboardObjectState {
  switch (action.type) {
    case DashboardActionTypes.AddDashboard: {
      return dashboardObjectAdapter.addOne(action.dashboard, state);
    }

    case DashboardActionTypes.UpsertDashboard: {
      return dashboardObjectAdapter.upsertOne(action.payload.dashboard, state);
    }

    case DashboardActionTypes.AddDashboards: {
      return dashboardObjectAdapter.addMany(action.dashboards, state);
    }

    case DashboardActionTypes.UpsertDashboards: {
      return dashboardObjectAdapter.upsertMany(
        action.payload.dashboards,
        state
      );
    }

    case DashboardActionTypes.UpdateDashboard: {
      return dashboardObjectAdapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case DashboardActionTypes.UpdateDashboards: {
      return dashboardObjectAdapter.updateMany(
        action.payload.dashboards,
        state
      );
    }

    case DashboardActionTypes.DeleteDashboard: {
      return dashboardObjectAdapter.updateOne(
        {
          id: action.dashboard.id,
          changes: { showDeleteDialog: false, deleting: true }
        },
        {
          ...state,
          notification: {
            message: `Deleting dashboard with name ${action.dashboard.name}...`
          }
        }
      );
    }

    case DashboardActionTypes.RemoveDashboard: {
      return dashboardObjectAdapter.removeOne(action.dashboard.id, {
        ...state,
        notification: null
      });
    }

    case DashboardActionTypes.DeleteDashboardFail: {
      return {
        ...state,
        notification: { message: `Could not delete dashboard: ${action.error}` }
      };
    }

    case DashboardActionTypes.DeleteDashboards: {
      return dashboardObjectAdapter.removeMany(action.payload.ids, state);
    }

    case DashboardActionTypes.LoadDashboards: {
      return {
        ...state,
        loading: true,
        loaded: false,
        hasError: false,
        error: null
      };
    }

    case DashboardActionTypes.LoadDashboardsSuccess: {
      const dashboards: Dashboard[] = getStandardizedDashboards(
        action.dashboards,
        action.currentUser,
        action.systemInfo,
        action.dataGroups
      );

      return dashboards
        ? dashboardObjectAdapter.addMany(dashboards, {
            ...state,
            loading: false,
            loaded: true
          })
        : {
            ...state,
            loading: false,
            hasError: true,
            error: 'Could not read dashboard list'
          };
    }

    case DashboardActionTypes.LoadDashboardsFail: {
      return { ...state, loading: false, hasError: true, error: action.error };
    }

    case DashboardActionTypes.ClearDashboards: {
      return dashboardObjectAdapter.removeAll(state);
    }

    case DashboardActionTypes.SetCurrentDashboard: {
      return { ...state, currentDashboard: action.id };
    }

    case DashboardActionTypes.SetCurrentVisualization: {
      return { ...state, currentVisualization: action.visualizationId };
    }

    case DashboardActionTypes.ToggleDashboardBookmark:
    case DashboardActionTypes.ToggleDashboardBookmarkSuccess:
    case DashboardActionTypes.ToggleDashboardBookmarkFail:
    case DashboardActionTypes.GlobalFilterChange: {
      return dashboardObjectAdapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case DashboardActionTypes.ManageDashboardItem: {
      return dashboardObjectAdapter.updateOne(
        { id: action.dashboardId, changes: { addingItem: true } },
        state
      );
    }

    case DashboardActionTypes.ManageDashboardItemSuccess: {
      return dashboardObjectAdapter.updateOne(
        { id: action.dashboardId, changes: { addingItem: false } },
        state
      );
    }

    case DashboardActionTypes.SaveDashboard: {
      return dashboardObjectAdapter.updateOne(
        { id: action.dashboard.id, changes: { saving: true } },
        {
          ...state,
          notification: { message: `Updating ${action.dashboard.name}....` }
        }
      );
    }

    case DashboardActionTypes.SaveDashboardSuccess: {
      return dashboardObjectAdapter.updateOne(
        { id: action.dashboard.id, changes: { saving: false } },
        {
          ...state,
          notification: null
        }
      );
    }

    case DashboardActionTypes.SaveDashboardFail: {
      return dashboardObjectAdapter.updateOne(
        {
          id: action.dashboard.id,
          changes: { saving: false, hasError: true, error: action.error }
        },
        {
          ...state,
          notification: null
        }
      );
    }
  }

  return state;
}

export const {
  selectEntities: getDashboardObjectEntitiesState,
  selectAll: getAllDashboardsState
} = dashboardObjectAdapter.getSelectors();

// additional entities parameters
export const getDashboardObjectLoadingState = (state: DashboardObjectState) =>
  state.loading;
export const getDashboardObjectLoadedState = (state: DashboardObjectState) =>
  state.loaded;
export const getDashboardObjectHasErrorState = (state: DashboardObjectState) =>
  state.hasError;
export const getDashboardObjectErrorState = (state: DashboardObjectState) =>
  state.error;

export const getCurrentDashboardObjectState = (state: DashboardObjectState) =>
  state.currentDashboard;

export const getDashboardNotificationState = (state: DashboardObjectState) =>
  state.notification;

export const getCurrentVisualizationState = (state: DashboardObjectState) =>
  state.currentVisualization;
