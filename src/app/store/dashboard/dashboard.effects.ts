import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Dashboard} from './dashboard.state';
import {Actions, Effect} from '@ngrx/effects';
import {HttpClientService} from '../../services/http-client.service';
import * as dashboard from './dashboard.actions';
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

  @Effect({dispatch: false})
  dashboardCreated$ = this.actions$
    .ofType<dashboard.CreateSuccessAction>(dashboard.DashboardActions.CREATE_SUCCESS)
    .switchMap((action: any) => {
      this.router.navigate([`/dashboards/${action.payload.id}`]);
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
