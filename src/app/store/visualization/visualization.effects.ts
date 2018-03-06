import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { HttpClientService } from '../../services/http-client.service';
import * as _ from 'lodash';
import * as visualization from './visualization.actions';
import * as dashboard from '../dashboard/dashboard.actions';
import { AppState } from '../app.reducers';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Visualization } from './visualization.state';
import { Dashboard } from '../dashboard/dashboard.state';
import * as visualizationHelpers from './helpers/index';
import 'rxjs/add/operator/mergeMap';
import { map, tap, switchMap, flatMap, catchError, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class VisualizationEffects {
  @Effect({ dispatch: false })
  setInitialVisualizations$ = this.actions$
    .ofType<dashboard.SetCurrentAction>(dashboard.DashboardActions.SET_CURRENT)
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, AppState]) => {
      const visualizationObjects: Visualization[] = state.visualization.visualizationObjects;
      const currentDashboard: Dashboard = _.find(state.dashboard.dashboards, ['id', action.payload]);
      if (currentDashboard) {
        const initialVisualizations: Visualization[] = currentDashboard.dashboardItems
          .map(
            (dashboardItem: any) =>
              !_.find(visualizationObjects, ['id', dashboardItem.id])
                ? visualizationHelpers.mapDashboardItemToVisualization(
                    dashboardItem,
                    currentDashboard.id,
                    state.currentUser
                  )
                : null
          )
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

  @Effect()
  laodFavorite$ = this.actions$
    .ofType<visualization.LoadFavoriteAction>(visualization.VisualizationActions.LOAD_FAVORITE)
    .flatMap((action: any) => {
      const favoriteUrl = visualizationHelpers.getVisualizationFavoriteUrl(action.payload.details.favorite);

      const favoritePromise = favoriteUrl !== '' ? this.httpClient.get(favoriteUrl) : Observable.of({});

      return favoritePromise.map((favorite: any) =>
        visualizationHelpers.updateVisualizationWithSettings(action.payload, favorite)
      );
    })
    .map((visualizationObject: any) => new visualization.LoadAnalyticsAction(visualizationObject));

  @Effect()
  loadAnalytics$ = this.actions$
    .ofType<visualization.LoadAnalyticsAction>(visualization.VisualizationActions.LOAD_ANALYTICS)
    .pipe(
      flatMap((action: any) => {
        const visualizationObject: Visualization = { ...action.payload };
        const visualizationDetails: any = { ...visualizationObject.details };
        const visualizationLayers: any[] = [...visualizationObject.layers];
        const analyticsPromises = _.map(visualizationLayers, (visualizationLayer: any) => {
          const visualizationFilter = _.find(visualizationDetails.filters, ['id', visualizationLayer.settings.id]);

          const dxFilterObject = _.find(visualizationFilter ? visualizationFilter.filters : [], ['name', 'dx']);

          /**
           * Get dx items for non function items
           */
          const normalDxItems = _.filter(
            dxFilterObject ? dxFilterObject.items : [],
            normalDx => normalDx.dimensionItemType !== 'FUNCTION_RULE'
          );

          const newFiltersWithNormalDx = _.map(visualizationFilter ? visualizationFilter.filters : [], filter => {
            return filter.name === 'dx'
              ? {
                  ...filter,
                  items: normalDxItems,
                  value: _.map(normalDxItems, item => item.dimensionItem).join(';')
                }
              : filter;
          });

          /**
           * Get dx items for function items
           */
          const functionItems = _.filter(
            dxFilterObject ? dxFilterObject.items : [],
            normalDx => normalDx.dimensionItemType === 'FUNCTION_RULE'
          );

          const newFiltersWithFunction =
            functionItems.length > 0
              ? _.map(visualizationFilter ? visualizationFilter.filters : [], filter => {
                  return filter.name === 'dx'
                    ? {
                        ...filter,
                        items: functionItems,
                        value: _.map(functionItems, item => item.id).join(';')
                      }
                    : filter;
                })
              : [];

          /**
           * Construct analytics promise
           */
          return forkJoin(
            this.getNormalAnalyticsPromise(
              visualizationObject.type,
              visualizationLayer.settings,
              newFiltersWithNormalDx
            ),
            this.getFunctionAnalyticsPromise(newFiltersWithFunction)
          ).pipe(
            map((analyticsResponse: any[]) => {
              const sanitizedAnalyticsArray: any[] = _.filter(analyticsResponse, analyticsObject => analyticsObject);
              return sanitizedAnalyticsArray.length > 1
                ? visualizationHelpers.getMergedAnalytics(sanitizedAnalyticsArray)
                : sanitizedAnalyticsArray[0];
            })
          );
        });

        return forkJoin(analyticsPromises).pipe(
          map((analyticsResponse: any[]) => {
            const layers = _.map(action.payload.layers, (visualizationLayer: any, layerIndex: number) => {
              const visualizationFilter = _.find(visualizationDetails.filters, ['id', visualizationLayer.settings.id]);
              const analytics = visualizationHelpers.getSanitizedAnalytics(
                { ...analyticsResponse[layerIndex] },
                visualizationFilter ? visualizationFilter.filters : []
              );

              return {
                ...visualizationLayer,
                analytics:
                  analytics.headers || analytics.count
                    ? visualizationHelpers.standardizeIncomingAnalytics(analytics, true)
                    : null
              };
            });
            return {
              ...action.payload,
              details: {
                ...action.payload.details,
                loaded: true
              },
              layers: layers,
              operatingLayers: layers
            };
          }),
          map(
            (visualizationObjectResult: Visualization) =>
              new visualization.AddOrUpdateAction({
                visualizationObject: visualizationObjectResult,
                placementPreference: 'normal'
              })
          ),
          catchError(error =>
            of(
              new visualization.AddOrUpdateAction({
                visualizationObject: {
                  ...action.payload,
                  details: {
                    ...action.payload.details,
                    loaded: true,
                    hasError: true,
                    errorMessage: error
                  }
                },
                placementPreference: 'normal'
              })
            )
          )
        );
      })
    );

  @Effect()
  visualizationWithMapSettings$ = this.actions$
    .ofType<visualization.UpdateVisualizationWithMapSettingsAction>(
      visualization.VisualizationActions.UPDATE_VISUALIZATION_WITH_MAP_SETTINGS
    )
    .flatMap(action => this._updateVisualizationWithMapSettings(action.payload))
    .map(
      (visualizationObject: Visualization) =>
        new visualization.AddOrUpdateAction({
          visualizationObject: visualizationObject,
          placementPreference: 'normal'
        })
    );

  @Effect()
  localFilterChange$ = this.actions$
    .ofType<visualization.LocalFilterChangeAction>(visualization.VisualizationActions.LOCAL_FILTER_CHANGE)
    .pipe(
      map((action: any) =>
        visualizationHelpers.updateVisualizationWithCustomFilters(
          action.payload.visualizationObject,
          visualizationHelpers.getSanitizedCustomFilterObject(action.payload.filterValue)
        )
      ),
      map((visualizationObject: Visualization) => new visualization.LoadAnalyticsAction(visualizationObject))
    );

  @Effect({ dispatch: false })
  globalFilterChanges$ = this.actions$
    .ofType<visualization.GlobalFilterChangeAction>(visualization.VisualizationActions.GLOBAL_FILTER_CHANGE)
    .withLatestFrom(this.store)
    .pipe(
      tap(([action, state]: [any, AppState]) => {
        const visualizationToUpdate: Visualization[] = _.filter(
          state.visualization.visualizationObjects,
          visualizationObject =>
            visualizationObject.dashboardId === action.payload.currentDashboardId &&
            !visualizationObject.details.nonVisualizable
        );

        _.each(visualizationToUpdate, (visualizationObject: Visualization) => {
          this.store.dispatch(
            new visualization.LocalFilterChangeAction({
              visualizationObject: visualizationObject,
              filterValue: action.payload.filterValue
            })
          );
        });
      })
    );

  @Effect({ dispatch: false })
  resizeAction$ = this.actions$
    .ofType<visualization.ResizeAction>(visualization.VisualizationActions.RESIZE)
    .switchMap((action: any) => this._resize(action.payload.visualizationId, action.payload.shape))
    .map(() => new visualization.ResizeSuccessAction());

  @Effect()
  deleteActions$ = this.actions$.ofType<visualization.DeleteAction>(visualization.VisualizationActions.DELETE).pipe(
    map((action: visualization.DeleteAction) => action.payload),
    switchMap(({ dashboardId, visualizationId }) =>
      this._delete(dashboardId, visualizationId).pipe(
        map(
          () =>
            new visualization.DeleteSuccessAction({
              dashboardId,
              visualizationId
            })
        ),
        catchError(() => of(new visualization.DeleteFailAction(visualizationId)))
      )
    )
  );

  @Effect()
  deleteSuccess$ = this.actions$
    .ofType<visualization.DeleteSuccessAction>(visualization.VisualizationActions.DELETE_SUCCESS)
    .pipe(
      map((action: visualization.DeleteSuccessAction) => action.payload),
      map(
        ({ dashboardId, visualizationId }) =>
          new dashboard.DeleteItemSuccessAction({
            dashboardId,
            visualizationId
          })
      )
    );

  constructor(private actions$: Actions, private store: Store<AppState>, private httpClient: HttpClientService) {}

  private getNormalAnalyticsPromise(
    visualizationType: string,
    visualizationSettings: any,
    visualizationFilters: any[]
  ): Observable<any> {
    const analyticsUrl = visualizationHelpers.constructAnalyticsUrl(
      visualizationType,
      visualizationSettings,
      visualizationFilters
    );

    return analyticsUrl !== ''
      ? this.httpClient.get(analyticsUrl).pipe(
          mergeMap((analyticsResult: any) => {
            return analyticsResult.count && analyticsResult.count < 2000
              ? this.httpClient.get(
                  visualizationHelpers.constructAnalyticsUrl(
                    visualizationType,
                    {
                      ...visualizationSettings,
                      eventClustering: false
                    },
                    visualizationFilters
                  )
                )
              : of(analyticsResult);
          })
        )
      : of(null);
  }

  private getFunctionAnalyticsPromise(visualizationFilters: any[]): Observable<any> {
    return new Observable(observer => {
      if (visualizationFilters.length === 0 || _.some(visualizationFilters, filter => filter.items.length === 0)) {
        observer.next(null);
        observer.complete();
      } else {
        const ouObject = _.find(visualizationFilters, ['name', 'ou']);
        const ouValue = ouObject ? ouObject.value : '';

        const peObject = _.find(visualizationFilters, ['name', 'pe']);
        const peValue = peObject ? peObject.value : '';

        const dxObject = _.find(visualizationFilters, ['name', 'dx']);

        const functionAnalyticsPromises = _.map(dxObject ? dxObject.items : [], dxItem => {
          return this._runFunction(
            {
              pe: peValue,
              ou: ouValue,
              rule: dxItem.config ? dxItem.config.ruleDefinition : null,
              success: result => {},
              error: error => {}
            },
            dxItem.config ? dxItem.config.functionString : ''
          );
        });

        forkJoin(functionAnalyticsPromises).subscribe((analyticsResponse: any[]) => {
          observer.next(
            analyticsResponse.length > 1
              ? visualizationHelpers.getMergedAnalytics(analyticsResponse)
              : analyticsResponse[0]
          );
          observer.complete();
        });
      }
    });
  }

  private _runFunction(functionParameters: any, functionString: string): Observable<any> {
    return new Observable(observ => {
      if (!this._isError(functionString)) {
        try {
          functionParameters.error = error => {
            observ.error(error);
            observ.complete();
          };
          functionParameters.success = results => {
            observ.next(results);
            observ.complete();
          };
          functionParameters.progress = results => {};
          const execute = Function('parameters', functionString);

          execute(functionParameters);
        } catch (e) {
          observ.error(e.stack);
          observ.complete();
        }
      } else {
        observ.error({ message: 'Errors in the code.' });
        observ.complete();
      }
    });
  }

  private _isError(code) {
    let successError = false;
    let errorError = false;
    let progressError = false;
    const value = code
      .split(' ')
      .join('')
      .split('\n')
      .join('')
      .split('\t')
      .join('');
    if (value.indexOf('parameters.success(') === -1) {
      successError = true;
    }
    if (value.indexOf('parameters.error(') === -1) {
      errorError = true;
    }
    if (value.indexOf('parameters.progress(') === -1) {
      progressError = true;
    }
    return successError || errorError;
  }

  private _delete(dashboardId: string, visualizationId: string) {
    return this.httpClient.delete('dashboards/' + dashboardId + '/items/' + visualizationId);
  }

  private _updateVisualizationWithMapSettings(visualizationObject: Visualization) {
    const newVisualizationObject: Visualization =
      visualizationObject.details.type !== 'MAP'
        ? visualizationHelpers.getSplitedVisualization(visualizationObject)
        : { ...visualizationObject };

    const newVisualizationObjectDetails: any = {
      ...newVisualizationObject.details
    };

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

      forkJoin(geoFeaturePromises).subscribe(
        (geoFeatureResponse: any[]) => {
          newVisualizationObject.layers = newVisualizationObject.layers.map((layer: any, layerIndex: number) => {
            const newSettings: any = { ...layer.settings };
            if (geoFeatureResponse[layerIndex] !== null) {
              newSettings.geoFeature = [...geoFeatureResponse[layerIndex]];
            }
            return { ...layer, settings: newSettings };
          });
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        },
        error => {
          newVisualizationObjectDetails.hasError = true;
          newVisualizationObjectDetails.errorMessage = error;
          newVisualizationObjectDetails.loaded = true;
          observer.next({
            ...newVisualizationObject,
            details: newVisualizationObjectDetails
          });
          observer.complete();
        }
      );
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

  private _resize(visualizationId: string, shape: string) {
    return this.httpClient.put('dashboardItems/' + visualizationId + '/shape/' + shape, '');
  }
}
