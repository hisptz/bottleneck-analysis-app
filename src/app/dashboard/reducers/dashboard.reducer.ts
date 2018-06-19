import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dashboard } from '../models/dashboard.model';
import { DashboardActions, DashboardActionTypes } from '../actions/dashboard.actions';

export interface DashboardState extends EntityState<Dashboard> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Dashboard> = createEntityAdapter<Dashboard>();

export const initialState: DashboardState = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: DashboardActions
): DashboardState {
  switch (action.type) {
    case DashboardActionTypes.AddDashboard: {
      return adapter.addOne(action.payload.dashboard, state);
    }

    case DashboardActionTypes.UpsertDashboard: {
      return adapter.upsertOne(action.payload.dashboard, state);
    }

    case DashboardActionTypes.AddDashboards: {
      return adapter.addMany(action.payload.dashboards, state);
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
      return adapter.addAll(action.payload.dashboards, state);
    }

    case DashboardActionTypes.ClearDashboards: {
      return adapter.removeAll(state);
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
  selectTotal,
} = adapter.getSelectors();
