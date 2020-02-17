import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { from, Observable, of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import * as fromRootHelpers from '../../../helpers';
import * as fromRootActions from '../../../store/actions';
import * as fromRootReducer from '../../../store/reducers';
import * as fromRootSelectors from '../../../store/selectors';
import * as fromDashboardHelpers from '../../helpers';
import { getDataSelectionsForDashboardCreation } from '../../helpers/get-data-selections-for-dashboard-creation.helper';
import * as fromDashboardModels from '../../models';
import * as fromVisualizationHelpers from '../../modules/ngx-dhis2-visualization/helpers';
import * as fromVisualizationModels from '../../modules/ngx-dhis2-visualization/models';
import * as fromVisualizationActions from '../../modules/ngx-dhis2-visualization/store/actions';
import * as fromVisualizationSelectors from '../../modules/ngx-dhis2-visualization/store/selectors';
import { DashboardService } from '../../services/dashboard.service';
import * as fromDashboardVisualizationActions from '../actions/dashboard-visualization.actions';
import * as fromDashboardActions from '../actions/dashboard.actions';
import * as fromDashboardSelectors from '../selectors';
import * as fromDashboardVisualizationSelectors from '../selectors/dashboard-visualization.selectors';
import { getStandardizedDashboards } from '../../helpers';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@iapps/ngx-dhis2-http-client';

@Injectable()
export class DashboardEffects {
  @Effect()
  loadAllDashboards$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.LoadDashboards),
    switchMap((action: fromDashboardActions.LoadDashboardsAction) => {
      return this.dashboardService.loadAll(action.dashboardSettings).pipe(
        map(
          (dashboards: any[]) =>
            new fromDashboardActions.LoadDashboardsSuccessAction(
              getStandardizedDashboards(
                fromDashboardHelpers.getFilteredDashboardBasedOnSharing(
                  dashboards,
                  action.currentUser
                ),
                action.currentUser,
                action.determinants
              ),
              action.currentUser
            )
        ),
        catchError((error: any) =>
          of(new fromDashboardActions.LoadDashboardsFailAction(error))
        )
      );
    })
  );

  @Effect()
  loadAllDashboardSuccess$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.LoadDashboardsSuccess),
    withLatestFrom(this.store.select(fromRootSelectors.getRouteUrl)),
    map(
      ([action, routeUrl]: [
        fromDashboardActions.LoadDashboardsSuccessAction,
        string
      ]) => {
        const currentDashboardId = fromDashboardHelpers.getCurrentDashboardId(
          routeUrl,
          action.dashboards,
          action.currentUser
        );
        return new fromDashboardActions.SetCurrentDashboardAction(
          currentDashboardId,
          routeUrl
        );
      }
    )
  );

  @Effect({ dispatch: false })
  setCurrentDashboard$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.SetCurrentDashboard),
    withLatestFrom(this.store.select(fromRootSelectors.getCurrentUser)),
    tap(
      ([action, currentUser]: [
        fromDashboardActions.SetCurrentDashboardAction,
        User
      ]) => {
        // Set selected dashboard id into local storage
        localStorage.setItem(
          'dhis2.dashboard.current.' + currentUser.userCredentials.username,
          action.id
        );

        // Decide on the route to take
        const splitedRouteUrl = action.routeUrl
          ? action.routeUrl.split('/')
          : [];
        const currentVisualizationId = splitedRouteUrl[4];
        if (!currentVisualizationId) {
          this.store.dispatch(
            new fromRootActions.Go({ path: [`/dashboards/${action.id}`] })
          );
        } else {
          this.store.dispatch(
            new fromDashboardActions.SetCurrentVisualizationAction(
              currentVisualizationId,
              action.id
            )
          );
        }

        // Load current dashboard contents if not available
        this.store
          .select(
            fromDashboardVisualizationSelectors.getDashboardVisualizationById(
              action.id
            )
          )
          .pipe(take(1))
          .subscribe(
            (
              dashboardVisualization: fromDashboardModels.DashboardVisualization
            ) => {
              if (!dashboardVisualization) {
                this.store.dispatch(
                  new fromDashboardVisualizationActions.LoadDashboardVisualizationsAction(
                    action.id,
                    currentVisualizationId
                  )
                );
              }
            }
          );
      }
    )
  );

  @Effect()
  setCurrentVisualization$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.SetCurrentVisualization),
    map(
      (action: fromDashboardActions.SetCurrentVisualizationAction) =>
        new fromRootActions.Go({
          path: [
            `/dashboards/${action.dashboardId}/fullScreen/${action.visualizationId}`,
          ],
        })
    )
  );

  @Effect()
  toggleDashboardBookmark$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.ToggleDashboardBookmark),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getDashboardSettings)
    ),
    switchMap(
      ([action, dashboardSettings]: [
        fromDashboardActions.ToggleDashboardBookmarkAction,
        fromDashboardModels.DashboardSettings
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
                new fromDashboardActions.ToggleDashboardBookmarkSuccessAction(
                  action.id,
                  {
                    bookmarkPending: false,
                  }
                )
            ),
            catchError(error =>
              of(
                new fromDashboardActions.ToggleDashboardBookmarkFailAction(
                  action.id,
                  {
                    bookmarkPending: false,
                    bookmarked: !action.changes.bookmarked,
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
    ofType(fromDashboardActions.DashboardActionTypes.ManageDashboardItem),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getDashboardSettings)
    ),
    tap(
      ([action, dashboardSettings]: [
        fromDashboardActions.ManageDashboardItemAction,
        fromDashboardModels.DashboardSettings
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
                new fromDashboardActions.ManageDashboardItemSuccessAction(
                  dashboardResponse.dashboardId,
                  dashboardResponse.dashboardItem
                )
              );

              if (!action.skipStoreUpdate) {
                if (action.action === 'ADD') {
                  this.store.dispatch(
                    new fromDashboardVisualizationActions.AddDashboardVisualizationItemAction(
                      dashboardResponse.dashboardId,
                      dashboardResponse.dashboardItem
                        ? dashboardResponse.dashboardItem.id
                        : ''
                    )
                  );

                  this.store.dispatch(
                    new fromVisualizationActions.AddVisualizationObjectAction(
                      fromVisualizationHelpers.getStandardizedVisualizationObject(
                        {
                          ...dashboardResponse.dashboardItem,
                          dashboardId: dashboardResponse.dashboardId,
                          isOpen: true,
                        }
                      )
                    )
                  );

                  this.store.dispatch(
                    new fromVisualizationActions.AddVisualizationUiConfigurationAction(
                      fromVisualizationHelpers.getStandardizedVisualizationUiConfig(
                        {
                          ...dashboardResponse.dashboardItem,
                          dashboardId: dashboardResponse.dashboardId,
                          isOpen: true,
                        }
                      )
                    )
                  );
                } else if (action.action === 'DELETE') {
                  if (
                    !action.dashboardItem.isNew &&
                    action.dashboardItem.deleteFavorite
                  ) {
                    this.store.dispatch(
                      new fromVisualizationActions.RemoveVisualizationFavoriteAction(
                        action.dashboardItem.id,
                        action.dashboardItem.favorite.id,
                        action.dashboardItem.favorite.type
                      )
                    );
                  }
                  this.store.dispatch(
                    new fromDashboardVisualizationActions.RemoveDashboardVisualizationItemAction(
                      action.dashboardId,
                      action.dashboardItem.id
                    )
                  );

                  this.store.dispatch(
                    new fromVisualizationActions.RemoveVisualizationObjectAction(
                      action.dashboardItem.id
                    )
                  );
                }
              }
            },
            error => {
              this.store.dispatch(
                new fromDashboardActions.ManageDashboardItemFailAction(
                  '',
                  error
                )
              );
            }
          );
      }
    )
  );

  @Effect()
  createDashboard$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.CreateDashboard),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getDashboardSettings)
    ),
    mergeMap(
      ([action, dashboardSettings]: [
        fromDashboardActions.CreateDashboardAction,
        fromDashboardModels.DashboardSettings
      ]) => {
        this.snackBar.open(
          `Creating ${action.dashboard.name} intervention....`
        );
        const dataSelections = getDataSelectionsForDashboardCreation(
          action.dashboard ? action.dashboard.dashboardItems || [] : [],
          action.determinants,
          action.systemInfo,
          action.currentUser
        );

        const dashboard = fromDashboardHelpers.getStandardizedDashboard(
          action.dashboard,
          action.currentUser,
          dataSelections,
          action.determinants
        );

        const dashboardObject = {
          ...dashboard,
          id: fromRootHelpers.generateUid(),
          dashboardItems: _.map(
            action.dashboard.dashboardItems || [],
            (dashboardItem: any) =>
              fromDashboardHelpers.getSanitizedDashboardItem(dashboardItem)
          ),
        };
        this.store.dispatch(
          new fromDashboardActions.AddDashboardAction(
            _.omit(
              {
                ...dashboardObject,
                creating: true,
              },
              ['dashboardItems']
            )
          )
        );
        return this.dashboardService
          .create(dashboardObject, dashboardSettings)
          .pipe(
            switchMap(() => {
              this.snackBar.open(
                `${action.dashboard.name} intervention created successfully`,
                'OK',
                {
                  duration: 3000,
                }
              );
              return [
                new fromDashboardActions.UpdateDashboardAction(
                  dashboardObject.id,
                  {
                    creating: false,
                    updatedOrCreated: true,
                  }
                ),
                new fromDashboardVisualizationActions.LoadDashboardVisualizationsAction(
                  dashboardObject.id,
                  '',
                  dataSelections
                ),
                new fromDashboardActions.SetCurrentDashboardAction(
                  dashboardObject.id
                ),
              ];
            }),
            catchError(error => {
              this.snackBar.open(
                `Fail to create ${action.dashboard.name} intervention, Error (Code: ${error.status}): ${error.message}`,
                'OK'
              );
              return of(
                new fromDashboardActions.UpdateDashboardAction(
                  dashboardObject.id,
                  {
                    creating: false,
                    updatedOrCreated: false,
                    error,
                  }
                )
              );
            })
          );
      }
    )
  );

  @Effect()
  saveDashboard$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.SaveDashboard),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getDashboardSettings),
      this.store.select(fromDashboardSelectors.getCurrentDashboard)
    ),
    mergeMap(
      ([action, dashboardSettings, currentDashboard]: [
        fromDashboardActions.SaveDashboardAction,
        fromDashboardModels.DashboardSettings,
        fromDashboardModels.Dashboard
      ]) => {
        // Also Update visualization for the current dashboard
        this.store
          .select(
            fromDashboardVisualizationSelectors.getCurrentDashboardVisualizationItems
          )
          .pipe(take(1))
          .subscribe((visualizations: any[]) => {
            _.each(visualizations, (visualization: any) => {
              this.store.dispatch(
                new fromVisualizationActions.SaveVisualizationFavoriteAction(
                  visualization.id,
                  {},
                  currentDashboard.id
                )
              );
            });
          });

        return this.dashboardService
          .update(currentDashboard, dashboardSettings)
          .pipe(
            map(
              () =>
                new fromDashboardActions.SaveDashboardSuccessAction(
                  currentDashboard
                )
            ),
            catchError((error: any) =>
              of(
                new fromDashboardActions.SaveDashboardFailAction(
                  currentDashboard,
                  error
                )
              )
            )
          );
      }
    )
  );

  @Effect()
  deleteDashboard$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.DeleteDashboard),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getDashboardSettings)
    ),
    mergeMap(
      ([action, dashboardSettings]: [
        fromDashboardActions.DeleteDashboard,
        fromDashboardModels.DashboardSettings
      ]) => {
        this.snackBar.open(
          `Deleting ${action.dashboard.name} intervention....`
        );
        return this.dashboardService
          .delete(action.dashboard.id, dashboardSettings)
          .pipe(
            map(() => {
              this.snackBar.open(
                `${action.dashboard.name} intervention deleted successfully`,
                'OK',
                {
                  duration: 3000,
                }
              );
              return new fromDashboardActions.DeleteDashboardSuccess(
                action.dashboard
              );
            }),
            catchError((error: any) => {
              this.snackBar.open(
                `Fail to delete ${action.dashboard.name} intervention, Error (Code: ${error.status}): ${error.message}`,
                'OK'
              );
              return of(
                new fromDashboardActions.DeleteDashboardFail(
                  action.dashboard,
                  error
                )
              );
            })
          );
      }
    )
  );

  @Effect({ dispatch: false })
  deleteDashboardSuccess$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.DeleteDashboardSuccess),
    withLatestFrom(
      this.store.select(fromDashboardSelectors.getAllGroupDashboards)
    ),
    tap(
      ([action, dashboards]: [
        fromDashboardActions.DeleteDashboardSuccess,
        fromDashboardModels.Dashboard[]
      ]) => {
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
        this.store.dispatch(
          new fromDashboardActions.RemoveDashboard(action.dashboard)
        );

        // Set current dashboard
        if (dashboardToNavigate) {
          this.store.dispatch(
            new fromDashboardActions.SetCurrentDashboardAction(
              dashboardToNavigate.id
            )
          );
        } else {
          this.store.dispatch(
            new fromRootActions.Go({ path: [`/dashboards`] })
          );
        }
      }
    )
  );

  @Effect()
  addNewFavorite$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.AddNewUnsavedFavorite),
    map(
      (action: fromDashboardActions.AddNewUnsavedFavoriteAction) =>
        new fromDashboardVisualizationActions.AddDashboardVisualizationItemAction(
          action.id,
          fromRootHelpers.generateUid()
        )
    )
  );

  @Effect({ dispatch: false })
  globalFilterChange$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.GlobalFilterChange),
    withLatestFrom(
      this.store.select(
        fromDashboardVisualizationSelectors.getCurrentDashboardVisualizationItems
      )
    ),
    tap(
      ([action, dashboardVisualizations]: [
        fromDashboardActions.GlobalFilterChangeAction,
        any[]
      ]) => {
        from(dashboardVisualizations)
          .pipe(
            mergeMap(dashboardVisualization =>
              this.store
                .select(
                  fromVisualizationSelectors.getCurrentVisualizationObjectLayers(
                    dashboardVisualization.id
                  )
                )
                .pipe(
                  take(1),
                  map(
                    (
                      visualizationLayers: fromVisualizationModels.VisualizationLayer[]
                    ) => {
                      return {
                        visualizationId: dashboardVisualization.id,
                        visualizationLayers,
                      };
                    }
                  )
                )
            )
          )
          .subscribe(
            (visualizationDetails: {
              visualizationId: string;
              visualizationLayers: fromVisualizationModels.VisualizationLayer[];
            }) => {
              this.store.dispatch(
                new fromVisualizationActions.LoadVisualizationAnalyticsAction(
                  visualizationDetails.visualizationId,
                  visualizationDetails.visualizationLayers,
                  action.changes.globalSelections
                )
              );
            }
          );
      }
    )
  );

  @Effect({ dispatch: false })
  resetDashboard$: Observable<any> = this.actions$.pipe(
    ofType(fromDashboardActions.DashboardActionTypes.ResetDashboard),
    tap(() => {
      window.location.reload();
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromRootReducer.State>,
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) {}
}
