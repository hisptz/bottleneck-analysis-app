import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-loader',
  templateUrl: './table-loader.component.html',
  styleUrls: ['./table-loader.component.css']
})
export class TableLoaderComponent implements OnInit {

  @Input() tableName: string;
  constructor() { }

  ngOnInit() {
  }

}
