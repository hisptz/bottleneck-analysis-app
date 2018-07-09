import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dashboard } from '../../models';
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

export const adapter: EntityAdapter<Dashboard> = createEntityAdapter<
  Dashboard
>();

export const initialState: DashboardObjectState = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  hasError: false,
  error: null,
  currentDashboard: ''
});

export function dashboardObjectReducer(
  state = initialState,
  action: DashboardActions
): DashboardObjectState {
  switch (action.type) {
    case DashboardActionTypes.AddDashboard: {
      return adapter.addOne(action.payload.dashboard, state);
    }

    case DashboardActionTypes.UpsertDashboard: {
      return adapter.upsertOne(action.payload.dashboard, state);
    }

    case DashboardActionTypes.AddDashboards: {
      return adapter.addMany(action.dashboards, state);
    }

    case DashboardActionTypes.UpsertDashboards: {
      return adapter.upsertMany(action.payload.dashboards, state);
    }

    case DashboardActionTypes.UpdateDashboard: {
      return adapter.updateOne(action.payload.dashboard, state);
    }

    case DashboardActionTypes.UpdateDashboards: {
      return adapter.updateMany(action.payload.dashboards, state);
    }

    case DashboardActionTypes.DeleteDashboard: {
      return adapter.removeOne(action.payload.id, state);
    }

    case DashboardActionTypes.DeleteDashboards: {
      return adapter.removeMany(action.payload.ids, state);
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
      return adapter.removeAll(state);
    }

    case DashboardActionTypes.SetCurrentDashboard: {
      return { ...state, currentDashboard: action.id };
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
