import {Injectable} from "@angular/core";
@Injectable()
export class Constants {
  public root_url: string;
  public api: string;
  public chartTypes: any;
  constructor() {
    this.root_url = '../../../';
    this.api = this.root_url + 'api/25/';
    this.chartTypes = [
      {
        type: 'bar',
        description: 'Bar chart',
        icon: 'assets/img/bar.png'
      },
      {
        type: 'line',
        description: 'Line chart',
        icon: 'assets/img/line.png'
      },
      {
        type: 'combined',
        description: 'Combined chart',
        icon: 'assets/img/combined.png'
      },
      {
        type: 'column',
        description: 'Column chart',
        icon: 'assets/img/column.png'
      },
      {
        type: 'area',
        description: 'Area chart',
        icon: 'assets/img/area.png'
      },
      {
        type: 'pie',
        description: 'Pie chart',
        icon: 'assets/img/pie.png'
      },
      {
        type: 'stacked_column',
        description: 'stacked column chart',
        icon: 'assets/img/column-stacked.png'
      },
      {
        type: 'gauge',
        description: 'Gauge chart',
        icon: 'assets/img/gauge.png'
      },
      {
        type: 'radar',
        description: 'Radar chart',
        icon: 'assets/img/radar.png'
      },
    ]

  }
}
