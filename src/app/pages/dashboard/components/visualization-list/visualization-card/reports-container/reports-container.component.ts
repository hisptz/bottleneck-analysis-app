import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html',
  styleUrls: ['./reports-container.component.css']
})
export class ReportsContainerComponent implements OnInit {
  @Input() visualizationLayers: any[];
  reportList: any[];
  constructor() {}

  ngOnInit() {
    if (this.visualizationLayers) {
      this.reportList = _.flatten(
        _.map(
          this.visualizationLayers,
          (layer: any) => (layer.settings ? layer.settings.reports : [])
        )
      );
    }
  }
}
