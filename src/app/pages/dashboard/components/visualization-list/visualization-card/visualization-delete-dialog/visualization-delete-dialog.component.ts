import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Output() onCloseDeleteDialog: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  cancelDelete(e) {
    e.stopPropagation();
    this.onCloseDeleteDialog.emit(true);
  }

  delete(e) {
    e.stopPropagation();
    this.onDelete.emit(true);
  }
}
