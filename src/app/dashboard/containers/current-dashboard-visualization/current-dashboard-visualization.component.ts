import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  State,
  getCurrentVisualizationId,
  getCurrentDashboardId,
  SetCurrentDashboardAction
} from '../../../store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-current-dashboard-visualization',
  templateUrl: './current-dashboard-visualization.component.html',
  styleUrls: ['./current-dashboard-visualization.component.scss']
})
export class CurrentDashboardVisualizationComponent implements OnInit {
  currentVisualizationId$: Observable<string>;
  currentDashboardId$: Observable<string>;
  constructor(private store: Store<State>) {
    this.currentVisualizationId$ = this.store.select(getCurrentVisualizationId);
    this.currentDashboardId$ = this.store.select(getCurrentDashboardId);
  }

  onToggleVisualizationFullScreen(fullScreenDetails: any) {
    this.store.dispatch(
      new SetCurrentDashboardAction(fullScreenDetails.dashboardId)
    );
  }
  ngOnInit() {}
}
