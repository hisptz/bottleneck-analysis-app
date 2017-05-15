import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {dashboardMenuItemsSelector} from "../../store/selectors/dashboard-menu-items.selector";
import {currentCreatedDashboardSelector} from "../../store/selectors/current-created-dashboard.selector";
import {DeleteDashboardAction} from "../../store/actions";

export interface DashboardMenusItem {
  id: string;
  name: string;
}
@Component({
  selector: 'app-dashboard-menu-items',
  templateUrl: './dashboard-menu-items.component.html',
  styleUrls: ['./dashboard-menu-items.component.css']
})
export class DashboardMenuItemsComponent implements OnInit {

  dashboardMenuItems$: Observable<DashboardMenusItem[]>;
  currentCreatedDashboard$: Observable<string>;
  currentRightClicked: string = null;
  itemToDelete: string = null;
  deletingItem: boolean = false;
  constructor(private store: Store<ApplicationState>) {
    this.dashboardMenuItems$ = store.select(dashboardMenuItemsSelector);
    this.currentCreatedDashboard$ = store.select(currentCreatedDashboardSelector)

  }

  ngOnInit() {
  }

  showOptions(dashboardId) {
    this.currentRightClicked = dashboardId;
    return false;

  }

  openDeleteForm(id) {
    this.deletingItem = false;
    this.currentRightClicked = null;
    this.itemToDelete = id;
  }

  deleteDashboard(id) {
    this.deletingItem = true;
    this.store.dispatch(new DeleteDashboardAction(id))
  }



}
