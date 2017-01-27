import {Component, OnInit} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute} from "@angular/router";
import {DashboardService} from "../../providers/dashboard.service";
import {Observable} from "rxjs";
import {Dashboard} from "../../interfaces/dashboard";

@Component({
  selector: 'app-dashboard-items',
  templateUrl: './dashboard-items.component.html',
  styleUrls: ['./dashboard-items.component.css']
})
export class DashboardItemsComponent implements OnInit {

  public loading: boolean;
  public hasError: boolean;
  public dashboardItems: any;
  dashboardName: Observable<string>;
  constructor(
      private dashboardItemService: DashboardItemService,
      private dashboardService: DashboardService,
      private route: ActivatedRoute
  ) {
    this.loading = true;
    this.hasError = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let dashboardId = params['id'];
      this.dashboardService.setName(null,dashboardId);
      this.dashboardName = this.dashboardService.getName();
      this.dashboardItemService.findByDashboard(dashboardId).subscribe(dashboardItems => {
        this.dashboardItems = dashboardItems;
        this.loading = false;
      })
    })
  }

}
