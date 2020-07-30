import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-program-indicator-properties',
  templateUrl: './program-indicator-properties.component.html',
  styleUrls: ['./program-indicator-properties.component.css']
})
export class ProgramIndicatorPropertiesComponent implements OnInit {
  @Input() programIndicator: any;
  @Input() listingIsSet: boolean;
  @Input() metadataIdentifiers: any;
  @Output() selectedMetadata = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  getIndicatorType(indicatorType) {
    if (indicatorType.name.toLowerCase().indexOf('cent') > -1) {
      return 'Percentage indicator';
    } else {
      return 'Number indicator';
    }
  }

  addSelectedMetadata(e) {
    this.selectedMetadata.emit(e);
  }

  checkIfTheIndicatorIsAmongSelected(indicatorId, metadataIdentifiers) {
    if (_.indexOf(metadataIdentifiers, indicatorId) > -1) {
      return true;
    } else {
      return false;
    }
  }
}
