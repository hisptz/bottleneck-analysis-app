import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { DRAG_ICON, ARROW_DOWN_ICON } from '../../icons';
import * as _ from 'lodash';
import { generateUid } from '../../../../../../../helpers/generate-uid.helper';
import { DragulaService } from 'ng2-dragula';
import { removeMemberFromGroup } from '../../helpers/remove-member-from-group.helper';
import { DataGroup } from 'src/app/models';
import { updateDataGroupInList } from '../../helpers/update-data-group-in-list.helper';
import { addDefaultDataGroupInList } from '../../helpers/add-default-data-group-in-list.helper';
import { removeGroupFromList } from '../../helpers/remove-group-from-list.helper';
import { addMembersToGroups } from '../../helpers/add-members-to-group.helper';
import { removeAllMembersFromGroups } from '../../helpers';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-data-filter-groups',
  templateUrl: './data-filter-groups.component.html',
  styleUrls: ['./data-filter-groups.component.css']
})
export class DataFilterGroupsComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  dataGroups: any[];
  @Input()
  selectedItems: any[];
  @Input()
  selectedGroupId: string;

  @Input()
  dataGroupPreferences: {
    maximumNumberOfGroups: number;
    maximumItemPerGroup: number;
  };
  @Output()
  dataGroupsUpdate: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output()
  selectedGroupIdUpdate: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  removeMember: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  updateSelectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();
  // icons
  dragIcon: string;
  arrowDownIcon: string;

  constructor(private dragulaService: DragulaService) {
    this.dragIcon = DRAG_ICON;
    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.dataGroups = [];

    this.dragulaService.createGroup('GROUPS', {
      direction: 'vertical',
      moves: (el, source, handle) => handle.className === 'group-handle'
    });
  }

  get selectedGroup() {
    return _.find(this.dataGroups || [], ['id', this.selectedGroupId]);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (
      simpleChanges.selectedItems &&
      !simpleChanges.selectedItems.firstChange
    ) {
      const selectedItems = simpleChanges.selectedItems.currentValue;

      if (selectedItems.length > 0) {
        this.onAddMembers(selectedItems);
      }
    }
  }

  ngOnInit() {
    if (!this.selectedGroupId && this.dataGroups[0]) {
      this.selectedGroupId = this.dataGroups[0].id;
    }
  }

  onAddGroup(e) {
    e.stopPropagation();
    const newGroupId = generateUid();
    this.selectedGroupId = newGroupId;
    this.dataGroups = addDefaultDataGroupInList(this.dataGroups, newGroupId);
    this.selectedGroupIdUpdate.emit(this.selectedGroupId);
  }

  onSetCurrentGroup(currentDataGroup, e) {
    e.stopPropagation();

    if (currentDataGroup.id === this.selectedGroupId) {
      this.selectedGroupId = '';
    } else {
      this.selectedGroupId = currentDataGroup.id;
    }

    this.selectedGroupIdUpdate.emit(this.selectedGroupId);
  }

  onAddMembers(members: any[]) {
    this.dataGroups = addMembersToGroups(
      this.dataGroups,
      this.selectedGroupId,
      members,
      this.dataGroupPreferences
    );
    this.emitDataGroups();
  }

  onRemoveMember(dataGroup: DataGroup, member: any, e) {
    e.stopPropagation();
    this.dataGroups = updateDataGroupInList(
      this.dataGroups,
      removeMemberFromGroup(dataGroup, member)
    );
    this.emitDataGroups();

    this.removeMember.emit(member);
  }

  onRemovedAllMembers() {
    this.dataGroups = removeAllMembersFromGroups(this.dataGroups);
  }

  onDeleteGroup(group: any, e) {
    e.stopPropagation();
    // remove group members
    _.each(group ? group.members : [], (groupMember: any) => {
      this.removeMember.emit(groupMember);
    });

    this.dataGroups = removeGroupFromList(this.dataGroups, group);

    this.emitDataGroups();
  }

  onSortGroups(sortedDataGroups: any[]) {
    this.dataGroups = [...sortedDataGroups];
    this.emitDataGroups();
  }

  onSortGroupMembers(sortedMembers: any[], group: any) {
    const groupIndex = this.dataGroups.indexOf(
      _.find(this.dataGroups, ['id', group.id])
    );

    if (groupIndex !== -1) {
      this.dataGroups = [
        ..._.slice(this.dataGroups, 0, groupIndex),
        { ...group, members: sortedMembers },
        ..._.slice(this.dataGroups, groupIndex + 1)
      ];

      this.updateSelectedItems.emit(
        _.flatten(_.map(this.dataGroups, (dataGroup: any) => dataGroup.members))
      );

      this.emitDataGroups();
    }
  }

  emitDataGroups() {
    let membersToRemove = [];
    this.dataGroups = _.filter(this.dataGroups, (dataGroup: any) => {
      if (dataGroup.name === '') {
        membersToRemove = [...membersToRemove, ...dataGroup.members];
      }
      return dataGroup.name !== '';
    });

    // Also remove members for the removed groups
    _.each(membersToRemove, (member: any) => {
      this.removeMember.emit(member);
    });
    this.dataGroupsUpdate.emit(this.dataGroups);
  }

  onUpdateDataGroup(dataGroup: any) {
    this.dataGroups = updateDataGroupInList(this.dataGroups, dataGroup);
    this.emitDataGroups();
  }

  ngOnDestroy() {
    this.dragulaService.destroy('GROUPS');
    this.emitDataGroups();
  }
}
