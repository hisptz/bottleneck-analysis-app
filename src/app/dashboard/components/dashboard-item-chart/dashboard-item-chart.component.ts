import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {VisualizerService} from "../../providers/dhis-visualizer.service";
import {type} from "os";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {UtilitiesService} from "../../providers/utilities.service";
import {isUndefined} from "util";

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
  public errorMessage: string;
  public currentChartType: string;
  constructor(
      private dashboardItemService: DashboardItemService,
      private visualizationService: VisualizerService,
      private route: ActivatedRoute,
      private utilService: UtilitiesService
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
    this.subscription = this.dashboardItemService.findDashboardAnalyticObject(this.chartData.id)
      .subscribe(analyticObject => {
          //@todo remove this hardcoding after finding the best way to include gauge chart
          // let chartObjectType = this.chartData[this.utilService.camelCaseName(this.chartData.type)].type.toLowerCase() != 'gauge' ? this.chartData[this.utilService.camelCaseName(this.chartData.type)].type.toLowerCase(): 'bar';
          let chartConfiguration = {
            'type': chartType ? chartType : this.chartData[this.utilService.camelCaseName(this.chartData.type)].type.toLowerCase(),
            'title': this.chartData[this.utilService.camelCaseName(this.chartData.type)].name,
            'xAxisType': this.chartData[this.utilService.camelCaseName(this.chartData.type)].category ? this.chartData[this.utilService.camelCaseName(this.chartData.type)].category : 'pe',
            'yAxisType': this.chartData[this.utilService.camelCaseName(this.chartData.type)].series ? this.chartData[this.utilService.camelCaseName(this.chartData.type)].series : 'dx'
          };
          console.log(this.chartObject);
          if(isUndefined(this.chartObject) || this.chartObject.chart.type != chartType) {
            this.chartObject = this.visualizationService.drawChart(analyticObject, chartConfiguration);
          }
          this.loadingChart = false;
      }, error => {
        this.loadingChart = false;
        this.chartHasError = true;
        this.errorMessage = error;
      });
  }

  updateChartType(type) {
    this.loadingChart = true;
    this.drawChart(type)
  }

  setChartType(type) {
    this.currentChartType = type;
    this.updateChartType(this.currentChartType)
  }

}
