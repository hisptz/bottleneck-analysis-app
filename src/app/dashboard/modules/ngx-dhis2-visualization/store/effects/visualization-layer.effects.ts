import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { tap, withLatestFrom, take } from 'rxjs/operators';
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
  getSanitizedAnalytics
} from '../../helpers';
import { Visualization } from '../../models';
import { getVisualizationObjectById } from '../selectors';

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
        .select(getVisualizationObjectById(action.visualizationId))
        .pipe(take(1))
        .subscribe((visualizationObject: Visualization) => {
          if (!visualizationObject.isNonVisualizable) {
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

            forkJoin(
              _.map(action.visualizationLayers, visualizationLayer =>
                this.analyticsService.getAnalytics(
                  visualizationLayer.dataSelections,
                  visualizationLayer.layerType,
                  visualizationLayer.config
                )
              )
            ).subscribe(
              analyticsResponse => {
                // Save visualizations layers
                _.each(analyticsResponse, (analytics, analyticsIndex) => {
                  this.store.dispatch(
                    new LoadVisualizationAnalyticsSuccessAction(
                      action.visualizationLayers[analyticsIndex].id,
                      {
                        analytics: getSanitizedAnalytics(
                          getStandardizedAnalyticsObject(analytics, true),
                          action.visualizationLayers[analyticsIndex]
                            .dataSelections
                        ),
                        dataSelections:
                          action.visualizationLayers[analyticsIndex]
                            .dataSelections
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
                      message: error.error
                    }
                  })
                );
              }
            );
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
