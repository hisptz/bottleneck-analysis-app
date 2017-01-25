import {Component, OnInit, Input} from '@angular/core';
import {DashboardService} from "./providers/dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {

  }

}
