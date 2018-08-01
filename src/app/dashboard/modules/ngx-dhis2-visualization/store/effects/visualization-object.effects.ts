import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as _ from 'lodash';
import { Observable, of, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  catchError,
  map,
  mergeMap,
  tap,
  withLatestFrom,
  take,
  switchMap
} from 'rxjs/operators';

// actions
import {
  AddVisualizationObjectAction,
  InitializeVisualizationObjectAction,
  LoadVisualizationFavoriteAction,
  LoadVisualizationFavoriteSuccessAction,
  UpdateVisualizationObjectAction,
  VisualizationObjectActionTypes,
  AddVisualizationLayerAction,
  LoadVisualizationAnalyticsAction,
  UpdateVisualizationLayerAction,
  AddVisualizationConfigurationAction,
  UpdateVisualizationConfigurationAction,
  AddVisualizationUiConfigurationAction,
  SaveVisualizationFavoriteAction,
  ReplaceVisualizationLayerIdAction
} from '../actions';

// reducers
import {
  VisualizationState,
  getVisualizationObjectEntities
} from '../reducers';

// models
import { Visualization, VisualizationLayer } from '../../models';

// services
import { FavoriteService } from '../../services/favorite.service';

// helpers
import {
  getSelectionDimensionsFromFavorite,
  getVisualizationLayerType,
  getStandardizedVisualizationType,
  getStandardizedVisualizationObject,
  getStandardizedVisualizationUiConfig,
  getStandardizedAnalyticsObject,
  getSelectionDimensionsFromAnalytics
} from '../../helpers';
import { SystemInfoService } from '@hisptz/ngx-dhis2-http-client';
import { getVisualizationObjectById } from '../selectors';
import {
  getCurrentVisualizationObjectLayers,
  getCurrentVisualizationConfig
} from '@hisptz/ngx-dhis2-visualization';
import { getFavoritePayload } from '../../helpers/get-favorite-payload.helpers';
import { UtilService } from '../../../../../services';
import { DashboardObjectState } from '../../../../../store/reducers/dashboard.reducer';
import { AddDashboardItemAction } from '../../../../../store';

@Injectable()
export class VisualizationObjectEffects {
  @Effect({ dispatch: false })
  initializeVisualizationObject$: Observable<any> = this.actions$.pipe(
    ofType(VisualizationObjectActionTypes.INITIALIZE_VISUALIZATION_OBJECT),
    withLatestFrom(this.store.select(getVisualizationObjectEntities)),
    tap(
      ([action, visualizationObjectEntities]: [
        InitializeVisualizationObjectAction,
        any
      ]) => {
        const visualizationObject: Visualization =
          visualizationObjectEntities[action.id];
        if (visualizationObject) {
          if (
            visualizationObject.progress &&
            visualizationObject.progress.percent === 0
          ) {
            // set initial visualization configurations
            this.store.dispatch(
              new AddVisualizationConfigurationAction({
                id: visualizationObject.visualizationConfigId,
                type: visualizationObject.type,
                currentType: getStandardizedVisualizationType(
                  visualizationObject.type
                ),
                name: visualizationObject.favorite
                  ? visualizationObject.favorite.name
                  : ''
              })
            );

            // Load favorite information
            if (visualizationObject.favorite) {
              this.store.dispatch(
                new LoadVisualizationFavoriteAction(visualizationObject)
              );
            }
          }
        } else {
          const initialVisualizationObject: Visualization = getStandardizedVisualizationObject(
            {
              id: action.id,
              name: action.name,
              type: action.visualizationType,
              isNew: true
            }
          );

          // set initial visualization object
          this.store.dispatch(
            new AddVisualizationObjectAction(initialVisualizationObject)
          );

          // set initial visualization ui configuration
          this.store.dispatch(
            new AddVisualizationUiConfigurationAction(
              getStandardizedVisualizationUiConfig({
                id: action.id,
                type: action.visualizationType
              })
            )
          );

          // set initial global visualization configurations
          this.store.dispatch(
            new AddVisualizationConfigurationAction({
              id: initialVisualizationObject.visualizationConfigId,
              type: initialVisualizationObject.type,
              currentType: getStandardizedVisualizationType(
                initialVisualizationObject.type
              ),
              name: initialVisualizationObject.favorite
                ? initialVisualizationObject.favorite.name
                : ''
            })
          );

          // set visualization layers
          const visualizationLayers: any[] = _.filter(
            _.map(
              action.visualizationLayers || [],
              (visualizationLayer: VisualizationLayer) => {
                return visualizationLayer.analytics ||
                  visualizationLayer.dataSelections
                  ? {
                      ...visualizationLayer,
                      analytics: visualizationLayer.analytics
                        ? getStandardizedAnalyticsObject(
                            visualizationLayer.analytics,
                            true
                          )
                        : null,
                      dataSelections: visualizationLayer.dataSelections || []
                    }
                  : null;
              }
            ),
            visualizationLayer => visualizationLayer
          );

          // update visualization object with layers
          if (visualizationLayers.length > 0) {
            // Update visualization object
            if (
              _.some(
                visualizationLayers,
                visualizationLayer => visualizationLayer.analytics
              )
            ) {
              this.store.dispatch(
                new UpdateVisualizationObjectAction(action.id, {
                  layers: _.map(
                    visualizationLayers,
                    visualizationLayer => visualizationLayer.id
                  ),
                  progress: {
                    statusCode: 200,
                    statusText: 'OK',
                    percent: 100,
                    message: 'Analytics has been loaded'
                  }
                })
              );

              // Add visualization Layers
              _.each(visualizationLayers, visualizationLayer => {
                this.store.dispatch(
                  new AddVisualizationLayerAction({
                    ...visualizationLayer,
                    id:
                      visualizationLayer.id === ''
                        ? `${action.id}_${action.index}`
                        : visualizationLayer.id,
                    dataSelections: getSelectionDimensionsFromAnalytics(
                      visualizationLayer.analytics
                    )
                  })
                );
              });
            } else if (
              !_.some(
                visualizationLayers,
                visualizationLayer => visualizationLayer.analytics
              ) &&
              _.some(
                visualizationLayers,
                visualizationLayer => visualizationLayer.dataSelections
              )
            ) {
              const newVisualizationLayers: Visualization[] = _.map(
                visualizationLayers,
                (visualizationLayer: Visualization) => {
                  return {
                    ...visualizationLayer,
                    id:
                      visualizationLayer.id === ''
                        ? `${action.id}_${action.index}`
                        : visualizationLayer.id
                  };
                }
              );
              this.store.dispatch(
                new UpdateVisualizationObjectAction(action.id, {
                  layers: _.map(
                    newVisualizationLayers,
                    visualizationLayer => visualizationLayer.id
                  ),
                  progress: {
                    statusCode: 200,
                    statusText: 'OK',
                    percent: 50,
                    message: 'Favorite has been loaded'
                  }
                })
              );

              // Add visualization Layers
              _.each(newVisualizationLayers, visualizationLayer => {
                this.store.dispatch(
                  new AddVisualizationLayerAction(visualizationLayer)
                );
              });

              // Load analytics for visualization layers
              this.store.dispatch(
                new LoadVisualizationAnalyticsAction(
                  action.id,
                  newVisualizationLayers
                )
              );
            } else {
              console.warn(
                `Visualization with id ${
                  action.id
                } has no any visualizable layer or data selections`
              );
            }
          }
        }
      }
    )
  );

