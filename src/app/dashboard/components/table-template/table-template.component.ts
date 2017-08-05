import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-template',
  templateUrl: './table-template.component.html',
  styleUrls: ['./table-template.component.css']
})
export class TableTemplateComponent implements OnInit {

  @Input() tableObject: any;
  constructor() { }

  ngOnInit() {
  }

}
