import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { getTableConfiguration } from '../../helpers';
import { LegendSet } from '../../models/legend-set.model';
import { TableConfiguration } from '../../models/table-configuration';
import { TableItemComponent } from '../table-item/table-item.component';
import { getTableLayers } from '../../helpers/get-table-layers.helper';
import { VisualizationLayer } from '../../../../models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    this.tableLayers = getTableLayers(
      this.visualizationLayers,
      this.visualizationType
    );
  }

  onDownloadEvent(downloadFormat) {
    if (this.tableItem) {
      this.tableItem.downloadTable(downloadFormat);
    }
  }

  onLayoutChange(visualizationLayers: VisualizationLayer[]) {
    this.tableLayers = getTableLayers(
      visualizationLayers,
      this.visualizationType
    );
  }
}
