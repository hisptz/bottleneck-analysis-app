import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-filter-item-selector',
  templateUrl: './data-filter-item-selector.component.html',
  styleUrls: ['./data-filter-item-selector.component.scss'],
})
export class DataFilterItemSelectorComponent implements OnInit {
  @Input() dataFilterItems: any[];
  @Input() selectedItems: any[];
  @Output() selectDataItem: EventEmitter<any> = new EventEmitter<any>();
  searchTerm: string;
  constructor() {}

  ngOnInit() {}

  onDataItemSearch(e) {
    e.stopPropagation();
    this.searchTerm = e.target ? e.target.value : '';
  }

  onSelectDataItem(dataItem: any, e) {
    e.stopPropagation();
    this.selectDataItem.emit(dataItem);
  }
}
