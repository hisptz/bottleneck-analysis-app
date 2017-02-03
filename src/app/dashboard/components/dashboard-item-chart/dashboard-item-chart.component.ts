import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {VisualizerService} from "../../providers/dhis-visualizer.service";
import {type} from "os";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard-item-chart',
  templateUrl: './dashboard-item-chart.component.html',
  styleUrls: ['./dashboard-item-chart.component.css']
})
export class DashboardItemChartComponent implements OnInit,OnDestroy {

  @Input() chartData: any;
  public chartObject: any;
  subscription: Subscription;
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
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  drawChart(chartType?:string) {
    this.subscription = this.dashboardItemService.getDashboardItemAnalyticsObject(this.chartData).subscribe(analyticObject => {
      //@todo remove this hardcoding after finding the best way to include gauge chart
      let chartObjectType = analyticObject.dashboardObject.type.toLowerCase() != 'gauge' ? analyticObject.dashboardObject.type.toLowerCase(): 'bar';
      let chartConfiguration = {
        'type': chartType ? chartType : chartObjectType,
        'title': this.getDisplayName(this.chartData),
        'xAxisType': analyticObject.dashboardObject.category,
        'yAxisType': analyticObject.dashboardObject.series
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
