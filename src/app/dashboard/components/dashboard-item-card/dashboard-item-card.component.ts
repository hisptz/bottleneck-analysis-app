import {Component, OnInit, AfterViewInit, Input, ViewChild, Output, EventEmitter} from "@angular/core";
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {ActivatedRoute} from "@angular/router";
import {DashboardService} from "../../providers/dashboard.service";
import {UtilitiesService} from "../../providers/utilities.service";
import {VisualizerService} from "../../providers/dhis-visualizer.service";
import {Constants} from "../../../shared/constants";
import {Observable} from "rxjs";
import {isNull} from "util";
import {DashboardLayoutComponent} from "../dashboard-layout/dashboard-layout.component";

export const DASHBOARD_SHAPES = {
  'NORMAL': ['col-md-4','col-sm-6','col-xs-12'],
  'DOUBLE_WIDTH': ['col-md-8','col-sm-6','col-xs-12'],
  'FULL_WIDTH': ['col-md-12','col-sm-12','col-xs-12']
}
@Component({
  selector: 'app-dashboard-item-card',
  templateUrl: 'dashboard-item-card.component.html',
  styleUrls: ['dashboard-item-card.component.css']
})
export class DashboardItemCardComponent implements OnInit{

  @Input() itemData: any;
  @Input() currentUser: any;
  @Input() status: any;
  @Output() onDelete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild(DashboardLayoutComponent) dashboardLayout: DashboardLayoutComponent;
  public isFullScreen: boolean;
  public isInterpretationShown: boolean;
  public interpretationReady: boolean;
  public currentVisualization: string;
  public dashboardShapeBuffer: string;
  public confirmDelete: boolean;
  public chartObject: any;
  public tableObject: any;
  public loadingChart: boolean;
  public loadingTable: boolean;
  public chartHasError: boolean;
  public tableHasError: boolean;
  public currentChartType: string;
  public metadataIdentifiers: string;
  public chartTypes: any;
  interpretation: string;
  orgunit_model: any;
  customLayout: any = null;
  constructor(
      private dashboardItemService: DashboardItemService,
      private dashboardService: DashboardService,
      private route: ActivatedRoute,
      private utilService: UtilitiesService,
      private visualizationService: VisualizerService,
      private constants: Constants
  ) {
    this.isFullScreen = false;
    this.isInterpretationShown = this.interpretationReady = false;
    this.confirmDelete = false;
    this.chartHasError = this.tableHasError = false;
    this.loadingChart = this.loadingTable = true;
    this.chartTypes = this.constants.chartTypes;
    this.currentChartType = 'bar';
  }

  ngOnInit() {
    //compile user orgunits
    let userOrgUnits = [];
    this.currentUser.dataViewOrganisationUnits.forEach(orgUnit => {
      userOrgUnits.push(orgUnit.id);
    })

    this.orgunit_model = {
      selection_mode: "orgUnit",
      selected_level: "",
      selected_group: "",
      orgunit_levels: [],
      orgunit_groups: [],
      selected_orgunits: [],
      user_orgunits: userOrgUnits
    };
    this.currentVisualization = this.itemData.type;
    this.dashboardShapeBuffer = this.itemData.shape;

    //load dashbordItem object
    if((this.currentVisualization == 'CHART') ||
      (this.currentVisualization == 'EVENT_CHART') ||
      (this.currentVisualization == 'TABLE') ||
      (this.currentVisualization == 'REPORT_TABLE') ||
      (this.currentVisualization == 'EVENT_REPORT')) {
        this.updateDasboardItemForAnalyticTypeItems();
    }
  }

  visualize(dashboardItemType, dashboardObject, dashboardAnalytic) {
    if((dashboardItemType == 'CHART') || (dashboardItemType == 'EVENT_CHART')) {
      this.drawChart(dashboardObject, dashboardAnalytic,this.currentChartType);
    } else if ((dashboardItemType == 'TABLE') || (dashboardItemType == 'EVENT_REPORT') || (dashboardItemType == 'REPORT_TABLE')) {
      this.drawTable(dashboardObject, dashboardAnalytic)
    } else if(dashboardItemType == 'DICTIONARY') {
      this.metadataIdentifiers = this.dashboardService.getDashboardItemMetadataIdentifiers(this.itemData.object)
    }
  }

  setVisualization(visualizationType) {
    this.currentVisualization = visualizationType;
    this.dashboardLayout.changeVisualisation(visualizationType,this.itemData.analytic.headers);
    this.visualize(visualizationType,this.itemData.object, this.itemData.analytic)
  }

