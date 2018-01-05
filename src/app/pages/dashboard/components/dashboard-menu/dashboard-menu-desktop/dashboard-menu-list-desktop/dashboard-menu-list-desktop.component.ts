import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DashboardMenuItem} from '../../../../../../store/dashboard/dashboard.state';
import {AppState} from '../../../../../../store/app.reducers';
import {Store} from '@ngrx/store';
import * as dashboardSelectors from '../../../../../../store/dashboard/dashboard.selectors';

@Component({
  selector: 'app-dashboard-menu-list-desktop',
  templateUrl: './dashboard-menu-list-desktop.component.html',
  styleUrls: ['./dashboard-menu-list-desktop.component.css']
})
export class DashboardMenuListDesktopComponent implements OnInit {

  @Input() dashboardSearchQuery: string;
  @Input() slideCss = '';
  dashboardMenuItems$: Observable<DashboardMenuItem[]>;
  constructor(private store: Store<AppState>) {
    this.dashboardMenuItems$ = this.store.select(dashboardSelectors.getDashboardMenuItems);
  }

  ngOnInit() {
  }

}
