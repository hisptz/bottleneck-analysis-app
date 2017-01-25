import {Component, OnInit} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute} from "@angular/router";
import {DashboardService} from "../../providers/dashboard.service";

@Component({
  selector: 'app-dashboard-items',
  templateUrl: './dashboard-items.component.html',
  styleUrls: ['./dashboard-items.component.css']
})
export class DashboardItemsComponent implements OnInit {

  public loading: boolean;
  public hasError: boolean;
  public dashboardItems: any;
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
      //set dashboard name
      this.dashboardService.find(dashboardId).subscribe(dashboard => {
        this.dashboardService.setDashboardName(dashboard.name);
      });
      //get dashboard items
      this.dashboardItemService.findByDashboard(dashboardId).subscribe(dashboardItems => {
        this.dashboardItems = dashboardItems;
        this.loading = false;
      })
    })
  }

}
