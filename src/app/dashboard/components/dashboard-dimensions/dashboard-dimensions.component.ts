import { Component, OnInit } from '@angular/core';
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";

@Component({
  selector: 'app-dashboard-dimensions',
  templateUrl: './dashboard-dimensions.component.html',
  styleUrls: ['./dashboard-dimensions.component.css']
})
export class DashboardDimensionsComponent implements OnInit {

  constructor(private settingService: DashboardSettingsService) { }

  ngOnInit() {
  }

}
