import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IndicatorGroup } from '../../models/indicator-group.model';
import {
  IndicatorGroupActions,
  IndicatorGroupActionTypes
} from '../actions/indicator-group.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<IndicatorGroup> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  loadInitiated: boolean;
}

export const adapter: EntityAdapter<IndicatorGroup> = createEntityAdapter<
  IndicatorGroup
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  loadInitiated: false,
  hasError: false,
  error: null
});

export function reducer(
  state = initialState,
  action: IndicatorGroupActions
): State {
  switch (action.type) {
    case IndicatorGroupActionTypes.LoadIndicatorGroupsInitiated: {
      return { ...state, loadInitiated: true };
    }
    case IndicatorGroupActionTypes.AddIndicatorGroup: {
      return adapter.addOne(action.payload.indicatorGroup, state);
    }

    case IndicatorGroupActionTypes.UpsertIndicatorGroup: {
      return adapter.upsertOne(action.payload.indicatorGroup, state);
    }

    case IndicatorGroupActionTypes.AddIndicatorGroups: {
      return adapter.addMany(action.indicatorGroups, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case IndicatorGroupActionTypes.UpsertIndicatorGroups: {
      return adapter.upsertMany(action.payload.indicatorGroups, state);
    }

    case IndicatorGroupActionTypes.UpdateIndicatorGroup: {
      return adapter.updateOne(action.payload.indicatorGroup, state);
    }

    case IndicatorGroupActionTypes.UpdateIndicatorGroups: {
      return adapter.updateMany(action.payload.indicatorGroups, state);
    }

    case IndicatorGroupActionTypes.DeleteIndicatorGroup: {
      return adapter.removeOne(action.payload.id, state);
    }

    case IndicatorGroupActionTypes.DeleteIndicatorGroups: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case IndicatorGroupActionTypes.LoadIndicatorGroups: {
      return {
        ...state,
        loading: state.loaded ? false : true,
        loaded: state.loaded,
        hasError: false,
        error: null
      };
    }

    case IndicatorGroupActionTypes.ClearIndicatorGroups: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getIndicatorGroupState = createFeatureSelector<State>(
  'indicatorGroup'
);

export const { selectAll: getAllIndicatorGroups } = adapter.getSelectors(
  getIndicatorGroupState
);
