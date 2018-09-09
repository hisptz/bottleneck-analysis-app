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
  // icons
  dragIcon: string;
  arrowDownIcon: string;
  constructor() {
    this.dragIcon = DRAG_ICON;
    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.dataGroups = [];
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedItems']) {
      if (this.dataGroups.length === 1) {
        this.dataGroups = _.map(this.dataGroups, dataGroup => {
          return {
            ...dataGroup,
            members: _.slice(
              _.map(this.selectedItems, selectedItem => {
                return {
                  id: selectedItem.id,
                  name: selectedItem.name
                };
              }),
              0,
              this.dataGroupPreferences.maximumItemPerGroup
            )
          };
        });
      } else {
        let alreadySelectedItems = [];
        let additionalSelectedItems = [];
        this.dataGroups = _.map(
          _.map(this.dataGroups, dataGroup => {
            return {
              ...dataGroup,
              members:
                dataGroup.id !== this.selectedGroupId &&
                dataGroup.members.length > 0
                  ? _.filter(dataGroup.members, member => {
                      const availableMember = _.find(this.selectedItems, [
                        'id',
                        member.id
                      ]);

                      // save already selected item for future use
                      alreadySelectedItems = availableMember
                        ? [...alreadySelectedItems, availableMember]
                        : alreadySelectedItems;

                      return availableMember;
                    })
                  : dataGroup.members
            };
          }),
          newDataGroup => {
            const selectedGroupMembers =
              newDataGroup.id === this.selectedGroupId
                ? _.filter(
                    this.selectedItems,
                    selectedItem =>
                      !_.find(alreadySelectedItems, ['id', selectedItem.id])
                  )
                : [];

            additionalSelectedItems = _.uniqBy(
              [
                ...additionalSelectedItems,
                ..._.slice(
                  selectedGroupMembers,
                  this.dataGroupPreferences.maximumItemPerGroup
                )
              ],
              'id'
            );

            const unSelectedGroupMembers =
              newDataGroup.id !== this.selectedGroupId
                ? [...newDataGroup.members, ...additionalSelectedItems]
                : [];

            if (unSelectedGroupMembers.length > 0) {
              additionalSelectedItems = _.slice(
                unSelectedGroupMembers,
                this.dataGroupPreferences.maximumItemPerGroup
              );
            }

            const newMembers =
              newDataGroup.id === this.selectedGroupId
                ? _.slice(
                    selectedGroupMembers,
                    0,
                    this.dataGroupPreferences.maximumItemPerGroup
                  )
                : _.slice(
                    unSelectedGroupMembers,
                    0,
                    this.dataGroupPreferences.maximumItemPerGroup
                  );
            return {
              ...newDataGroup,
              members: newMembers
            };
          }
        );
      }
      this.emitDataGroups();
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
    this.dataGroups = [
      ..._.map(this.dataGroups, dataGroup => {
        return { ...dataGroup, current: false };
      }),
      {
        id: newGroupId,
        name: 'Untitled',
        color: '#000000',
        members: []
      }
    ];

    // this.emitDataGroups();
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

  onRemoveMember(member: any, e) {
    e.stopPropagation();
    this.removeMember.emit(member);
  }

  onDeleteGroup(group: any, e) {
    e.stopPropagation();
    const groupToDelete = _.find(this.dataGroups, [
      'id',
      group ? group.id : ''
    ]);

    const groupIndex = this.dataGroups.indexOf(groupToDelete);

    if (groupIndex !== -1) {
      // Also remove members
      _.each(groupToDelete.members, (groupMember: any) => {
        this.removeMember.emit(groupMember);
      });
      this.dataGroups = [
        ..._.slice(this.dataGroups, 0, groupIndex),
        ..._.slice(this.dataGroups, groupIndex + 1)
      ];

      this.emitDataGroups();
    }
  }

  emitDataGroups() {
    let membersToRemove = [];
    const filterDataGroups = _.filter(this.dataGroups, (dataGroup: any) => {
      if (dataGroup.name === '') {
        membersToRemove = [...membersToRemove, ...dataGroup.members];
      }
      return dataGroup.name !== '' && dataGroup.members.length > 0;
    });

    // Also remove members for the removed groups
    _.each(membersToRemove, (member: any) => {
      this.removeMember.emit(member);
    });
    this.dataGroupsUpdate.emit(filterDataGroups);
  }

  ngOnDestroy() {
    this.emitDataGroups();
  }
}
