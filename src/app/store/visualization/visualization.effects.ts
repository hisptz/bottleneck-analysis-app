import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {HttpClientService} from '../../services/http-client.service';
import * as _ from 'lodash';
import * as visualization from './visualization.actions';
import * as dashboard from '../dashboard/dashboard.actions';
import {AppState} from '../app.reducers';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Visualization} from './visualization.state';
import {Dashboard} from '../dashboard/dashboard.state';
import * as visualizationHelpers from './helpers/index';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import {Router} from '@angular/router';

@Injectable()
export class VisualizationEffects {

  @Effect({dispatch: false})
  setInitialVisualizations$ = this.actions$
    .ofType<dashboard.SetCurrentAction>(dashboard.DashboardActions.SET_CURRENT)
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, AppState]) => {
      const visualizationObjects: Visualization[] = state.visualization.visualizationObjects;
      const currentDashboard: Dashboard = _.find(state.dashboard.dashboards, ['id', action.payload]);
      if (currentDashboard) {

        const initialVisualizations: Visualization[] = currentDashboard.dashboardItems.map((dashboardItem: any) =>
          !_.find(visualizationObjects, ['id', dashboardItem.id]) ? visualizationHelpers.mapDashboardItemToVisualization(
            dashboardItem, currentDashboard.id, state.currentUser) : null)
          .filter((visualizationObject: Visualization) => visualizationObject);

        /**
         * Update store with initial visualization objects
         */
        this.store.dispatch(new visualization.SetInitialAction(initialVisualizations));

        /**
         * Update visualizations with favorites
         */
        initialVisualizations.forEach((visualizationObject: Visualization) => {
          this.store.dispatch(new visualization.LoadFavoriteAction(visualizationObject));
        });
      }
      return Observable.of(null);
    });

  @Effect({dispatch: false})
  laodFavorite$ = this.actions$
    .ofType<visualization.LoadFavoriteAction>(visualization.VisualizationActions.LOAD_FAVORITE)
    .flatMap((action: any) => {
      const favoriteUrl = visualizationHelpers.getVisualizationFavoriteUrl(action.payload.details.favorite);

      const favoritePromise = favoriteUrl !== '' ? this.httpClient.get(favoriteUrl) : Observable.of({});

      favoritePromise.subscribe((favorite: any) =>
        this.store.dispatch(new visualization.LoadAnalyticsAction(
          visualizationHelpers.updateVisualizationWithSettings(action.payload, favorite))), error => {
        console.log(error);
      });
      return Observable.of(null);
    });

  @Effect()
  loadAnalytics$ = this.actions$
    .ofType<visualization.LoadAnalyticsAction>(visualization.VisualizationActions.LOAD_ANALYTICS)
    .flatMap((action: any) => {
      const visualizationObject: Visualization = {...action.payload};
      const visualizationDetails: any = {...visualizationObject.details};
      const visualizationLayers: any[] = [...visualizationObject.layers];
      const analyticsPromises = _.map(visualizationLayers, (visualizationLayer: any) => {
        const visualizationFilter = _.find(visualizationDetails.filters, ['id', visualizationLayer.settings.id]);
        const analyticsUrl = visualizationHelpers.constructAnalyticsUrl(
          visualizationObject.type,
          visualizationLayer.settings,
          visualizationFilter ? visualizationFilter.filters : []);
        return analyticsUrl !== '' ? this.httpClient.get(analyticsUrl) : Observable.of(null);
      });

      return new Observable((observer) => {
        Observable.forkJoin(analyticsPromises)
          .subscribe((analyticsResponse: any[]) => {
            visualizationDetails.loaded = visualizationObject.details.currentVisualization === 'MAP' ? false : true;
            visualizationObject.layers = [..._.map(visualizationLayers, (visualizationLayer: any, layerIndex: number) => {
              const newVisualizationLayer: any = {...visualizationLayer};
              const analytics = {...analyticsResponse[layerIndex]};

              if (analytics.headers) {
                newVisualizationLayer.analytics = analytics;
              }
              return newVisualizationLayer;
            })];

            visualizationObject.details = {...visualizationDetails};
            observer.next(visualizationObject);
            observer.complete();
          }, (error) => {
            visualizationDetails.loaded = true;
            visualizationDetails.hasError = true;
            visualizationDetails.errorMessage = error;
            visualizationObject.details = {...visualizationDetails};
            observer.next(visualizationObject);
            observer.complete();
          });
      });
    })
    .map((visualizationObject: Visualization) => {
      visualizationObject.operatingLayers = [...visualizationObject.layers];
      if (visualizationObject.details.currentVisualization === 'MAP') {
        return new visualization.UpdateVisualizationWithMapSettingsAction(visualizationObject);
      } else if (visualizationObject.details.type === 'MAP' && visualizationObject.details.currentVisualization !== 'MAP') {
        // TODO find best way to merge visualization object
        // visualizationObject = this.visualizationObjectService.mergeVisualizationObject(visualization);
      }
      return new visualization.UpdateAction(visualizationObject);
    });

  @Effect()
  visualizationWithMapSettings$ = this.actions$
    .ofType<visualization.UpdateVisualizationWithMapSettingsAction>
    (visualization.VisualizationActions.UPDATE_VISUALIZATION_WITH_MAP_SETTINGS)
    .flatMap((action) => this._updateVisualizationWithMapSettings(action.payload))
    .map((visualizationObject: Visualization) => new visualization.UpdateAction(visualizationObject));

  @Effect()
  visualizationChange$ = this.actions$
    .ofType<visualization.VisualizationChangeAction>(visualization.VisualizationActions.VISUALIZATION_CHANGE)
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, AppState]) => {
      const correspondingVisualizationObject: Visualization =
        _.find(state.visualization.visualizationObjects, ['id', action.payload.id]);

      return new Observable(observer => {
        if (correspondingVisualizationObject) {

          if (action.payload.type === 'MAP') {
            // TODO perform map related actions
            observer.next({
              ...correspondingVisualizationObject,
              details: {
                ...correspondingVisualizationObject.details,
                currentVisualization: action.payload.type
              },
              layers: [...correspondingVisualizationObject.operatingLayers]
            });
            observer.complete();
          } else {
            observer.next({
              ...correspondingVisualizationObject,
              details: {
                ...correspondingVisualizationObject.details,
                currentVisualization: action.payload.type
              },
              layers: [...correspondingVisualizationObject.operatingLayers]
            });
            observer.complete();
          }
        } else {
          observer.next(null);
          observer.complete();
        }
      });
    })
    .map((visualizationObject: Visualization) => new visualization.UpdateAction(visualizationObject));

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private router: Router,
              private httpClient: HttpClientService) {
  }

  private _updateVisualizationWithMapSettings(visualizationObject: Visualization) {
    const newVisualizationObject: Visualization = visualizationObject.details.type !== 'MAP' ?
      visualizationHelpers.getSplitedVisualization(visualizationObject) : {...visualizationObject};

    const newVisualizationObjectDetails: any = {...newVisualizationObject.details};

    const dimensionArea = this._findOrgUnitDimension(newVisualizationObject.details.layouts[0].layout);
    return new Observable(observer => {
      newVisualizationObjectDetails.mapConfiguration = visualizationHelpers.getMapConfiguration(visualizationObject);
      const geoFeaturePromises = _.map(newVisualizationObject.layers, (layer: any) => {
        const visualizationFilters = visualizationHelpers.getDimensionValues(layer.settings[dimensionArea], []);
        const orgUnitFilterObject = _.find(visualizationFilters ? visualizationFilters : [], ['name', 'ou']);
        const orgUnitFilterValue = orgUnitFilterObject ? orgUnitFilterObject.value : '';
        /**
         * Get geo feature
         * @type {string}
         */
          // TODO find best way to reduce number of geoFeature calls
        const geoFeatureUrl = visualizationHelpers.getGeoFeatureUrl(orgUnitFilterValue);
        return geoFeatureUrl !== '' ? this.httpClient.get(geoFeatureUrl) : Observable.of(null);
      });

      Observable.forkJoin(geoFeaturePromises)
        .subscribe((geoFeatureResponse: any[]) => {
          newVisualizationObject.layers = newVisualizationObject.layers.map((layer: any, layerIndex: number) => {
            const newSettings: any = {...layer.settings};
            if (geoFeatureResponse[layerIndex] !== null) {
              newSettings.geoFeature = [...geoFeatureResponse[layerIndex]];
            }
            return {...layer, settings: newSettings};
          });
          newVisualizationObjectDetails.loaded = true;
          observer.next({...newVisualizationObject, details: newVisualizationObjectDetails});
          observer.complete();
        }, (error) => {
          newVisualizationObjectDetails.hasError = true;
          newVisualizationObjectDetails.errorMessage = error;
          newVisualizationObjectDetails.loaded = true;
          observer.next({...newVisualizationObject, details: newVisualizationObjectDetails});
          observer.complete();
        });
    });
  }

  private _findOrgUnitDimension(visualizationLayout: any) {
    let dimensionArea = '';

    if (_.find(visualizationLayout.columns, ['value', 'ou'])) {
      dimensionArea = 'columns';
    } else if (_.find(visualizationLayout.rows, ['value', 'ou'])) {
      dimensionArea = 'rows';
    } else {
      dimensionArea = 'filters';
    }

    return dimensionArea;
  }
}
