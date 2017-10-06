import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {LoadDashboardNotificationAction} from '../../../store/actions';
import {dashboardNotificationSelector} from '../../../store/selectors/dashboard-notification.selector';
import {interpretationLinkSelector} from '../../../store/selectors/interpretation-link.selector';

@Component({
  selector: 'app-dashboard-notification-area',
  templateUrl: './dashboard-notification-area.component.html',
  styleUrls: ['./dashboard-notification-area.component.css']
})
export class DashboardNotificationAreaComponent implements OnInit {

  notification$: Observable<any>;
  interpretationLink$: Observable<string>;
  constructor(
    private store: Store<ApplicationState>
  ) {
    this.notification$ = store.select(dashboardNotificationSelector);
    this.interpretationLink$ = store.select(interpretationLinkSelector);
  }

  ngOnInit() {
    this.loadNotification();
    Observable.timer(60000).first().subscribe(() => this.loadNotification());
  }

  loadNotification() {
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      this.store.dispatch(new LoadDashboardNotificationAction(apiRootUrl))
    })
  }

}
