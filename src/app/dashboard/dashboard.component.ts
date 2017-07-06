import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {ActivatedRoute} from '@angular/router';
import {
  CurrentDashboardChangeAction, GlobalFilterUpdateAction, LoadInitialVisualizationObjectAction,
  UpdateVisualizationWithFilterAction
} from '../store/actions';
import {Observable} from 'rxjs/Observable';
import {currentDashboardNameSelector} from '../store/selectors/current-dashboard-name.selector';
import {dashboardItemsSelector} from '../store/selectors/dashboard-items.selector';
import * as _ from 'lodash';
import {currentUserSelector} from '../store/selectors/current-user.selector';
import {Visualization} from './model/visualization';
import {visualizationObjectsSelector} from '../store/selectors/visualization-objects.selector';
import {apiRootUrlSelector} from '../store/selectors/api-root-url.selector';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  dashboardName$: Observable<string>;
  visualizationObjects$: Observable<Visualization[]>;
  subscription: Subscription;
  dashboardId: string;
  globalFilters: Observable<any>;
  globalFilters$: Subject<any> = new Subject<any>();
  dashboardConfig: any = {
    showNotification: false
  }
  constructor(
    private store: Store<ApplicationState>,
    private route: ActivatedRoute
  ) {
    this.dashboardName$ = store.select(currentDashboardNameSelector);
    this.visualizationObjects$ = store.select(visualizationObjectsSelector);
    this.globalFilters$.next(null);
    this.globalFilters = this.globalFilters$.asObservable();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.dashboardId = params.id;
      if (this.subscription) {
        this.subscription.unsubscribe()
      }
      this.store.dispatch(new CurrentDashboardChangeAction(params.id));
      this.store.select(currentUserSelector).subscribe(currentUser => {
        if (currentUser.id) {
          this.subscription = this.store.select(dashboardItemsSelector).subscribe((dashboardItems: any[]) => {
            if (dashboardItems.length > 0) {
              const newDashboardItems: any[] = _.clone(dashboardItems.filter(dashboardItem => { return !dashboardItem.visualizationObjectLoaded }));
              newDashboardItems.forEach(dashboardItem => {
                this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
                  if (apiRootUrl !== '') {
                    this.store.dispatch(new LoadInitialVisualizationObjectAction(
                      {
                        dashboardItem: dashboardItem,
                        dashboardId: params.id,
                        currentUser: currentUser,
                        apiRootUrl: apiRootUrl
                      })
                    )
                  }
                })
              });
            }
          });
        }
      });
    })
  }

  updateFilters(filterData) {
    this.globalFilters$.next(filterData);
  }

}
