import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../../store/app.reducers';
import * as dashboardActions from '../../../../../../store/dashboard/dashboard.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-menu-item-desktop',
  templateUrl: './dashboard-menu-item-desktop.component.html',
  styleUrls: ['./dashboard-menu-item-desktop.component.css']
})
export class DashboardMenuItemDesktopComponent implements OnInit {

  @Input() dashboardMenuItem: any;
  showEditForm: boolean;
  showDashboardItemDropdown: boolean;
  showDeleteBlock: boolean;
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.showEditForm = false;
    this.showDashboardItemDropdown = false;
    this.showDeleteBlock = false;
  }

  get showName() {
    return this.dashboardMenuItem.details.showName && !this.showEditForm && !this.showDeleteBlock;
  }

  ngOnInit() {
  }

  toggleEditForm(e?) {

    if (e) {
      e.stopPropagation();
    }

    this.showEditForm = !this.showEditForm;
    this.showDashboardItemDropdown = false;
  }

  showDropdown(e) {
    e.stopPropagation();
    this.showDashboardItemDropdown = true;
    return false;
  }

  toggleDeleteForm(e?) {

    if (e) {
      e.stopPropagation();
    }

    this.showDeleteBlock = !this.showDeleteBlock;
    this.showDashboardItemDropdown = false;
  }

  openShareBlock(e) {
    e.stopPropagation();
  }

  hideDashboardNotificationIcon() {
    if (this.dashboardMenuItem.details.showIcon) {
      this.store.dispatch(new dashboardActions.HideMenuNotificationIconAction(this.dashboardMenuItem));
    }
  }
}
