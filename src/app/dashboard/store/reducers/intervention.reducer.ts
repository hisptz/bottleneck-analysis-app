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
  notification: { message: string };
}

export const adapter: EntityAdapter<Intervention> = createEntityAdapter<
  Intervention
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  notification: null
});

export function reducer(
  state = initialState,
  action: InterventionActions
): State {
  switch (action.type) {
    case InterventionActionTypes.CreateIntervention: {
      return {
        ...state,
        notification: { message: `Adding ${action.intervention.name}...` }
      };
    }

    case InterventionActionTypes.CreateInterventionSuccess: {
      return adapter.addOne(action.intervention, {
        ...state,
        notification: null
      });
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
      return adapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    }

    case InterventionActionTypes.SaveIntervention: {
      return adapter.updateOne(
        {
          id: action.intervention.id,
          changes: { showEditForm: !action.intervention.showEditForm }
        },
        {
          ...state,
          notification: {
            message: `Updating intervention to ${action.intervention.name}...`
          }
        }
      );
    }

    case InterventionActionTypes.SaveInterventionSuccess: {
      return adapter.updateOne(
        {
          id: action.intervention.id,
          changes: { name: action.intervention.name }
        },
        {
          ...state,
          notification: null
        }
      );
    }

    case InterventionActionTypes.SaveInterventionFail: {
      return {
        ...state,
        notification: {
          message: `Could not update interventation ${action.error.message}`
        }
      };
    }

    case InterventionActionTypes.UpdateInterventions: {
      return adapter.updateMany(action.payload.interventions, state);
    }

    case InterventionActionTypes.DeleteIntervention: {
      return adapter.updateOne(
        {
          id: action.intervention.id,
          changes: { showDeleteDialog: false, deleting: true }
        },
        {
          ...state,
          notification: { message: `Deleting ${action.intervention.name}...` }
        }
      );
    }

    case InterventionActionTypes.DeleteInterventionSuccess: {
      return adapter.removeOne(action.id, {
        ...state,
        notification: null
      });
    }

    case InterventionActionTypes.DeleteInterventionFail: {
      return adapter.updateOne(
        { id: action.intervention.id, changes: { deleting: false } },
        {
          ...state,
          notification: {
            message: `Could not delete ${action.intervention.name}: ${
              action.error.message
            }`
          }
        }
      );
    }
    case InterventionActionTypes.DeleteInterventions: {
      return adapter.removeMany(action.payload.ids, {
        ...state,
        notification: null
      });
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
