import {Injectable} from '@angular/core';
import {DashboardService} from '../../providers/dashboard.service';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import {
  DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION,
  DASHBOARD_ITEM_ADD_ACTION,
  DashboardEditedAction,
  DashboardGroupSettingsUpdatedAction,
  DashboardItemAddedAction,
  DashboardsCustomSettingsLoadedAction,
  DashboardSearchItemsLoadedAction,
  DashboardsLoadedAction,
  ErrorOccurredAction,
  InitialVisualizationObjectsLoadedAction,
  LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION,
  VisualizationObjectDeletedAction
} from '../actions';
import * as fromAction from '../actions';
import {Action, Store} from '@ngrx/store';
import {ApplicationState} from '../application-state';
import {Dashboard} from '../../model/dashboard';
import {Router} from '@angular/router';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import {mergeRelatedItems} from '../mappers/map-state-to-dashboard';

@Injectable()
export class DashboardEffect {

  @Effect({dispatch: false}) currentUserLoaded$: Observable<Action> = this.actions$
    .ofType(fromAction.CURRENT_USER_LOADED_ACTION)
    .withLatestFrom(this.store)
    .take(1)
    .switchMap(([action, store]) => {
      return new Observable(observer => {
        this.dashboardService.loadAll(store.uiState.systemInfo.apiRootUrl)
          .subscribe((dashboardResponse: any) => {
            if (!dashboardResponse.dashboards) {
              this.store.dispatch(new fromAction.ErrorOccurredAction(dashboardResponse));
            }

            const newDashboards: Dashboard[] = dashboardResponse.dashboards;
            this.store.dispatch(new DashboardsLoadedAction(newDashboards));

            observer.next(null);
            observer.complete();
          })
      })
    });

