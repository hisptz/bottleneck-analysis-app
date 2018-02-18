import {Component, HostListener, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducers';
import * as visualizationSelectors from '../../store/visualization/visualization.selectors';
import {CurrentUserState} from '../../store/current-user/current-user.state';
import {getCurrentUser} from '../../store/current-user/current-user.selectors';
import {Observable} from 'rxjs/Observable';
import {Visualization} from '../../store/visualization/visualization.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  visualizationObjects$: Observable<Visualization[]>;
  currentUser$: Observable<CurrentUserState>;
  visualizationLoading$: Observable<boolean>;
  welcomingTitle: string;
  welcomingDescription: string;

  constructor(private store: Store<AppState>) {
    this.visualizationObjects$ = store.select(
      visualizationSelectors.getCurrentDashboardVisualizationObjects
    );
    this.currentUser$ = store.select(getCurrentUser);
    this.visualizationLoading$ = store.select(visualizationSelectors.getVisualizationLoadingState);
    this.welcomingTitle = 'Welcome to the most interactive dashboard';
    this.welcomingDescription =
      'Enjoy interactive features with support for one click switching between tables, charts and maps, changing data selections as well as layouts';
  }

  ngOnInit() {
  }

}
