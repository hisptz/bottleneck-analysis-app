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
  public chartObject: any;
  public analyticObject: any;
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
    this.drawChart()
  }

  drawChart(chartType?:string) {

    this.dashboardItemService.getDashboardItemObject(this.chartData).subscribe(chartObject => {
      //@todo remove this hardcoding after finding the best way to include gauge chart
      let chartObjectType = chartObject.type.toLowerCase() != 'gauge' ? chartObject.type.toLowerCase(): 'bar';
      let chartConfiguration = {
        'type': chartType ? chartType : chartObjectType,
          'title': this.chartData.chart.displayName,
          'xAxisType': 'pe',
          'yAxisType': 'ou'
      }
      this.dashboardItemService.getDashboardItemAnalyticsObject(this.dashboardItemService.getDashBoardItemAnalyticsUrl(chartObject)).subscribe(analyticObject => {
        this.chartObject = this.visualizationService.drawChart(analyticObject, chartConfiguration);
        this.loadingChart = false;
      }, error => {
        this.chartHasError = true;
        this.loadingChart = false;
      })
    })
  }

  updateChartType(type) {
    this.loadingChart = true;
    this.drawChart(type)
  }

}
