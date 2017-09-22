import {Injectable} from '@angular/core';
import {DashboardService} from '../../providers/dashboard.service';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';
import {
  CREATE_DASHBOARD_ACTION,
  CURRENT_DASHBOARD_CHANGE_ACTION,
  CURRENT_DASHBOARD_LOADED,
  CURRENT_USER_LOADED_ACTION,
  CurrentDashboardLoaded,
  CurrentDashboardSaveAction,
  DASHBOARD_CREATED_ACTION,
  DASHBOARD_DELETED_ACTION,
  DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION,
  DASHBOARD_ITEM_ADD_ACTION,
  DASHBOARD_ITEM_ADDED_ACTION,
  DashboardCreatedAction,
  DashboardDeletedAction,
  DashboardEditedAction,
  DashboardGroupSettingsUpdatedAction,
  DashboardItemAddedAction,
  DashboardNavigatedAction,
  DashboardNavigationAction,
  DashboardsCustomSettingsLoadedAction,
  DashboardSearchItemsLoadedAction,
  DashboardsLoadedAction,
  DELETE_DASHBOARD_ACTION,
  DELETE_VISUALIZATION_OBJECT_ACTION,
  EDIT_DASHBOARD_ACTION,
  ErrorOccurredAction,
  InitialVisualizationObjectsLoadedAction,
  LOAD_CURRENT_DASHBOARD,
  LOAD_DASHBOARD_SEARCH_ITEMS_ACTION,
  LOAD_DASHBOARDS_ACTION,
  LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION,
  LoadDashboardsAction,
  NAVIGATE_DASHBOARD_ACTION,
  NavigateDashboardAction,
  VisualizationObjectDeletedAction
} from '../actions';
import * as fromAction from '../actions';
import {Action, Store} from '@ngrx/store';
import {ApplicationState} from '../application-state';
import {Dashboard} from '../../model/dashboard';
import {Router} from '@angular/router';
import {Visualization} from '../../dashboard/model/visualization';
import {VisualizationObjectService} from '../../dashboard/providers/visualization-object.service';
import {mergeRelatedItems} from '../mappers/map-state-to-dashboard';

@Injectable()
export class DashboardEffect {

  @Effect() currentUserLoaded$: Observable<Action> = this.actions$
    .ofType(CURRENT_USER_LOADED_ACTION)
    .withLatestFrom(this.store)
    .take(1)
    .switchMap(([action, store]) => Observable.of(store.uiState.systemInfo.apiRootUrl))
    .map((apiRootUrl) => new LoadDashboardsAction(apiRootUrl));

