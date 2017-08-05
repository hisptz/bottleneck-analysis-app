import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import {
  CURRENT_VISUALIZATION_CHANGE_ACTION,
  FAVORITE_LOADED_ACTION, GEO_FEATURE_LOADED_ACTION, GeoFeatureLoadedAction, GET_CHART_CONFIGURATION_ACTION,
  GET_CHART_OBJECT_ACTION, GET_MAP_CONFIGURATION_ACTION, GET_MAP_OBJECT_ACTION, GET_TABLE_CONFIGURATION_ACTION,
  GET_TABLE_OBJECT_ACTION,
  GET_VISUALIZATION_FILTER_ACTION,
  GetVisualizationFilterAction,
  INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION,
  InitialVisualizationObjectLoadedAction, LEGEND_SET_LOADED_ACTION, LegendSetLoadedAction, LOAD_FAVORITE_ACTION,
  LOAD_GEO_FEATURE_ACTION,
  LOAD_INITIAL_VISUALIZATION_OBJECT_ACTION, LOAD_LEGEND_SET_ACTION, LOAD_ORGUNIT_GROUP_SET_ACTION, LoadFavoriteAction,
  LoadLegendSetAction, LoadOrgUnitGroupSetAction, MERGE_VISUALIZATION_OBJECT_ACTION, OrgUnitGroupSetLoadedAction,
  SaveChartConfigurationAction,
  SaveChartObjectAction, SaveMapConfigurationAction, SaveMapObjectAction, SaveTableConfigurationAction,
  SaveTableObjectAction, SPLIT_VISUALIZATION_OBJECT_ACTION, VisualizationObjectMergedAction,
  VisualizationObjectSplitedAction
} from '../actions';
import {ChartService} from '../../dashboard/providers/chart.service';
import {GeoFeatureService} from '../../dashboard/providers/geo-feature.service';
import {LegendSetService} from '../../dashboard/providers/legend-set.service';
import {OrgunitGroupSetService} from '../../dashboard/providers/orgunit-group-set.service';
import {MapService} from '../../dashboard/providers/map.service';
import {TableService} from '../../dashboard/providers/table.service';
import {ApplicationState} from '../application-state';
@Injectable()
export class VisualizationObjectEffect {
  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private visualizationObjectService: VisualizationObjectService,
    private chartService: ChartService,
    private geoFeatureService: GeoFeatureService,
    private legendSetService: LegendSetService,
    private orgUnitGroupSetService: OrgunitGroupSetService,
    private mapService: MapService,
    private tableService: TableService
  ) {}

  @Effect() initialVisualizationObject$: Observable<Action> = this.actions$
    .ofType(LOAD_INITIAL_VISUALIZATION_OBJECT_ACTION)
    .switchMap((action: any) => this.visualizationObjectService.loadInitialVisualizationObject(action.payload))
    .map(visualizationObject => new InitialVisualizationObjectLoadedAction(visualizationObject));

  @Effect() loadedVisualizationObject$: Observable<Action> = this.actions$
    .ofType(INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION)
    .withLatestFrom(this.store)
    .flatMap(([action, store]) => {
      return Observable.of(action.payload)
    })
    .map(visualizationObject => {
      return new LoadFavoriteAction(visualizationObject)
    });

  @Effect() chartConfiguration$: Observable<Action> = this.actions$
    .ofType(GET_CHART_CONFIGURATION_ACTION)
    .flatMap((action: any) => Observable.of(this.chartService.getChartConfiguration(action.payload)))
    .map(chartConfiguration => new SaveChartConfigurationAction(chartConfiguration));

  @Effect() mapConfiguration$: Observable<Action> = this.actions$
    .ofType(GET_MAP_CONFIGURATION_ACTION)
    .flatMap((action: any) => Observable.of(this.mapService.getMapConfiguration(action.payload)))
    .map(chartConfiguration => new SaveMapConfigurationAction(chartConfiguration));

  @Effect() tableConfiguration$: Observable<Action> = this.actions$
    .ofType(GET_TABLE_CONFIGURATION_ACTION)
    .flatMap((action: any) => Observable.of(this.tableService.getTableConfiguration(action.payload)))
    .map(chartConfiguration => new SaveTableConfigurationAction(chartConfiguration));

  @Effect() chartObject$: Observable<Action> = this.actions$
    .ofType(GET_CHART_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.chartService.getChartObjects(action.payload)))
    .map(chartObject => new SaveChartObjectAction(chartObject));

  @Effect() tableObject$: Observable<Action> = this.actions$
    .ofType(GET_TABLE_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.tableService.getTableObjects(action.payload)))
    .map(tableObjects => new SaveTableObjectAction(tableObjects));

  @Effect() mapObject$: Observable<Action> = this.actions$
    .ofType(GET_MAP_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.mapService.getMapObject(action.payload)))
    .map(chartObject => new SaveMapObjectAction(chartObject));

  @Effect() loadGeoFeature$: Observable<Action> = this.actions$
    .ofType(LOAD_GEO_FEATURE_ACTION)
    .flatMap((action: any) => this.geoFeatureService.getGeoFeature(action.payload))
    .map(geoFeature => new GeoFeatureLoadedAction(geoFeature));

  @Effect() geoFeatureLoaded$: Observable<Action> = this.actions$
    .ofType(GEO_FEATURE_LOADED_ACTION)
    .flatMap((action: any) => Observable.of(action.payload))
    .map(visualizationDetails => new LoadLegendSetAction(visualizationDetails));

  @Effect() loadlegendSet$: Observable<Action> = this.actions$
    .ofType(LOAD_LEGEND_SET_ACTION)
    .flatMap((action: any) => this.legendSetService.getLegendSet(action.payload))
    .map(legendSet => new LegendSetLoadedAction(legendSet));

  @Effect() legendSetLoaded: Observable<Action> = this.actions$
    .ofType(LEGEND_SET_LOADED_ACTION)
    .flatMap((action: any) => Observable.of(action.payload))
    .map(visualizationDetails => new LoadOrgUnitGroupSetAction(visualizationDetails));

  @Effect() loadGroupSet$: Observable<Action> = this.actions$
    .ofType(LOAD_ORGUNIT_GROUP_SET_ACTION)
    .flatMap((action: any) => this.orgUnitGroupSetService.getGroupSet(action.payload))
    .map(legendSet => new OrgUnitGroupSetLoadedAction(legendSet));

  @Effect() mergeVisualizationObject$: Observable<Action> = this.actions$
    .ofType(MERGE_VISUALIZATION_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.visualizationObjectService.mergeVisualizationObject(action.payload)))
    .map(mergedVisualizationObject => new VisualizationObjectMergedAction(mergedVisualizationObject));

  @Effect() splitVisualizationObject$: Observable<Action> = this.actions$
    .ofType(SPLIT_VISUALIZATION_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.visualizationObjectService.splitVisualizationObject(action.payload)))
    .map(legendSet => new VisualizationObjectSplitedAction(legendSet));

}
