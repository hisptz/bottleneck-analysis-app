import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-delete-dialog',
  templateUrl: './dashboard-delete-dialog.component.html',
  styleUrls: ['./dashboard-delete-dialog.component.scss']
})
export class DashboardDeleteDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public name: any) {}

  ngOnInit() {}
}
