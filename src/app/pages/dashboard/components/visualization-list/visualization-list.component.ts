import { Component, OnInit } from '@angular/core';
import {AppState} from '../../../../store/app.reducers';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Visualization} from '../../../../store/visualization/visualization.state';
import * as visualizationSelectors from '../../../../store/visualization/visualization.selectors';
import {CurrentUserState} from '../../../../store/current-user/current-user.state';
import {getCurrentUser} from '../../../../store/current-user/current-user.selectors';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.css']
})
export class VisualizationListComponent implements OnInit {

  visualizationObjects$: Observable<Visualization[]>;
  currentUser$: Observable<CurrentUserState>;
  constructor(private store: Store<AppState>) {
    this.visualizationObjects$ = store.select(visualizationSelectors.getCurrentDashboardVisualizationObjects);
    this.currentUser$ = store.select(getCurrentUser);
  }

  ngOnInit() {
  }

}
