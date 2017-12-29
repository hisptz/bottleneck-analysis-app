import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../../../../store/visualization/visualization.state';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/app.reducers';
import * as visualization from '../../../../../store/visualization/visualization.actions';

@Component({
  selector: 'app-visualization-card',
  templateUrl: './visualization-card.component.html',
  styleUrls: ['./visualization-card.component.css']
})
export class VisualizationCardComponent implements OnInit {

  @Input() visualizationObject: Visualization;

  constructor(private store: Store<AppState>) {
  }

  get currentVisualization(): string {
    return this.visualizationObject.details.currentVisualization;
  }

  ngOnInit() {
  }

  currentVisualizationChange(visualizationType: string) {
    this.store.dispatch(new visualization.VisualizationChangeAction({
      type: visualizationType,
      id: this.visualizationObject.id
    }));
  }

}
