import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Dashboard, DashboardMenuItem} from '../../../../../store/dashboard/dashboard.state';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/app.reducers';
import * as fromDashboardSelectors from '../../../../../store/dashboard/dashboard.selectors';
import * as fromDashboardActions from '../../../../../store/dashboard/dashboard.actions';

@Component({
  selector: 'app-dashboard-menu-mobile',
  templateUrl: './dashboard-menu-mobile.component.html',
  styleUrls: ['./dashboard-menu-mobile.component.css']
})
export class DashboardMenuMobileComponent implements OnInit {

  showSelectionList: boolean;
  dashboardMenuList$: Observable<DashboardMenuItem[]>;
  currentDashboard$: Observable<Dashboard>;
  constructor(private store: Store<AppState>) {
    this.dashboardMenuList$ = store.select(fromDashboardSelectors.getAllDashboardMenuItems);
    this.currentDashboard$ = store.select(fromDashboardSelectors.getCurrentDashboard);
  }

  ngOnInit() {
  }

  toggleSelectionList(e) {
    e.stopPropagation();
    this.showSelectionList = !this.showSelectionList;
  }

  onSetCurrent(e, dashboardId: string) {
    e.stopPropagation();
    this.store.dispatch(new fromDashboardActions.SetCurrentAction(dashboardId));
    this.showSelectionList = false;
  }

}
