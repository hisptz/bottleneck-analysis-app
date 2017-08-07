import {Component, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {DashboardMenuVm} from '../../model/dashboard-menu-vm';
import {dashboardMenuItemsSelector} from '../../../store/selectors/dashboard-menu-items.selector';
import {PaginationInstance} from 'ng2-pagination';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {DeleteDashboardAction, HideDashboardMenuNotificationIcon} from '../../../store/actions';
import {dashboardPaginationConfigurationSelector} from '../../../store/selectors/dashboard-pagination-configuration.selector';
import * as _ from 'lodash';

export const INITIAL_PAGING_CONFIG: PaginationInstance = {
  itemsPerPage: 8,
  currentPage: 0
}

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent implements OnInit {

  showCreateDashboardForm: boolean = false;
  showDashboardSearch: boolean = false;
  dashboardMenuObject$: Observable<any>;
  dashboardName: string = '';
  currentRightClicked: string = '';
  currentDashboardGroup: string = '';
  activeEditFormId: string = '';
  itemToDelete: string = '';
  config$: Observable<PaginationInstance>;
  private _showFilter: any;
  showDataFilter: boolean;
  showPeriodFilter: boolean;
  showOrgUnitFilter: boolean;
  private _config: PaginationInstance;
  menuConfig: any = {
    showDashboardCreateButton: false,
    showPaginationCounter: true,
    showPaginationButtons: true,
    showMaintenanceOptions: true,
    showFilter: false
  };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.organizeMenu(event.target.innerWidth);
  }

  @Output() onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  constructor(private store: Store<ApplicationState>) {
    this.dashboardMenuObject$ = store.select(dashboardMenuItemsSelector);
    this.config$ = store.select(dashboardPaginationConfigurationSelector);
    this._showFilter = {
      orgUnit: {
        enabled: true,
        shown: false
      },
      data:  {
        enabled: true,
        shown: false
      },

      period:  {
        enabled: true,
        shown: false
      },
      settings: {
        enabled: false,
        shown: false
      }
    };
  }


  get showFilter(): any {
    return this._showFilter;
  }

  set showFilter(value: any) {
    this._showFilter = value;
  }

  ngOnInit() {
    this.config$.subscribe(config => {
      this._config = config;
      if (config) {
        this.organizeMenu(window.innerWidth)
      }
    })
  }

  openEditForm(id) {
    this.currentRightClicked = '';
    this.organizeMenu(window.innerWidth, true);
    if (this.menuConfig.showMaintenanceOptions) {
      this.activeEditFormId = id;
    }
  }

  closeEditForm() {
    this.activeEditFormId = '';
    this.organizeMenu(window.innerWidth);
  }


  get config(): PaginationInstance {
    return this._config;
  }

  set config(value: PaginationInstance) {
    this._config = value;
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
    this.itemToDelete = '';
    this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
      this.store.dispatch(new DeleteDashboardAction({apiRootUrl: apiRootUrl, id: id}))
    })
  }

  toggleDashboardGroup(groupName) {
    if (this.currentDashboardGroup === groupName) {
      this.currentDashboardGroup = ''
    } else {
      this.currentDashboardGroup = groupName;
    }
  }

  updateFilters(filterValues) {
    this.onFilterUpdate.emit(filterValues);
    this.toggleFilter();
  }


  organizeMenu(width: number, forceReduce: boolean = false) {

    const filtersShown = [this._showFilter.orgUnit.shown, this._showFilter.data.shown, this._showFilter.period.shown].filter(status => { return status });
    const additionalWidth: number = filtersShown.length > 0 || this.showDashboardSearch || forceReduce ? 800 : 600;
    const approximatedItemsPerPage: number = (width - additionalWidth) / 100;

    if (approximatedItemsPerPage >= 1 && approximatedItemsPerPage <= 8) {
      this._config.itemsPerPage = parseInt(approximatedItemsPerPage.toFixed(0));
    } else if (approximatedItemsPerPage < 1) {
      this._config.itemsPerPage = 1;
    }
  }

  toggleDashboardMenuSearch() {
    this.showDashboardSearch = !this.showDashboardSearch;

    /**
     * Auto focus dashboard search on open
     */


    if (this.showDashboardSearch) {
      setTimeout(() => {
        document.getElementById('dashboard_menu_search').focus();
      }, 10);
    }
    this.dashboardName = '';
    this.organizeMenu(window.innerWidth);
  }

  toggleFilter() {
    this._showFilter.orgUnit.shown = !this._showFilter.orgUnit.shown;
    this._showFilter.data.shown = !this._showFilter.data.shown;
    this._showFilter.period.shown = !this._showFilter.period.shown;
    this._showFilter.settings.shown = !this._showFilter.settings.shown;
    this.organizeMenu(window.innerWidth);
  }

  hideDashboardNotificationIcon(dashboardMneuItem) {
    this.store.dispatch(new HideDashboardMenuNotificationIcon(dashboardMneuItem));
  }

  toggleCreateDashboardForm() {
    this.showCreateDashboardForm = !this.showCreateDashboardForm;

    if (this.showCreateDashboardForm) {
      this.organizeMenu(window.innerWidth, true);
    } else {
      this.organizeMenu(window.innerWidth);
    }
  }

}
