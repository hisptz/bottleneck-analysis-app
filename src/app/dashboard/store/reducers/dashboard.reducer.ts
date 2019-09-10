import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

import { Dashboard } from '../../models';
import {
  DashboardActions,
  DashboardActionTypes
} from '../actions/dashboard.actions';

export interface State extends EntityState<Dashboard> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  currentDashboard: string;
  currentVisualization: string;
  notification: { message: string };
  unSavedDashboards: string[];
  menuHeight: number;
  menuExpanded: boolean;
}

export const adapter: EntityAdapter<Dashboard> = createEntityAdapter<
  Dashboard
>();

const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: true,
  loaded: false,
  hasError: false,
  error: null,
  currentDashboard: '',
  currentVisualization: '',
  notification: null,
  unSavedDashboards: [],
  menuHeight: 65,
  menuExpanded: false
});

export function reducer(state = initialState, action: DashboardActions): State {
  switch (action.type) {
    case DashboardActionTypes.AddDashboard: {
      return adapter.addOne(action.dashboard, state);
    }

    case DashboardActionTypes.AddDashboards: {
      return adapter.addMany(action.dashboards, state);
    }

    case DashboardActionTypes.UpdateDashboard: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case DashboardActionTypes.DeleteDashboard: {
      return adapter.updateOne(
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
      return adapter.removeOne(action.dashboard.id, {
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
      return action.dashboards
        ? adapter.addMany(action.dashboards, {
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
      return adapter.removeAll(state);
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
    case DashboardActionTypes.GlobalFilterChange:
    case DashboardActionTypes.ResetDashboard: {
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case DashboardActionTypes.ManageDashboardItem: {
      return adapter.updateOne(
        { id: action.dashboardId, changes: { addingItem: true } },
        state
      );
    }

    case DashboardActionTypes.ManageDashboardItemSuccess: {
      return adapter.updateOne(
        { id: action.dashboardId, changes: { addingItem: false } },
        state
      );
    }

    case DashboardActionTypes.SaveDashboard: {
      return adapter.updateOne(
        { id: action.dashboard.id, changes: { saving: true } },
        {
          ...state,
          notification: { message: `Updating ${action.dashboard.name}....` }
        }
      );
    }

    case DashboardActionTypes.SaveDashboardSuccess: {
      return adapter.updateOne(
        { id: action.dashboard.id, changes: { saving: false, unSaved: false } },
        {
          ...state,
          notification: null
        }
      );
    }

    case DashboardActionTypes.SaveDashboardFail: {
      return adapter.updateOne(
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

    case DashboardActionTypes.ChangeDashboardMenuHeight: {
      const dashboardLength = state.ids.length + 1;
      const windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      const dashboardLines = Math.ceil(dashboardLength / (windowWidth / 180));

      return {
        ...state,
        menuHeight: state.menuExpanded ? 65 : dashboardLines * 65,
        menuExpanded: !state.menuExpanded
      };
    }
  }

  return state;
}

export const getDashboardState = createFeatureSelector<State>('dashboard');

export const {
  selectEntities: getDashboardObjectEntities,
  selectAll: getAllDashboards
} = adapter.getSelectors(getDashboardState);

// additional entities parameters
export const getDashboardObjectLoadingState = (state: State) => state.loading;
export const getDashboardObjectLoadedState = (state: State) => state.loaded;
export const getDashboardObjectHasErrorState = (state: State) => state.hasError;
export const getDashboardObjectErrorState = (state: State) => state.error;

export const getCurrentDashboardObjectState = (state: State) =>
  state.currentDashboard;

export const getDashboardNotificationState = (state: State) =>
  state.notification;

export const getCurrentVisualizationState = (state: State) =>
  state.currentVisualization;
