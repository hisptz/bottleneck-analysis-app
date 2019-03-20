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
  constructor() {}

  ngOnInit() {}

  onRemoveMember(dataGroup: DataGroup, member: any, e) {
    console.log('here');
    e.stopPropagation();
    this.removeMember.emit({ dataItem: member, group: dataGroup });
  }
}
