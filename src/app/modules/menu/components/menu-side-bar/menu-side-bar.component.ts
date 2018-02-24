import {Component, Input, OnInit} from '@angular/core';

import * as fromServices from '../../services';
import * as fromConstants from '../../constants';

@Component({
  selector: 'app-menu-side-bar',
  templateUrl: './menu-side-bar.component.html',
  styleUrls: ['./menu-side-bar.component.css']
})
export class MenuSideBarComponent implements OnInit {
  @Input() rootUrl: string;
  showProfile: boolean;
  currentUser: any;
  loadingUser: boolean;
  profileMenus: any[];
  apps: any[];
  originalApps: any[];
  loadingModules: boolean;
  filteredApp: string;
  showSidebarApps: boolean;

  constructor(private menuService: fromServices.MenuService) {
    this.showProfile = false;
    this.rootUrl = '../../../';
    this.loadingUser = true;
    this.apps = [];
    this.originalApps = [];
    this.loadingModules = true;
    this.profileMenus = fromConstants.PROFILE_MENUS;
    this.filteredApp = '';
    this.showSidebarApps = false;
  }

  ngOnInit() {
    this.menuService.getUserInfo(this.rootUrl).subscribe((profile: any) => {
      if (profile) {
        this.currentUser = {
          name: profile.displayName,
          email: profile.email
        };
      }

      this.loadingUser = false;
    });

    this.menuService
      .getMenuModules(this.rootUrl)
      .subscribe((menuModules: any) => {
        if (menuModules !== null) {
          this.loadingModules = false;
          this.originalApps = [...menuModules];
          this.apps = this._prepareMenuModules();
        }
      });
  }

  private _prepareMenuModules() {
    return this.filteredApp === ''
      ? this.originalApps.filter((menu: any) => {
        return !menu.onlyShowOnSearch;
      })
      : this.originalApps;
  }

  toggleSidebarMenus(e) {
    e.stopPropagation();
    this.showSidebarApps = !this.showSidebarApps;
  }

  updateMenuModules() {
    this.apps = this._prepareMenuModules();
  }

}