  @Effect()
  loadFavorite$: Observable<any> = this.actions$
    .ofType(VisualizationObjectActionTypes.LOAD_VISUALIZATION_FAVORITE)
    .pipe(
      mergeMap((action: LoadVisualizationFavoriteAction) =>
        this.favoriteService.getFavorite(action.visualization.favorite).pipe(
          map(
            (favorite: any) =>
              new LoadVisualizationFavoriteSuccessAction(
                action.visualization,
                favorite
              )
          ),
          catchError(error =>
            of(
              new UpdateVisualizationObjectAction(action.visualization.id, {
                progress: {
                  statusCode: error.status,
                  statusText: 'Error',
                  percent: 100,
                  message: error.error
                }
              })
            )
          )
        )
      )
    );

  @Effect({ dispatch: false })
  loadFavoriteSuccess$: Observable<any> = this.actions$.pipe(
    ofType(VisualizationObjectActionTypes.LOAD_VISUALIZATION_FAVORITE_SUCCESS),
    withLatestFrom(this.systemInfoService.getSystemInfo()),
    tap(
      ([action, systemInfo]: [LoadVisualizationFavoriteSuccessAction, any]) => {
        const spatialSupport =
          systemInfo && systemInfo.databaseInfo
            ? systemInfo.databaseInfo.spatialSupport
            : false;
        const visualizationFavoriteOptions =
          action.visualization && action.visualization.favorite
            ? action.visualization.favorite
            : null;

        if (visualizationFavoriteOptions && action.favorite) {
          if (visualizationFavoriteOptions.requireAnalytics) {
            // update global visualization configurations
            this.store.dispatch(
              new UpdateVisualizationConfigurationAction(
                action.visualization.visualizationConfigId,
                {
                  basemap: action.favorite.basemap,
                  zoom: action.favorite.zoom,
                  latitude: action.favorite.latitude,
                  longitude: action.favorite.longitude
                }
              )
            );

            // generate visualization layers
            const visualizationLayers: VisualizationLayer[] = _.map(
              action.favorite.mapViews || [action.favorite],
              (favoriteLayer: any) => {
                const dataSelections = getSelectionDimensionsFromFavorite(
                  favoriteLayer
                );
                return {
                  id: favoriteLayer.id,
                  dataSelections,
                  layerType: getVisualizationLayerType(
                    action.visualization.favorite.type,
                    favoriteLayer
                  ),
                  analytics: null,
                  config: {
                    ...favoriteLayer,
                    spatialSupport,
                    visualizationType: action.visualization.type
                  }
                };
              }
            );

            // Add visualization Layers
            _.each(visualizationLayers, visualizationLayer => {
              this.store.dispatch(
                new AddVisualizationLayerAction(visualizationLayer)
              );
            });

            // Update visualization object
            this.store.dispatch(
              new UpdateVisualizationObjectAction(action.visualization.id, {
                layers: _.map(
                  visualizationLayers,
                  visualizationLayer => visualizationLayer.id
                ),
                progress: {
                  statusCode: 200,
                  statusText: 'OK',
                  percent: 50,
                  message: 'Favorite information has been loaded'
                }
              })
            );

            // Load analytics for visualization layers
            this.store.dispatch(
              new LoadVisualizationAnalyticsAction(
                action.visualization.id,
                visualizationLayers
              )
            );
          } else {
            const visualizationLayers: VisualizationLayer[] = _.map(
              [action.favorite],
              favoriteLayer => {
                return {
                  id: favoriteLayer.id,
                  analytics: {
                    rows: favoriteLayer[visualizationFavoriteOptions.type]
                  }
                };
              }
            );

            // Update visualization object
            this.store.dispatch(
              new UpdateVisualizationObjectAction(action.visualization.id, {
                layers: _.map(
                  visualizationLayers,
                  visualizationLayer => visualizationLayer.id
                ),
                progress: {
                  statusCode: 200,
                  statusText: 'OK',
                  percent: 100,
                  message: 'Information has been loaded'
                }
              })
            );

            // Add visualization Layers
            _.each(visualizationLayers, visualizationLayer => {
              this.store.dispatch(
                new AddVisualizationLayerAction(visualizationLayer)
              );
            });
          }
        } else {
          // Update visualization object
          this.store.dispatch(
            new UpdateVisualizationObjectAction(action.visualization.id, {
              layers: [visualizationFavoriteOptions.id],
              progress: {
                statusCode: 200,
                statusText: 'OK',
                percent: 100,
                message: 'Information has been loaded'
              }
            })
          );
        }
      }
    )
  );

