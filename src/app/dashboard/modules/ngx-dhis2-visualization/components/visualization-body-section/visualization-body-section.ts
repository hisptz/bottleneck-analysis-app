import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
} from '@angular/core';
import * as _ from 'lodash';
import { VisualizationConfig } from '../../models/visualization-config.model';
import { VisualizationUiConfig } from '../../models/visualization-ui-config.model';
import { VisualizationLayer } from '../../models/visualization-layer.model';
import { TableListComponent } from '../../modules/ngx-dhis2-table/components/table-list/table-list.component';
import { ChartListComponent } from '../../modules/ngx-dhis-chart/components/chart-list/chart-list.component';
import { VisualizationWidgetComponent } from '../visualization-widget/visualization-widget.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'visualization-body-section',
  templateUrl: 'visualization-body-section.html',
  styleUrls: ['./visualization-body-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizationBodySectionComponent {
  @Input() id: string;
  @Input() appKey: string;
  @Input() baseUrl: string;
  @Input() visualizationLayers: VisualizationLayer[];
  @Input() visualizationConfig: VisualizationConfig;
  @Input() visualizationUiConfig: VisualizationUiConfig;
  @Input() dashboard: any;
  @Input() focusedVisualization: string;
  @Input() currentUser: any;
  @Input() downloadFilename: string;

  @ViewChild(TableListComponent, { static: false })
  tableList: TableListComponent;

  @ViewChild(ChartListComponent, { static: false })
  chartList: ChartListComponent;

  @ViewChild(VisualizationWidgetComponent, { static: false })
  widget: VisualizationWidgetComponent;

  @Output() updateVisualizationLayer: EventEmitter<any> = new EventEmitter<
    any
  >();

  get metadataIdentifiers() {
    return _.uniq(
      _.flatten(
        _.map(this.visualizationLayers, (layer) => layer.metadataIdentifiers)
      )
    );
  }

  constructor() {}

  onDownloadVisualization(visualizationType: string, downloadFormat: string) {
    if (visualizationType === 'CHART' && this.chartList) {
      this.chartList.onDownloadEvent(downloadFormat, this.downloadFilename);
    } else if (visualizationType === 'TABLE' && this.tableList) {
      this.tableList.onDownloadEvent(downloadFormat, this.downloadFilename);
    } else if (visualizationType === 'APP') {
      this.widget.onDownloadEvent(downloadFormat);
    }
  }

  onVisualizationLayerUpdate(visualizationLayer: any) {
    this.updateVisualizationLayer.emit(visualizationLayer);
  }

  onVisualizationLayoutChange(visualizationLayers: VisualizationLayer[]) {
    if (this.tableList) {
      this.tableList.onLayoutChange(visualizationLayers);
    }
  }
}
