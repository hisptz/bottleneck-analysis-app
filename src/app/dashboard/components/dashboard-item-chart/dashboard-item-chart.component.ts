import {Component, OnInit, Input} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {VisualizerService} from "../../providers/dhis-visualizer.service";
import {type} from "os";

@Component({
  selector: 'app-dashboard-item-chart',
  templateUrl: './dashboard-item-chart.component.html',
  styleUrls: ['./dashboard-item-chart.component.css']
})
export class DashboardItemChartComponent implements OnInit {

  @Input() chartData: any;
  public chartType: string;
  public chartObject: any;
  public loadingChart: boolean;
  public chartHasError: boolean;
  constructor(
      private dashboardItemService: DashboardItemService,
      private visualizationService: VisualizerService
  ) {
    this.loadingChart = true;
    this.chartHasError = false;
  }

  ngOnInit() {
    this.drawChart('bar')
  }

  drawChart(chartType) {
    let visualizer_config = {
      'type': 'chart',
      'chartConfiguration': {
        'type': chartType,
        'title': this.chartData.chart.displayName,
        'xAxisType': 'pe',
        'yAxisType': 'ou'
      }
    }
    this.dashboardItemService.getDashboardItemObject(this.chartData).subscribe(chartObject => {
      this.dashboardItemService.getDashboardItemAnalyticsObject(this.dashboardItemService.getDashBoardItemAnalyticsUrl(chartObject)).subscribe(analyticObject => {
        this.chartObject = this.visualizationService.drawChart(analyticObject, visualizer_config.chartConfiguration);
        this.loadingChart = false;
      }, error => {
        this.chartHasError = true;
        this.loadingChart = false;
      })
    })
  }

  updateChartType(type) {
    this.drawChart(type)
  }

}
