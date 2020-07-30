import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-data-set',
  templateUrl: './data-set.component.html',
  styleUrls: ['./data-set.component.css'],
})
export class DataSetComponent implements OnInit {
  @Input() dataSetInfo: any;
  @Output() selectedMetadataId = new EventEmitter<string>();
  @Input() isprintSet: any;
  constructor() {}

  ngOnInit() {}

  setActiveItem(e, metaDataId) {
    this.selectedMetadataId.emit(metaDataId);
  }

  sortLegends(legends) {
    return _.reverse(_.sortBy(legends, ['startValue']));
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

  getDataElement(elementId, allElements) {
    let metadataName = '';
    _.map(allElements, (element: any) => {
      if (element.id === elementId) {
        metadataName = element.name;
      }
    });
    return metadataName;
  }
}
