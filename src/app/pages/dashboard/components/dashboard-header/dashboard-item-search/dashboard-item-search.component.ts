import { Component, OnInit } from '@angular/core';
import {AppState} from '../../../../../store/app.reducers';
import * as dashboardActions from '../../../../../store/dashboard/dashboard.actions';
import * as dashboardSelectors from '../../../../../store/dashboard/dashboard.selectors';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {DASHBOARD_TYPES, DashboardSearchItem} from '../../../../../store/dashboard/dashboard.state';

@Component({
  selector: 'app-dashboard-item-search',
  templateUrl: './dashboard-item-search.component.html',
  styleUrls: ['./dashboard-item-search.component.css']
})
export class DashboardItemSearchComponent implements OnInit {

  searchTerm: string;
  showBody: boolean;
  dashboardSearchItems$: Observable<DashboardSearchItem>;
  dashboardItemTypes: any;
  constructor(private store: Store<AppState>) {
    this.dashboardSearchItems$ = this.store.select(dashboardSelectors.getDashboardSearchItems);
    this.dashboardItemTypes = DASHBOARD_TYPES;
  }

  ngOnInit() {
  }

  search(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value;
    if (this.searchTerm.trim() !== '') {
      this.showBody = true;
      this.store.dispatch(new dashboardActions.SearchItemsAction(Observable.of(this.searchTerm)));
    } else {
      this.showBody = false;
    }
  }

  updateSearchBody(e) {
    e.stopPropagation();
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.showBody = true;
    }
  }

  toggleHeaderSelection(header, event) {
    event.stopPropagation();
    this.store.dispatch(new dashboardActions.ChangeSearchHeaderAction(
      {header: {
        ...header,
        selected: !header.selected
      }, multipleSelection: event.ctrlKey ? true : false}
      ));
  }

  addDashboardItem(dashboardItemData) {
    this.showBody = false;
    this.store.dispatch(new dashboardActions.AddItemAction(dashboardItemData));
  }

}
