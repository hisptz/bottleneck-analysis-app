import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
  exhaustMap,
  mergeMap
} from 'rxjs/operators';

import * as _ from 'lodash';

// ngrx store
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

// Services import
import { DashboardService, UtilService } from '../../services';

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
  ToggleDashboardBookmarkFailAction,
  AddDashboardItemAction,
  AddDashboardItemSuccessAction,
  AddDashboardItemFailAction,
  CreateDashboardAction,
  AddDashboardAction,
  UpdateDashboardAction
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
  getStandardizedVisualizationUiConfig,
  AddVisualizationObjectAction,
  AddVisualizationUiConfigurationAction
} from '@hisptz/ngx-dhis2-visualization';

// helpers import
import {
  getStandardizedDashboards,
  getCurrentDashboardId,
  getStandardizedDashboardVisualizations,
  getDashboardItemsFromDashboards
} from '../../helpers';
import {
  AddDashboardVisualizationsAction,
  AddDashboardVisualizationItemAction
} from '../actions';
import { User } from '../../../models';
import { getDashboardSettings } from '../selectors/dashboard-settings.selectors';
import { DashboardSettings } from '../../models/dashboard-settings.model';

@Injectable()
export class DashboardEffects {
  @Effect()
  loadAllDashboards$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.LoadDashboards),
    withLatestFrom(this.store.select(getRouteUrl)),
    switchMap(([action, routeUrl]: [LoadDashboardsAction, string]) =>
      this.dashboardService.loadAll(action.dashboardSettings).pipe(
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

  @Effect()
  addDashboardItem$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.AddDashboardItem),
    switchMap((action: AddDashboardItemAction) =>
      this.dashboardService
        .addDashboardItem(action.dashboardId, action.dashboardItem)
        .pipe(
          switchMap((dashboardResponse: any) => [
            new AddDashboardItemSuccessAction(
              dashboardResponse.dashboardId,
              dashboardResponse.dashboardItem
            ),
            new AddDashboardVisualizationItemAction(
              dashboardResponse.dashboardId,
              dashboardResponse.dashboardItem
                ? dashboardResponse.dashboardItem.id
                : ''
            ),
            new AddVisualizationObjectAction(
              getStandardizedVisualizationObject({
                ...dashboardResponse.dashboardItem,
                dashboardId: dashboardResponse.dashboardId,
                isOpen: true
              })
            ),
            new AddVisualizationUiConfigurationAction(
              getStandardizedVisualizationUiConfig({
                ...dashboardResponse.dashboardItem,
                dashboardId: dashboardResponse.dashboardId,
                isOpen: true
              })
            )
          ]),
          catchError(error => of(new AddDashboardItemFailAction('', error)))
        )
    )
  );

  @Effect()
  createDashboard$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.CreateDashboard),
    withLatestFrom(this.store.select(getDashboardSettings)),
    mergeMap(
      ([action, dashboardSettings]: [
        CreateDashboardAction,
        DashboardSettings
      ]) =>
        this.utilService.getUniqueId().pipe(
          tap((id: string) => {
            this.store.dispatch(
              new AddDashboardAction({
                id,
                name: action.dashboardName,
                creating: true
              })
            );
          }),
          mergeMap((id: string) =>
            this.dashboardService
              .create({ id, name: action.dashboardName }, dashboardSettings)
              .pipe(
                map(
                  () =>
                    new UpdateDashboardAction(id, {
                      creating: false,
                      updatedOrCreated: true
                    })
                ),
                catchError(error =>
                  of(
                    new UpdateDashboardAction(id, {
                      creating: false,
                      updatedOrCreated: false,
                      error
                    })
                  )
                )
              )
          )
        )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dashboardService: DashboardService,
    private utilService: UtilService
  ) {}
}
