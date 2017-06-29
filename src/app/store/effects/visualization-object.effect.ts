import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import {
  FAVORITE_LOADED_ACTION, GET_CHART_CONFIGURATION_ACTION, GET_CHART_OBJECT_ACTION, GET_VISUALIZATION_FILTER_ACTION,
  GetVisualizationFilterAction,
  INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION,
  InitialVisualizationObjectLoadedAction, LOAD_FAVORITE_ACTION,
  LOAD_INITIAL_VISUALIZATION_OBJECT_ACTION, LoadFavoriteAction, SaveChartConfigurationAction, SaveChartObjectAction
} from '../actions';
import {ChartService} from '../../dashboard/providers/chart.service';
@Injectable()
export class VisualizationObjectEffect {
  constructor(
    private actions$: Actions,
    private visualizationObjectService: VisualizationObjectService,
    private chartService: ChartService
  ) {}

  @Effect() initialVisualizationObject$: Observable<Action> = this.actions$
    .ofType(LOAD_INITIAL_VISUALIZATION_OBJECT_ACTION)
    .switchMap((action: any) => this.visualizationObjectService.loadInitialVisualizationObject(action.payload))
    .map(visualizationObject => new InitialVisualizationObjectLoadedAction(visualizationObject));

  @Effect() loadedVisualizationObject$: Observable<Action> = this.actions$
    .ofType(INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION)
    .flatMap((action: any) => Observable.of(action.payload))
    .map(visualizationObject => new LoadFavoriteAction(visualizationObject));

  @Effect() chartConfiguration$: Observable<Action> = this.actions$
    .ofType(GET_CHART_CONFIGURATION_ACTION)
    .flatMap((action: any) => Observable.of(this.chartService.getChartConfiguration(action.payload)))
    .map(chartConfiguration => new SaveChartConfigurationAction(chartConfiguration));

  @Effect() chartObject$: Observable<Action> = this.actions$
    .ofType(GET_CHART_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.chartService.getChartObjects(action.payload)))
    .map(chartObject => new SaveChartObjectAction(chartObject));

  //
  // @Effect() visualizationObjectWithAnalytics$: Observable<Action> = this.actions$
  //   .ofType(LOAD_ANALYTICS_ACTION)
  //   .flatMap((action: any) => this.visualizationObjectService.updateVisualizationObjectWithAnalytics(action.payload))
  //   .map(visualizationObject => new AnalyticsLoadedAction(visualizationObject));
  //
  // @Effect() loadedVisualizationObjectWithAnalytics$: Observable<Action> = this.actions$
  //   .ofType(ANALYTICS_LOADED_ACTION)
  //   .flatMap((action: any) => Observable.of(action.payload))
  //   .map(visualizationObject => new LoadVisualizationOptionsAction(visualizationObject));
  //
  // @Effect() visualizationObjectWithOptions$: Observable<Action> = this.actions$
  //   .ofType(LOAD_VISUALIZATION_OPTIONS_ACTION)
  //   .flatMap((action: any) => this.visualizationObjectService.updateVisualizationWithMoreSettingsForCurrentVisualization(action.payload))
  //   .map(visualizationObject => new VisualizationOptionsLoadedAction(visualizationObject));
}
