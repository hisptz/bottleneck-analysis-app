import {
  DashboardGroupsActions,
  DashboardGroupsActionTypes
} from '../actions/dashboard-groups.action';
import { DashboardGroups } from '../../dashboard/models/dashboard-groups.model';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface DashboardGroupsState extends EntityState<DashboardGroups> {
  loading: boolean;
  activeGroup: string;
  loaded: boolean;
}

export const DashboardGroupsAdapter: EntityAdapter<
  DashboardGroups
> = createEntityAdapter<DashboardGroups>();

const initialState: DashboardGroupsState = DashboardGroupsAdapter.getInitialState(
  {
    // additional entity state properties
    loading: false,
    activeGroup: null,
    loaded: false
  }
);

export function dashboardGroupReducer(
  state = initialState,
  action: DashboardGroupsActions
): DashboardGroupsState {
  switch (action.type) {
    case DashboardGroupsActionTypes.InitializeDashboardGroups: {
      /**
       * The addMany function provided by the created adapter
       * adds many records to the entity dictionary
       * and returns a new state including those records. If
       * the collection is to be sorted, the adapter will
       * sort each record upon entry into the sorted array.
       */

      const payload: DashboardGroups[] = [];

      return DashboardGroupsAdapter.addMany(payload, {
        ...state,
        loaded: true,
        loading: false
      });
    }

    case DashboardGroupsActionTypes.SetActiveDashboardGroup: {
      return { ...state, activeGroup: action.activeGroup };
    }

    default: {
      return state;
    }
  }
}

export const getDashboardGroupsLoadedState = (state: DashboardGroupsState) =>
  state.loaded;
export const getActiveDashboardGroupState = (state: DashboardGroupsState) =>
  state.activeGroup;
export const getDashboardGroupsLoadingState = (state: DashboardGroupsState) =>
  state.loading;
