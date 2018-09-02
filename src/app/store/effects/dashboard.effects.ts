import { Injectable } from '@angular/core';

import { Observable, of, from } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  withLatestFrom,
  mergeMap,
  take,
  first,
  filter
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
  GlobalFilterChangeAction,
  DeleteDashboard,
  DeleteDashboardSuccess,
  DeleteDashboardFail,
  RemoveDashboard
} from '../actions/dashboard.actions';

import {
  AddVisualizationObjectAction,
  AddVisualizationUiConfigurationAction,
  ToggleFullScreenAction,
  LoadVisualizationAnalyticsAction,
  RemoveVisualizationObjectAction,
  RemoveVisualizationFavoriteAction,
  VisualizationObjectActionTypes,
  SaveVisualizationFavoriteSuccessAction
} from '../../dashboard/modules/ngx-dhis2-visualization/store/actions';

import {
  getStandardizedVisualizationUiConfig,
  getStandardizedVisualizationObject,
  getMergedDataSelections
} from '../../dashboard/modules/ngx-dhis2-visualization/helpers';

// helpers import
import { getCurrentDashboardId } from '../../helpers';
import {
  AddDashboardVisualizationItemAction,
  Go,
  RemoveDashboardVisualizationItemAction,
  AddDashboardVisualizationAction,
  LoadDashboardVisualizationsAction
} from '../actions';
import { User } from '../../models';
import { getDashboardSettings } from '../selectors/dashboard-settings.selectors';
import { DashboardSettings } from '../../dashboard/models/dashboard-settings.model';
import { State } from '../reducers';
import {
  getCurrentUser,
  getRouteUrl,
  getDashboardVisualizationById,
  getCurrentDashboardVisualizationItems,
  getAllGroupDashboards
} from '../selectors';
import { VisualizationLayer } from '../../dashboard/modules/ngx-dhis2-visualization/models';
import { getCurrentVisualizationObjectLayers } from '../../dashboard/modules/ngx-dhis2-visualization/store/selectors';
import { generateUid } from '../../helpers/generate-uid.helper';
import { DashboardVisualization, Dashboard } from '../../dashboard/models';
import { getStandardizedDashboard } from '../../helpers/get-standardized-dashboard.helper';
import { getDataGroupObjectWithLoadingStatus } from '../selectors/data-group.selectors';

