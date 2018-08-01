import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dashboard } from '../../dashboard/models';
import {
  DashboardActions,
  DashboardActionTypes
} from '../actions/dashboard.actions';

export interface DashboardObjectState extends EntityState<Dashboard> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  currentDashboard: string;
}

export const dashboardObjectAdapter: EntityAdapter<
  Dashboard
> = createEntityAdapter<Dashboard>();

const initialState: DashboardObjectState = dashboardObjectAdapter.getInitialState(
  {
    // additional entity state properties
    loading: false,
    loaded: false,
    hasError: false,
    error: null,
    currentDashboard: ''
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
      return dashboardObjectAdapter.removeOne(action.payload.id, state);
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
      return {
        ...state,
        loading: false,
        loaded: true
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

    case DashboardActionTypes.ToggleDashboardBookmark:
    case DashboardActionTypes.ToggleDashboardBookmarkSuccess:
    case DashboardActionTypes.ToggleDashboardBookmarkFail: {
      return dashboardObjectAdapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case DashboardActionTypes.AddDashboardItem: {
      return dashboardObjectAdapter.updateOne(
        { id: action.dashboardId, changes: { addingItem: true } },
        state
      );
    }

    case DashboardActionTypes.AddDashboardItemSuccess: {
      return dashboardObjectAdapter.updateOne(
        { id: action.dashboardId, changes: { addingItem: false } },
        state
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
