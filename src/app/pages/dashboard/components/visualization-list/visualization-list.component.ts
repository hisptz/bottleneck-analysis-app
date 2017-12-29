import { Component, OnInit } from '@angular/core';
import {AppState} from '../../../../store/app.reducers';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Visualization} from '../../../../store/visualization/visualization.state';
import * as visualizationSelectors from '../../../../store/visualization/visualization.selectors';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.css']
})
export class VisualizationListComponent implements OnInit {

  visualizationObjects$: Observable<Visualization[]>;
  constructor(private store: Store<AppState>) {
    this.visualizationObjects$ = store.select(visualizationSelectors.getCurrentDashboardVisualizationObjects);
  }

  ngOnInit() {
  }

}
