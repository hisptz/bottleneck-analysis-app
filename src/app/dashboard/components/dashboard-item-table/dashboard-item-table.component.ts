import {Component, OnInit, Input} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {VisualizerService} from "../../providers/dhis-visualizer.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-dashboard-item-table',
  templateUrl: './dashboard-item-table.component.html',
  styleUrls: ['./dashboard-item-table.component.css']
})
export class DashboardItemTableComponent implements OnInit {

  @Input() itemData: any;
  public tableData: any;
  public loadingTable: boolean;
  public tableHasError: boolean;
  constructor(
    private dashboardItemService: DashboardItemService,
    private visualizationService: VisualizerService,
    private route: ActivatedRoute
  ) {
    this.loadingTable = true;
    this.tableHasError = false;
  }

  ngOnInit() {
    this.drawTable();
  }
  drawTable() {
    this.dashboardItemService.findDashboardItemObject(this.itemData.id)
      .subscribe(dashboardItemObject => {
        this.dashboardItemService.findDashboardAnalyticObject(this.itemData.id)
          .subscribe(
            analyticObject => {
              this.tableData = this.visualizationService.drawTable(analyticObject, this.tableConfiguration(dashboardItemObject));
              this.loadingTable = false;
            },error => {
              this.loadingTable = false;
              this.tableHasError = true;
            })

      }, error => {
        console.log(error)
      });
  }

  tableConfiguration(dashboardObject) {
    let config = {rows: [], columns: []};
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
    return config;
  }

}
