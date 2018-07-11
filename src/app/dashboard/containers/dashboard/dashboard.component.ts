import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  DashboardState,
  getAllDashboards,
  getCurrentDashboardId,
  SetCurrentDashboardAction
} from '../../store';
import { Dashboard } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  dashboards$: Observable<Dashboard[]>;
  currentDashboardId$: Observable<string>;
  constructor(private store: Store<DashboardState>) {
    this.dashboards$ = store.select(getAllDashboards);
    this.currentDashboardId$ = store.select(getCurrentDashboardId);
  }

  ngOnInit() {}

  onSetCurrenDashboardAction(dashboardId: string) {
    this.store.dispatch(new SetCurrentDashboardAction(dashboardId));
  }
}
