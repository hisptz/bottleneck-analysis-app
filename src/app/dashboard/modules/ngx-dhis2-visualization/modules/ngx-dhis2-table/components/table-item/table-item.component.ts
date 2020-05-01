import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import {
  listEnterAnimation,
  openAnimation,
} from '../../../../../../../animations';
import { VisualizationExportService } from '../../../../services';
import { drawBnaTable } from '../../helpers/draw-bna-table.helper';
import { LegendSet } from '../../models/legend-set.model';
import { TableConfiguration } from '../../models/table-configuration';
import { Legend } from 'src/app/models/legend.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.css'],
  animations: [listEnterAnimation, openAnimation],
})
export class TableItemComponent implements OnInit {
  @Input() tableConfiguration: TableConfiguration;
  @Input() analyticsObject: any;
  @Input() legendDefinitions: Legend[];

  @ViewChild('table', { static: true })
  table: ElementRef;
  tableObject: any;
  sort_direction: string[] = [];
  current_sorting: boolean[] = [];
  tableData: any;

  @Output() layoutUpdate: EventEmitter<any> = new EventEmitter<any>();

  constructor(private visualizationExportService: VisualizationExportService) {
    this.tableObject = null;
  }

  ngOnInit() {
    if (this.analyticsObject && this.tableConfiguration) {
      this.tableData = drawBnaTable(
        this.analyticsObject,
        this.tableConfiguration
      );
    }
  }

  downloadTable(downloadFormat, filename) {
    if (this.tableData && this.tableConfiguration) {
      const date = new Date();
      const title = `Sublevel Analysis - ${filename}  generated on ${date.toUTCString()}`;
      if (this.table) {
        const el = this.table.nativeElement;
        if (downloadFormat === 'XLS') {
          this.visualizationExportService.exportXLS(
            title,
            el ? el.outerHTML : ''
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
