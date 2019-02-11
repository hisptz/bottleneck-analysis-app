import { LegendSetActions, LegendSetActionTypes } from '../actions/legend-set-config.action';
import { LegendSet } from '../../models/legendSet-config.model';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface LegendSetState extends EntityState<LegendSet> {
  loading: boolean;
  loaded: boolean;
}

export const LegendSetAdapter: EntityAdapter<LegendSet> = createEntityAdapter<LegendSet>();

const initialState: LegendSetState = LegendSetAdapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false
});

export function legendSetReducer(state = initialState, action: LegendSetActions): LegendSetState {
  switch (action.type) {
    case LegendSetActionTypes.LoadLegendSetSuccess: {
      return LegendSetAdapter.addMany(action.payload, {
        ...state,
        loaded: true,
        loading: false
      });
    }

    case LegendSetActionTypes.SaveLegendSetsDataStore:
    case LegendSetActionTypes.UpsetLagendSets: {
      return LegendSetAdapter.upsertMany(action.payload.legendSets, state);
    }

    case LegendSetActionTypes.DeleteLegendSet: {
      return LegendSetAdapter.removeOne(action.payload.id, state);
    }

    default: {
      return state;
    }
  }
}

export const getLegendSetLoadedState = (state: LegendSetState) => state.loaded;
export const getLegendSetLoadingState = (state: LegendSetState) => state.loading;
