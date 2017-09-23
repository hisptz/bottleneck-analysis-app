import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {AnalyticsService} from '../../dashboard/providers/analytics.service';
import * as fromAction from '../actions';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {Action, Store} from '@ngrx/store';
import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {Visualization} from '../../dashboard/model/visualization';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import * as fromVisualizationHelper from '../helpers/visualization.helpers';
import {getSanitizedCustomFilterObject, updateVisualizationWithCustomFilters} from '../helpers/visualization.helpers';
@Injectable()
export class AnalyticsEffect {
  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private analyticsService: AnalyticsService,
    private visualizationObjectService: VisualizationObjectService
  ) {}

  @Effect({dispatch: false}) globalFilterChange$ = this.actions$
    .ofType(fromAction.GLOBAL_FILTER_CHANGE_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
        const visualizationObjects: Visualization[] =
          _.filter(store.storeData.visualizationObjects, (visualization: Visualization) => visualization.dashboardId === action.payload.dashboardId);
        visualizationObjects.forEach((visualization: Visualization) => {
          this.store.dispatch(new fromAction.LoadAnalyticsAction(fromVisualizationHelper.updateVisualizationWithCustomFilters(
            visualization,
            fromVisualizationHelper.getSanitizedCustomFilterObject(action.payload.filterObject)
          )));
        });
        return Observable.of(null);
    });

  @Effect() localFilterChange$ = this.actions$
    .ofType(fromAction.LOCAL_FILTER_CHANGE_ACTION)
    .switchMap((action) => Observable.of(updateVisualizationWithCustomFilters(
      action.payload.visualizationObject,
      getSanitizedCustomFilterObject(action.payload.filterValue)
    ))).map((visualization: Visualization) => new fromAction.LoadAnalyticsAction(visualization));

  @Effect() visualizationObjectWithAnalytics$: Observable<Action> = this.actions$
    .ofType(fromAction.LOAD_ANALYTICS_ACTION)
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
      } else if (visualization.details.type === 'MAP' && visualization.details.currentVisualization !== 'MAP') {
        visualization = this.visualizationObjectService.mergeVisualizationObject(visualization);
      }
      return new fromAction.SaveVisualization(visualization)
    })
}
