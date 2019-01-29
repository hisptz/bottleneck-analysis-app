import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import * as _ from 'lodash';
import { ChartItemComponent } from '../chart-item/chart-item.component';
import { getChartConfiguration } from '../../helpers';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-chart-list',
  templateUrl: './chart-list.component.html',
  styleUrls: ['./chart-list.component.css']
})
export class ChartListComponent implements OnInit {
  @Input()
  visualizationLayers: any[] = [];
  @Input()
  visualizationId: string;
  @Input()
  chartHeight: string;
  chartLayers: Array<{ chartConfiguration: any; analyticsObject: any }> = [];

  @Output()
  updateChartVisualizationLayer: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(ChartItemComponent)
  chartItem: ChartItemComponent;

  constructor() {}

  ngOnInit() {
    if (this.visualizationLayers.length > 0) {
      this.chartLayers = this.visualizationLayers.map(
        (layer: any, layerIndex: number) => {
          return {
            chartConfiguration: getChartConfiguration(
              layer.config || {},
              layer.id,
              layer.layout,
              '',
              layer.dataSelections
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

  onDownloadEvent(downloadFormat) {
    if (this.chartItem) {
      this.chartItem.downloadChart(downloadFormat);
    }
  }

  onChartItemUpdate(chartItem) {
    const visualizationLayer = _.find(this.visualizationLayers, [
      'id',
      chartItem.id
    ]);

    if (visualizationLayer) {
      const newVisualizationLayer = _.omit(visualizationLayer, [
        'layout',
        'metadataIdentifiers'
      ]);

      this.updateChartVisualizationLayer.emit({
        ...newVisualizationLayer,
        config: {
          ...newVisualizationLayer.config,
          ...chartItem
        }
      });
    }
  }
}
