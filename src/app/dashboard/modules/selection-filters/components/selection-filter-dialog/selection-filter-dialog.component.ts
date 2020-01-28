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
    const {
      userAccesses,
      userGroupAccesses,
      publicAccess,
    } = this.selectionDialogData;
    this.dialogRef.close({
      sharingDetails: { userAccesses, userGroupAccesses, publicAccess },
      selectionItems,
      bottleneckPeriodType: this.selectionDialogData.bottleneckPeriodType,
      action,
    });
  }
  onUpdateSharingDetails(sharingDetails: any) {
    this.selectionDialogData = {
      ...this.selectionDialogData,
      ...sharingDetails,
    };
  }

  onUpdateInterventionDetails(interventionDetails: any) {
    this.selectionDialogData = {
      ...this.selectionDialogData,
      ...interventionDetails,
    };
  }
}
