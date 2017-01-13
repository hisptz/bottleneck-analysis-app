import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DashboardService} from "../../providers/dashboard.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard-landing',
  templateUrl: './dashboard-landing.component.html',
  styleUrls: ['./dashboard-landing.component.css']
})
export class DashboardLandingComponent implements OnInit {

  hasError: boolean;
  constructor(
      private dashboardService: DashboardService,
      private router: Router
  ) {
    this.hasError = false;
  }

  ngOnInit() {
    this.dashboardService.all().subscribe(dashboards => {
      this.router.navigate(['dashboards/tFPbgxRf1bc/dashboard']);
    }, error => {
      this.hasError = true;
    })
  }

}
