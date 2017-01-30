import { Component, OnInit } from '@angular/core';
import {DashboardSearchService} from "../../providers/dashboard-search.service";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-dashboard-item-search',
  templateUrl: './dashboard-item-search.component.html',
  styleUrls: ['./dashboard-item-search.component.css']
})
export class DashboardItemSearchComponent implements OnInit {

  showBody; boolean;
  searchTerm$ = new Subject<string>();
  results: any;
  headers: Array<any>;
  constructor(private searchService: DashboardSearchService) {
    this.showBody = false;
  }

  ngOnInit() {

    // this.searchService.getMessageCount().subscribe(count => {
    //   console.log(count)
    // });
    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results;
        this.headers = this.getResultHeaders(results);
        this.showBody = true;
      });
  }

  getResultHeaders(results): Array<any> {
    let headers = [];
    if(results.hasOwnProperty('users')) {
      headers.push({name: 'users', count: results.userCount, showBlock: true})
    }
    if(results.hasOwnProperty('charts')) {
      headers.push({name: 'charts', count: results.chartCount, showBlock: true})
    }
    if(results.hasOwnProperty('maps')) {
      headers.push({name: 'maps', count: results.mapCount, showBlock: true})
    }
    if(results.hasOwnProperty('reportTables')) {
      headers.push({name: 'reportTables', count: results.reportTableCount, showBlock: true})
    }
    if(results.hasOwnProperty('reports')) {
      headers.push({name: 'reports', count: results.reportCount, showBlock: true})
    }
    if(results.hasOwnProperty('resources')) {
      headers.push({name: 'resources', count: results.resourceCount, showBlock: true})
    }
    if(results.hasOwnProperty('eventCharts')) {
      headers.push({name: 'eventCharts', count: results.eventChartCount, showBlock: true})
    }
    if(results.hasOwnProperty('eventReports')) {
      headers.push({name: 'eventReports', count: results.eventReportCount, showBlock: true})
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

}
