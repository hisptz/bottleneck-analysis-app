import {Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute} from "@angular/router";
import {DashboardService} from "../../providers/dashboard.service";
import {Observable, Subscription} from "rxjs";
import {Dashboard} from "../../interfaces/dashboard";
import {Http} from "@angular/http";
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";

@Component({
  selector: 'app-dashboard-items',
  templateUrl: './dashboard-items.component.html',
  styleUrls: ['./dashboard-items.component.css']
})
export class DashboardItemsComponent implements OnInit,OnDestroy,AfterViewInit {

  public loading: boolean;
  public hasError: boolean;
  public itemsLoaded: boolean;
  public dashboardItems: any;
  public loadingNotification: boolean;
  public notification: any;
  public isSettingsOpen: boolean;
  isCollapsed: boolean = true;
  dashboardName: string;
  subscription: Subscription[];
  totalItems: number;
  loadedItems: number;
  constructor(
      private dashboardItemService: DashboardItemService,
      private dashboardService: DashboardService,
      private route: ActivatedRoute,
      private http: Http,
      private settingService: DashboardSettingsService
  ) {
    this.loading = true;
    this.hasError = false;
    this.itemsLoaded= false;
    this.loadingNotification = true;
    this.subscription = [];
    this.isSettingsOpen = false;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
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
      this.loadedItems = 0;
      this.totalItems = 0;
      this.dashboardItems = [];
      this.dashboardService.find(this.route.snapshot.params['id'])
        .subscribe(
          dashboard => {
            this.dashboardName = dashboard.name;
            this.totalItems = dashboard.dashboardItems.length;
            this.loading = this.totalItems == 0 ? false : true;
            dashboard.dashboardItems.map(dashboardItem => {
              this.subscription.push(
                this.dashboardItemService.find(dashboardItem.id, dashboardItem.type)
                  .subscribe(
                    item => {
                      this.loadedItems += 1;
                      this.dashboardItems.push(item);
                      this.loading = this.loadedItems == this.totalItems ? false : true;
                      this.itemsLoaded = true;
                    }, error => {
                      //@todo handle error
                      console.log(error)
                    })
              )
            })
          }, error => {
            //@todo handle error
          });
    });
  }

  ngOnDestroy() {
    this.subscription.map(sub => sub.unsubscribe());
  }

  calculateProgress() {
    return this.totalItems == 0 ? 0 :((this.loadedItems/this.totalItems)*100).toFixed(0)
  }


  reload(dashboardItemId) {
    this.dashboardService.removeDashboardItem(dashboardItemId, this.route.snapshot.params['id']);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

}
