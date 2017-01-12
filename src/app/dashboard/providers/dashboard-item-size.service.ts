import { Injectable } from '@angular/core';

export interface DashboardSize {
  shape: string;
  classes: Array<any>;
}
@Injectable()
export class DashboardItemSizeService {
  public dashboardSize: DashboardSize[];
  public currentDashboardShape:string;
  constructor() {
    this.dashboardSize = [
      {shape: 'NORMAL', classes: ['col-md-4','col-sm-6','col-xs-12']},
      {shape: 'DOUBLE_WIDTH', classes: ['col-md-8','col-sm-12','col-xs-12']},
      {shape: 'FULL_WIDTH', classes: ['col-md-12','col-sm-12','col-xs-12']},
    ];
    this.currentDashboardShape = 'NORMAL';
  }

  getDashboardSize(shape): Array<any> {
    let dashboardClass = [];
    this.dashboardSize.forEach((sizeValue) => {
      if (shape == sizeValue.shape) {
        dashboardClass = sizeValue.classes;
      }
    });
    return dashboardClass
  }

  resizeDashboard() {

  }

}
