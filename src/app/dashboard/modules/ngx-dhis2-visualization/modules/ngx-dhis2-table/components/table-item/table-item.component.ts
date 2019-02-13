import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import * as _ from 'lodash';
import { TableConfiguration } from '../../models/table-configuration';
import { LegendSet } from '../../models/legend-set.model';
import {
  listEnterAnimation,
  openAnimation
} from '../../../../../../../animations';
import { VisualizationExportService } from '../../../../services';
import { drawBnaTable } from '../../helpers/draw-bna-table.helper';
import { RESHUFFLE_ICON } from '../../icons';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.css'],
  animations: [listEnterAnimation, openAnimation]
})
export class TableItemComponent implements OnInit {
  @Input()
  tableConfiguration: TableConfiguration;

  @Input()
  analyticsObject: any;
  @Input()
  legendSets: LegendSet[];

  @Output()
  layoutUpdate: EventEmitter<any> = new EventEmitter<any>();

  reshuffleIcon: string;

  @ViewChild('table')
  table: ElementRef;
  tableObject: any;
  sort_direction: string[] = [];
  current_sorting: boolean[] = [];
  tableData: any;
  constructor(private visualizationExportService: VisualizationExportService) {
    this.tableObject = null;
    this.reshuffleIcon = RESHUFFLE_ICON;
  }

  ngOnInit() {
    if (this.analyticsObject && this.tableConfiguration) {
      this.tableData = drawBnaTable(
        this.analyticsObject,
        this.tableConfiguration
      );
    }
  }

  onLayoutChange(event) {
    event.stopPropagation();
    const rows = this.tableConfiguration.rows;
    const columns = this.tableConfiguration.columns;

    this.tableConfiguration = {
      ...this.tableConfiguration,
      rows: columns,
      columns: rows
    };

    this.tableData = drawBnaTable(
      this.analyticsObject,
      this.tableConfiguration
    );
  }

  downloadTable(downloadFormat) {
    if (this.tableData && this.tableConfiguration) {
      const title = `${this.tableData.title || 'Untitled'}-${
        this.tableData.subtitle
      }`;
      if (this.table) {
        const el = this.table.nativeElement;
        if (downloadFormat === 'XLS') {
          this.visualizationExportService.exportXLS(
            title,
            this.tableConfiguration.id
          );
        } else if (downloadFormat === 'CSV') {
          if (el) {
            this.visualizationExportService.exportCSV(title, el);
          }
        }
      }
    }
  }
}
