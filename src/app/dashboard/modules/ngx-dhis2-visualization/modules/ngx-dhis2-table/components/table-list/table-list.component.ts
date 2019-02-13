import * as _ from 'lodash';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { TableConfiguration } from '../../models/table-configuration';
import { getTableConfiguration } from '../../helpers/index';
import { LegendSet } from '../../models/legend-set.model';
import { TableItemComponent } from '../table-item/table-item.component';
import {
  VisualizationLayer,
  VisualizationDataSelection
} from '../../../../models';
import { getInvertedObject } from '../../helpers/get-inverted-object.helper';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  @Input()
  visualizationLayers: any[];
  @Input()
  visualizationType: string;
  @Input()
  legendSets: LegendSet[];
  tableLayers: Array<{
    tableConfiguration: TableConfiguration;
    analyticsObject: any;
  }> = [];

  @Output()
  updateTableVisualizationLayer: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(TableItemComponent)
  tableItem: TableItemComponent;
  constructor() {}

  ngOnInit() {
    if (this.visualizationLayers && this.visualizationLayers.length > 0) {
      this.tableLayers = this.visualizationLayers.map((layer: any) => {
        return {
          tableConfiguration: getTableConfiguration(
            layer.config || {},
            layer.layout,
            this.visualizationType,
            layer.dataSelections
          ),
          analyticsObject: layer.analytics
        };
      });
    }
  }

  onDownloadEvent(downloadFormat) {
    if (this.tableItem) {
      this.tableItem.downloadTable(downloadFormat);
    }
  }

  onLayoutUpdate(layout: any) {
    const invertedLayout = getInvertedObject(layout);

    _.each(
      this.visualizationLayers,
      (visualizationLayer: VisualizationLayer) => {
        const newVisualizationLayer = {
          ...visualizationLayer,
          dataSelections: _.map(
            visualizationLayer.dataSelections || [],
            (dataSelection: VisualizationDataSelection) => {
              return {
                ...dataSelection,
                layout: invertedLayout[dataSelection.dimension]
              };
            }
          )
        };

        this.updateTableVisualizationLayer.emit(newVisualizationLayer);
      }
    );
  }
}
