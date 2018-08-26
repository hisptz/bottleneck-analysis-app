import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

interface DefaultDashboard {
  name: string;
}

const DASHBOARD_ITEMS = [
  {
    shape: 'FULL_WIDTH',
    type: 'CHART'
  },
  {
    shape: 'FULL_WIDTH',
    type: 'REPORT_TABLE'
  },
  {
    shape: 'FULL_WIDTH',
    type: 'APP'
  }
];

@Component({
  selector: 'app-default-dashboard-list',
  templateUrl: './default-dashboard-list.component.html',
  styleUrls: ['./default-dashboard-list.component.scss']
})
export class DefaultDashboardListComponent implements OnInit {
  @Input()
  defaultDashboardList: DefaultDashboard[];
  showDefaultList: boolean;
  searchTerm: string;

  @Output()
  create: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.defaultDashboardList = [
      {
        name: 'Antenatal Care'
      },
      {
        name: 'Immunization'
      },
      {
        name: 'Malaria Treatment'
      },
      {
        name: 'Skilled Birth Delivery'
      }
    ];
  }

  get dashboardList(): DefaultDashboard[] {
    return _.filter(
      this.defaultDashboardList,
      (dashboard: DefaultDashboard) => {
        return (
          dashboard.name
            .toLowerCase()
            .indexOf(this.searchTerm.toLowerCase()) !== -1
        );
      }
    );
  }
  ngOnInit() {}

  onSearchDashboard(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value.trim();
    this.showDefaultList = true;
  }

  onAddDashboard(e, dashboard: DefaultDashboard) {
    e.stopPropagation();
    this.showDefaultList = false;
    this.create.emit({ ...dashboard, dashboardItems: DASHBOARD_ITEMS });
  }
}
