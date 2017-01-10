import { Component, OnInit } from '@angular/core';

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
  constructor() {
    this.isAddFormOpen = false;
    this.isSearchOpen = false;
    this.isEditFormOpen = false;
    this.isSettingsOpen = false;
    this.isItemSearchOpen = false;
  }

  ngOnInit() {
  }

}
