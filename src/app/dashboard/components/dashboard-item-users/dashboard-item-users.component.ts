import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-dashboard-item-users',
  templateUrl: './dashboard-item-users.component.html',
  styleUrls: ['./dashboard-item-users.component.css']
})
export class DashboardItemUsersComponent implements OnInit {

  @Input() userData: any;
  constructor() { }

  ngOnInit() {
  }

}
