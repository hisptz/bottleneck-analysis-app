import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/app.reducers';
import * as dashboardActions from '../../../../../store/dashboard/dashboard.actions';

@Component({
  selector: 'app-dashboard-menu-create',
  templateUrl: './dashboard-menu-create.component.html',
  styleUrls: ['./dashboard-menu-create.component.css']
})
export class DashboardMenuCreateComponent implements OnInit {

  showCreateForm: boolean;
  dashboardName: string;

  constructor(private store: Store<AppState>) {
    this.showCreateForm = false;
  }

  ngOnInit() {

  }

  get inputSize() {
    return this.dashboardName ? this.dashboardName.length > 12 ? this.dashboardName.length : 12 : 12;
  }

  get dashboardNameIsWhiteSpace() {
    return this.dashboardName ? this.dashboardName.trim().length > 1 ? false : true : true;
  }

  save(e) {
    e.stopPropagation();
    this.store.dispatch(new dashboardActions.CreateAction(this.dashboardName.trim()));
    this.toggleCreateForm();
  }

  toggleCreateForm(e?) {
    if (e) {
      e.stopPropagation();
    }

    if (this.showCreateForm) {
      this.dashboardName = '';
    }

    this.showCreateForm = !this.showCreateForm;

  }

}
