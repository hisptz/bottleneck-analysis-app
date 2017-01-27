import {Component, OnInit, Input} from '@angular/core';
import {Dashboard} from "../../interfaces/dashboard";
import {DashboardService} from "../../providers/dashboard.service";
import {PaginationInstance} from 'ng2-pagination';
import {ContextMenuService} from "angular2-contextmenu";
import {Observable} from "rxjs";
import {RouterModule, Router} from "@angular/router";

@Component({
  selector: 'app-dashboard-menu-items',
  templateUrl: './dashboard-menu-items.component.html',
  styleUrls: ['./dashboard-menu-items.component.css']
})
export class DashboardMenuItemsComponent implements OnInit {

  test: Observable<any>;
  public isItemSearchOpen: boolean;
  public dashboardsLoading: boolean;
  public dashboardsError: boolean;
  public activeEditFormId: string;
  public dashboards: Dashboard[];
  menuOptions: Array<any>;
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
  };
  constructor(
     private dashboardService: DashboardService,
     private contextMenuService: ContextMenuService,
     private router: Router
  ) {
    this.isItemSearchOpen = false;
    this.dashboardsLoading = true;
    this.dashboardsError = false;
    this.activeEditFormId = '';
    this.menuOptions = [
      // {
      //   html: () => 'Share',
      //   click: (item, $event) => {
      //   },
      // },
      {
        html: (): string => 'Rename',
        click: (item, $event): void => {
          this.openEditForm(item.id)
        }
      },
      {
        html: (): string => 'Delete',
        click: (item, $event): void => {
          this.dashboardService.delete(item.id).subscribe(response => {
            //@todo handle notifications
            this.dashboardService.all().subscribe(dashboards => {
              this.router.navigate(['dashboards/'+ dashboards[0].id + '/dashboard']);
            })
          });
        }
      }
    ]

  }

  ngOnInit() {
    this.test = this.dashboardService.all();
    this.dashboardService.all().subscribe(dashboards => {
      this.dashboards = dashboards;
      this.dashboardsLoading = false;
    }, error => {
      this.dashboardsLoading = false;
      this.dashboardsError = true;
    })
  }

  public onContextMenu($event: MouseEvent, item: any): void{
    this.contextMenuService.show.next({
      actions: this.menuOptions,
      event: $event,
      item: item
    });
    $event.preventDefault();
    $event.stopPropagation();
  }

  isEditFormOpen(id) {
    return this.activeEditFormId == id ? true : false;
  }

  openEditForm(id) {
    this.activeEditFormId = id;
  }

  closeEditForm(event) {
    this.activeEditFormId = '';
  }

}
