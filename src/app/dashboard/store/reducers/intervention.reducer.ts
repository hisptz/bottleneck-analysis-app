import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Intervention } from '../models/intervention.model';
import {
  InterventionActions,
  InterventionActionTypes
} from '../actions/intervention.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<Intervention> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
}

export const adapter: EntityAdapter<Intervention> = createEntityAdapter<
  Intervention
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false
});

export function reducer(
  state = initialState,
  action: InterventionActions
): State {
  switch (action.type) {
    case InterventionActionTypes.AddIntervention: {
      return adapter.addOne(action.payload.intervention, state);
    }

    case InterventionActionTypes.UpsertIntervention: {
      return adapter.upsertOne(action.payload.intervention, state);
    }

    case InterventionActionTypes.AddInterventions: {
      return adapter.addMany(action.interventions, {
        ...state,
        loading: false,
        loaded: true
      });
    }

    case InterventionActionTypes.UpsertInterventions: {
      return adapter.upsertMany(action.payload.interventions, state);
    }

    case InterventionActionTypes.UpdateIntervention: {
      return adapter.updateOne(action.payload.intervention, state);
    }

    case InterventionActionTypes.UpdateInterventions: {
      return adapter.updateMany(action.payload.interventions, state);
    }

    case InterventionActionTypes.DeleteIntervention: {
      return adapter.removeOne(action.payload.id, state);
    }

    case InterventionActionTypes.DeleteInterventions: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case InterventionActionTypes.LoadInterventions: {
      return {
        ...state,
        loading: true
      };
    }

    case InterventionActionTypes.ClearInterventions: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getInterventionState = createFeatureSelector<State>(
  'intervention'
);

export const {
  selectEntities: getInterventionEntities,
  selectAll: getInterventions
} = adapter.getSelectors(getInterventionState);