  drawChart(dashboardObject, dashboardAnalytic,chartType?:string) {
    let chartConfiguration = {
      'type': chartType,
      'title': dashboardObject.title,
      'xAxisType': dashboardObject.category ? this.itemData.object.category : 'pe',
      'yAxisType': dashboardObject.series ? this.itemData.object.series : 'dx'
    };
    console.log(chartConfiguration)
    this.chartObject = this.visualizationService.drawChart(dashboardAnalytic, chartConfiguration);
    this.loadingChart = false;
  }

  drawTable(dashboardObject, dashboardAnalytic) {
    let config = {rows: [], columns: []};

    if(!isNull(this.customLayout)) {
      //get columns
      if(this.customLayout.columnDimension.length > 0) {
        this.customLayout.columnDimension.forEach(column => {
          config.columns.push(column)
        })
      } else {
        config.columns = ['co'];
      }

      if(this.customLayout.rowDimension.length > 0) {
        this.customLayout.rowDimension.forEach(row => {
          config.rows.push(row)
        })
      } else {
        config.rows = ['ou', 'dx', 'pe'];
      }
    } else {
      //get columns
      if(dashboardObject.hasOwnProperty('columns')) {
        dashboardObject.columns.forEach(colValue => {
          config.columns.push(colValue.dimension);
        });
      } else {
        config.columns = ['co'];
      }

      //get rows
      if(dashboardObject.hasOwnProperty('rows')) {
        dashboardObject.rows.forEach(rowValue => {
          config.rows.push(rowValue.dimension)
        })
      } else {
        config.rows = ['ou', 'dx', 'pe'];
      }
    }

    this.tableObject = this.visualizationService.drawTable(dashboardAnalytic, config);
    this.loadingTable = false;
  }

  updateChartType(type) {
    this.loadingChart = true;
    this.drawChart(this.itemData.object,this.itemData.analytic,type)
  }

  setChartType(type) {
    this.currentChartType = type;
    this.updateChartType(this.currentChartType)
  }

  //Methods for dashboard item  shape

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
    this.dashboardService.updateShape(this.route.snapshot.params['id'],this.itemData.id, newShape);

    //@todo find best way to close interpretation on normal screen
    if(newShape == 'NORMAL') {
      this.isInterpretationShown = false;
    }
  }

  canShowIcons(visualizationType): boolean {
    let noFooterVisualization = ['USERS', 'REPORTS','RESOURCES'];
    let canShow = true;
    noFooterVisualization.forEach(visualizationValue => {
      if(visualizationType == visualizationValue) {
        canShow = false
      }
    })
    return canShow;
  }

  toggleInterpretation() {
    if(this.isInterpretationShown) {
      this.isInterpretationShown = false;
      this.itemData.shape = this.dashboardShapeBuffer;
    } else {
      this.isInterpretationShown = true;
      if(this.itemData.shape == 'NORMAL') {
        this.dashboardShapeBuffer = this.itemData.shape;
        this.itemData.shape = 'DOUBLE_WIDTH';
      } else {
        this.dashboardShapeBuffer = this.itemData.shape;
      }
    }
  }

  deleteDashboardItem(id) {
    this.dashboardService.deleteDashboardItem(this.route.snapshot.params['id'], id)
      .subscribe(response => {this.onDelete.emit(id);},
        error => {console.log('error deleting item')})
  }

  updateDashboardCard(event) {
    this.updateDasboardItemForAnalyticTypeItems(event);
  }

  updateDasboardItemForAnalyticTypeItems(customDimensions = []) {
    this.loadingChart =  this.loadingTable = true;
    this.dashboardService.getDashboardItemWithObjectAndAnalytics(this.route.snapshot.params['id'],this.itemData.id,this.currentUser.id,customDimensions)
      .subscribe(dashboardItem => {
        this.itemData = dashboardItem;
        this.visualize(this.currentVisualization,dashboardItem.object, dashboardItem.analytic);
        //@todo find best way to autoplay interpretation
        this.autoplayInterpretation(dashboardItem);
      }, error => {
        this.tableHasError = this.chartHasError = true;
        this.loadingChart =  this.loadingTable = false;
      })
  }

  updateDashboardItemLayout(layout) {
    this.customLayout = layout;
    this.loadingChart =  this.loadingTable = true;
    this.visualize(this.currentVisualization, this.itemData.object, this.itemData.analytic);
  }

  autoplayInterpretation(dashboardItem) {
    this.interpretationReady = true;
    let interpretationIndex = 0;
    let interpretationLength = dashboardItem.object.interpretations.length;
    if(interpretationLength > 0) {
      Observable.interval(4000).subscribe(value => {
        if(interpretationIndex <= interpretationLength - 1) {
          this.interpretation = dashboardItem.object.interpretations[interpretationIndex].text;
          interpretationIndex += 1;
        } else {
          interpretationIndex = 0;
          this.interpretation = dashboardItem.object.interpretations[interpretationIndex].text
        }
      })
    }
  }

}
