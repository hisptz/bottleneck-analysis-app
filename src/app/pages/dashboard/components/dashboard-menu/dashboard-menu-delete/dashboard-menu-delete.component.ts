import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppState} from '../../../../../store/app.reducers';
import * as dashboardActions from '../../../../../store/dashboard/dashboard.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-dashboard-menu-delete',
  templateUrl: './dashboard-menu-delete.component.html',
  styleUrls: ['./dashboard-menu-delete.component.css']
})
export class DashboardMenuDeleteComponent implements OnInit {

  @Input() dashboardId: string;
  @Input() deleting: boolean;
  @Output() onCancelDelete: EventEmitter<any> = new EventEmitter<any>();
  showDeleteDialog: boolean;
  constructor(private store: Store<AppState>) {
    this.showDeleteDialog = true;
  }

  ngOnInit() {
  }

  cancelDelete(e) {
    e.stopPropagation();
    this.onCancelDelete.emit(true);
  }

  deleteDashboard(e) {
    e.stopPropagation();
    this.store.dispatch(new dashboardActions.DeleteAction(this.dashboardId));
  }

}
