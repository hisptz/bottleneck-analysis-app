import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Dashboard} from "../../interfaces/dashboard";
import {DashboardService} from "../../providers/dashboard.service";
import {PaginationInstance} from 'ng2-pagination';
import {RouterModule, Router} from "@angular/router";
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-dashboard-menu-items',
  templateUrl: './dashboard-menu-items.component.html',
  styleUrls: ['./dashboard-menu-items.component.css']
})
export class DashboardMenuItemsComponent implements OnInit {

  public isItemSearchOpen: boolean;
  public dashboardsLoading: boolean;
  public dashboardsError: boolean;
  public activeEditFormId: string;
  public dashboards: Dashboard[];
  public itemToDelete: string;
  menuOptions: Array<any>;
  updatedDashboard: string = '';
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
  };
  constructor(
     private dashboardService: DashboardService,
     private settingsService: DashboardSettingsService,
     private router: Router
  ) {
    this.isItemSearchOpen = false;
    this.dashboardsLoading = true;
    this.dashboardsError = false;
    this.activeEditFormId = '';
    this.itemToDelete = '';
    // this.menuOptions = [
    //   // {
    //   //   html: () => 'Share',
    //   //   click: (item, $event) => {
    //   //   },
    //   // },
    //   {
    //     html: (): string => 'Rename',
    //     click: (item, $event): void => {
    //       this.openEditForm(item.id)
    //     }
    //   },
    //   {
    //     html: (): string => 'Delete',
    //     click: (item, $event): void => {
    //       this.itemToDelete= item.id;
    //     }
    //   }
    // ]

  }

  ngOnInit() {
    this.dashboardService.all().subscribe(dashboards => {
      this.dashboards = dashboards;
      this.dashboardsLoading = false;
    }, error => {
      this.dashboardsLoading = false;
      this.dashboardsError = true;
    })
  }

  // public onContextMenu($event: MouseEvent, item: any): void{
  //   this.contextMenuService.show.next({
  //     actions: this.menuOptions,
  //     event: $event,
  //     item: item
  //   });
  //   $event.preventDefault();
  //   $event.stopPropagation();
  // }

  isEditFormOpen(id) {
    return this.activeEditFormId == id ? true : false;
  }

  isItemToDelete(id) {
    return this.itemToDelete == id ? true : false;
  }

  openEditForm(id) {
    this.activeEditFormId = id;
  }

  closeEditForm(event, id) {
    this.updatedDashboard = id;
    this.activeEditFormId = '';
  }

  deleteDashboard(id) {
    this.dashboardService.delete(id).subscribe(response => {
      //@todo handle notifications
      this.dashboardService.all().subscribe(dashboards => {
        if(dashboards.length == 0) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['dashboards/'+ dashboards[0].id + '/dashboard']);
        }

      })
    });
  }

}
