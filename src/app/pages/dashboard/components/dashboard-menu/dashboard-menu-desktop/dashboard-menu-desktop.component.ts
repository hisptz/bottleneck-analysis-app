import { Component, OnInit } from '@angular/core';
import * as dashboard from '../../../../../store/dashboard/dashboard.actions';
import * as dashboardSelectors from '../../../../../store/dashboard/dashboard.selectors';
import {AppState} from '../../../../../store/app.reducers';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard-menu-desktop',
  templateUrl: './dashboard-menu-desktop.component.html',
  styleUrls: ['./dashboard-menu-desktop.component.css']
})
export class DashboardMenuDesktopComponent implements OnInit {

  currentDashboardPage$: Observable<number>;
  dashboardPages$: Observable<number>;
  constructor(private store: Store<AppState>) {
    this.currentDashboardPage$ = store.select(dashboardSelectors.getCurrentDashboardPage);
    this.dashboardPages$ = store.select(dashboardSelectors.getDashboardPages);
  }

  ngOnInit() {
  }

  getPreviousPage(e) {
    e.stopPropagation();
    this.store.dispatch(new dashboard.ChangeCurrentPageAction(-1));
  }

  getNextPage(e) {
    e.stopPropagation();
    this.store.dispatch(new dashboard.ChangeCurrentPageAction(1));
  }

}
