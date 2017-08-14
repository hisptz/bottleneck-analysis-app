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
import {favoriteOptionsSelector} from '../store/selectors/favorite-options.selector';
import {dashboardLoadedSelector} from '../store/selectors/dashboard-loaded.selector';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  dashboardName$: Observable<string>;
  visualizationObjects$: Observable<Visualization[]>;
  dashboardLoaded$: Observable<boolean>;
  subscription: Subscription;
  dashboardId: string;
  globalFilters: Observable<any>;
  globalFilters$: Subject<any> = new Subject<any>();
  dashboardConfig: any = {
    showNotification: true,
    showSearch: true,
    showName: true
  };
  private _welcomingTitle: string;
  private _welcomingDescription: string;
  constructor(
    private store: Store<ApplicationState>,
    private route: ActivatedRoute,
    private dragulaService: DragulaService
  ) {
    this.dashboardName$ = store.select(currentDashboardNameSelector);
    this.visualizationObjects$ = store.select(visualizationObjectsSelector);
    this.dashboardLoaded$ = store.select(dashboardLoadedSelector);
    this.globalFilters$.next(null);
    this.globalFilters = this.globalFilters$.asObservable();
    this._welcomingTitle = 'Welcome to Interactive dashboard';
    this. _welcomingDescription = 'Enjoy interactive dashboard by switching,filtering and changing layout to different visualization <br> <b>Search and add dashboard now!</b>'
  }


  get welcomingTitle(): string {
    return this._welcomingTitle;
  }

  set welcomingTitle(value: string) {
    this._welcomingTitle = value;
  }

  get welcomingDescription(): string {
    return this._welcomingDescription;
  }

  set welcomingDescription(value: string) {
    this._welcomingDescription = value;
  }

  ngOnInit() {
    this.dragulaService.drop.subscribe(value => {
      //todo find a way to get new position for dropped item
      console.log(value);
    });
    this.route.params.subscribe(params => {
      this.dashboardId = params.id;
      if (this.subscription) {
        this.subscription.unsubscribe()
      }

      // todo find best way to inlude favorite Options
      this.store.select(dashboardLoadedSelector).subscribe(dashboardLoaded => {
        if (dashboardLoaded) {
          this.store.dispatch(new CurrentDashboardChangeAction(params.id));
          this.store.select(currentUserSelector).subscribe(currentUser => {
            if (currentUser.id) {
              this.subscription = this.store.select(dashboardItemsSelector).subscribe((dashboardItems: any[]) => {
                if (dashboardItems.length > 0) {
                  const newDashboardItems: any[] = dashboardItems.filter(dashboardItem => {
                    return !dashboardItem.visualizationObjectLoaded
                  });
                  newDashboardItems.forEach(dashboardItem => {
                    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
                      if (apiRootUrl !== '') {
                        this.store.dispatch(new LoadInitialVisualizationObjectAction(
                          {
                            dashboardItem: dashboardItem,
                            favoriteOptions: [],
                            dashboardId: params.id,
                            currentUser: currentUser,
                            apiRootUrl: apiRootUrl,
                            isNew: dashboardItem.isNew
                          })
                        )
                      }
                    })
                  });
                }
              });
            }
          });
        }
      })
    })
  }

  updateFilters(filterData) {
    this.globalFilters$.next(filterData);
  }

}
