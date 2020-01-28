import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectionDialogData } from '../../models/selection-dialog-data.model';

@Component({
  selector: 'app-selection-filter-dialog',
  templateUrl: './selection-filter-dialog.component.html',
  styleUrls: ['./selection-filter-dialog.component.scss'],
})
export class SelectionFilterDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SelectionFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public selectionDialogData: SelectionDialogData
  ) {}

  ngOnInit() {}

  onFilterUpdate(selectionItems, action: string) {
    this.dialogRef.close({ selectionItems, action });
  }
}
