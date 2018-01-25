import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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
  constructor() {}

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
