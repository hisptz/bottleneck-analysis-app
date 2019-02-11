import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';

import { State } from '../../../store/reducers';
import { DashboardService } from '../../services/dashboard.service';

// actions
import * as fromVisualizationActions from '../../modules/ngx-dhis2-visualization/store/actions';
import * as fromDashboardActions from '../actions';

// models
import * as fromDashboardModels from '../../models';
import * as fromVisualizationModels from '../../modules/ngx-dhis2-visualization/models';

// selectors
import * as fromDashboardSelectors from '../selectors';

// helpers
import * as fromDashboardHelpers from '../../helpers';
import * as fromVisualizationHelpers from '../../modules/ngx-dhis2-visualization/helpers';
import { getDashboardVisualizationsFromDashboardItems } from '../../helpers';

@Injectable()
export class DashboardVisualizationEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dashboardService: DashboardService
  ) {}

  @Effect()
  loadDashboardVisualizations$: Observable<any> = this.actions$.pipe(
    ofType(
      fromDashboardActions.DashboardVisualizationActionTypes
        .LoadDashboardVisualizations
    ),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getDashboardSettings)
    ),
    mergeMap(
      ([action, dashboardSettings]: [
        fromDashboardActions.LoadDashboardVisualizationsAction,
        fromDashboardModels.DashboardSettings
      ]) => {
        this.store.dispatch(
          new fromDashboardActions.AddDashboardVisualizationAction(
            fromDashboardHelpers.getStandardizedDashboardVisualization(
              action.dashboardId,
              [],
              true
            )
          )
        );

        /** TODO: dashboard is loaded againg from server as at first few items were loaded,
         *   this may not be the case when using datastore, consider refactoring
         **/
        return this.dashboardService
          .load(action.dashboardId, dashboardSettings)
          .pipe(
            map((dashboard: any) => {
              const dashboardVisualizations: any[] = getDashboardVisualizationsFromDashboardItems(
                dashboard ? dashboard.dashboardItems || [] : [],
                action.dashboardId
              );
              return new fromDashboardActions.LoadDashboardVisualizationsSuccessAction(
                action.dashboardId,
                dashboardVisualizations,
                action.currentVisualizationId,
                action.dataSelections
              );
            }),
            catchError((error: any) =>
              of(
                new fromDashboardActions.LoadDashboardSettingsFailAction(
                  action.dashboardId,
                  error
                )
              )
            )
          );
      }
    )
  );

  @Effect({ dispatch: false })
  loadDashboardVisualizationsSuccess$: Observable<any> = this.actions$.pipe(
    ofType(
      fromDashboardActions.DashboardVisualizationActionTypes
        .LoadDashboardVisualizationsSuccess
    ),
    withLatestFrom(
      this.store.select(
        fromDashboardSelectors.getCurrentDashboardGlobalSelections
      )
    ),
    tap(
      ([action, globalSelections]: [
        fromDashboardActions.LoadDashboardVisualizationsSuccessAction,
        any[]
      ]) => {
        // Deduce visualization objects from dashboard items and add them to visualization store
        const visualizationObjects: fromVisualizationModels.Visualization[] = _.map(
          action.dashboardItems || [],
          dashboardItem =>
            fromVisualizationHelpers.getStandardizedVisualizationObject(
              dashboardItem,
              action.dataSelections || globalSelections
            )
        );

        this.store.dispatch(
          new fromVisualizationActions.AddVisualizationObjectsAction(
            visualizationObjects
          )
        );

        // Deduce visualization Ui configuration from dashboard items and addd them to visualization ui store
        const visualizationUiConfigs: any[] = _.map(
          action.dashboardItems || [],
          dashboardItem =>
            fromVisualizationHelpers.getStandardizedVisualizationUiConfig(
              dashboardItem,
              action.currentVisualizationId
            )
        );

        this.store.dispatch(
          new fromVisualizationActions.AddVisualizationUiConfigurationsAction(
            visualizationUiConfigs
          )
        );

        // Deduce visualizations references to be tied to dashboard

        this.store.dispatch(
          new fromDashboardActions.AddDashboardVisualizationAction(
            fromDashboardHelpers.getStandardizedDashboardVisualization(
              action.dashboardId,
              action.dashboardItems
            )
          )
        );
      }
    )
  );
}
