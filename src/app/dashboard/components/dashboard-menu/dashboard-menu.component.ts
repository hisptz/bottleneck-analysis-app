import {Component, OnInit, Input} from '@angular/core';
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";
import {DashboardService} from "../../providers/dashboard.service";
@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent implements OnInit {

  public isSettingsOpen: boolean;
  constructor(
      private settingService: DashboardSettingsService,
  ) {
    this.isSettingsOpen = false;
  }

  ngOnInit() {

  }

}
