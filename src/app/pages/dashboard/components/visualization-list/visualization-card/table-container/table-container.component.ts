import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-container',
  templateUrl: './table-container.component.html',
  styleUrls: ['./table-container.component.css']
})
export class TableContainerComponent implements OnInit {

  @Input() visualizationLayers: any[] = [];
  @Input() visualizationType: string;
  constructor() { }

  ngOnInit() {
  }

}
