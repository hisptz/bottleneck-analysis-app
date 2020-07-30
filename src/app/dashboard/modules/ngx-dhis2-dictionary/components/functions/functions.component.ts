import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css'],
})
export class FunctionsComponent implements OnInit {
  @Input() functionsDetails: any;
  @Output() selectedMetadataId = new EventEmitter<string>();
  @Input() isprintSet: any;
  constructor() {}

  ngOnInit() {}

  setActiveItem(e, metaDataId) {
    this.selectedMetadataId.emit(metaDataId);
  }

  getTodayDate() {
    const now = new Date();
    return now;
  }

  getSizeOfTheFunction(functionDefinition) {
    const functionSize = functionDefinition.length;
    if (functionSize < 1000) {
      return functionSize;
    } else if (functionSize >= 1000 && functionSize < 1000000) {
      return (functionSize / 1000).toFixed(2);
    } else {
      return (functionSize / 1000000).toFixed(2);
    }
  }

  formatToUppercase(str) {
    return _.upperCase(str);
  }
}
