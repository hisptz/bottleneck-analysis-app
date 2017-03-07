import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";

@Component({
  selector: 'app-dashboard-dimensions',
  templateUrl: './dashboard-dimensions.component.html',
  styleUrls: ['./dashboard-dimensions.component.css']
})
export class DashboardDimensionsComponent implements OnInit {

  periods: any = {};
  orgUnits: any = {};
  @Output() onDimensionUpdate: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  constructor(private settingService: DashboardSettingsService) { }

  ngOnInit() {
  }

  getPeriodValues(event) {
    this.periods = event;
  }

  getOrgUnitValues(event) {
    this.orgUnits = event;
  }

  updateDashboard() {
    let dimension = [];
    dimension.push(this.orgUnits);
    dimension.push(this.periods);
    this.onDimensionUpdate.emit(dimension);
  }
}