  @Effect() predefinedDashboards$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION)
    .switchMap(action => this.dashboardService.loadCustomDashboardSettings(action.payload))
    .map(dashboards => new DashboardsCustomSettingsLoadedAction(dashboards));

  @Effect() updateDashboardsSettings$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION)
    .switchMap(action => this.dashboardService.updateCustomDashboardSettings(action.payload))
    .map(dashboardsSettings => new DashboardGroupSettingsUpdatedAction(dashboardsSettings));

  @Effect({dispatch: false}) createDashboard$: Observable<Action> = this.actions$
    .ofType(fromAction.CREATE_DASHBOARD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return new Observable(observer => {
        this.dashboardService.create(
          {apiRootUrl: store.uiState.systemInfo.apiRootUrl, dashboardData: action.payload})
          .subscribe((dashboard: Dashboard) => {
            this.store.dispatch(new fromAction.DashboardCreatedAction(dashboard));
            this.router.navigate(['/dashboards/' + dashboard.id]);
            observer.next(null);
            observer.complete();
          }, () => {
            observer.next(null);
            observer.complete();
          })
      })
    });


  @Effect() editDashboard$: Observable<Action> = this.actions$
    .ofType(fromAction.EDIT_DASHBOARD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      const apiRootUrl = store.uiState.systemInfo.apiRootUrl;
      return this.dashboardService.edit({apiRootUrl: apiRootUrl, dashboardData: action.payload})
    })
    .map(dashboard => new DashboardEditedAction(dashboard));

  @Effect({dispatch: false}) deleteDashboard$: Observable<Action> = this.actions$
    .ofType(fromAction.DELETE_DASHBOARD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return new Observable(observer => {
        this.dashboardService.delete(action.payload)
          .subscribe((dashboardToDelete: any) => {
            const dashboardIndex = _.findIndex(store.storeData.dashboards,
              _.find(store.storeData.dashboards, ['id', dashboardToDelete.id]));

            if (dashboardIndex !== -1) {
              const dashboardToNavigate = dashboardIndex === 0 ? store.storeData.dashboards[1] :
                store.storeData.dashboards[dashboardIndex - 1];
              this.store.dispatch(new fromAction.DashboardDeletedAction(dashboardToDelete));

              this.router.navigate(['/dashboards/' + dashboardToNavigate.id]);

              observer.next(null);
              observer.complete();
            }
          }, () => {
            observer.next(null);
            observer.complete();
          })
      })
    });

  @Effect({dispatch: false}) resizeDashboard$: Observable<Action> = this.actions$
    .ofType(fromAction.RESIZE_DASHBOARD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return new Observable(observer => {
        const dashboardDetails: any = {... action.payload};
        dashboardDetails.apiRootUrl = store.uiState.systemInfo.apiRootUrl;
        this.dashboardService.resize(dashboardDetails)
          .subscribe(() => {
            observer.next(null);
            observer.complete();
          }, () => {
            observer.next(null);
            observer.complete();
          })
      })
    });

  @Effect() loadDashboardSearchItems$: Observable<Action> = this.actions$
    .ofType(fromAction.LOAD_DASHBOARD_SEARCH_ITEMS_ACTION)
    .withLatestFrom(this.store)

    .switchMap(([action, store]) => this.dashboardService.loadSearchItems({
        apiRootUrl: store.uiState.systemInfo.apiRootUrl,
        searchText: action.payload
      })
    )
    .map((searchResult) => new DashboardSearchItemsLoadedAction(searchResult))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() addDashboardItemAction$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_ITEM_ADD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => this.dashboardService.addItems({
      dashboardItemData: action.payload,
      apiRootUrl: store.uiState.systemInfo.apiRootUrl
    }))
    .map((dashboardDetails) => new DashboardItemAddedAction(dashboardDetails));

  @Effect() dashboardItemAdded$: Observable<Action> = this.actions$
    .ofType(fromAction.DASHBOARD_ITEM_ADDED_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]: [any, ApplicationState]) => {
      const newDashboardItem: any = action.payload.dashboardItems.length > 1 ?
        mergeRelatedItems(action.payload.dashboardItems)[0] :
        action.payload.dashboardItems[0];

      const currentDashboard = _.find(store.storeData.dashboards, ['id', action.payload.dashboardId]);
      if (newDashboardItem) {
        if (currentDashboard) {
          const availableDashboardItem = _.find(currentDashboard.dashboardItems, ['id', newDashboardItem.id]);

          /**
           * Update for list like items .ie. users , reports ,etc
           */
          if (availableDashboardItem) {

            if (availableDashboardItem.type[availableDashboardItem.type.length - 1] === 'S') {
              const availableDashboardItemIndex = _.findIndex(currentDashboard.dashboardItems, availableDashboardItem);

              /**
               * Update the item in its corresponding dashboard
               * @type {[any , {} , any]}
               */
              const mergedDashboardItem: any = {...mergeRelatedItems([newDashboardItem, availableDashboardItem])[0]};
              currentDashboard.dashboardItems = [
                ...currentDashboard.dashboardItems.slice(0, availableDashboardItemIndex),
                mergedDashboardItem,
                ...currentDashboard.dashboardItems.slice(availableDashboardItemIndex + 1)
              ];

              /**
               * Also update its associated visualization object
               */
              this.store.dispatch(new fromAction.SaveVisualization(this.visualizationObjectService.loadInitialVisualizationObject({
                dashboardItem: mergedDashboardItem,
                favoriteOptions: [],
                dashboardId: action.payload.dashboardId,
                currentUser: store.storeData.currentUser,
                apiRootUrl: store.uiState.systemInfo.apiRootUrl,
                isNew: false
              })))
            }
          } else {

            if (newDashboardItem.type === 'APP') {
              if (!_.find(currentDashboard.dashboardItems, ['appKey', newDashboardItem.appKey])) {
                newDashboardItem.isNew = true;
                currentDashboard.dashboardItems = [newDashboardItem, ...currentDashboard.dashboardItems];

                this.store.dispatch(new fromAction.InitialVisualizationObjectsLoadedAction(
                  [this.visualizationObjectService.loadInitialVisualizationObject({
                    dashboardItem: newDashboardItem,
                    favoriteOptions: [],
                    dashboardId: action.payload.dashboardId,
                    currentUser: store.storeData.currentUser,
                    apiRootUrl: store.uiState.systemInfo.apiRootUrl,
                    isNew: true
                  })]))
              }
            } else {
              newDashboardItem.isNew = true;
              currentDashboard.dashboardItems = [newDashboardItem, ...currentDashboard.dashboardItems];

              this.store.dispatch(new fromAction.InitialVisualizationObjectsLoadedAction(
                [this.visualizationObjectService.loadInitialVisualizationObject({
                  dashboardItem: newDashboardItem,
                  favoriteOptions: [],
                  dashboardId: action.payload.dashboardId,
                  currentUser: store.storeData.currentUser,
                  apiRootUrl: store.uiState.systemInfo.apiRootUrl,
                  isNew: true
                })]))
            }
          }
        }
      }

      return Observable.of(currentDashboard);
    })
    .map((dashboard: Dashboard) => new fromAction.UpdateDashboardAction(dashboard));

  @Effect() deleteVisualizationObject$: Observable<Action> = this.actions$
    .ofType(fromAction.DELETE_VISUALIZATION_OBJECT_ACTION)
    .switchMap(action => this.dashboardService.deleteItem(action.payload))
    .map((dashboardDetails) => new VisualizationObjectDeletedAction(dashboardDetails));

  @Effect({dispatch: false}) currentDashboard$: Observable<Action> = this.actions$
    .ofType(fromAction.LOAD_CURRENT_DASHBOARD)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      const currentDashboard: Dashboard = _.find(store.storeData.dashboards, ['id', action.payload]);

      if (currentDashboard) {
        let initialVisualizations = [];
        currentDashboard.dashboardItems.forEach((dashboardItem: any) => {
          if (!_.find(store.storeData.visualizationObjects, ['id', dashboardItem.id])) {
            initialVisualizations = [...initialVisualizations, this.visualizationObjectService.loadInitialVisualizationObject({
              dashboardItem: dashboardItem,
              favoriteOptions: [],
              dashboardId: currentDashboard.id,
              currentUser: store.storeData.currentUser,
              apiRootUrl: store.uiState.systemInfo.apiRootUrl,
              isNew: dashboardItem.isNew
            })]
          }
        });

        if (initialVisualizations.length > 0) {
          this.store.dispatch(new InitialVisualizationObjectsLoadedAction(initialVisualizations))
        }
      } else {
        const firstDashboard = store.storeData.dashboards[0];

        if (firstDashboard) {
          this.router.navigate(['dashboards/' + firstDashboard.id]);
        }
      }
      return Observable.of(null);
    });

  constructor(private actions$: Actions,
              private store: Store<ApplicationState>,
              private dashboardService: DashboardService,
              private visualizationObjectService: VisualizationObjectService,
              private router: Router) {
  }

}
