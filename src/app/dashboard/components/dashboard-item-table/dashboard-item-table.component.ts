import {Component, OnInit, Input} from '@angular/core';
import {DashboardItemService} from "../../providers/dashboard-item.service";
import {VisualizerService} from "../../providers/dhis-visualizer.service";

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
    private visualizationService: VisualizerService
  ) {
    this.loadingTable = true;
    this.tableHasError = false;
  }

  ngOnInit() {
    this.drawTable();
  }

  drawTable() {
    let visualizer_config = {
      'type': 'table',
      'tableConfiguration': {
        'rows': ['ou', 'dx', 'pe'] ,
        'columns': ['co']
      }
    }
    this.dashboardItemService.getDashboardItemObject(this.itemData).subscribe(tableObject => {
      this.dashboardItemService.getDashboardItemAnalyticsObject(this.dashboardItemService.getDashBoardItemAnalyticsUrl(tableObject)).subscribe(analyticObject => {
        this.tableData = this.visualizationService.drawTable(analyticObject, visualizer_config.tableConfiguration);
        this.loadingTable = false;
      }, error => {
        this.tableHasError = true;
        this.loadingTable = false;
      })
    }, error =>  {
      console.log('error')
    })
  }

}
