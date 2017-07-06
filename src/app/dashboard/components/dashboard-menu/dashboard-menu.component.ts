import { Component, OnInit } from '@angular/core';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {DashboardMenuVm} from '../../model/dashboard-menu-vm';
import {dashboardMenuItemsSelector} from '../../../store/selectors/dashboard-menu-items.selector';
import {PaginationInstance} from 'ng2-pagination';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {DeleteDashboardAction} from '../../../store/actions';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent implements OnInit {

  showCreateDashboardForm: boolean = false;
  showDashboardSearch: boolean = false;
  dashboardMenuItems$: Observable<DashboardMenuVm[]>;
  dashboardName: string = '';
  currentRightClicked: string = '';
  activeEditFormId: string = '';
  itemToDelete: string = '';
  config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 8,
    currentPage: 1
  };
  menuConfig: any = {
    showDashboardCreateButton: false,
    showPaginationCounter: true,
    showPaginationButtons: true,
    showMaintenanceOptions: false
  }
  constructor(private store: Store<ApplicationState>) {
    this.dashboardMenuItems$ = store.select(dashboardMenuItemsSelector)
  }

  ngOnInit() {
  }

  openEditForm(id) {
    this.currentRightClicked = '';
    if (this.menuConfig.showMaintenanceOptions) {
      this.activeEditFormId = id;
    }
  }

  openDeleteForm(id) {
    this.currentRightClicked = '';
    this.itemToDelete = id;
  }

  openShareBlock() {
    this.currentRightClicked = '';
  }

  showOptions(dashboardId) {
    if (!this.menuConfig.showMaintenanceOptions) {
      return true;
    }
    this.currentRightClicked = dashboardId;
    return false;
  }

  deleteDashboard(id) {
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      this.store.dispatch(new DeleteDashboardAction({apiRootUrl: apiRootUrl, id: id}))
    })
  }

}
