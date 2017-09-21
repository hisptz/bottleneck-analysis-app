import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {AnalyticsService} from '../../dashboard/providers/analytics.service';
import {
  AnalyticsLoadedAction, LOAD_ANALYTICS_ACTION, LoadAnalyticsAction, UPDATE_VISUALIZATION_WITH_CUSTOM_FILTER_ACTION,
  UPDATE_VISUALIZATION_WITH_FILTER_ACTION
} from '../actions';
import * as fromAction from '../actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {Action, Store} from '@ngrx/store';
import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {
  mapFavoriteToLayerSettings,
  updateFavoriteWithCustomFilters
} from '../reducers/store-data-reducer';
import {Visualization} from '../../dashboard/model/visualization';
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
    .take(1)
    .flatMap(([action, store]) => {
      const visualizationObject = _.clone(action.payload.visualizationObject);
      const favorite: any = _.find(store.storeData.favorites, ['id', visualizationObject.details.favorite.id]);
      const customFilters = _.clone(action.payload.filters);
      /**
       * Update visualization with original favorite and custom filters
       */
      if (favorite) {
        /**
         * Update with original settings
         */
        visualizationObject.layers = _.assign([], updateFavoriteWithCustomFilters(
          mapFavoriteToLayerSettings(favorite),
          customFilters
        ));
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
    .withLatestFrom(this.store)
    .flatMap(([action, store]: [any, ApplicationState]) => {
      const visualization: Visualization = action.payload;
      const visualizationLayers: any[] = visualization.layers;
      const analyticsPromises = _.map(visualizationLayers, (visualizationLayer: any) => {
        const visualizationFilter = _.find(visualization.details.filters, ['id', visualizationLayer.settings.id]);
        return this.analyticsService.getAnalytics(
          store.uiState.systemInfo.apiRootUrl,
          visualizationLayer.settings,
          visualization.type,
          visualizationFilter ? visualizationFilter.filters : []
          );
      });

      return new Observable((observer) => {
        Observable.forkJoin(analyticsPromises)
          .subscribe((analyticsResponse: any[]) => {
            visualization.details.loaded = visualization.details.currentVisualization === 'MAP' ? false : true;
            visualization.layers = [..._.map(visualizationLayers, (visualizationLayer: any, layerIndex: number) => {
              const newVisualizationLayer: any = {...visualizationLayer};
              const analytics = {...analyticsResponse[layerIndex]};

              if (analytics.headers) {
                newVisualizationLayer.analytics = analytics;
              }
              return newVisualizationLayer;
            })];
            observer.next(visualization);
            observer.complete();
          }, (error) => {
            visualization.details.loaded = true;
            visualization.details.hasError = true;
            visualization.details.errorMessage = error;
            observer.next(visualization);
            observer.complete();
          });
      });
    })
    .map((visualization: Visualization) => {
      visualization.operatingLayers = [...visualization.layers];
      if (visualization.details.currentVisualization === 'MAP') {
        return new fromAction.UpdateVisualizationWithMapSettings(visualization)
      }
      return new fromAction.SaveVisualization(visualization)
    })
}
