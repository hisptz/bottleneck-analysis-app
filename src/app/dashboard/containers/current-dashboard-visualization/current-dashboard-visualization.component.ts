import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  State,
  getCurrentVisualizationId,
  getCurrentDashboardId,
  SetCurrentDashboardAction,
  getCurrentUser,
  getCurrentDashboardVisualizationLoading,
  getCurrentDashboardVisualizationLoaded
} from '../../../store';
import { Observable } from 'rxjs';
import { User, SystemInfo } from '../../../models';
import { getSystemInfo } from '../../../store/selectors/system-info.selectors';

@Component({
  selector: 'app-current-dashboard-visualization',
  templateUrl: './current-dashboard-visualization.component.html',
  styleUrls: ['./current-dashboard-visualization.component.scss']
})
export class CurrentDashboardVisualizationComponent implements OnInit {
  currentVisualizationId$: Observable<string>;
  currentDashboardId$: Observable<string>;
  currentUser$: Observable<User>;
  systemInfo$: Observable<SystemInfo>;
  currentDashboardVisualizationLoading$: Observable<boolean>;
  currentDashboardVisualizationLoaded$: Observable<boolean>;

  constructor(private store: Store<State>) {
    this.currentVisualizationId$ = this.store.select(getCurrentVisualizationId);
    this.currentDashboardId$ = this.store.select(getCurrentDashboardId);
    this.currentUser$ = store.select(getCurrentUser);
    this.systemInfo$ = store.select(getSystemInfo);

    this.currentDashboardVisualizationLoading$ = store.select(getCurrentDashboardVisualizationLoading);

    this.currentDashboardVisualizationLoaded$ = store.select(getCurrentDashboardVisualizationLoaded);
  }

  onToggleVisualizationFullScreen(fullScreenDetails: any) {
    this.store.dispatch(new SetCurrentDashboardAction(fullScreenDetails.dashboardId));
  }
  ngOnInit() {}
}
