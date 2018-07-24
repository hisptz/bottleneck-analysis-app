import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FavoriteFilter } from '../../models/favorite-filter.model';
import {
  FavoriteFilterActions,
  FavoriteFilterActionTypes
} from '../actions/favorite-filter.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface FavoriteFilterState extends EntityState<FavoriteFilter> {
  // additional entities state properties
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
}

export const favoriteFilterAdapter: EntityAdapter<
  FavoriteFilter
> = createEntityAdapter<FavoriteFilter>();

export const initialState: FavoriteFilterState = favoriteFilterAdapter.getInitialState(
  {
    // additional entity state properties
    loading: false,
    loaded: false,
    hasError: false,
    error: null
  }
);

export function favoriteFilterReducer(
  state = initialState,
  action: FavoriteFilterActions
): FavoriteFilterState {
  switch (action.type) {
    case FavoriteFilterActionTypes.AddFavoriteFilter: {
      return favoriteFilterAdapter.addOne(action.payload.favoriteFilter, state);
    }

    case FavoriteFilterActionTypes.UpsertFavoriteFilter: {
      return favoriteFilterAdapter.upsertOne(
        action.payload.favoriteFilter,
        state
      );
    }

    case FavoriteFilterActionTypes.AddFavoriteFilters: {
      return favoriteFilterAdapter.addMany(action.favoriteFilters, state);
    }

    case FavoriteFilterActionTypes.UpsertFavoriteFilters: {
      return favoriteFilterAdapter.upsertMany(
        action.payload.favoriteFilters,
        state
      );
    }

    case FavoriteFilterActionTypes.UpdateFavoriteFilter: {
      return favoriteFilterAdapter.updateOne(
        action.payload.favoriteFilter,
        state
      );
    }

    case FavoriteFilterActionTypes.UpdateFavoriteFilters: {
      return favoriteFilterAdapter.updateMany(
        action.payload.favoriteFilters,
        state
      );
    }

    case FavoriteFilterActionTypes.DeleteFavoriteFilter: {
      return favoriteFilterAdapter.removeOne(action.payload.id, state);
    }

    case FavoriteFilterActionTypes.DeleteFavoriteFilters: {
      return favoriteFilterAdapter.removeMany(action.payload.ids, state);
    }

    case FavoriteFilterActionTypes.LoadFavoriteFilters: {
      return {
        ...state,
        loaded: false,
        loading: false,
        hasError: false,
        error: null
      };
    }

    case FavoriteFilterActionTypes.ClearFavoriteFilters: {
      return favoriteFilterAdapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const getFavoriteFilterState = createFeatureSelector<
  FavoriteFilterState
>('favoriteFilter');

export const {
  selectAll: getFavoriteFilters,
  selectEntities: getFavoriteFilterEntities
} = favoriteFilterAdapter.getSelectors(getFavoriteFilterState);
