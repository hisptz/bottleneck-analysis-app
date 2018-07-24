import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { FavoriteFilter } from '../../models/favorite-filter.model';

export enum FavoriteFilterActionTypes {
  LoadFavoriteFilters = '[FavoriteFilter] Load FavoriteFilters',
  LoadFavoriteFiltersFail = '[FavoriteFilter] Load FavoriteFilters fail',
  AddFavoriteFilter = '[FavoriteFilter] Add FavoriteFilter',
  UpsertFavoriteFilter = '[FavoriteFilter] Upsert FavoriteFilter',
  AddFavoriteFilters = '[FavoriteFilter] Add FavoriteFilters',
  UpsertFavoriteFilters = '[FavoriteFilter] Upsert FavoriteFilters',
  UpdateFavoriteFilter = '[FavoriteFilter] Update FavoriteFilter',
  UpdateFavoriteFilters = '[FavoriteFilter] Update FavoriteFilters',
  DeleteFavoriteFilter = '[FavoriteFilter] Delete FavoriteFilter',
  DeleteFavoriteFilters = '[FavoriteFilter] Delete FavoriteFilters',
  ClearFavoriteFilters = '[FavoriteFilter] Clear FavoriteFilters'
}

export class LoadFavoriteFiltersAction implements Action {
  readonly type = FavoriteFilterActionTypes.LoadFavoriteFilters;
  constructor(public searchTerm: string) {}
}

export class LoadFavoriteFiltersFailAction implements Action {
  readonly type = FavoriteFilterActionTypes.LoadFavoriteFiltersFail;
  constructor(public error: any) {}
}

export class AddFavoriteFilter implements Action {
  readonly type = FavoriteFilterActionTypes.AddFavoriteFilter;

  constructor(public payload: { favoriteFilter: FavoriteFilter }) {}
}

export class UpsertFavoriteFilter implements Action {
  readonly type = FavoriteFilterActionTypes.UpsertFavoriteFilter;

  constructor(public payload: { favoriteFilter: FavoriteFilter }) {}
}

export class AddFavoriteFiltersAction implements Action {
  readonly type = FavoriteFilterActionTypes.AddFavoriteFilters;

  constructor(public favoriteFilters: FavoriteFilter[]) {}
}

export class UpsertFavoriteFilters implements Action {
  readonly type = FavoriteFilterActionTypes.UpsertFavoriteFilters;

  constructor(public payload: { favoriteFilters: FavoriteFilter[] }) {}
}

export class UpdateFavoriteFilter implements Action {
  readonly type = FavoriteFilterActionTypes.UpdateFavoriteFilter;

  constructor(public payload: { favoriteFilter: Update<FavoriteFilter> }) {}
}

export class UpdateFavoriteFilters implements Action {
  readonly type = FavoriteFilterActionTypes.UpdateFavoriteFilters;

  constructor(public payload: { favoriteFilters: Update<FavoriteFilter>[] }) {}
}

export class DeleteFavoriteFilter implements Action {
  readonly type = FavoriteFilterActionTypes.DeleteFavoriteFilter;

  constructor(public payload: { id: string }) {}
}

export class DeleteFavoriteFilters implements Action {
  readonly type = FavoriteFilterActionTypes.DeleteFavoriteFilters;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearFavoriteFilters implements Action {
  readonly type = FavoriteFilterActionTypes.ClearFavoriteFilters;
}

export type FavoriteFilterActions =
  | LoadFavoriteFiltersAction
  | LoadFavoriteFiltersFailAction
  | AddFavoriteFilter
  | UpsertFavoriteFilter
  | AddFavoriteFiltersAction
  | UpsertFavoriteFilters
  | UpdateFavoriteFilter
  | UpdateFavoriteFilters
  | DeleteFavoriteFilter
  | DeleteFavoriteFilters
  | ClearFavoriteFilters;
