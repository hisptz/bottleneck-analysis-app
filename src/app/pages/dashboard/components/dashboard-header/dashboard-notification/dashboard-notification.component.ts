import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/app.reducers';
import { Observable } from 'rxjs/Observable';
import { getDashboardNotification } from '../../../../../store/dashboard/dashboard.selectors';

@Component({
  selector: 'app-dashboard-notification',
  templateUrl: './dashboard-notification.component.html',
  styleUrls: ['./dashboard-notification.component.css']
})
export class DashboardNotificationComponent implements OnInit {

  dashboardNotification$: Observable<any>;
  constructor(private store: Store<AppState>) {
    this.dashboardNotification$ = store.select(getDashboardNotification);
  }

  ngOnInit() {
  }

}
