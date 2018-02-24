import {Component, Input, OnInit} from '@angular/core';
import {AppState} from '../../../../../../store/app.reducers';
import {Store} from '@ngrx/store';
import * as visualizationActions from '../../../../../../store/visualization/visualization.actions';
import * as visualizationHelpers from '../../../../../../store/visualization/helpers/index';

@Component({
  selector: 'app-visualization-resize-section',
  templateUrl: './visualization-resize-section.component.html',
  styleUrls: ['./visualization-resize-section.component.css']
})
export class VisualizationResizeSectionComponent implements OnInit {

  @Input() dashboardId: string;
  @Input() visualizationId: string;
  @Input() loaded: boolean;
  @Input() showResizeButton: boolean;
  @Input() visualizationShape: string;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
  }

  toggleFullScreen(e) {
    e.stopPropagation();
    this.store.dispatch(new visualizationActions.ToggleFullScreenAction(this.visualizationId));
  }

  resizeCard(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.store.dispatch(new visualizationActions.ResizeAction({
      visualizationId: this.visualizationId,
      shape: visualizationHelpers.getVisualizationShape(this.visualizationShape)
    }));
  }

}
