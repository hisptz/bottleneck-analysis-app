import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartItemComponent } from '../chart-item/chart-item.component';
import { getChartConfiguration } from '../../helpers';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-chart-list',
  templateUrl: './chart-list.component.html',
  styleUrls: ['./chart-list.component.css']
})
export class ChartListComponent implements OnInit {
  @Input() visualizationLayers: any[] = [];
  @Input() visualizationId: string;
  @Input() chartHeight: string;
  chartLayers: Array<{ chartConfiguration: any; analyticsObject: any }> = [];

  @ViewChild(ChartItemComponent) chartItem: ChartItemComponent;

  constructor() {}

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      this.chartLayers = this.visualizationLayers.map(
        (layer: any, layerIndex: number) => {
          return {
            chartConfiguration: getChartConfiguration(
              layer.config || {},
              this.visualizationId + '_' + layerIndex,
              layer.layout
            ),
            analyticsObject: layer.analytics
          };
        }
      );
    }
  }

  onParentEvent(parentEvent) {
    if (this.chartItem) {
      this.chartItem.onFocus(parentEvent);
    }
  }

  onDownloadEvent(filename, downloadFormat) {
    if (this.chartItem) {
      this.chartItem.downloadChart(filename, downloadFormat);
    }
  }
}
