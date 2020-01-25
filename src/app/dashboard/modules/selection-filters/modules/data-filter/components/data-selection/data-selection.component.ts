import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataFilterType } from '../../models/data-filter-type.model';

@Component({
  selector: 'app-data-selection',
  templateUrl: './data-selection.component.html',
  styleUrls: ['./data-selection.component.scss'],
})
export class DataSelectionComponent implements OnInit {
  @Input() dataFilterTypes: DataFilterType[];
  @Input() dataFilterGroups: any[];
  @Input() currentDataFilterGroup: any;
  @Input() dataFilterItems: any;
  @Input() selectedItems: any;

  @Output() setDataFilterGroup: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectDataItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleDataFilterType: EventEmitter<
    DataFilterType[]
  > = new EventEmitter<DataFilterType[]>();

  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  onSetDataGroup(dataGroup: any) {
    this.setDataFilterGroup.emit(dataGroup);
  }

  onToggleDataFilterType(dataFilterTypes: DataFilterType[]) {
    this.toggleDataFilterType.emit(dataFilterTypes);
  }

  onSelectDataItem(dataItem: any) {
    this.selectDataItem.emit(dataItem);
  }

  onClose(e) {
    e.stopPropagation();
    this.close.emit(null);
  }
}
