import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { DataGroup } from '../models/data-group.model';
import {
  DataGroupActions,
  DataGroupActionTypes
} from '../actions/data-group.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<DataGroup> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  loadInitiated: boolean;
}

export const adapter: EntityAdapter<DataGroup> = createEntityAdapter<
  DataGroup
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  loadInitiated: false,
  hasError: false,
  error: null
});

export function reducer(state = initialState, action: DataGroupActions): State {
  switch (action.type) {
    case DataGroupActionTypes.LoadDataGroupsInitiated: {
      return { ...state, loadInitiated: true };
    }
    case DataGroupActionTypes.AddDataGroup: {
      return adapter.addOne(action.payload.dataGroup, state);
    }

    case DataGroupActionTypes.UpsertDataGroup: {
      return adapter.upsertOne(action.payload.dataGroup, state);
    }

    case DataGroupActionTypes.AddDataGroups: {
      return adapter.addMany(action.dataGroups, state);
    }

    case DataGroupActionTypes.UpsertDataGroups: {
      return adapter.upsertMany(action.payload.dataGroups, state);
    }

    case DataGroupActionTypes.UpdateDataGroup: {
      return adapter.updateOne(action.payload.dataGroup, state);
    }

    case DataGroupActionTypes.UpdateDataGroups: {
      return adapter.updateMany(action.payload.dataGroups, state);
    }

    case DataGroupActionTypes.DeleteDataGroup: {
      return adapter.removeOne(action.payload.id, state);
    }

    case DataGroupActionTypes.DeleteDataGroups: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case DataGroupActionTypes.LoadDataGroups: {
      return {
        ...state,
        loading: state.loaded ? false : true,
        loaded: state.loaded,
        hasError: false,
        error: null
      };
    }

    case DataGroupActionTypes.ClearDataGroups: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getDataGroupState = createFeatureSelector<State>('dataGroup');

export const { selectAll: getDataGroups } = adapter.getSelectors(
  getDataGroupState
);
