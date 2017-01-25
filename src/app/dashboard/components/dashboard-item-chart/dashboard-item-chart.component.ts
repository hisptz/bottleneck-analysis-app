import {Component, OnInit, Input} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {VisualizerService} from "../../providers/dhis-visualizer.service";
import {type} from "os";
import {ActivatedRoute} from "@angular/router";

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
      private visualizationService: VisualizerService,
      private route: ActivatedRoute
  ) {
    this.loadingChart = true;
    this.chartHasError = false;
  }

  ngOnInit() {
    this.drawChart()
  }

  drawChart(chartType?:string) {
    this.dashboardItemService.getDashboardItemAnalyticsObject(this.chartData, this.route.snapshot.params['id']).subscribe(analyticObject => {
      //@todo remove this hardcoding after finding the best way to include gauge chart
      let chartObjectType = analyticObject.dashboardObject.type.toLowerCase() != 'gauge' ? analyticObject.dashboardObject.type.toLowerCase(): 'bar';
      let chartConfiguration = {
        'type': chartType ? chartType : chartObjectType,
        'title': this.getDisplayName(this.chartData),
        'xAxisType': 'pe',
        'yAxisType': 'ou'
      }
      this.chartObject = this.visualizationService.drawChart(analyticObject.analytic, chartConfiguration);
      this.loadingChart = false;
    }, error => {
      this.loadingChart = false;
      this.chartHasError = true;
      console.log(error)
      //@todo handle error when analytic object fails
    });
  }

  updateChartType(type) {
    this.loadingChart = true;
    this.drawChart(type)
  }

  getDisplayName(chartData) {
    let name = '';
    if(chartData.hasOwnProperty('chart')) {
      name = chartData.chart.displayName;
    } else {
      name = chartData.displayName;
    }
  }

}
