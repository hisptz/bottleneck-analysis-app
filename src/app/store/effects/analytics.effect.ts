import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {AnalyticsService} from '../../dashboard/providers/analytics.service';
import {
  AnalyticsLoadedAction, LOAD_ANALYTICS_ACTION, LoadAnalyticsAction, UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION,
  UPDATE_VISUALIZATION_WITH_FILTER_ACTION
} from '../actions';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {
  handleVisualizationChangeAction, mapFavoriteToLayerSettings,
  updateFavoriteWithCustomFilters
} from '../reducers/store-data-reducer';
@Injectable()
export class AnalyticsEffect {
  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private analyticsService: AnalyticsService
  ) {}

  @Effect() loadedVisualizationObjectWithFavorite$: Observable<Action> = this.actions$
    .ofType(UPDATE_VISUALIZATION_WITH_FILTER_ACTION)
    .flatMap((action: any) => Observable.of(action.payload))
    .map(visualizationObject => new LoadAnalyticsAction(visualizationObject));

  @Effect() loadedVisualizationObjectWithFilters$: Observable<Action> = this.actions$
    .ofType(UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION)
    .withLatestFrom(this.store)
    .flatMap(([action, store]) => {
      const visualizationObject = _.clone(action.payload.visualizationObject);
      const favorite: any = _.find(store.storeData.favorites, ['id', visualizationObject.details.favorite.id]);
      const customFilters = _.cloneDeep(action.payload.filters);
      /**
       * Update visualization with original favorite and custom filters
       */
      if (favorite) {
        visualizationObject.layers = Object.assign([], updateFavoriteWithCustomFilters(mapFavoriteToLayerSettings(favorite), customFilters));
      }

      return Observable.of({
        apiRootUrl: _.clone(store.uiState.systemInfo.apiRootUrl),
        visualizationObject: _.clone(visualizationObject),
        filters: _.clone(customFilters),
        updateAvailable: _.clone(action.payload.updateAvailable)
      })
    })
    .map(visualizationObject => new LoadAnalyticsAction(visualizationObject));

  @Effect() visualizationObjectWithAnalytics$: Observable<Action> = this.actions$
    .ofType(LOAD_ANALYTICS_ACTION)
    .flatMap((action: any) => this.analyticsService.getAnalytics(action.payload))
    .map(payload => new AnalyticsLoadedAction(payload))
}
