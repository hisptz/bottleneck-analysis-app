import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-data-element-group',
  templateUrl: './data-element-group.component.html',
  styleUrls: ['./data-element-group.component.css'],
})
export class DataElementGroupComponent implements OnInit {
  @Input() dataElementGroupInfo: any;
  @Output() selectedMetadataId = new EventEmitter<string>();
  @Input() isprintSet: any;
  constructor() {}

  ngOnInit() {}

  setActiveItem(e, metaDataId) {
    this.selectedMetadataId.emit(metaDataId);
  }

  getDistinctDataSetsCount(dataElements) {
    const dataSets = [];
    dataElements.forEach((dataElement) => {
      dataSets.push(dataElement.dataSetElements[0].dataSet);
    });
    return _.uniqBy(dataSets, 'id');
  }

  getTodayDate() {
    const now = new Date();
    return now;
  }

  formatTextToSentenceFormat(text) {
    text
      .split('_')
      .map((stringSection) => {
        return (
          stringSection.slice(0, 1).toUpperCase() +
          stringSection.slice(1).toLowerCase()
        );
      })
      .join(' ');
    return (
      text.split('_').join(' ').slice(0, 1).toUpperCase() +
      text.split('_').join(' ').slice(1).toLowerCase()
    );
  }
}
