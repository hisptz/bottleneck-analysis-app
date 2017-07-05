import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {
  FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION,
  FAVORITE_LOADED_ACTION, FavoriteAdditionalOptionsLoadedAction, FavoriteLoadedAction, FavoritesSavedAction,
  GET_VISUALIZATION_FILTER_ACTION,
  GetVisualizationFilterAction,
  LOAD_FAVORITE_ACTION, LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION, LoadFavoriteAdditionalOptionAction,
  SAVE_FAVORITE_ACTION,
  UPDATE_VISUALIZATION_WITH_FILTER_ACTION,
  UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION,
  UpdateVisualizationWithFilterAction,
  UpdateVisualizationWithLayoutAction
} from '../actions';
import {Action} from '@ngrx/store';
import {FavoriteService} from '../../dashboard/providers/favorite.service';
import {observable} from 'rxjs/symbol/observable';
@Injectable()
export class FavoriteEffect {
  constructor(
    private actions$: Actions,
    private favoriteService: FavoriteService
  ) {}

  @Effect() favorite$: Observable<Action> = this.actions$
    .ofType(LOAD_FAVORITE_ACTION)
    .flatMap((action: any) => this.favoriteService.getFavorite(action.payload))
    .map(favorite => new FavoriteLoadedAction(favorite));

  @Effect() favoriteLoaded$: Observable<Action> = this.actions$
    .ofType(FAVORITE_LOADED_ACTION)
    .flatMap((action: any) => Observable.of(action.payload))
    .map(favorite => new LoadFavoriteAdditionalOptionAction(favorite));

  @Effect() additionalOptions$: Observable<Action> = this.actions$
    .ofType(LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION)
    .flatMap((action: any) => this.favoriteService.loadAdditionalOptions(action.payload))
    .map(favoriteAdditionalOptions => new FavoriteAdditionalOptionsLoadedAction(favoriteAdditionalOptions));

  @Effect() additionalOptionsLoaded$: Observable<Action> = this.actions$
    .ofType(FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION)
    .flatMap((action: any) => Observable.of(this.favoriteService.getVisualizationFiltersFromFavorite(action.payload)))
    .map(filters => new UpdateVisualizationWithFilterAction(filters));

  @Effect() filters$: Observable<Action> = this.actions$
    .ofType(UPDATE_VISUALIZATION_WITH_FILTER_ACTION)
    .flatMap((action: any) => Observable.of(this.favoriteService.getVisualizationLayoutFromFavorite(action.payload)))
    .map(payload => new UpdateVisualizationWithLayoutAction(payload));

  @Effect() saveFavorite$: Observable<Action> = this.actions$
    .ofType(SAVE_FAVORITE_ACTION)
    .flatMap((action: any) => this.favoriteService.createOrUpdateFavorite(action.payload))
    .map(payload => new FavoritesSavedAction(payload));

}
