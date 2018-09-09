import {
  DashboardGroupsActions,
  DashboardGroupsActionTypes
} from '../actions/dashboard-groups.action';
import {
  DashboardActionTypes,
  DashboardActions
} from '../actions/dashboard.actions';
import { DashboardGroups } from '../../models/dashboard-groups.model';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<DashboardGroups> {
  loading: boolean;
  activeGroup: string;
  loaded: boolean;
}

export const adapter: EntityAdapter<DashboardGroups> = createEntityAdapter<
  DashboardGroups
>();

const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  activeGroup: null,
  loaded: false
});

export function reducer(
  state = initialState,
  action: DashboardGroupsActions | DashboardActions
): State {
  switch (action.type) {
    case DashboardGroupsActionTypes.InitializeDashboardGroupSuccess: {
      /**
       * The addMany function provided by the created adapter
       * adds many records to the entity dictionary
       * and returns a new state including those records. If
       * the collection is to be sorted, the adapter will
       * sort each record upon entry into the sorted array.
       */

      const { dashboardGroups, activeGroup } = action;

      return adapter.addMany(dashboardGroups, {
        ...state,
        activeGroup,
        loaded: true,
        loading: false
      });
    }

    case DashboardActionTypes.SetCurrentDashboard: {
      const { entities } = state;
      const activeGroup = Object.keys(entities).find(id =>
        entities[id].dashboards.includes(action.id)
      );
      return { ...state, activeGroup };
    }

    case DashboardGroupsActionTypes.SetActiveDashboardGroup: {
      return { ...state, activeGroup: action.activeGroup.id };
    }

    default: {
      return state;
    }
  }
}

export const getDashboardGroupState = createFeatureSelector<State>(
  'dashboardGroup'
);

export const {
  selectAll: getAllDashboardGroups,
  selectEntities: getDashboardGroupEntities
} = adapter.getSelectors(getDashboardGroupState);
