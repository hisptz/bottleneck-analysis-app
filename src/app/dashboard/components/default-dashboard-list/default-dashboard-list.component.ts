import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

interface DefaultDashboard {
  name: string;
}

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
    console.log(dashboard);
    this.showDefaultList = false;
  }
}
