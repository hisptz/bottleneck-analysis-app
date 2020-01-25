import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataFilterType } from '../../models/data-filter-type.model';
import { map } from 'lodash';

@Component({
  selector: 'app-data-filter-type-selector',
  templateUrl: './data-filter-type-selector.component.html',
  styleUrls: ['./data-filter-type-selector.component.scss'],
})
export class DataFilterTypeSelectorComponent implements OnInit {
  @Input() dataFilterTypes: DataFilterType[];

  @Output() toggleDataFilterType: EventEmitter<
    DataFilterType[]
  > = new EventEmitter<DataFilterType[]>();
  constructor() {}

  ngOnInit() {}

  onToggleDataFilterType(toggledDataFilterType: DataFilterType, event) {
    event.stopPropagation();
    const multipleSelection = event.ctrlKey ? true : false;
    this.dataFilterTypes = map(this.dataFilterTypes, (dataFilterType: any) => {
      return {
        ...dataFilterType,
        selected:
          toggledDataFilterType.prefix === 'all'
            ? dataFilterType.prefix !== 'all'
              ? false
              : !dataFilterType.selected
            : toggledDataFilterType.prefix === dataFilterType.prefix
            ? !dataFilterType.selected
            : multipleSelection
            ? dataFilterType.prefix === 'all'
              ? false
              : dataFilterType.selected
            : false,
      };
    });

    this.toggleDataFilterType.emit(this.dataFilterTypes);
  }
}
