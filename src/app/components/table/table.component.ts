import {Component, OnInit, Input, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {Visualization} from "../../model/visualization";
import {TableService} from "../../services/table.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {

  @Input() tableData: Visualization;
  @Input() customFilters: any[] = [];
  loading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = 'Unknown error has occurred';
  tableObjects: any[];
  constructor(
    private tableService: TableService
  ) {
  }

  ngOnInit() {
    this.loading = true;
    if(this.tableData != undefined) {
      this.tableObjects = this.tableService.getTableObjects(this.tableData);
      this.loading = false;
    }
  }

}
