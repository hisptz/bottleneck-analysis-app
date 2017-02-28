import {Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import {Dashboard} from "../../interfaces/dashboard";
import {DashboardService} from "../../providers/dashboard.service";
import {PaginationInstance} from 'ng2-pagination';
import {RouterModule, Router, ActivatedRoute} from "@angular/router";
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-dashboard-menu-items',
  templateUrl: './dashboard-menu-items.component.html',
  styleUrls: ['./dashboard-menu-items.component.css']
})
export class DashboardMenuItemsComponent implements OnInit, AfterViewInit {

  public isItemSearchOpen: boolean;
  public dashboardsLoading: boolean;
  public dashboardsError: boolean;
  public activeEditFormId: string;
  public dashboards: Dashboard[];
  public itemToDelete: string;
  menuOptions: Array<any>;
  menuSearch: boolean = false;
  updatedDashboard: string = '';
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 8,
    currentPage: 1
  };
  constructor(
     private dashboardService: DashboardService,
     private settingsService: DashboardSettingsService,
     private router: Router,
     private route: ActivatedRoute
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
      this.config.itemsPerPage = dashboards.length <= 8 ? dashboards.length : 8;
      this.config.currentPage = this.getCurrentPage(this.dashboards,this.route.snapshot.params['id'],this.config.itemsPerPage);
      this.dashboardsLoading = false;
    }, error => {
      this.dashboardsLoading = false;
      this.dashboardsError = true;
    })

  }
  ngAfterViewInit() {
    // this.route.params.subscribe(params => {
    //   this.config.currentPage = this.getCurrentPage(this.dashboards,params['id'],this.config.itemsPerPage);
    //   console.log(this.config.currentPage)
    // })
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

  getCurrentPage(dashboards: Dashboard[],  dashboardid: string, itemsPerPage: number) {
    let dashboardIndex: number = 0;
    let dashboardCount: number = dashboards.length;
    dashboards.forEach((value, index) => {
      if(value.id == dashboardid) {
        dashboardIndex = index + 1;
      }
    });

    let pageNumber: number = dashboardCount/itemsPerPage-1 + dashboardCount%itemsPerPage;
    pageNumber.toFixed(0);
    //create range
    let ranges = [];
    let pageCount: number = 1;
    let j: number = itemsPerPage;
    for(let i: number =1; i <= itemsPerPage*pageNumber; i += itemsPerPage) {
      ranges.push({min: i, max: j, page: pageCount});
      j += itemsPerPage;
      pageCount++;
    }

    //find current page based on current dashboard
    let currentPage: number;
    for(let range of ranges) {
      if(dashboardIndex >= range.min && dashboardIndex <= range.max) {
        currentPage = range.page;
        break;
      }
    }

    return currentPage;
  }

  updateCurrentPage(dashboardId) {
    console.log(dashboardId)
    this.config.currentPage = this.getCurrentPage(this.dashboards,dashboardId,this.config.itemsPerPage);
    console.log(this.config.currentPage)
  }

}
