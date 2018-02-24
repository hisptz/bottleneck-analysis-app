import {Component, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit {

  @Input() visualizationLayers: Array<{settings: any, analytics: any}>;
  @Input() visualizationId: string;
  constructor() { }

  ngOnInit() {
  }

}
