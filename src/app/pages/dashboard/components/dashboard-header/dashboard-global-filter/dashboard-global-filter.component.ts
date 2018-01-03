import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-global-filter',
  templateUrl: './dashboard-global-filter.component.html',
  styleUrls: ['./dashboard-global-filter.component.css']
})
export class DashboardGlobalFilterComponent implements OnInit {

  showGlobalFilters: boolean;
  constructor() {
    this.showGlobalFilters = false;
  }

  ngOnInit() {
  }

  toggleGlobalFilters(e) {
    e.stopPropagation();
    this.showGlobalFilters = !this.showGlobalFilters;
  }

}
