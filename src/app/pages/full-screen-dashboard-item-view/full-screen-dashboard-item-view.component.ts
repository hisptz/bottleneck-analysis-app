import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppState} from '../../store/app.reducers';
import {Store} from '@ngrx/store';
import * as dashboardSelectors from '../../store/dashboard/dashboard.selectors';
import * as visualizationSelectors from '../../store/visualization/visualization.selectors';
import * as visualizationActions from '../../store/visualization/visualization.actions';
import {Dashboard} from '../../store/dashboard/dashboard.state';
import {Observable} from 'rxjs/Observable';
import {Visualization} from '../../store/visualization/visualization.state';

@Component({
  selector: 'app-full-screen-dashboard-item-view',
  templateUrl: './full-screen-dashboard-item-view.component.html',
  styleUrls: ['./full-screen-dashboard-item-view.component.css']
})
export class FullScreenDashboardItemViewComponent implements OnInit {

  currentVisualizationObject$: Observable<Visualization>;
  constructor(private router: Router,
              private store: Store<AppState>) {
    this.currentVisualizationObject$ = this.store.select(visualizationSelectors.getCurrentVisualizationObject);
  }

  ngOnInit() {
  }

  closeDashboardItem(e) {
    e.stopPropagation();
    this.store.dispatch(new visualizationActions.UnSetCurrentAction());
    this.store.select(dashboardSelectors.getCurrentDashboard)
      .take(1)
      .subscribe((currentDashboard: Dashboard) => {
        this.router.navigate([`/dashboards/${currentDashboard.id}`]);
      });
  }

}
