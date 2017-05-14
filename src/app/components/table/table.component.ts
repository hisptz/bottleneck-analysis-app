import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Visualization} from "../../model/visualization";
import {TableService} from "../../services/table.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {

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
    // this.initializeTable();
  }

  ngOnChanges() {
    this.loading = true;
    console.log('chnaged')
    if(this.tableData != undefined) {
      this.tableObjects = this.tableService.getTableObjects(this.tableData);
      this.loading = false;
    }
  }

  initializeTable() {
    this.tableService.getSanitizedTableData(this.tableData, this.customFilters).subscribe(sanitizedData => {
      this.tableData = sanitizedData;
      this.tableObjects = this.tableService.getTableObjects(this.tableData);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.hasError = true;
      this.errorMessage = error.hasOwnProperty('message') ? error.message : 'Unknown error has occurred';
      console.log(error.message)
    })
  }

}
