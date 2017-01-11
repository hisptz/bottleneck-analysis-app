import { Component, OnInit } from '@angular/core';
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent implements OnInit {

  public isAddFormOpen : boolean;
  public isEditFormOpen: boolean;
  public isSearchOpen: boolean;
  public isSettingsOpen: boolean;
  public isItemSearchOpen: boolean;
  constructor(private settingService: DashboardSettingsService) {
    this.isAddFormOpen = false;
    this.isSearchOpen = false;
    this.isEditFormOpen = false;
    this.isSettingsOpen = false;
    this.isItemSearchOpen = false;
  }

  ngOnInit() {
  }

}
