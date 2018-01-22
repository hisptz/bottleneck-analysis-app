import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../store/app.reducers';
import * as visualizationActions from '../../../../../../store/visualization/visualization.actions';

@Component({
  selector: 'app-visualization-delete-dialog',
  templateUrl: './visualization-delete-dialog.component.html',
  styleUrls: ['./visualization-delete-dialog.component.css']
})
export class VisualizationDeleteDialogComponent implements OnInit {
  @Input() visualizationId: string;
  @Input() dashboardId: string;
  @Input() deleting: boolean;
  @Input() deleteFail: boolean;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  cancelDelete(e) {
    e.stopPropagation();
    this.store.dispatch(
      new visualizationActions.ToggleDeleteDialogAction(this.visualizationId)
    );
  }

  onDelete(e) {
    e.stopPropagation();
    this.store.dispatch(
      new visualizationActions.DeleteAction({
        dashboardId: this.dashboardId,
        visualizationId: this.visualizationId
      })
    );
  }
}
