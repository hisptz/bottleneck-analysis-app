import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Dashboard} from './dashboard.state';
import {Actions, Effect} from '@ngrx/effects';
import {HttpClientService} from '../../services/http-client.service';
import * as dashboard from './dashboard.actions';
import * as dashboardHelpers from './helpers/index';
import * as visualization from '../visualization/visualization.actions';
import * as visualizationHelpers from '../visualization/helpers/index';
import * as currentUser from '../current-user/current-user.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import {AppState} from '../app.reducers';
import {Store} from '@ngrx/store';
import 'rxjs/add/operator/withLatestFrom';
import {CurrentUserState} from '../current-user/current-user.state';
import * as _ from 'lodash';
import {Router} from '@angular/router';
import 'rxjs/add/operator/take';
import {ROUTER_NAVIGATION} from '@ngrx/router-store';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {Visualization} from '../visualization/visualization.state';

@Injectable()
export class DashboardEffects {

  @Effect()
  currentUserLoaded$ = this.actions$
    .ofType<currentUser.LoadSuccessAction>(currentUser.CurrentUserActions.LOAD_SUCCESS)
    .switchMap(() => Observable.of(null))
    .map(() => new dashboard.LoadAction());

  @Effect()
  loadDashboard$ = this.actions$
    .ofType<dashboard.LoadAction>(dashboard.DashboardActions.LOAD)
    .take(1)
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, AppState]) => new Observable(observer => {
      this._loadAll().subscribe((dashboards: Dashboard[]) => {
        observer.next({
          dashboards: dashboards,
          currentUser: state.currentUser,
          url: state.route.state.url
        });
        observer.complete();
      });
    }))
    .map((dashboardResponse: any) => new dashboard.LoadSuccessAction(dashboardResponse));

  @Effect({dispatch: false})
  dashboardsLoaded$ = this.actions$
    .ofType<dashboard.LoadSuccessAction>(dashboard.DashboardActions.LOAD_SUCCESS)
    .switchMap((action: any) => {
      const currentDashboardId = this._getCurrentDashboardId(
        action.payload.url,
        action.payload.dashboards,
        action.payload.currentUser);

      const currentVisualization = action.payload.url.split('/')[4];

      if (currentVisualization) {
        this.store.dispatch(new visualization.SetCurrentAction(currentVisualization));
      }

      if (currentDashboardId) {
        /**
         * Navigate to the particular dashboard if comes from home
         */
        if (action.payload.url.indexOf('dashboards') === -1) {
          this.router.navigate(['/dashboards/' + currentDashboardId]);
        }

        /**
         * Save current dashboard into the store and load visualizations
         */
        const currentDashboard = _.find(action.payload.dashboards, ['id', currentDashboardId]);

        if (currentDashboard) {
          this.store.dispatch(new dashboard.SetCurrentAction(currentDashboard.id));
        }
      } else {
        this.router.navigate(['/']);
      }

      return Observable.of(null);
    });

  @Effect()
  createDashboard$ = this.actions$
    .ofType<dashboard.CreateAction>(dashboard.DashboardActions.CREATE)
    .switchMap((action: any) => this._create(action.payload))
    .map((dashboardObject: any) => new dashboard.CreateSuccessAction(dashboardObject));
  // TODO deal with errors when dashboard creation fails

  @Effect()
  renameDashboard$ = this.actions$
    .ofType<dashboard.RenameAction>(dashboard.DashboardActions.RENAME)
    .switchMap((action: any) => this._rename(action.payload))
    .map((dashboardObject: any) => new dashboard.RenameSuccessAction(dashboardObject));

  @Effect({dispatch: false})
  dashboardCreated$ = this.actions$
    .ofType<dashboard.CreateSuccessAction>(dashboard.DashboardActions.CREATE_SUCCESS)
    .switchMap((action: any) => {
      this.router.navigate([`/dashboards/${action.payload.id}`]);
      return Observable.of(null);
    });

  @Effect()
  deleteDashboard$ = this.actions$
    .ofType<dashboard.DeleteAction>(dashboard.DashboardActions.DELETE)
    .switchMap((action: any) => this._delete(action.payload))
    .map((dashboardId: string) => new dashboard.DeleteSuccessAction(dashboardId));

  @Effect({dispatch: false})
  dashboardDeleted$ = this.actions$
    .ofType<dashboard.DeleteSuccessAction>(dashboard.DashboardActions.DELETE_SUCCESS)
    .withLatestFrom(this.store)
    .switchMap(([action, store]: [any, AppState]) => {
      const dashboardIndex = _.findIndex(store.dashboard.dashboards,
        _.find(store.dashboard.dashboards, ['id', action.payload]));

      if (dashboardIndex !== -1) {
        const dashboardToNavigate = store.dashboard.dashboards.length > 1 ? dashboardIndex === 0 ?
          store.dashboard.dashboards[1] : store.dashboard.dashboards[dashboardIndex - 1] : null;

        this.store.dispatch(new dashboard.CommitDeleteAction(action.payload));

        if (dashboardToNavigate) {
          this.router.navigate([`/dashboards/${dashboardToNavigate.id}`]);
        } else {
          this.router.navigate(['/']);
        }
      }

      return Observable.of(null);
    });

  @Effect({dispatch: false})
  route$ = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, AppState]) => {
      const currentDashboardId = state.route.state.url.split('/')[2];
      if (currentDashboardId) {
        /**
         * Save current dashboard into the store and load visualizations
         */
        const currentDashboard = _.find(state.dashboard.dashboards, ['id', currentDashboardId]);

        if (currentDashboard) {
          /**
           * Save current dashboard to local storage
           */
          localStorage.setItem('dhis2.dashboard.current.' + state.currentUser.userCredentials.username, currentDashboardId);

          /**
           * Set current dashboard in the store
           */
          this.store.dispatch(new dashboard.SetCurrentAction(currentDashboard.id));
        }
      }
      return Observable.of(null);
    });

  @Effect()
  searchItem$ = this.actions$
    .ofType<dashboard.SearchItemsAction>(dashboard.DashboardActions.SEARCH_ITEMS)
    .switchMap((action: any) => action.payload.debounceTime(400)
      .distinctUntilChanged()
      .switchMap((term: string) => this._searchItems(term)))
    .map((searchResult: any) => new dashboard.UpdateSearchResultAction(searchResult));

  @Effect()
  addDashboardItemAction$ = this.actions$
    .ofType<dashboard.AddItemAction>(dashboard.DashboardActions.ADD_ITEM)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => this._addItem(
      store.dashboard.currentDashboard,
      action.payload.id,
      action.payload.type
    ))
    .map((dashboardItems: any[]) => new dashboard.AddItemSuccessAction(dashboardItems));

  @Effect({dispatch: false})
  dashboardItemAddedAction$ = this.actions$
    .ofType<dashboard.AddItemSuccessAction>(dashboard.DashboardActions.ADD_ITEM_SUCCESS)
    .withLatestFrom(this.store)
    .switchMap(([action, state]: [any, AppState]) => {
      const currentDashboard: Dashboard = _.find(state.dashboard.dashboards, ['id', state.dashboard.currentDashboard]);

      if (currentDashboard) {
        const newDashboardItem: any = dashboardHelpers.getCheckedAddedItem(currentDashboard, action.payload);

        const initialVisualization: Visualization = visualizationHelpers.mapDashboardItemToVisualization(
          newDashboardItem, state.dashboard.currentDashboard, state.currentUser);
        this.store.dispatch(new visualization.AddOrUpdateAction({
          visualizationObject: initialVisualization,
          placementPreference: 'first'
        }));

        this.store.dispatch(new visualization.LoadFavoriteAction(initialVisualization));
      }

      return Observable.of(null);
    });

  constructor(private actions$: Actions,
              private store: Store<AppState>,
              private router: Router,
              private httpClient: HttpClientService) {
  }

  private _loadAll(): Observable<Dashboard[]> {
    return new Observable(observer => {
      this.httpClient.get(`dashboards.json?fields=id,name,publicAccess,access,externalAccess,created,lastUpdated,
      user[id,name],dashboardItems[id,type,created,lastUpdated,shape,appKey,reports[id,displayName],chart[id,displayName],
    map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],
    resources[id,displayName],users[id,displayName]]&paging=false`)
        .subscribe((dashboardResponse: any) => {
          observer.next(dashboardResponse.dashboards);
          observer.complete();
        }, dashboardError => {
          console.warn(dashboardError);
          observer.next([]);
          observer.complete();
        });
    });
  }

  private _getCurrentDashboardId(routeUrl: string, dashboards: Dashboard[], currentUserInfo: CurrentUserState) {
    let currentDashboard = routeUrl.split('/')[2];

    if (_.find(dashboards, ['id', currentDashboard])) {
      if (currentUserInfo && currentUserInfo.userCredentials) {
        localStorage.setItem('dhis2.dashboard.current.' + currentUserInfo.userCredentials.username, currentDashboard);
      }
    } else {
      if (currentUserInfo && currentUserInfo.userCredentials) {
        currentDashboard = localStorage.getItem('dhis2.dashboard.current.' + currentUserInfo.userCredentials.username);

        if (!_.find(dashboards, ['id', currentDashboard])) {
          currentDashboard = dashboards[0] ? dashboards[0].id : undefined;
        }
      } else {
        currentDashboard = dashboards[0] ? dashboards[0].id : undefined;
      }

    }
    return currentDashboard;
  }

  private _load(id) {
    return this.httpClient.get(`dashboards/${id}.json?fields=id,name,publicAccess,access,externalAccess,
    userGroupAccesses,dashboardItems[id,type,created,shape,appKey,reports[id,displayName],chart[id,displayName],
    map[id,displayName],reportTable[id,displayName],eventReport[id,displayName],eventChart[id,displayName],
    resources[id,displayName],users[id,displayName]]`);
  }

  private _create(dashboardName: any): Observable<Dashboard> {
    return Observable.create(observer => {
      this.getUniqueId()
        .subscribe((uniqueId: string) => {
          this.httpClient.post('dashboards', {
            id: uniqueId,
            name: dashboardName,
          }).subscribe(() => {
            this._load(uniqueId).subscribe((dashboardObject: any) => {
              observer.next(dashboardObject);
              observer.complete();
            }, dashboardLoadError => observer.error(dashboardLoadError));
          }, dashboardCreationError => observer.error(dashboardCreationError));
        }, uniqueIdError => observer.error(uniqueIdError));
    });
  }

  private _rename(dashboardData: { id: string, name: string }): Observable<Dashboard> {
    return new Observable(observer => {
      this.httpClient.put(`dashboards/${dashboardData.id}`, {name: dashboardData.name})
        .subscribe(() => {
          this._load(dashboardData.id).subscribe((dashboardObject: any) => {
            observer.next(dashboardObject);
            observer.complete();
          }, dashboardLoadError => observer.error(dashboardLoadError));
        }, renameError => observer.error(renameError));
    });
  }

  private _delete(dashboardId: string) {
    return new Observable(observer => {
      this.httpClient.delete(`dashboards/${dashboardId}`)
        .subscribe(() => {
          observer.next(dashboardId);
          observer.complete();
        }, error => observer.error(error));
    });
  }

  private _searchItems(searchText: string) {
    return new Observable(observer => {
      this.httpClient.get('dashboards/q/' + searchText + '.json?max=USERS&&max=MAP&max=REPORT_TABLE&max=CHART&' +
        'max=EVENT_CHART&max=EVENT_REPORT&max=RESOURCES&max=REPORTS&max=APP')
        .subscribe(searchResult => {
          observer.next(searchResult);
          observer.complete();
        }, () => {
          observer.next(null);
          observer.complete();
        });
    });
  }

  private _addItem(dashboardId, itemId, dashboardItemType) {
    return new Observable(observer => {
      this.httpClient.post(
        'dashboards/' + dashboardId +
        '/items/content?type=' + dashboardItemType +
        '&id=' + itemId, {})
        .subscribe(() => {
          this._load(dashboardId)
            .subscribe((dashboardResponse: any) => {
              observer.next(this._retrieveAddedItem(dashboardResponse.dashboardItems, dashboardItemType, itemId));
              observer.complete();
            }, () => {
              observer.next([]);
              observer.complete();
            });
        }, () => {
          observer.next([]);
          observer.complete();
        });
    });
  }

  private _retrieveAddedItem(dashboardItems, dashboardItemType, favoriteId) {
    let newItems = [];
    if (dashboardItemType[dashboardItemType.length - 1] === 'S') {
      newItems = _.clone(dashboardItems.filter(item => {
        return item.type[dashboardItemType.length - 1] === 'S'
      }));
    } else {
      for (const item of dashboardItems) {

        /**
         * Get new item for apps
         */
        if (item.type === 'APP' && dashboardItemType === 'APP') {
          newItems = [item];
          break;
        }

        const itemTypeObject = item[_.camelCase(dashboardItemType)];
        if (itemTypeObject) {
          if (itemTypeObject.id === favoriteId) {
            newItems = [item];
            break;
          }
        }
      }
    }

    return newItems;
  }


  getUniqueId(): Observable<string> {
    return new Observable(observer => {
      this.httpClient.get('system/id.json?n=1')
        .subscribe(
          response => {
            observer.next(response['codes'][0]);
            observer.complete();
          }, error => observer.error(error));
    });
  }
}