  @Effect({ dispatch: false })
  saveVisualizationFavorite$: Observable<any> = this.actions$.pipe(
    ofType(VisualizationObjectActionTypes.SaveVisualizationFavorite),
    tap((action: SaveVisualizationFavoriteAction) => {
      const dataSelections: any[] =
        action.layers && action.layers.length > 0
          ? action.layers[0].dataSelections
          : [];
      const favoriteDetails = getFavoritePayload(
        action.name,
        dataSelections,
        action.config.currentType
      );

      if (favoriteDetails) {
        const favoritePromise = action.isNew
          ? this.utilService.getUniqueId().pipe(
              switchMap(favoriteId =>
                this.favoriteService.create(favoriteDetails.url, {
                  ...favoriteDetails.favorite,
                  id: favoriteId
                })
              )
            )
          : this.favoriteService.update(favoriteDetails.url, {
              ...favoriteDetails.favorite,
              id: action.layers[0].id
            });

        favoritePromise.subscribe(favoriteResult => {
          this.store
            .select(getVisualizationObjectById(action.id))
            .pipe(take(1))
            .subscribe((visualization: Visualization) => {
              const newVisualization = {
                ...visualization,
                favorite: {
                  id: favoriteResult.id,
                  name: favoriteResult.name,
                  type: action.config.currentType.toLowerCase(),
                  requireAnalytics: true
                },
                layers: [favoriteResult.id]
              };

              // Update visualization object with new favorite
              this.store.dispatch(
                new UpdateVisualizationObjectAction(action.id, {
                  ...newVisualization
                })
              );

              // Update visualization layer
              this.store.dispatch(
                new UpdateVisualizationLayerAction(action.layers[0].id, {
                  id: favoriteResult.id
                })
              );

              // Save favorite as dashboard item
              this.dashboardStore.dispatch(
                new AddDashboardItemAction(
                  action.dashboardId,
                  {
                    id: visualization.id,
                    type: favoriteDetails.favoriteType,
                    [_.camelCase(favoriteDetails.favoriteType)]: {
                      id: favoriteResult.id,
                      displayName: favoriteResult.name
                    }
                  },
                  true
                )
              );
            });
        });
      }
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<VisualizationState>,
    private dashboardStore: Store<DashboardObjectState>,
    private favoriteService: FavoriteService,
    private systemInfoService: SystemInfoService,
    private utilService: UtilService
  ) {}
}
