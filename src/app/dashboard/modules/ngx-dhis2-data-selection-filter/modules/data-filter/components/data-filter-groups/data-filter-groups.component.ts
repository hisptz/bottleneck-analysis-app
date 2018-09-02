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
  dataGroupPreferences: { maximumNumberOfGroups: number };
  @Output()
  dataGroupsUpdate: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output()
  selectedGroupUpdate: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  removeMember: EventEmitter<any> = new EventEmitter<any>();
  // icons
  dragIcon: string;
  arrowDownIcon: string;
  constructor() {
    this.dragIcon = DRAG_ICON;
    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.dataGroups = [];
    this.dataGroupPreferences = { maximumNumberOfGroups: 6 };
  }

  get dataGroupsVm() {
    return _.map(
      this.dataGroups || [],
      (dataGroup: any, dataGroupIndex: number) => {
        return {
          ...dataGroup,
          current: this.selectedGroupId
            ? dataGroup.id === this.selectedGroupId
            : dataGroupIndex === 0
        };
      }
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedItems']) {
      if (this.dataGroups.length === 1) {
        this.dataGroups = _.map(this.dataGroups, dataGroup => {
          return {
            ...dataGroup,
            members: _.map(this.selectedItems, selectedItem => {
              return {
                id: selectedItem.id,
                name: selectedItem.name
              };
            })
          };
        });
      } else {
        let alreadySelectedItems = [];
        this.dataGroups = _.map(
          _.map(this.dataGroups, dataGroup => {
            return {
              ...dataGroup,
              members:
                !dataGroup.current && dataGroup.members.length > 0
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
            return {
              ...newDataGroup,
              members: newDataGroup.current
                ? _.filter(
                    this.selectedItems,
                    selectedItem =>
                      !_.find(alreadySelectedItems, ['id', selectedItem.id])
                  )
                : newDataGroup.members
            };
          }
        );
      }
      this.dataGroupsUpdate.emit(this.dataGroups);
    }
  }

  ngOnInit() {
    if (this.dataGroups && this.dataGroups[0] && !this.selectedGroupId) {
      this.selectedGroupId = this.dataGroups[0].id;
    }
  }

  onAddGroup(e) {
    e.stopPropagation();
    const currentGroupLength = this.dataGroups.length;
    this.dataGroups = [
      ..._.map(this.dataGroups, dataGroup => {
        return { ...dataGroup, current: false };
      }),
      {
        id: `group${currentGroupLength + 1}`,
        name: `Untitled Group ${currentGroupLength + 1}`,
        color: '#000000',
        current: true,
        members: []
      }
    ];

    this.dataGroupsUpdate.emit(this.dataGroups);
  }

  onSetCurrentGroup(currentDataGroup, e) {
    e.stopPropagation();
    this.dataGroups = _.map(this.dataGroups, (dataGroup: any) => {
      return {
        ...dataGroup,
        current: dataGroup.id === currentDataGroup.id && !dataGroup.current
      };
    });

    this.dataGroupsUpdate.emit(this.dataGroups);
    this.selectedGroupUpdate.emit(currentDataGroup.id);
  }

  onRemoveMember(member: any, e) {
    e.stopPropagation();
    this.removeMember.emit(member);
  }

  ngOnDestroy() {
    this.dataGroupsUpdate.emit(this.dataGroups);
    this.selectedGroupUpdate.emit(this.selectedGroupId);
  }
}
