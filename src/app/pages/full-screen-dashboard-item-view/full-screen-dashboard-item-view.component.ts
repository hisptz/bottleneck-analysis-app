import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-full-screen-dashboard-item-view',
  templateUrl: './full-screen-dashboard-item-view.component.html',
  styleUrls: ['./full-screen-dashboard-item-view.component.css']
})
export class FullScreenDashboardItemViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeDashboardItem(e) {
    e.stopPropagation();

  }

}
