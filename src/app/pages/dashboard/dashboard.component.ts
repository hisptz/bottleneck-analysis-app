import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {dashboardNameSelector} from "../../store/selectors/dashboard-name.selector";
import {ActivatedRoute} from "@angular/router";
import {CurrentDashboardChangeAction} from "../../store/actions";
import {currentDashboardItemsSelector} from "../../store/selectors/current-dashboard-items.selector";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardName$: Observable<string>;
  dashboardItems$: Observable<any[]>;
  constructor(
    private store: Store<ApplicationState>,
    private route: ActivatedRoute
  ) {
     this.dashboardName$ = store.select(dashboardNameSelector);
     this.dashboardItems$ = store.select(currentDashboardItemsSelector);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.store.dispatch(new CurrentDashboardChangeAction(params['id']));
    })
  }

}
