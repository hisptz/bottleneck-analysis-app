import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {dashboardMenuItemsSelector} from "../../store/selectors/dashboard-menu-items.selector";

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
  constructor(store: Store<ApplicationState>) {
    this.dashboardMenuItems$ = store.select(dashboardMenuItemsSelector)

  }

  ngOnInit() {
  }

}
