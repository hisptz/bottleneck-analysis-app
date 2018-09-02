import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Indicator } from '../../models/indicator.model';
import {
  IndicatorActions,
  IndicatorActionTypes
} from '../actions/indicator.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<Indicator> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  loadInitiated: boolean;
}

export const adapter: EntityAdapter<Indicator> = createEntityAdapter<
  Indicator
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  loadInitiated: false,
  hasError: false,
  error: null
});

export function reducer(state = initialState, action: IndicatorActions): State {
  switch (action.type) {
    case IndicatorActionTypes.LoadIndicatorsInitiated: {
      return { ...state, loadInitiated: true };
    }
    case IndicatorActionTypes.AddIndicator: {
      return adapter.addOne(action.payload.indicator, state);
    }

    case IndicatorActionTypes.UpsertIndicator: {
      return adapter.upsertOne(action.payload.indicator, state);
    }

    case IndicatorActionTypes.AddIndicators: {
      return adapter.addMany(action.indicators, {
        ...state,
        loaded: true,
        loading: false
      });
    }

    case IndicatorActionTypes.UpsertIndicators: {
      return adapter.upsertMany(action.payload.indicators, state);
    }

    case IndicatorActionTypes.UpdateIndicator: {
      return adapter.updateOne(action.payload.indicator, state);
    }

    case IndicatorActionTypes.UpdateIndicators: {
      return adapter.updateMany(action.payload.indicators, state);
    }

    case IndicatorActionTypes.DeleteIndicator: {
      return adapter.removeOne(action.payload.id, state);
    }

    case IndicatorActionTypes.DeleteIndicators: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case IndicatorActionTypes.LoadIndicators: {
      return {
        ...state,
        loading: state.loaded ? false : true,
        loaded: state.loaded,
        hasError: false,
        error: null
      };
    }

    case IndicatorActionTypes.ClearIndicators: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getIndicatorState = createFeatureSelector<State>('indicator');

export const {
  selectEntities: getIndicatorEntities,
  selectAll: getIndicators
} = adapter.getSelectors(getIndicatorState);
