import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../../providers/dashboard.service";

@Component({
  selector: 'app-dashboard-items',
  templateUrl: './dashboard-items.component.html',
  styleUrls: ['./dashboard-items.component.css']
})
export class DashboardItemsComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.dashboardService.find('tFPbgxRf1bc').subscribe(dashboard => {
      console.log(dashboard)
    })
  }

}
