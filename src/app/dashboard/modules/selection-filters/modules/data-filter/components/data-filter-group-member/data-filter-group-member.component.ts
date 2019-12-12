import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataGroup } from 'src/app/models';

@Component({
  selector: 'app-data-filter-group-member',
  templateUrl: './data-filter-group-member.component.html',
  styleUrls: ['./data-filter-group-member.component.scss']
})
export class DataFilterGroupMemberComponent implements OnInit {
  @Input()
  groupMember: any;

  @Input()
  dataGroup: DataGroup;

  @Output()
  removeMember: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  updateMember: EventEmitter<any> = new EventEmitter<any>();

  isFormOpen: boolean;
  constructor() {}

  ngOnInit() {}

  onRemoveMember(dataGroup: DataGroup, member: any, e) {
    e.stopPropagation();
    this.removeMember.emit({ dataItem: member, group: dataGroup });
  }

  onToggleForm(e) {
    e.stopPropagation();
    this.isFormOpen = !this.isFormOpen;
  }

  onInputChange(e) {
    e.stopPropagation();
    this.updateMember.emit(this.groupMember);
  }
}
