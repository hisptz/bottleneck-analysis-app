import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-data-group-item',
  templateUrl: './data-group-item.component.html',
  styleUrls: ['./data-group-item.component.scss']
})
export class DataGroupItemComponent implements OnInit {
  @Input()
  dataGroup: any;

  @Input()
  dataGroups: any[];

  @Output()
  updateDataGroup: EventEmitter<any> = new EventEmitter<any>();

  newGroupName: string;
  constructor() {}

  get isUnique() {
    return !this.newGroupName
      ? false
      : _.some(
          this.dataGroups || [],
          (dataGroup: any) =>
            dataGroup &&
            dataGroup.name &&
            dataGroup.id &&
            dataGroup.name.toLowerCase() ===
              (this.newGroupName || '').toLowerCase() &&
            dataGroup.id !== this.dataGroup.id
        );
  }

  ngOnInit() {
    if (this.dataGroup) {
      this.newGroupName = this.dataGroup.name;
    }
  }

  onDataGroupNameChange(e) {
    e.stopPropagation();
    this.newGroupName = e.target.value;
    this.emitDataGroup();
  }

  emitDataGroup() {
    if (!this.isUnique) {
      this.updateDataGroup.emit({ ...this.dataGroup, name: this.newGroupName });
    }
  }
}
