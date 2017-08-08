import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import {
  ANALYTICS_LOADED_ACTION, CHART_TYPE_CHANGE_ACTION,
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
  SaveTableObjectAction, SPLIT_VISUALIZATION_OBJECT_ACTION,
  UpdateVisualizationObjectWithRenderingObjectAction, VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION,
  VisualizationObjectMergedAction,
  VisualizationObjectOptimizedAction,
  VisualizationObjectSplitedAction
} from '../actions';
import {ChartService} from '../../dashboard/providers/chart.service';
import {GeoFeatureService} from '../../dashboard/providers/geo-feature.service';
import {LegendSetService} from '../../dashboard/providers/legend-set.service';
import {OrgunitGroupSetService} from '../../dashboard/providers/orgunit-group-set.service';
import {MapService} from '../../dashboard/providers/map.service';
import {TableService} from '../../dashboard/providers/table.service';
import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {updateVisualizationWithAnalytics} from '../handlers/updateVisualizationWithAnalytics';
import {Visualization} from '../../dashboard/model/visualization';
import {mapFavoriteToLayerSettings, updateFavoriteWithCustomFilters} from '../reducers/store-data-reducer';
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
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return Observable.of({
        apiRootUrl: store.uiState.systemInfo.apiRootUrl,
        visualizationObject: this.visualizationObjectService.loadInitialVisualizationObject(action.payload)
      });
    })
    .map(visualizationObjectDetails => new InitialVisualizationObjectLoadedAction(visualizationObjectDetails));

  @Effect() loadedVisualizationObject$: Observable<Action> = this.actions$
    .ofType(INITIAL_VISUALIZATION_OBJECT_LOADED_ACTION)
    .withLatestFrom(this.store)
    .flatMap(([action, store]) => {
      return Observable.of(action.payload)
    })
    .map(visualizationObjectDetails => {

      const visualizationDetails = visualizationObjectDetails.visualizationObject.details;

      if (visualizationDetails) {
        if (!visualizationDetails.favorite || !visualizationDetails.favorite.id) {
          return new UpdateVisualizationObjectWithRenderingObjectAction(visualizationObjectDetails.visualizationObject);
        }
      }
      return new LoadFavoriteAction(visualizationObjectDetails)
    });

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

  @Effect() chartTypeChange: Observable<Action> = this.actions$
    .ofType(CHART_TYPE_CHANGE_ACTION)
    .withLatestFrom(this.store)
    .flatMap(([action, store]) => {
      const currentVisualizationObject = _.find(store.storeData.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const newVisualizationObject = _.clone(currentVisualizationObject);

        const visualizationLayers = _.map(currentVisualizationObject.layers, (layer) => {
          const newLayer = _.clone(layer);
          newLayer.settings.type = action.payload.chartType;
          return newLayer;
        });

        newVisualizationObject.layers = _.assign([], visualizationLayers);

        return this.getSanitizedVisualizationObject(newVisualizationObject, store.storeData.analytics, store.uiState.systemInfo.apiRootUrl);
      }
      return Observable.of(action.payload.visualizationObject);
    })
    .map(visualizationObject => new UpdateVisualizationObjectWithRenderingObjectAction(visualizationObject));

  @Effect() visualizationObjectLayoutChange$: Observable<Action> = this.actions$
    .ofType(VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION)
    .withLatestFrom(this.store)
    .flatMap(([action, store]) => {
      const currentVisualizationObject = _.find(store.storeData.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const newVisualizationObject: Visualization = _.clone(currentVisualizationObject);

        const newVisualizationObjectDetails = _.clone(currentVisualizationObject.details);

        /**
         * Update visualization layouts
         */
        newVisualizationObjectDetails.layouts = action.payload.layouts;

        const favorite: any = _.find(store.storeData.favorites, ['id', newVisualizationObjectDetails.favorite.id]);
        /**
         * Update visualization with original favorite and custom filters
         */
        if (favorite) {
          //todo find best way to keep some options that might have already being changed
          /**
           * Update chart type if chart
           */

          if (favorite.type) {
            if (action.payload.visualizationObject.layers) {
              const visualizationLayer = action.payload.visualizationObject.layers[0];

              if (visualizationLayer && visualizationLayer.settings) {
                if (visualizationLayer.settings.type) {
                  favorite.type = visualizationLayer.settings.type;
                }
              }
            }
          }
          /**
           * Update with original settings
           */
          newVisualizationObject.layers = _.assign([], updateFavoriteWithCustomFilters(
            mapFavoriteToLayerSettings(favorite),
            newVisualizationObjectDetails.filters
          ));
        }

        /**
         * Compile modified list with details
         */
        newVisualizationObject.details = _.assign({}, newVisualizationObjectDetails);

        return this.getSanitizedVisualizationObject(newVisualizationObject, store.storeData.analytics, store.uiState.systemInfo.apiRootUrl);
      }

      return Observable.of(action.payload.visualizationObject);
    })
    .map(visualizationObject => new UpdateVisualizationObjectWithRenderingObjectAction(visualizationObject));

  @Effect() currentVisualizationChange: Observable<Action> = this.actions$
    .ofType(CURRENT_VISUALIZATION_CHANGE_ACTION)
    .withLatestFrom(this.store)
    .flatMap(([action, store]) => {
      const currentVisualizationObject = _.find(store.storeData.visualizationObjects, ['id', action.payload.visualizationObject.id]);
      if (currentVisualizationObject) {
        const newVisualizationObject: Visualization = _.clone(currentVisualizationObject);

        const newVisualizationObjectDetails = _.clone(currentVisualizationObject.details);

        /**
         * Update visualization details
         */
        newVisualizationObjectDetails.currentVisualization = action.payload.selectedVisualization;

        const favorite: any = _.find(store.storeData.favorites, ['id', newVisualizationObjectDetails.favorite.id]);
        /**
         * Update visualization with original favorite and custom filters
         */
        if (favorite) {
          /**
           * Update with original settings
           */
          newVisualizationObject.layers = _.assign([], updateFavoriteWithCustomFilters(
            mapFavoriteToLayerSettings(favorite),
            newVisualizationObjectDetails.filters
          ));
        }

        /**
         * Compile modified list with details
         */
        newVisualizationObject.details = _.assign({}, newVisualizationObjectDetails);

        return this.getSanitizedVisualizationObject(newVisualizationObject, store.storeData.analytics, store.uiState.systemInfo.apiRootUrl);
      }

      return Observable.of(action.payload.visualizationObject);
    })
    .map(visualizationObject => new UpdateVisualizationObjectWithRenderingObjectAction(visualizationObject));

  @Effect() analyticsLoaded$: Observable<Action> = this.actions$
    .ofType(ANALYTICS_LOADED_ACTION)
    .withLatestFrom(this.store)
    .flatMap(([action, store]) => {
      const loadedAnalytics: any[] = action.payload.analytics;
      const analyticsError = action.payload.error;
      const currentVisualizationObject = _.find(store.storeData.visualizationObjects, ['id', action.payload.visualizationObject.id]);

      if (!analyticsError && currentVisualizationObject) {

        /**
         * Use updated layers if avaialable
         */
        if (action.payload.visualizationObject.layers.length > 0) {
          currentVisualizationObject.layers = _.assign([], action.payload.visualizationObject.layers);
        }
        return this.getSanitizedVisualizationObject(currentVisualizationObject, loadedAnalytics, store.uiState.systemInfo.apiRootUrl);
      } else {
        const newVisualizationObject = _.clone(currentVisualizationObject);
        const newVisualizationObjectDetails = _.clone(newVisualizationObject.details);

        newVisualizationObjectDetails.laoded = true;
        newVisualizationObjectDetails.hasError = true;
        newVisualizationObjectDetails.errorMessage = analyticsError;

        newVisualizationObject.details = _.assign({}, newVisualizationObjectDetails);

        return Observable.of(newVisualizationObject);
      }

      // return Observable.of(action.payload.visualizationObject)
    })
    .map(visualizationObject => new UpdateVisualizationObjectWithRenderingObjectAction(visualizationObject));

  getSanitizedVisualizationObject(currentVisualizationObject: Visualization, loadedAnalytics, apiRootUrl) {
    const newVisualizationObject = updateVisualizationWithAnalytics(currentVisualizationObject, loadedAnalytics);
    const currentVisualization: string = currentVisualizationObject.details.currentVisualization;
    return Observable.create(observer => {
      if (currentVisualization === 'CHART') {
        const mergeVisualizationObject = this.visualizationObjectService.mergeVisualizationObject(newVisualizationObject);
        /**
         * Update visualization layers with chart configuration
         */
        const visualizationObjectLayersWithChartConfiguration = _.map(mergeVisualizationObject.layers, (layer, layerIndex) => {
          const newLayer = _.clone(layer);
          const newSettings = _.clone(layer.settings);
          newSettings.chartConfiguration = _.assign({}, this.chartService.getChartConfiguration1(
            newSettings,
            mergeVisualizationObject.id + '_' + layerIndex,
            mergeVisualizationObject.details.layouts
          ));
          newLayer.settings = _.assign({}, newSettings);
          return newLayer;
        });

        /**
         * Update visualization layers with chart object
         */
        const visualizationObjectLayersWithChartObject = _.map(visualizationObjectLayersWithChartConfiguration, (layer) => {
          const newLayer = _.clone(layer);
          newLayer.chartObject = _.assign({}, this.chartService.getChartObject(newLayer.analytics, newLayer.settings.chartConfiguration));
          return newLayer;
        });

        newVisualizationObject.layers = _.assign([], visualizationObjectLayersWithChartObject);

        observer.next(newVisualizationObject);
        observer.complete();

      } else if (currentVisualization === 'TABLE') {
        const mergeVisualizationObject = this.visualizationObjectService.mergeVisualizationObject(newVisualizationObject);

        /**
         * Update visualization layers with table configuration
         */
        const visualizationObjectLayersWithTableConfiguration = _.map(mergeVisualizationObject.layers, (layer, layerIndex) => {
          const newLayer = _.clone(layer);
          const newSettings = _.clone(layer.settings);
          newSettings.tableConfiguration = _.assign({}, this.tableService.getTableConfiguration1(
            newSettings,
            mergeVisualizationObject.details.layouts,
            mergeVisualizationObject.type
          ));
          newLayer.settings = _.assign({}, newSettings);
          return newLayer;
        });

        /**
         * Update visualization layers with table object
         */
        const visualizationObjectLayersWithChartObject = _.map(visualizationObjectLayersWithTableConfiguration, (layer) => {
          const newLayer = _.clone(layer);
          newLayer.tableObject = _.assign({}, this.tableService.getTableObject(newLayer.analytics, newLayer.settings.tableConfiguration));
          return newLayer;
        });

        newVisualizationObject.layers = _.assign([], visualizationObjectLayersWithChartObject);

        observer.next(newVisualizationObject);
        observer.complete();
      } else if (currentVisualization === 'MAP') {
        const splitedVisualizationObject = newVisualizationObject.details.type !== 'MAP' ?
          this.visualizationObjectService.splitVisualizationObject(newVisualizationObject) :
          _.clone(newVisualizationObject);

        const newVisualizationDetails = _.clone(splitedVisualizationObject.details);

        /**
         * Update with map configuration
         */
        newVisualizationDetails.mapConfiguration = _.assign({}, this.mapService.getMapConfiguration(splitedVisualizationObject));

        /**
         * Update with geo features
         */
        this.geoFeatureService.getGeoFeature({
          apiRootUrl: apiRootUrl,
          visualizationObject: splitedVisualizationObject
        }).subscribe(geoFeatureResponse => {
          if (geoFeatureResponse.geoFeatures) {
            splitedVisualizationObject.layers = _.map(splitedVisualizationObject.layers, (layer) => {
              const newLayer = _.clone(layer);
              const newSettings = _.clone(layer.settings);
              const availableGeoFeatureObject = _.find(geoFeatureResponse.geoFeatures, ['id', newSettings.id]);

              if (availableGeoFeatureObject) {
                if (availableGeoFeatureObject.content.length === 0) {
                  // newVisualizationDetails.hasError = true;
                  // newVisualizationDetails.errorMessage = 'Coordinates for displaying a map are missing';
                } else {
                  newSettings.geoFeature = _.assign([], availableGeoFeatureObject.content);
                }
              }
              newLayer.settings = _.assign({}, newSettings);

              return newLayer;
            });
          }
          splitedVisualizationObject.details = _.assign({}, newVisualizationDetails);
          observer.next(splitedVisualizationObject);
          observer.complete();
        })
      } else {
        observer.next(newVisualizationObject);
        observer.complete();
      }
    })
  }

}
