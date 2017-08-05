import {Component, Input, OnInit} from '@angular/core';
import {DashboardMenuVm} from '../../model/dashboard-menu-vm';

@Component({
  selector: 'app-dashboard-menu-item',
  templateUrl: './dashboard-menu-item.component.html',
  styleUrls: ['./dashboard-menu-item.component.css']
})
export class DashboardMenuItemComponent implements OnInit {

  @Input() dashboardMenuItem: DashboardMenuVm;
  constructor() { }

  ngOnInit() {
    // console.log(this.dashboardMenuItem)
  }

}
