import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DashboardService} from "../../providers/dashboard.service";
import {Observable, Subscription, Subject, BehaviorSubject} from "rxjs";
import {Dashboard} from "../../interfaces/dashboard";
import {Http} from "@angular/http";
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";
import {DashboardSearchService} from "../../providers/dashboard-search.service";
import {UtilitiesService} from "../../providers/utilities.service";
import {isObject} from "rxjs/util/isObject";
import {CurrentUserService} from "../../../shared/providers/current-user.service";

@Component({
  selector: 'app-dashboard-items',
  templateUrl: './dashboard-items.component.html',
  styleUrls: ['./dashboard-items.component.css']
})
export class DashboardItemsComponent implements OnInit,OnDestroy,AfterViewInit {

  public loading: boolean;
  public dashboard: Dashboard;
  public hasError: boolean;
  public itemsLoaded: boolean;
  public dashboardItems: any;
  public loadingNotification: boolean;
  public notification: any;
  public isSettingsOpen: boolean;
  isCollapsed: boolean = true;
  subscription: Subscription[];
  totalItems: number;
  loadedItems: number;
  showBody; boolean;
  searchTerm$ = new Subject<string>();
  results: any;
  headers: Array<any>;
  messageCount: number;
  currentUser: any;
  constructor(
      private dashboardItemService: DashboardItemService,
      private dashboardService: DashboardService,
      private route: ActivatedRoute,
      private http: Http,
      private settingService: DashboardSettingsService,
      private router: Router,
      private searchService: DashboardSearchService,
      private util: UtilitiesService,
      private currentUserService: CurrentUserService
  ) {
    this.loading = true;
    this.hasError = false;
    this.itemsLoaded= false;
    this.loadingNotification = true;
    this.subscription = [];
    this.isSettingsOpen = false;
    this.showBody = false;
    this.headers = [];
    this.messageCount = 0;
    this.dashboardItems = [];
  }

  ngOnInit() {
    //search area
    this.searchTerm$.subscribe(terms => {
      if(terms.match(/^[mM]/)) {
        this.searchService.getMessageCount()
          .subscribe(count => {
            this.messageCount = count;
          })
      } else {
        this.messageCount = 0;
      }
    })
    this.searchTerm$.asObservable().subscribe(term => console.log(term));
    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results;
        this.headers = this.getResultHeaders(results);
        this.showBody = true;
      });
    //get notification information
    this.http.get('../../../api/me/dashboard.json')
      .map(res => res.json())
      .subscribe(
        notification => {
          this.notification = notification;
          this.loadingNotification = false;
        },
        error => {
          //@todo handle errors
          console.log(error)
        });

    this.route.params.subscribe(params => {
      //update current dashboard in local storage
      this.currentUserService.getCurrentUser()
        .subscribe(currentUser => {
          this.currentUser = currentUser;
          localStorage.setItem('dhis2.dashboard.current.' + currentUser.userCredentials.username,params['id']);
          this.loadDashboardItems(params['id'])
        }, error => console.log('Something is wrong fetching user information'));
    });
  }

  loadDashboardItems(dashboardId) {
    this.loadedItems = 0;
    this.totalItems = 0;
    this.dashboardService.find(dashboardId)
      .subscribe(
        dashboard => {
          this.dashboard = dashboard;
          this.loading = false;
        }, error => {
          this.router.navigate(['/']);
        });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.subscription.map(sub => sub.unsubscribe());
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

  addDashboardItem(type, id) {
    this.showBody = false;
    let typeValue = this.isPlural(type) ? this.util.readableName(type, true) : this.util.readableName(type.slice(0,type.length-1),true);
    let dashboardId = this.route.snapshot.params['id'];
    this.dashboardService.addDashboardItem(dashboardId, {type: typeValue, id: id})
      .subscribe(response => {
        //@todo find best way to only update added item
        this.loadDashboardItems(dashboardId)
      });
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

  calculateProgress() {
    return this.totalItems == 0 ? 0 :((this.loadedItems/this.totalItems)*100).toFixed(0)
  }


  deleteDashboardItem(dashboardItemId) {
    this.dashboardService.removeDashboardItem(dashboardItemId, this.route.snapshot.params['id']);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

}
