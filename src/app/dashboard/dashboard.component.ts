import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {ActivatedRoute} from '@angular/router';
import {
  CurrentDashboardChangeAction, LoadCurrentDashboard
} from '../store/actions';
import {Observable} from 'rxjs/Observable';
import {currentDashboardNameSelector} from '../store/selectors/current-dashboard-name.selector';
import {Visualization} from './model/visualization';
import {visualizationObjectsSelector} from '../store/selectors/visualization-objects.selector';
import {Subject} from 'rxjs/Subject';
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
  dashboardId: string;
  globalFilters: Observable<any>;
  globalFilters$: Subject<any> = new Subject<any>();
  dashboardConfig: any = {
    showNotification: true,
    showSearch: true,
    showName: true
  };
  welcomingTitle: string;
  welcomingDescription: string;
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
    this.welcomingTitle = 'Welcome to the most interactive dashboard';
    this.welcomingDescription = 'Enjoy interactive features with support for one click switching between tables, charts and maps, changing data selections as well as layouts'
  }

  ngOnInit() {
    this.dragulaService.drop.subscribe(value => {
      //todo find a way to get new position for dropped item
      console.log(value);
    });
    this.route.params.subscribe(params => {
      this.dashboardId = params.id;
      this.store.dispatch(new CurrentDashboardChangeAction(params.id));

      // todo find best way to inlude favorite Options
      this.store.select(dashboardLoadedSelector)
        .first((loaded: boolean) => loaded)
        .subscribe(dashboardLoaded => this.store.dispatch(new LoadCurrentDashboard()))
    })
  }

  updateFilters(filterData) {
    this.globalFilters$.next(filterData);
  }

}
