import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {
  FAVORITE_LOADED_ACTION, FavoriteAdditionalOptionsLoadedAction, FavoriteLoadedAction, FavoriteOptionsLoadedAction,
  FavoritesSavedAction,
  LOAD_FAVORITE_ACTION, LOAD_FAVORITE_ADDITIONAL_OPTIONS_ACTION, LOAD_FAVORITE_OPTIONS_ACTION,
  SAVE_FAVORITE_ACTION,
  UPDATE_VISUALIZATION_WITH_FILTER_ACTION, UPDATE_VISUALIZATION_WITH_INTERPRETATION_ACTION,
  UpdateVisualizationWithFilterAction, UpdateVisualizationWithInterpretationAction,
  UpdateVisualizationWithLayoutAction
} from '../actions';
import * as fromAction from '../actions';
import {Action, Store} from '@ngrx/store';
import {FavoriteService} from '../../dashboard/providers/favorite.service';
import {ApplicationState} from '../application-state';
import {Visualization} from '../../dashboard/model/visualization';
import * as fromVisualizationHelper from '../helpers/visualization.helpers';
@Injectable()
export class FavoriteEffect {
  constructor(
    private actions$: Actions,
    private store$: Store<ApplicationState>,
    private favoriteService: FavoriteService
  ) {}

  @Effect() favorite$: Observable<Action> = this.actions$
    .ofType(fromAction.LOAD_FAVORITE_ACTION)
    .flatMap((action: any) => this.favoriteService.getFavorite(action.payload))
    .map(favoriteDetails => new fromAction.LoadAnalyticsAction(fromVisualizationHelper.updateVisualizationWithSettings(
      favoriteDetails.visualizationObject, favoriteDetails.favorite
    )));

  @Effect() favoriteOptions$: Observable<Action> = this.actions$
    .ofType(LOAD_FAVORITE_OPTIONS_ACTION)
    .flatMap((action: any) => this.favoriteService.getFavoriteOptions(action.payload))
    .map(favoriteOptions => new FavoriteOptionsLoadedAction(favoriteOptions));


  @Effect() saveFavorite$: Observable<Action> = this.actions$
    .ofType(SAVE_FAVORITE_ACTION)
    .flatMap((action: any) => this.favoriteService.createOrUpdateFavorite(action.payload))
    .map(payload => new FavoritesSavedAction(payload));

}
