import { createSelector } from '@ngrx/store';
import { getFavoriteFilters } from '../reducers/favorite-filter.reducer';

export const getFavoriteFilterHeaders = createSelector(
  getFavoriteFilters,
  favoriteFilters => favoriteFilters
);
