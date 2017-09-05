import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {
  FAVORITE_ADDITIONAL_OPTIONS_LOADED_ACTION,
  FAVORITE_LOADED_ACTION, FavoriteAdditionalOptionsLoadedAction, FavoriteLoadedAction, FavoriteOptionsLoadedAction,
  FavoritesSavedAction,
  GET_VISUALIZATION_FILTER_ACTION,
  GetVisualizationFilterAction,
  LOAD_FAVORITE_ACTION, LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION, LOAD_FAVORITE_OPTIONS_ACTION,
  LoadFavoriteAdditionalOptionAction,
  SAVE_FAVORITE_ACTION,
  UPDATE_VISUALIZATION_WITH_FILTER_ACTION, UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION,
  UPDATE_VISUALIZATION_WITH_LAYOUT_ACTION,
  UpdateVisualizationWithFilterAction, UpdateVisualizationWithInterpretationAction,
  UpdateVisualizationWithLayoutAction
} from '../actions';
import {Action, Store} from '@ngrx/store';
import {FavoriteService} from '../../dashboard/providers/favorite.service';
import {observable} from 'rxjs/symbol/observable';
import {ApplicationState} from '../application-state';
import {favoriteSelector} from '../selectors/favorites.selector';
@Injectable()
export class FavoriteEffect {
  constructor(
    private actions$: Actions,
    private store$: Store<ApplicationState>,
    private favoriteService: FavoriteService
  ) {}

  @Effect() favorite$: Observable<Action> = this.actions$
    .ofType(LOAD_FAVORITE_ACTION)
    .flatMap((action: any) => this.favoriteService.getFavorite(action.payload))
    .map(favorite => new FavoriteLoadedAction(favorite));

  @Effect() additionalOptions$: Observable<Action> = this.actions$
    .ofType(LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION)
    .flatMap((action: any) => this.favoriteService.loadAdditionalOptions(action.payload))
    .map(favoriteAdditionalOptions => new FavoriteAdditionalOptionsLoadedAction(favoriteAdditionalOptions));

  @Effect() favoriteOptions$: Observable<Action> = this.actions$
    .ofType(LOAD_FAVORITE_OPTIONS_ACTION)
    .flatMap((action: any) => this.favoriteService.getFavoriteOptions(action.payload))
    .map(favoriteOptions => new FavoriteOptionsLoadedAction(favoriteOptions));

  @Effect() additionalOptionsLoaded$: Observable<Action> = this.actions$
    .ofType(FAVORITE_LOADED_ACTION)
    .flatMap((action: any) => Observable.of(this.favoriteService.getVisualizationFiltersFromFavorite(action.payload)))
    .map(filters => new UpdateVisualizationWithFilterAction(filters));

  @Effect() filters$: Observable<Action> = this.actions$
    .ofType(UPDATE_VISUALIZATION_WITH_FILTER_ACTION)
    .flatMap((action: any) => Observable.of(this.favoriteService.getVisualizationInterpretationFromFavorite(action.payload)))
    .map(payload => new UpdateVisualizationWithInterpretationAction(payload));

  @Effect() interpretations$: Observable<Action> = this.actions$
    .ofType(UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION)
    .flatMap((action: any) => Observable.of(this.favoriteService.getVisualizationLayoutFromFavorite(action.payload)))
    .map(payload => new UpdateVisualizationWithLayoutAction(payload));

  @Effect() saveFavorite$: Observable<Action> = this.actions$
    .ofType(SAVE_FAVORITE_ACTION)
    .flatMap((action: any) => this.favoriteService.createOrUpdateFavorite(action.payload))
    .map(payload => new FavoritesSavedAction(payload));

}
