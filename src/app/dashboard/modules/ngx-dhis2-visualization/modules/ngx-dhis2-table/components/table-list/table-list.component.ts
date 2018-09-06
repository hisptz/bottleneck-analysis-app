import { Component, Input, OnInit } from '@angular/core';
import { TableConfiguration } from '../../models/table-configuration';
import { getTableConfiguration } from '../../helpers/index';
import { LegendSet } from '../../models/legend-set.model';
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
}
