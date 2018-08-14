import { Injectable } from '@angular/core';

import { Observable, of, from } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
  mergeMap,
  take
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
  ToggleDashboardBookmarkFailAction,
  ManageDashboardItemAction,
  ManageDashboardItemSuccessAction,
  ManageDashboardItemFailAction,
  CreateDashboardAction,
  AddDashboardAction,
  UpdateDashboardAction,
  AddNewUnsavedFavoriteAction,
  SetCurrentVisualizationAction,
  GlobalFilterChangeAction
} from '../actions/dashboard.actions';

import {
  AddAllVisualizationObjectsAction,
  AddAllVisualizationUiConfigurationsAction,
  AddVisualizationObjectAction,
  AddVisualizationUiConfigurationAction,
  ToggleFullScreenAction,
  LoadVisualizationAnalyticsAction,
  RemoveVisualizationObjectAction,
  RemoveVisualizationFavoriteAction
} from '../../dashboard/modules/ngx-dhis2-visualization/store/actions';

import {
  getStandardizedVisualizationUiConfig,
  getStandardizedVisualizationObject,
  getMergedDataSelections
} from '../../dashboard/modules/ngx-dhis2-visualization/helpers';

// helpers import
import {
  getStandardizedDashboards,
  getCurrentDashboardId,
  getStandardizedDashboardVisualizations,
  getDashboardItemsFromDashboards
} from '../../helpers';
import {
  AddDashboardVisualizationsAction,
  AddDashboardVisualizationItemAction,
  Go,
  RemoveDashboardVisualizationItemAction
} from '../actions';
import { User } from '../../models';
import { getDashboardSettings } from '../selectors/dashboard-settings.selectors';
import { DashboardSettings } from '../../dashboard/models/dashboard-settings.model';
import { State } from '../reducers';
import {
  getCurrentUser,
  getRouteUrl,
  getCurrentDashboardVisualizations
} from '../selectors';
import {
  Visualization,
  VisualizationLayer
} from '../../dashboard/modules/ngx-dhis2-visualization/models';
import { getCurrentVisualizationObjectLayers } from '../../dashboard/modules/ngx-dhis2-visualization/store/selectors';
import { generateUid } from '../../helpers/generate-uid.helper';

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
              routeUrl,
              action.systemInfo
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
        getStandardizedDashboards(
          action.dashboards,
          action.currentUser,
          action.systemInfo
        )
      ),
      new SetCurrentDashboardAction(
        getCurrentDashboardId(
          action.routeUrl,
          action.dashboards,
          action.currentUser
        ),
        action.routeUrl
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

  @Effect({ dispatch: false })
  setCurrentDashboard$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.SetCurrentDashboard),
    withLatestFrom(this.store.select(getCurrentUser)),
    tap(([action, currentUser]: [SetCurrentDashboardAction, User]) => {
      // Set selected dashboard id into local storage
      localStorage.setItem(
        'dhis2.dashboard.current.' + currentUser.userCredentials.username,
        action.id
      );

      const splitedRouteUrl = action.routeUrl ? action.routeUrl.split('/') : [];
      const currentVisualizationId = splitedRouteUrl[4];
      if (!currentVisualizationId) {
        this.store.dispatch(new Go({ path: [`/dashboards/${action.id}`] }));
      } else {
        this.store.dispatch(
          new ToggleFullScreenAction(`${currentVisualizationId}_ui_config`)
        );

        this.store.dispatch(
          new SetCurrentVisualizationAction(currentVisualizationId, action.id)
        );
      }
    })
  );

  @Effect()
  setCurrentVisualization$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.SetCurrentVisualization),
    map(
      (action: SetCurrentVisualizationAction) =>
        new Go({
          path: [
            `/dashboards/${action.dashboardId}/fullScreen/${
              action.visualizationId
            }`
          ]
        })
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

  @Effect({ dispatch: false })
  addDashboardItem$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.ManageDashboardItem),
    withLatestFrom(this.store.select(getDashboardSettings)),
    tap(
      ([action, dashboardSettings]: [
        ManageDashboardItemAction,
        DashboardSettings
      ]) => {
        this.dashboardService
          .manageDashboardItem(
            action.dashboardId,
            action.dashboardItem,
            dashboardSettings,
            action.action
          )
          .subscribe(
            (dashboardResponse: any) => {
              this.store.dispatch(
                new ManageDashboardItemSuccessAction(
                  dashboardResponse.dashboardId,
                  dashboardResponse.dashboardItem
                )
              );

              if (!action.skipStoreUpdate) {
                if (action.action === 'ADD') {
                  this.store.dispatch(
                    new AddDashboardVisualizationItemAction(
                      dashboardResponse.dashboardId,
                      dashboardResponse.dashboardItem
                        ? dashboardResponse.dashboardItem.id
                        : ''
                    )
                  );

                  this.store.dispatch(
                    new AddVisualizationObjectAction(
                      getStandardizedVisualizationObject({
                        ...dashboardResponse.dashboardItem,
                        dashboardId: dashboardResponse.dashboardId,
                        isOpen: true
                      })
                    )
                  );

                  this.store.dispatch(
                    new AddVisualizationUiConfigurationAction(
                      getStandardizedVisualizationUiConfig({
                        ...dashboardResponse.dashboardItem,
                        dashboardId: dashboardResponse.dashboardId,
                        isOpen: true
                      })
                    )
                  );
                } else if (action.action === 'DELETE') {
                  if (
                    !action.dashboardItem.isNew &&
                    action.dashboardItem.deleteFavorite
                  ) {
                    this.store.dispatch(
                      new RemoveVisualizationFavoriteAction(
                        action.dashboardItem.id,
                        action.dashboardItem.favorite.id,
                        action.dashboardItem.favorite.type
                      )
                    );
                  }
                  this.store.dispatch(
                    new RemoveDashboardVisualizationItemAction(
                      action.dashboardId,
                      action.dashboardItem.id
                    )
                  );

                  this.store.dispatch(
                    new RemoveVisualizationObjectAction(action.dashboardItem.id)
                  );
                }
              }
            },
            error => {
              this.store.dispatch(new ManageDashboardItemFailAction('', error));
            }
          );
      }
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
      ]) => {
        const id = generateUid();
        this.store.dispatch(
          new AddDashboardAction({
            id,
            name: action.dashboardName,
            creating: true
          })
        );
        return this.dashboardService
          .create({ id, name: action.dashboardName }, dashboardSettings)
          .pipe(
            switchMap(() => [
              new UpdateDashboardAction(id, {
                creating: false,
                updatedOrCreated: true,
                access: {
                  manage: true,
                  write: true,
                  update: true,
                  read: true,
                  externalize: true,
                  delete: true
                }
              }),
              new SetCurrentDashboardAction(id)
            ]),
            catchError(error =>
              of(
                new UpdateDashboardAction(id, {
                  creating: false,
                  updatedOrCreated: false,
                  error
                })
              )
            )
          );
      }
    )
  );

  @Effect()
  addNewFavorite$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.AddNewUnsavedFavorite),
    map(
      (action: AddNewUnsavedFavoriteAction) =>
        new AddDashboardVisualizationItemAction(action.id, generateUid())
    )
  );

  @Effect({ dispatch: false })
  globalFilterChange$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.GlobalFilterChange),
    withLatestFrom(this.store.select(getCurrentDashboardVisualizations)),
    tap(
      ([action, dashboardVisualizations]: [
        GlobalFilterChangeAction,
        string[]
      ]) =>
        from(dashboardVisualizations)
          .pipe(
            mergeMap(dashboardVisualization =>
              this.store
                .select(
                  getCurrentVisualizationObjectLayers(dashboardVisualization)
                )
                .pipe(
                  take(1),
                  map((visualizationLayers: VisualizationLayer[]) => {
                    return {
                      visualizationId: dashboardVisualization,
                      visualizationLayers: _.map(
                        visualizationLayers,
                        (visualizationLayer: VisualizationLayer) => {
                          return {
                            ...visualizationLayer,
                            dataSelections: getMergedDataSelections(
                              visualizationLayer.dataSelections,
                              action.changes.globalSelections
                            )
                          };
                        }
                      )
                    };
                  })
                )
            )
          )
          .subscribe(
            (visualizationDetails: {
              visualizationId: string;
              visualizationLayers: VisualizationLayer[];
            }) => {
              this.store.dispatch(
                new LoadVisualizationAnalyticsAction(
                  visualizationDetails.visualizationId,
                  visualizationDetails.visualizationLayers
                )
              );
            }
          )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dashboardService: DashboardService
  ) {}
}
