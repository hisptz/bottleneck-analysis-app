import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../store/application-state';
import {Observable} from 'rxjs/Observable';
import {dashboardSearchItemsSelector} from '../../../store/selectors/dashboard-search-item.selector';
import {
  DashboardItemAddAction, DashboardItemSearchAction, DashboardSearchHeaderChangeAction,
  LoadDashboardSearchItemsAction
} from '../../../store/actions';
import {DASHBOARD_TYPES} from '../../constants/visualization';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard-item-search',
  templateUrl: './dashboard-item-search.component.html',
  styleUrls: ['./dashboard-item-search.component.css']
})
export class DashboardItemSearchComponent implements OnInit {

  searchText: string;
  searchItemName: string;
  showBody: boolean;
  dashboardItemTypes: any;
  dashboardSearchItems$: Observable<any>;
  currentDashboard: string;
  constructor(
    private store: Store<ApplicationState>,
    private route: ActivatedRoute
  ) {
    this.dashboardItemTypes = DASHBOARD_TYPES;
    this.dashboardSearchItems$ = store.select(dashboardSearchItemsSelector)
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentDashboard = params.id;
    })
  }

  search(searchText) {
    if (this.searchText.trim() !== '') {
      this.showBody = true;
      this.store.dispatch(new LoadDashboardSearchItemsAction(searchText))
    } else {
      this.showBody = false
    }
  }

  updateSearchBody() {
    if (this.searchText && this.searchText.trim() !== '') {
      this.showBody = true;
    }
  }

  toggleHeaderSelection(header, event) {
    event.stopPropagation();
    const newHeader = _.cloneDeep(header);
    newHeader.selected = !newHeader.selected;
    this.store.dispatch(new DashboardSearchHeaderChangeAction(newHeader))
  }

  addDashboardItem(dashboardItemData) {
    this.showBody = false;
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      if (apiRootUrl !== '') {
        this.store.dispatch(new DashboardItemAddAction(
          {
            apiRootUrl: apiRootUrl,
            dashboardItemData: dashboardItemData
          }
        ))
      }
    })
  }

}
