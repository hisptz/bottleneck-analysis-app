import {Component, OnInit, AfterViewInit, Input, ViewChild} from "@angular/core";
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute} from "@angular/router";
import {DashboardItemChartComponent} from "../dashboard-item-chart/dashboard-item-chart.component";

export const DASHBOARD_SHAPES = {
  'NORMAL': ['col-md-4','col-sm-6','col-xs-12'],
  'DOUBLE_WIDTH': ['col-md-8','col-sm-6','col-xs-12'],
  'FULL_WIDTH': ['col-md-12','col-sm-12','col-xs-12']
}

export const CHART_TYPES = [
  'bar','line','column','combined','area', 'radar'
]
@Component({
  selector: 'app-dashboard-item-card',
  templateUrl: 'dashboard-item-card.component.html',
  styleUrls: ['dashboard-item-card.component.css']
})
export class DashboardItemCardComponent implements OnInit{

  @Input() itemData: any;
  @ViewChild(DashboardItemChartComponent)  chartComponent: DashboardItemChartComponent;
  public currentChartType: string;
  constructor(
      private dashboardItemBodyService: DashboardItemService,
      private route: ActivatedRoute
  ) {
    this.currentChartType = CHART_TYPES[0];
  }

  ngOnInit() {
  }

  dashboardShapeClass(shape): Array<any> {
    return DASHBOARD_SHAPES[shape];
  }

  resizeDashboard(currentShape) {
    let shapes = ['NORMAL', 'DOUBLE_WIDTH', 'FULL_WIDTH'];
    let newShape = '';
    if (shapes.indexOf(currentShape) + 1 < shapes.length) {
      newShape = shapes[shapes.indexOf(currentShape) + 1]
    } else {
      newShape = shapes[0];
    }
    this.dashboardItemBodyService.updateShape(this.itemData.id, this.route.snapshot.params['id'], newShape)
  }

  toggleChartType(currentChartType: string) {

    if (CHART_TYPES.indexOf(currentChartType) + 1 < CHART_TYPES.length) {
      this.currentChartType = CHART_TYPES[CHART_TYPES.indexOf(currentChartType) + 1]
    } else {
      this.currentChartType = CHART_TYPES[0];
    }
    this.chartComponent.updateChartType(this.currentChartType)
  }

  setChartType(type) {
    this.currentChartType = type;
    this.chartComponent.updateChartType(this.currentChartType)
  }

}
