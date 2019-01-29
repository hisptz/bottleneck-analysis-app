import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FavoriteFilterService } from '../../services/favorite-filter.service';
import { Observable, of } from 'rxjs';
import {
  FavoriteFilterActionTypes,
  LoadFavoriteFiltersAction,
  AddFavoriteFiltersAction,
  LoadFavoriteFiltersFailAction
} from '../actions/favorite-filter.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { getStandardizedFavoriteItems } from '../../helpers/get-standardized-favorite-items.helper';

@Injectable()
export class FavoriteFilterEffects {
  @Effect()
  loadFavoriteFilters$: Observable<any> = this.actions$.pipe(
    ofType(FavoriteFilterActionTypes.LoadFavoriteFilters),
    switchMap((action: LoadFavoriteFiltersAction) =>
      this.favoriteFilterService
        .getFavoritesBasedOnSearchQuery(action.searchTerm)
        .pipe(
          map(
            (favoriteResult: any) =>
              new AddFavoriteFiltersAction(
                getStandardizedFavoriteItems(favoriteResult)
              )
          ),
          catchError((error: any) =>
            of(new LoadFavoriteFiltersFailAction(error))
          )
        )
    )
  );
  constructor(
    private actions$: Actions,
    private favoriteFilterService: FavoriteFilterService
  ) {}
}
