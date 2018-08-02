import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as _ from 'lodash';
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
  selectedHeaders: string[];
  selectedFavoriteOwnership: string;
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
    error: null,
    selectedHeaders: ['all'],
    selectedFavoriteOwnership: 'all'
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
      return favoriteFilterAdapter.addAll(action.favoriteFilters, {
        ...state,
        loading: false,
        loaded: true
      });
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
      return favoriteFilterAdapter.removeAll({
        ...state,
        loaded: false,
        loading: true,
        hasError: false,
        error: null
      });
    }

    case FavoriteFilterActionTypes.ClearFavoriteFilters: {
      return favoriteFilterAdapter.removeAll(state);
    }

    case FavoriteFilterActionTypes.ToggleFavoriteFiltersHeader: {
      let newSelectedHeaders = [];
      if (action.multipleSelection) {
        if (action.toggledHeader === 'all') {
          newSelectedHeaders =
            state.selectedHeaders.indexOf(action.toggledHeader) === -1
              ? [action.toggledHeader]
              : [];
        } else {
          const headerIndex = state.selectedHeaders.indexOf(
            action.toggledHeader
          );
          newSelectedHeaders =
            headerIndex === -1
              ? [...state.selectedHeaders, action.toggledHeader]
              : [
                  ..._.slice(state.selectedHeaders, 0, headerIndex),
                  ..._.slice(state.selectedHeaders, headerIndex + 1)
                ];
        }
      } else {
        newSelectedHeaders =
          state.selectedHeaders.indexOf(action.toggledHeader) === -1
            ? [action.toggledHeader]
            : [];
      }

      return { ...state, selectedHeaders: newSelectedHeaders };
    }

    case FavoriteFilterActionTypes.SetFavoriteOnwership: {
      return {
        ...state,
        selectedFavoriteOwnership: action.favoriteOwnership
      };
    }

    default: {
      return state;
    }
  }
}

export const getFavoriteFilterState = createFeatureSelector<
  FavoriteFilterState
>('favoriteFilter');

export const getSelectedHeadersState = (state: FavoriteFilterState) =>
  state.selectedHeaders;

export const getSelectedFavoriteOwnershipState = (state: FavoriteFilterState) =>
  state.selectedFavoriteOwnership;

export const getFavoriteFilterLoadingState = (state: FavoriteFilterState) =>
  state.loading;
export const getFavoriteFilterLoadedState = (state: FavoriteFilterState) =>
  state.loaded;

export const {
  selectAll: getFavoriteFilters,
  selectEntities: getFavoriteFilterEntities
} = favoriteFilterAdapter.getSelectors(getFavoriteFilterState);
