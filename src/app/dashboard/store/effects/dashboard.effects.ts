import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import * as _ from 'lodash';

// ngrx store
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

// Services import
import { DashboardService } from '../../services';

// store actions import
import {
  DashboardActionTypes,
  LoadDashboardsAction,
  LoadDashboardsSuccessAction,
  LoadDashboardsFailAction,
  AddDashboardsAction,
  SetCurrentDashboardAction,
  ToggleDashboardBookmarkAction,
  ToggleDashboardBookmarkSuccessAction,
  ToggleDashboardBookmarkFailAction
} from '../actions/dashboard.actions';

import {
  UserActionTypes,
  AddCurrentUser,
  Go,
  State,
  getRouteUrl,
  getCurrentUser
} from '../../../store';

import {
  AddAllVisualizationObjectsAction,
  getStandardizedVisualizationObject,
  AddAllVisualizationUiConfigurationsAction,
  getStandardizedVisualizationUiConfig
} from '@hisptz/ngx-dhis2-visualization';

// helpers import
import {
  getStandardizedDashboards,
  getCurrentDashboardId,
  getStandardizedDashboardVisualizations,
  getDashboardItemsFromDashboards
} from '../../helpers';
import { AddDashboardVisualizationsAction } from '../actions';
import { User } from '../../../models';

@Injectable()
export class DashboardEffects {
  @Effect()
  currentUserLoaded$: Observable<any> = this.actions$.pipe(
    ofType(UserActionTypes.AddCurrentUser),
    map(
      (action: AddCurrentUser) => new LoadDashboardsAction(action.currentUser)
    )
  );

  @Effect()
  loadAllDashboards$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.LoadDashboards),
    withLatestFrom(this.store.select(getRouteUrl)),
    switchMap(([action, routeUrl]: [LoadDashboardsAction, string]) =>
      this.dashboardService.loadAll().pipe(
        map(
          (dashboards: any[]) =>
            new LoadDashboardsSuccessAction(
              dashboards,
              action.currentUser,
              routeUrl
            )
        ),
        catchError((error: any) => of(new LoadDashboardsFailAction(error)))
      )
    )
  );

  @Effect()
  loadAllDashboardSuccess$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.LoadDashboardsSuccess),
    switchMap((action: LoadDashboardsSuccessAction) => [
      new AddDashboardsAction(
        getStandardizedDashboards(action.dashboards, action.currentUser)
      ),
      new SetCurrentDashboardAction(
        getCurrentDashboardId(
          action.routeUrl,
          action.dashboards,
          action.currentUser
        )
      ),
      new AddDashboardVisualizationsAction(
        getStandardizedDashboardVisualizations(action.dashboards)
      ),
      new AddAllVisualizationObjectsAction(
        _.map(
          getDashboardItemsFromDashboards(action.dashboards),
          dashboardItem => getStandardizedVisualizationObject(dashboardItem)
        )
      ),
      new AddAllVisualizationUiConfigurationsAction(
        _.map(
          getDashboardItemsFromDashboards(action.dashboards),
          dashboardItem => getStandardizedVisualizationUiConfig(dashboardItem)
        )
      )
    ])
  );

  @Effect()
  setCurrentDashboard$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.SetCurrentDashboard),
    withLatestFrom(this.store.select(getCurrentUser)),
    tap(([action, currentUser]: [SetCurrentDashboardAction, User]) => {
      // Set selected dashboard id into local storage
      localStorage.setItem(
        'dhis2.dashboard.current.' + currentUser.userCredentials.username,
        action.id
      );
    }),
    map(
      ([action, currentUser]: [SetCurrentDashboardAction, User]) =>
        new Go({ path: [`/dashboards/${action.id}`] })
    )
  );

  @Effect()
  toggleDashboardBookmark$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.ToggleDashboardBookmark),
    withLatestFrom(this.store.select(getCurrentUser)),
    switchMap(([action, currentUser]: [ToggleDashboardBookmarkAction, User]) =>
      this.dashboardService
        .bookmarkDashboard(
          action.id,
          action.changes.bookmarked,
          action.supportBookmark,
          currentUser.id
        )
        .pipe(
          map(
            () =>
              new ToggleDashboardBookmarkSuccessAction(action.id, {
                bookmarkPending: false
              })
          ),
          catchError(error =>
            of(
              new ToggleDashboardBookmarkFailAction(
                action.id,
                {
                  bookmarkPending: false,
                  bookmarked: !action.changes.bookmarked
                },
                error
              )
            )
          )
        )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dashboardService: DashboardService
  ) {}
}
