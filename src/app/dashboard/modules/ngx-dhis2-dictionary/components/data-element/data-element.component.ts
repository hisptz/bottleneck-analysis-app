import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-data-element',
  templateUrl: './data-element.component.html',
  styleUrls: ['./data-element.component.css'],
})
export class DataElementComponent implements OnInit {
  @Input() dataElementInfo: any;
  @Output() selectedMetadataId = new EventEmitter<string>();
  @Input() isprintSet: boolean;
  listAllMetadataInGroup = false;
  showOptions = false;
  constructor() {}

  ngOnInit() {}

  setActiveItem(e, metaDataId) {
    this.selectedMetadataId.emit(metaDataId);
  }

  sortLegends(legends) {
    return _.reverse(_.sortBy(legends, ['startValue']));
  }

  getToCapitalLetters(color) {
    return _.upperCase(color);
  }

  getTodayDate() {
    const now = new Date();
    return now;
  }

  getOtherMetadata(allMedatada, listAllMetadataInGroup) {
    const newSlicedList = [];
    // _.map(allMedatada, (metadata) => {
    //   if (metadata.id !== this.dataElementInfo.data.metadata.id) {
    //     newSlicedList.push(metadata);
    //   }
    // })
    if (!listAllMetadataInGroup && !this.isprintSet) {
      return allMedatada.slice(0, 3);
    } else {
      return allMedatada;
    }
  }

  showOptionsList() {
    this.showOptions = !this.showOptions;
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
