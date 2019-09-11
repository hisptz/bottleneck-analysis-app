import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// root state
import { State } from '../../../store/reducers';

// selectors
import * as fromRootSelectors from '../../../store/selectors';
import * as fromDashboardSelectors from '../../store/selectors';

// actions
import { SetCurrentDashboardAction } from '../../store/actions';

// models
import { SystemInfo } from '../../../models';
import { Dashboard } from '../../models';
import { User } from '@iapps/ngx-dhis2-http-client';

@Component({
  selector: 'app-current-dashboard-visualization',
  templateUrl: './current-dashboard-visualization.component.html',
  styleUrls: ['./current-dashboard-visualization.component.scss']
})
export class CurrentDashboardVisualizationComponent implements OnInit {
  currentVisualizationId$: Observable<string>;
  currentDashboard$: Observable<Dashboard>;
  currentUser$: Observable<User>;
  systemInfo$: Observable<SystemInfo>;
  currentDashboardVisualizationLoading$: Observable<boolean>;
  currentDashboardVisualizationLoaded$: Observable<boolean>;

  constructor(private store: Store<State>) {
    this.currentVisualizationId$ = this.store.select(
      fromDashboardSelectors.getCurrentVisualizationId
    );
    this.currentDashboard$ = this.store.select(
      fromDashboardSelectors.getCurrentDashboard
    );
    this.currentUser$ = store.select(fromRootSelectors.getCurrentUser);
    this.systemInfo$ = store.select(fromRootSelectors.getSystemInfo);

    this.currentDashboardVisualizationLoading$ = store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationLoading
    );

    this.currentDashboardVisualizationLoaded$ = store.select(
      fromDashboardSelectors.getCurrentDashboardVisualizationLoaded
    );
  }

  onToggleVisualizationFullScreen(fullScreenDetails: any) {
    this.store.dispatch(
      new SetCurrentDashboardAction(fullScreenDetails.dashboardId)
    );
  }
  ngOnInit() {}
}
