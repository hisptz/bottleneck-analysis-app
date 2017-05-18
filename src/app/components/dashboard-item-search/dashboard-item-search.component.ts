import { Component, OnInit } from '@angular/core';
import {Subject, Observable} from "rxjs";
import {SearchService} from "../../services/search.service";
import {isObject} from "rxjs/util/isObject";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {currentDashboardSelector} from "../../store/selectors/current-dashboard.selector";
import {AddDashboardItemAction} from "../../store/actions";

export const DASHBOARD_TYPES = {
  users: 'USERS',
  reports: 'REPORTS',
  resources: 'RESOURCES',
  apps: 'APP',
  charts: 'CHART',
  eventCharts: 'EVENT_CHART',
  eventReports: 'EVENT_REPORT',
  maps: 'MAP',
  reportTables: 'REPORT_TABLE'

};

@Component({
  selector: 'app-dashboard-item-search',
  templateUrl: './dashboard-item-search.component.html',
  styleUrls: ['./dashboard-item-search.component.css']
})
export class DashboardItemSearchComponent implements OnInit {

  showBody: boolean = false;
  searchTerm$ = new Subject<string>();
  results: any;
  headers: Array<any> = [];
  messageCount: number = 0;
  currentDashboard: string;
  searching: boolean = false;
  dashboardItemTypes: any = DASHBOARD_TYPES;

  constructor(
    private searchService: SearchService,
    private store: Store<ApplicationState>
  ) {
    store.select(currentDashboardSelector).subscribe(dashboardId => {
      this.currentDashboard = dashboardId;
    })
  }

  ngOnInit() {
    //search area
    this.searchTerm$.asObservable().subscribe(terms => {
      this.searching = true;
      if(terms.match(/^[mM]/)) {
        this.searchService.getMessageCount()
          .subscribe(count => {
            this.messageCount = count;
          })
      } else {
        this.messageCount = 0;
      }
      this.searchService.search(this.searchTerm$)
        .subscribe(results => {
          this.searchTerm$.subscribe(terms => {
            if(terms.length > 0) {
              this.results = results;
              this.headers = this.getResultHeaders(results);
              this.showBody = true;
              this.searching = false;
            } else {
              this.showBody = false;
              this.searching = false;
              this.headers = [];
              this.results = {};
            }
          })
        });
    });
  }

  getResultHeaders(results): Array<any> {
    let headers = [];
    if(this.headers.length > 0) {
      Object.keys(results).map(key => {
        if(isObject(results[key])) {
          let showBlockStatus = true;
          for(let header of this.headers) {
            if(header.name == key) {
              showBlockStatus = header.showBlock;
              break;
            }
          }
          headers.push({name: key, count: results[key.slice(0, key.length-1) + 'Count'], showBlock: showBlockStatus})
        }
      });
    } else {
      Object.keys(results).map(key => {
        if(isObject(results[key])) {
          headers.push({name: key, count: results[key.slice(0, key.length-1) + 'Count'], showBlock: true})
        }
      });
    }
    return headers;
  }

  getIcon(name): string {
    let icon = '';
    if(name == 'users') {
      icon = 'user'
    } else if(name == 'charts' || name == 'eventCharts') {
      icon = 'line-chart'
    } else {
      icon = 'table'
    }
    return icon
  }

  toggleBlock(name, showStatus) {
    for(let header of this.headers) {
      if(header.name == name) {
        header.showBlock = !showStatus;
      }
    }
  }

  addDashboardItem(dashboardItemData) {
    this.showBody = false;
    this.store.dispatch(new AddDashboardItemAction(dashboardItemData));
  }

}
