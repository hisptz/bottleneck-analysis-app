import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Determinant } from '../../models/determinant.model';
import {
  DeterminantActions,
  DeterminantActionTypes,
} from '../actions/determinant.actions';

export interface State extends EntityState<Determinant> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  loadInitiated: boolean;
}

export const adapter: EntityAdapter<Determinant> = createEntityAdapter<
  Determinant
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  loadInitiated: false,
  hasError: false,
  error: null,
});

export function reducer(
  state = initialState,
  action: DeterminantActions
): State {
  switch (action.type) {
    case DeterminantActionTypes.LoadDeterminantsInitiated: {
      return { ...state, loadInitiated: true };
    }
    case DeterminantActionTypes.AddDeterminant: {
      return adapter.addOne(action.payload.determinant, state);
    }

    case DeterminantActionTypes.UpsertDeterminant: {
      return adapter.upsertOne(action.payload.determinant, state);
    }

    case DeterminantActionTypes.AddDeterminants: {
      return adapter.addMany(action.determinants, state);
    }

    case DeterminantActionTypes.UpsertDeterminants: {
      return adapter.upsertMany(action.payload.determinants, state);
    }

    case DeterminantActionTypes.UpdateDeterminant: {
      return adapter.updateOne(action.payload.determinant, state);
    }

    case DeterminantActionTypes.UpdateDeterminants: {
      return adapter.updateMany(action.payload.determinants, state);
    }

    case DeterminantActionTypes.DeleteDeterminant: {
      return adapter.removeOne(action.payload.id, state);
    }

    case DeterminantActionTypes.DeleteDeterminants: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case DeterminantActionTypes.LoadDeterminants: {
      return {
        ...state,
        loading: state.loaded ? false : true,
        loaded: state.loaded,
        hasError: false,
        error: null,
      };
    }

    case DeterminantActionTypes.ClearDeterminants: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const { selectAll: getDeterminantsState } = adapter.getSelectors();
