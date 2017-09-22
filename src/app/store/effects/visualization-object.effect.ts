import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import { MERGE_VISUALIZATION_OBJECT_ACTION, SPLIT_VISUALIZATION_OBJECT_ACTION,
  UpdateVisualizationObjectWithRenderingObjectAction, VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION,
  VisualizationObjectMergedAction,
  VisualizationObjectSplitedAction
} from '../actions';
import * as fromAction from '../actions';
import {ChartService} from '../../dashboard/providers/chart.service';
import {GeoFeatureService} from '../../dashboard/providers/geo-feature.service';
import {MapService} from '../../dashboard/providers/map.service';
import {TableService} from '../../dashboard/providers/table.service';
import {ApplicationState} from '../application-state';
import * as _ from 'lodash';
import {updateVisualizationWithAnalytics} from '../handlers/updateVisualizationWithAnalytics';
import {Visualization} from '../../dashboard/model/visualization';
import {mapFavoriteToLayerSettings} from '../reducers/store-data-reducer';
import 'rxjs/add/operator/take';
@Injectable()
export class VisualizationObjectEffect {
  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
    private visualizationObjectService: VisualizationObjectService,
    private chartService: ChartService,
    private geoFeatureService: GeoFeatureService,
    private mapService: MapService,
    private tableService: TableService
  ) {}

  @Effect({dispatch: false}) loadedVisualizationObject$: Observable<Action> = this.actions$
    .ofType(fromAction.INITIAL_VISUALIZATION_OBJECTS_LOADED_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]: [any, ApplicationState]) => {
      action.payload.forEach((visualizationObject: Visualization) => {
        const visualizationDetails: any = {...visualizationObject.details};

        if (visualizationDetails && visualizationDetails.favorite && visualizationDetails.favorite.id) {
          this.store.dispatch(new fromAction.LoadFavoriteAction({
            apiRootUrl: store.uiState.systemInfo.apiRootUrl,
            visualizationObject: visualizationObject
          }))
        }
      });
      return Observable.of(null)
    });

  @Effect() mergeVisualizationObject$: Observable<Action> = this.actions$
    .ofType(MERGE_VISUALIZATION_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.visualizationObjectService.mergeVisualizationObject(action.payload)))
    .map(mergedVisualizationObject => new VisualizationObjectMergedAction(mergedVisualizationObject));

  @Effect() splitVisualizationObject$: Observable<Action> = this.actions$
    .ofType(SPLIT_VISUALIZATION_OBJECT_ACTION)
    .flatMap((action: any) => Observable.of(this.visualizationObjectService.splitVisualizationObject(action.payload)))
    .map(legendSet => new VisualizationObjectSplitedAction(legendSet));

  // @Effect() visualizationObjectLayoutChange$: Observable<Action> = this.actions$
  //   .ofType(VISUALIZATION_OBJECT_LAYOUT_CHANGE_ACTION)
  //   .withLatestFrom(this.store)
  //   .flatMap(([action, store]) => {
  //     const currentVisualizationObject = _.find(store.storeData.visualizationObjects, ['id', action.payload.visualizationObject.id]);
  //     if (currentVisualizationObject) {
  //       const newVisualizationObject: Visualization = _.clone(currentVisualizationObject);
  //
  //       const newVisualizationObjectDetails = _.clone(currentVisualizationObject.details);
  //
  //       /**
  //        * Update visualization layouts
  //        */
  //       newVisualizationObjectDetails.layouts = action.payload.layouts;
  //
  //       const favorite: any = _.find(store.storeData.favorites, ['id', newVisualizationObjectDetails.favorite.id]);
  //       /**
  //        * Update visualization with original favorite and custom filters
  //        */
  //       if (favorite) {
  //         //todo find best way to keep some options that might have already being changed
  //         /**
  //          * Update chart type if chart
  //          */
  //
  //         if (favorite.type) {
  //           if (action.payload.visualizationObject.layers) {
  //             const visualizationLayer = action.payload.visualizationObject.layers[0];
  //
  //             if (visualizationLayer && visualizationLayer.settings) {
  //               if (visualizationLayer.settings.type) {
  //                 favorite.type = visualizationLayer.settings.type;
  //               }
  //             }
  //           }
  //         }
  //         /**
  //          * Update with original settings
  //          */
  //         newVisualizationObject.layers = _.assign([], updateFavoriteWithCustomFilters(
  //           mapFavoriteToLayerSettings(favorite),
  //           newVisualizationObjectDetails.filters
  //         ));
  //       }
  //
  //       /**
  //        * Compile modified list with details
  //        */
  //       newVisualizationObject.details = _.assign({}, newVisualizationObjectDetails);
  //
  //       return this.getSanitizedVisualizationObject(newVisualizationObject, store.storeData.analytics, store.uiState.systemInfo.apiRootUrl);
  //     }
  //
  //     return Observable.of(action.payload.visualizationObject);
  //   })
  //   .map(visualizationObject => new UpdateVisualizationObjectWithRenderingObjectAction(visualizationObject));

  @Effect() visualizationWithMapSettings$ = this.actions$
    .ofType(fromAction.UPDATE_VISUALIZATION_WITH_MAP_SETTINGS)
    .withLatestFrom(this.store)
    .flatMap(([action, store]: [any, ApplicationState]) => this.visualizationObjectService.updateVisualizationWithMapSettings(
      store.uiState.systemInfo.apiRootUrl,
      action.payload
    ))
    .map((visualization: Visualization) => new fromAction.SaveVisualization(visualization));

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
          newLayer.tableObject = _.assign({}, this.tableService.getTableObject(newLayer.analytics,newLayer.settings, newLayer.settings.tableConfiguration));
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
