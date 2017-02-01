import { Component, OnInit } from '@angular/core';
import {DashboardSearchService} from "../../providers/dashboard-search.service";
import {Observable, Subject} from "rxjs";
import {isObject} from "util";
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute} from "@angular/router";
import {UtilitiesService} from "../../providers/utilities.service";

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
  messageCount: number;
  constructor(
    private searchService: DashboardSearchService,
    private dashboardItemService: DashboardItemService,
    private route: ActivatedRoute,
    private util: UtilitiesService
  ) {
    this.showBody = false;
    this.headers = [];
    this.messageCount = 0;
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
    if(this.headers.length > 0) {
      Object.keys(results).map(key => {
        if(isObject(results[key])) {
          let showBlockStatus = true;
          for(let header of this.headers) {
            if(header.name == key) {
              showBlockStatus = header.showBlock
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

  addDashboardItem(type, id) {
    this.showBody = false;
    let typeValue = this.isPlural(type) ? this.util.readableName(type, true) : this.util.readableName(type.slice(0,type.length-1),true)
    this.dashboardItemService.addDashboardItem(this.route.snapshot.params['id'], {type: typeValue, id: id})
    //@todo need to subscribe to show progress when adding dashboards
  }

  isPlural(type):boolean {
    //@todo find the best way to deal with plural form items
    let plural = false;
    let pluralTypes = ['users','reports','resources'];
    for (let itemType of pluralTypes) {
        if(itemType == type){
          plural = true;
          break;
        }
    }
    return plural
  }

}
