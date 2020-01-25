import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-filter-group-selector',
  templateUrl: './data-filter-group-selector.component.html',
  styleUrls: ['./data-filter-group-selector.component.scss'],
})
export class DataFilterGroupSelectorComponent implements OnInit {
  showGroupList: boolean;
  searchTerm: string;
  @Input() dataFilterGroups: any[];
  @Input() currentDataGroup: any;

  @Output() setDataGroup: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  onToggleDataFilterGroup(e) {
    e.stopPropagation();
    this.showGroupList = !this.showGroupList;
  }

  onSearchDataGroup(e) {
    e.stopPropagation();
    this.searchTerm = e.target ? e.target.value : '';
  }

  onSetDataGroup(dataGroup: any, e) {
    e.stopPropagation();
    this.showGroupList = false;
    this.setDataGroup.emit(dataGroup);
  }
}
