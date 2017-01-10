import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['./dashboard-item.component.css']
})
export class DashboardItemComponent implements OnInit {

  public img: string;
  constructor() {
    this.img = 'assets/img/line.svg'
  }

  ngOnInit() {
  }

}