@Injectable()
export class DashboardEffects {
  @Effect()
  loadAllDashboards$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.LoadDashboards),
    switchMap((action: LoadDashboardsAction) => {
      return this.dashboardService.loadAll(action.dashboardSettings).pipe(
        map(
          (dashboards: any[]) =>
            new LoadDashboardsSuccessAction(
              dashboards,
              action.currentUser,
              action.systemInfo,
              action.dataGroups
            )
        ),
        catchError((error: any) => of(new LoadDashboardsFailAction(error)))
      );
    })
  );

  @Effect()
  loadAllDashboardSuccess$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.LoadDashboardsSuccess),
    withLatestFrom(this.store.select(getRouteUrl)),
    map(([action, routeUrl]: [LoadDashboardsSuccessAction, string]) => {
      const currentDashboardId = getCurrentDashboardId(
        routeUrl,
        action.dashboards,
        action.currentUser
      );
      return new SetCurrentDashboardAction(currentDashboardId, routeUrl);
    })
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

      // Decide on the route to take
      const splitedRouteUrl = action.routeUrl ? action.routeUrl.split('/') : [];
      const currentVisualizationId = splitedRouteUrl[4];
      if (!currentVisualizationId) {
        this.store.dispatch(new Go({ path: [`/dashboards/${action.id}`] }));
      } else {
        this.store.dispatch(
          new SetCurrentVisualizationAction(currentVisualizationId, action.id)
        );
      }

      // Load current dashboard contents if not available
      this.store
        .select(getDashboardVisualizationById(action.id))
        .pipe(take(1))
        .subscribe((dashboardVisualization: DashboardVisualization) => {
          if (!dashboardVisualization) {
            this.store.dispatch(
              new LoadDashboardVisualizationsAction(
                action.id,
                currentVisualizationId
              )
            );
          }
        });
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
    withLatestFrom(this.store.select(getDashboardSettings)),
    switchMap(
      ([action, dashboardSettings]: [
        ToggleDashboardBookmarkAction,
        DashboardSettings
      ]) =>
        this.dashboardService
          .bookmarkDashboard(
            action.id,
            action.changes.bookmarked,
            action.supportBookmark,
            action.currentUser.id,
            dashboardSettings
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
        const dashboard = getStandardizedDashboard(
          action.dashboard,
          action.currentUser,
          action.systemInfo,
          action.dataGroups
        );
        const dashboardObject = {
          ...dashboard,
          id: `${dashboardSettings.id}_${generateUid()}`,
          dashboardItems: _.map(
            action.dashboard.dashboardItems || [],
            (dashboardItem: any) => {
              return dashboardItem.type !== 'APP'
                ? {
                    ...dashboardItem,
                    id: generateUid(),
                    [_.camelCase(dashboardItem.type)]: {
                      id: generateUid()
                    }
                  }
                : {
                    ...dashboardItem,
                    id: generateUid()
                  };
            }
          )
        };
        this.store.dispatch(
          new AddDashboardAction(
            _.omit(
              {
                ...dashboardObject,
                creating: true
              },
              ['dashboardItems']
            )
          )
        );
        return this.dashboardService
          .create(dashboardObject, dashboardSettings)
          .pipe(
            switchMap(() => [
              new UpdateDashboardAction(dashboardObject.id, {
                creating: false,
                updatedOrCreated: true
              }),
              new LoadDashboardVisualizationsAction(dashboardObject.id, ''),
              new SetCurrentDashboardAction(dashboardObject.id)
            ]),
            catchError(error =>
              of(
                new UpdateDashboardAction(dashboardObject.id, {
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
  deleteDashboard$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.DeleteDashboard),
    withLatestFrom(this.store.select(getDashboardSettings)),
    mergeMap(
      ([action, dashboardSettings]: [DeleteDashboard, DashboardSettings]) =>
        this.dashboardService
          .delete(action.dashboard.id, dashboardSettings)
          .pipe(
            map(() => new DeleteDashboardSuccess(action.dashboard)),
            catchError((error: any) =>
              of(new DeleteDashboardFail(action.dashboard, error))
            )
          )
    )
  );

  @Effect({ dispatch: false })
  deleteDashboardSuccess$: Observable<any> = this.actions$.pipe(
    ofType(DashboardActionTypes.DeleteDashboardSuccess),
    withLatestFrom(this.store.select(getAllGroupDashboards)),
    tap(([action, dashboards]: [DeleteDashboardSuccess, Dashboard[]]) => {
      const dashboardIndex = dashboards.indexOf(
        _.find(dashboards, ['id', action.dashboard.id])
      );

      // Find dashboard to navigate
      const dashboardToNavigate =
        dashboards.length > 1
          ? dashboardIndex === 0
            ? dashboards[1]
            : dashboards[dashboardIndex - 1]
          : null;

      // Remove dashboard from the list
      this.store.dispatch(new RemoveDashboard(action.dashboard));

      // Set current dashboard
      if (dashboardToNavigate) {
        this.store.dispatch(
          new SetCurrentDashboardAction(dashboardToNavigate.id)
        );
      } else {
        this.store.dispatch(new Go({ path: [`/dashboards`] }));
      }
    })
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
    withLatestFrom(this.store.select(getCurrentDashboardVisualizationItems)),
    tap(
      ([action, dashboardVisualizations]: [GlobalFilterChangeAction, any[]]) =>
        from(dashboardVisualizations)
          .pipe(
            mergeMap(dashboardVisualization =>
              this.store
                .select(
                  getCurrentVisualizationObjectLayers(dashboardVisualization.id)
                )
                .pipe(
                  take(1),
                  map((visualizationLayers: VisualizationLayer[]) => {
                    return {
                      visualizationId: dashboardVisualization.id,
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

  @Effect()
  saveVisualizationFavoriteSuccess$: Observable<any> = this.actions$.pipe(
    ofType(VisualizationObjectActionTypes.SaveVisualizationFavoriteSuccess),
    map(
      (action: SaveVisualizationFavoriteSuccessAction) =>
        new ManageDashboardItemAction(
          action.dashboardId,
          {
            id: action.visualizationId,
            type: action.favoriteType,
            [_.camelCase(action.favoriteType)]: {
              id: action.favoriteDetails.id,
              displayName: action.favoriteDetails.name
            }
          },
          action.action,
          true
        )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private dashboardService: DashboardService
  ) {}
}
