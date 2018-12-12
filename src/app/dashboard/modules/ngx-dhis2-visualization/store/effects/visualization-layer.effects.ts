import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap, take } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

// reducers
import { VisualizationState } from '../reducers';

// actions
import {
  VisualizationLayerActionTypes,
  LoadVisualizationAnalyticsAction,
  LoadVisualizationAnalyticsSuccessAction,
  UpdateVisualizationLayerAction
} from '../actions/visualization-layer.actions';

import { UpdateVisualizationObjectAction } from '../actions/visualization-object.actions';

// services
import { AnalyticsService } from '../../services/analytics.service';

// helpers
import {
  getStandardizedAnalyticsObject,
  getSanitizedAnalytics,
  getMergedDataSelections
} from '../../helpers';
import { VisualizationLayer } from '../../models';
import { getCombinedVisualizationObjectById } from '../selectors';

@Injectable()
export class VisualizationLayerEffects {
  constructor(
    private actions$: Actions,
    private store: Store<VisualizationState>,
    private analyticsService: AnalyticsService
  ) {}

  @Effect({ dispatch: false })
  loadAnalytics$: Observable<any> = this.actions$.pipe(
    ofType(VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS),
    tap((action: LoadVisualizationAnalyticsAction) => {
      this.store
        .select(getCombinedVisualizationObjectById(action.visualizationId))
        .pipe(take(1))
        .subscribe((visualizationObject: any) => {
          if (visualizationObject) {
            this.store.dispatch(
              new UpdateVisualizationObjectAction(action.visualizationId, {
                progress: {
                  statusCode: 200,
                  statusText: 'OK',
                  percent: 50,
                  message: 'Favorite information has been loaded'
                }
              })
            );

            const visualizationLayers = action.globalSelections
              ? _.map(
                  visualizationObject.layers,
                  (visualizationLayer: VisualizationLayer) => {
                    return {
                      ...visualizationLayer,
                      dataSelections: getMergedDataSelections(
                        visualizationLayer.dataSelections,
                        action.globalSelections,
                        visualizationObject.type
                      )
                    };
                  }
                )
              : action.visualizationLayers;

            forkJoin(
              _.map(
                visualizationLayers,
                (visualizationLayer: VisualizationLayer) => {
                  return this.analyticsService.getAnalytics(
                    visualizationLayer.dataSelections,
                    visualizationLayer.layerType || 'thematic',
                    visualizationLayer.config,
                    {
                      returnDummyAnalyticsOnFail: true,
                      metadataOnly: visualizationObject.isNonVisualizable
                    }
                  );
                }
              )
            ).subscribe(
              analyticsResponse => {
                // Save visualizations layers
                _.each(analyticsResponse, (analytics, analyticsIndex) => {
                  this.store.dispatch(
                    new LoadVisualizationAnalyticsSuccessAction(
                      visualizationLayers[analyticsIndex].id,
                      {
                        analytics: getSanitizedAnalytics(
                          getStandardizedAnalyticsObject(analytics, true),
                          visualizationLayers[analyticsIndex].dataSelections
                        ),
                        dataSelections:
                          visualizationLayers[analyticsIndex].dataSelections
                      }
                    )
                  );
                });
                // Update visualization object
                this.store.dispatch(
                  new UpdateVisualizationObjectAction(action.visualizationId, {
                    progress: {
                      statusCode: 200,
                      statusText: 'OK',
                      percent: 100,
                      message: 'Analytics loaded'
                    }
                  })
                );
              },
              error => {
                this.store.dispatch(
                  new UpdateVisualizationObjectAction(action.visualizationId, {
                    progress: {
                      statusCode: error.status,
                      statusText: 'Error',
                      percent: 100,
                      message: error.message
                    }
                  })
                );
              }
            );
            // if (!visualizationObject.isNonVisualizable) {

            // } else {
            //   _.each(
            //     _.map(
            //       action.visualizationLayers,
            //       (visualizationLayer: VisualizationLayer) => {
            //         return {
            //           ...visualizationLayer,
            //           dataSelections: getMergedDataSelections(
            //             visualizationLayer.dataSelections,
            //             action.globalSelections,
            //             visualizationObject.type
            //           )
            //         };
            //       }
            //     ),
            //     visualizationLayer => {
            //       this.store.dispatch(
            //         new UpdateVisualizationLayerAction(
            //           visualizationLayer.id,
            //           visualizationLayer
            //         )
            //       );
            //     }
            //   );
            // }
          } else {
            _.each(action.visualizationLayers, visualizationLayer => {
              this.store.dispatch(
                new UpdateVisualizationLayerAction(
                  visualizationLayer.id,
                  visualizationLayer
                )
              );
            });
          }
        });
    })
  );
}
