import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { DashboardService } from '../../services';
import {
  DashboardVisualizationActionTypes,
  LoadDashboardVisualizationsAction,
  LoadDashboardVisualizationsSuccessAction,
  AddDashboardVisualizationAction
} from '../actions/dashboard-visualization.actions';

import { LoadDashboardSettingsFailAction } from '../actions/dashboard-settings.action';
import { Observable, of } from 'rxjs';
import { mergeMap, withLatestFrom, take, map, catchError, tap } from 'rxjs/operators';
import { getDashboardSettings } from '../selectors';
import { DashboardSettings } from '../../dashboard/models/dashboard-settings.model';
import { getStandardizedDashboardVisualization } from '../../helpers';
import { DashboardVisualization } from '../../dashboard/models';
import { Visualization } from '../../dashboard/modules/ngx-dhis2-visualization/models';
import {
  getStandardizedVisualizationObject,
  getStandardizedVisualizationUiConfig
} from '../../dashboard/modules/ngx-dhis2-visualization/helpers';
import {
  AddVisualizationObjectsAction,
  AddVisualizationUiConfigurationsAction
} from '../../dashboard/modules/ngx-dhis2-visualization/store/actions';

@Injectable()
export class DashboardVisualizationEffects {
  @Effect()
  loadDashboardVisualizations$: Observable<any> = this.actions$.pipe(
    ofType(DashboardVisualizationActionTypes.LoadDashboardVisualizations),
    withLatestFrom(this.store.select(getDashboardSettings)),
    mergeMap(([action, dashboardSettings]: [LoadDashboardVisualizationsAction, DashboardSettings]) => {
      const standardizedDashboardVisualization: DashboardVisualization = getStandardizedDashboardVisualization(
        action.dashboardId,
        [],
        true
      );
      this.store.dispatch(new AddDashboardVisualizationAction(standardizedDashboardVisualization));
      return this.dashboardService.load(action.dashboardId, dashboardSettings).pipe(
        map((dashboard: any) => {
          const dashboardVisualizations: any[] = _.map(
            dashboard && dashboard.dashboardItems ? dashboard.dashboardItems : [],
            (dashboardItem: any) => {
              return {
                ...dashboardItem,
                isOpen: true,
                dashboardId: action.dashboardId
              };
            }
          );
          return new LoadDashboardVisualizationsSuccessAction(
            action.dashboardId,
            dashboardVisualizations,
            action.currentVisualizationId
          );
        }),
        catchError((error: any) => of(new LoadDashboardSettingsFailAction(action.dashboardId, error)))
      );
    })
  );

  @Effect({ dispatch: false })
  loadDashboardVisualizationsSuccess$: Observable<any> = this.actions$.pipe(
    ofType(DashboardVisualizationActionTypes.LoadDashboardVisualizationsSuccess),
    tap((action: LoadDashboardVisualizationsSuccessAction) => {
      // Deduce visualization objects from dashboard items and add them to visualization store
      const visualizationObjects: Visualization[] = _.map(action.dashboardItems || [], dashboardItem =>
        getStandardizedVisualizationObject(dashboardItem)
      );

      this.store.dispatch(new AddVisualizationObjectsAction(visualizationObjects));

      // Deduce visualization Ui configuration from dashboard items and addd them to visualization ui store
      const visualizationUiConfigs: any[] = _.map(action.dashboardItems || [], dashboardItem =>
        getStandardizedVisualizationUiConfig(dashboardItem, action.currentVisualizationId)
      );

      this.store.dispatch(new AddVisualizationUiConfigurationsAction(visualizationUiConfigs));

      // Deduce visualizations references to be tied to dashboard
      const standardizedDashboardVisualization: DashboardVisualization = getStandardizedDashboardVisualization(
        action.dashboardId,
        action.dashboardItems
      );

      this.store.dispatch(new AddDashboardVisualizationAction(standardizedDashboardVisualization));
    })
  );
  constructor(private actions$: Actions, private store: Store<State>, private dashboardService: DashboardService) {}
}