  @Effect() dashboards$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARDS_ACTION)
    .switchMap(action => this.dashboardService.loadAll(action.payload))
    .map((dashboardResponse: any) => {

      if (!dashboardResponse.dashboards) {
        return new ErrorOccurredAction(dashboardResponse);
      }

      const newDashboards: Dashboard[] = dashboardResponse.dashboards;
      return new DashboardsLoadedAction(newDashboards)
    });

  @Effect() currentDashboardChange: Observable<Action> = this.actions$
    .ofType(CURRENT_DASHBOARD_CHANGE_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {

      if (store.uiState.dashboardLoaded && store.uiState.dashboardCustomSettingsLoaded) {
        const currentDashboard = _.find(store.storeData.dashboards, ['id', action.payload]);

        if (!currentDashboard) {
          return Observable.of(store.storeData.dashboards[0]);
        }
      }
      return Observable.of(action.payload);
    })
    .map(dashboard => {
      if (dashboard.id) {
        return new NavigateDashboardAction(dashboard)
      }

      return new CurrentDashboardSaveAction(dashboard);
    });

  @Effect() predefinedDashboards$: Observable<Action> = this.actions$
    .ofType(LOAD_DASHBOARDS_CUSTOM_SETTINGS_ACTION)
    .switchMap(action => this.dashboardService.loadCustomDashboardSettings(action.payload))
    .map(dashboards => new DashboardsCustomSettingsLoadedAction(dashboards));

  @Effect() updateDashboardsSettings$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_GROUP_SETTINGS_UPDATE_ACTION)
    .switchMap(action => this.dashboardService.updateCustomDashboardSettings(action.payload))
    .map(dashboardsSettings => new DashboardGroupSettingsUpdatedAction(dashboardsSettings))

  @Effect() createDashboard$: Observable<Action> = this.actions$
    .ofType(CREATE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.create(action.payload))
    .map(dashboard => new DashboardCreatedAction(dashboard))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() navigateDashboard$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_CREATED_ACTION)
    .switchMap(action => Observable.of(action.payload))
    .map(dashboard => new NavigateDashboardAction(dashboard));

  @Effect() dashboardNavigated$: Observable<Action> = this.actions$
    .ofType(NAVIGATE_DASHBOARD_ACTION)
    .switchMap(action => Observable.of(this.dashboardService.navigateToDashboard(action.payload)))
    .map(dashboard => new DashboardNavigatedAction(dashboard));


  @Effect() editDashboard$: Observable<Action> = this.actions$
    .ofType(EDIT_DASHBOARD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      const apiRootUrl = store.uiState.systemInfo.apiRootUrl;
      return this.dashboardService.edit({apiRootUrl: apiRootUrl, dashboardData: action.payload})
    })
    .map(dashboard => new DashboardEditedAction(dashboard));

  @Effect() deleteDashboard$: Observable<Action> = this.actions$
    .ofType(DELETE_DASHBOARD_ACTION)
    .switchMap(action => this.dashboardService.delete(action.payload))
    .map(dashboard => new DashboardDeletedAction(dashboard))
    .catch((error) => Observable.of(new ErrorOccurredAction(error)));

  @Effect() deletedDashboard$: Observable<Action> = this.actions$
    .ofType(DASHBOARD_DELETED_ACTION)
    .switchMap(action => Observable.of(action.payload))
    .map(dashboard => new NavigateDashboardAction(dashboard));

  @Effect({dispatch: false}) resizeDashboard$: Observable<Action> = this.actions$
    .ofType(fromAction.RESIZE_DASHBOARD_ACTION)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return new Observable(observer => {
        action.payload.apiRootUrl = store.uiState.systemInfo.apiRootUrl;
        this.dashboardService.resize(action.payload)
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
    .ofType(LOAD_DASHBOARD_SEARCH_ITEMS_ACTION)
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
    .ofType(DASHBOARD_ITEM_ADDED_ACTION)
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
    .ofType(DELETE_VISUALIZATION_OBJECT_ACTION)
    .switchMap(action => this.dashboardService.deleteItem(action.payload))
    .map((dashboardDetails) => new VisualizationObjectDeletedAction(dashboardDetails));

  @Effect() currentDashboard$: Observable<Action> = this.actions$
    .ofType(LOAD_CURRENT_DASHBOARD)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      const dashboardId = store.uiState.currentDashboard;
      const currentDashboard: Dashboard = _.find(store.storeData.dashboards, ['id', dashboardId]);
      return Observable.of({
        currentDashboard: currentDashboard,
        nextPossibleDashboardId: store.storeData.dashboards[0].id
      });
    })
    .map((dashboardPayload: any) => {
      if (!dashboardPayload.currentDashboard) {
        this.router.navigate(['dashboards/' + dashboardPayload.nextPossibleDashboardId]);
        return new DashboardNavigationAction()
      }

      return new CurrentDashboardLoaded(dashboardPayload.currentDashboard);
    });

  @Effect() currentDashboardLoaded$: Observable<Action> = this.actions$
    .ofType(CURRENT_DASHBOARD_LOADED)
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, ApplicationState]) => Observable.of({
      dashboardItems: [...action.payload.dashboardItems],
      dashboardId: state.uiState.currentDashboard,
      currentUser: state.storeData.currentUser,
      apiRootUrl: state.uiState.systemInfo.apiRootUrl,
      availableVisualizationObjects: _.filter(state.storeData.visualizationObjects,
        (visualizationObject: Visualization) =>
          visualizationObject.dashboardId === state.uiState.currentDashboard)
    }))
    .map((resultPayload: any) => {
      let initialVisualizations: Visualization[] = [];
      resultPayload.dashboardItems.forEach((dashboardItem: any) => {
        if (!_.find(resultPayload.availableVisualizationObjects, ['id', dashboardItem.id])) {
          initialVisualizations = [...initialVisualizations, this.visualizationObjectService.loadInitialVisualizationObject({
            dashboardItem: dashboardItem,
            favoriteOptions: [],
            dashboardId: resultPayload.dashboardId,
            currentUser: resultPayload.currentUser,
            apiRootUrl: resultPayload.apiRootUrl,
            isNew: dashboardItem.isNew
          })]
        }
      });
      return new InitialVisualizationObjectsLoadedAction(initialVisualizations);
    });

  constructor(private actions$: Actions,
              private store: Store<ApplicationState>,
              private dashboardService: DashboardService,
              private visualizationObjectService: VisualizationObjectService,
              private router: Router) {
  }

}
