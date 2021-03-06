import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as _ from 'lodash';
import { DragulaService } from 'ng2-dragula';
import { Determinant } from 'src/app/models';
import { generateUid } from '../../../../../../../helpers/generate-uid.helper';
import { removeAllMembersFromDeterminants } from '../../helpers';
import { addDefaultDeterminantInList } from '../../helpers/add-default-determinant-in-list.helper';
import { removeDeterminantFromList } from '../../helpers/remove-determinant-from-list.helper';
import { updateDeterminantInList } from '../../helpers/update-data-determinant-in-list.helper';
import { ARROW_DOWN_ICON, DRAG_ICON } from '../../icons';
import { DataFilterType } from '../../models/data-filter-type.model';
import { getDeterminantMemberLegendSet } from '../../helpers/get-determinant-member-legend-set.helper';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-determinant-list',
  templateUrl: './determinant-list.component.html',
  styleUrls: ['./determinant-list.component.css'],
})
export class DeterminantListComponent implements OnInit, OnDestroy {
  determinantList: Determinant[];
  @Input() determinants: any[];
  @Input() selectedItems: any[];
  @Input() selectedDeterminantId: string;
  @Input() dataFilterTypes: DataFilterType[];
  @Input() dataFilterGroups: any[];
  @Input() currentDataFilterGroup: any;
  @Input() dataFilterItems: any[];
  @Input() generalDataConfiguration: any;
  @Input() determinantPreferences: {
    maximumNumberOfDeterminants: number;
    maximumItemPerDeterminant: number;
  };

  currentDeterminantMember: any;
  showDataSelection: boolean;

  @Output()
  determinantsUpdate: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output()
  selectDeterminant: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  removeMember: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  updateMember: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  updateSelectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output()
  toggleDataFilterType: EventEmitter<DataFilterType[]> = new EventEmitter<
    DataFilterType[]
  >();

  @Output() setDataFilterGroup: EventEmitter<any> = new EventEmitter<any>();

  @Output() selectDataItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeAllDeterminantMembers: EventEmitter<any> = new EventEmitter<
    any
  >();
  @Output() removeDeterminantMember: EventEmitter<any> = new EventEmitter<
    any
  >();
  // icons
  dragIcon: string;
  arrowDownIcon: string;

  constructor(private dragulaService: DragulaService) {
    this.dragIcon = DRAG_ICON;
    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.determinants = [];

    this.dragulaService.createGroup('GROUPS', {
      direction: 'vertical',
      moves: (el, source, handle) => handle.className === 'group-handle',
    });
  }

  get selectedDeterminant() {
    return _.find(this.determinants || [], ['id', this.selectedDeterminantId]);
  }

  ngOnInit() {}

  onAddDeterminant(e) {
    e.stopPropagation();
    const newDeterminantId = generateUid();
    this.selectedDeterminantId = newDeterminantId;
    this.determinants = addDefaultDeterminantInList(
      this.determinants,
      newDeterminantId
    );
    this.selectDeterminant.emit(this.selectedDeterminantId);
  }

  onSetCurrentDeterminant(currentDeterminant, e) {
    e.stopPropagation();

    if (currentDeterminant.id === this.selectedDeterminantId) {
      this.selectedDeterminantId = '';
    } else {
      this.selectedDeterminantId = currentDeterminant.id;
    }

    this.selectDeterminant.emit(this.selectedDeterminantId);
  }

  onSetCurrentDeterminantMember(id: string, e?) {
    if (e) {
      e.stopPropagation();
    }

    const determinantMemberFromSelected = _.find(this.selectedItems, [
      'id',
      id,
    ]);
    const determinantMemberFromDataFilterList = _.find(this.dataFilterItems, [
      'id',
      id,
    ]);

    this.currentDeterminantMember = {
      ...({
        ...determinantMemberFromSelected,
        legendSet: getDeterminantMemberLegendSet(
          determinantMemberFromSelected || determinantMemberFromDataFilterList,
          this.generalDataConfiguration.legendDefinitions
        ),
      } || {}),
      ...(determinantMemberFromDataFilterList || {}),
    };
  }

  onUpdateMember(member: any) {
    this.currentDeterminantMember = member;
    this.updateMember.emit(member);
  }

  onRemoveMember(memberDetails: { dataItem: any; group: Determinant }) {
    this.removeMember.emit(memberDetails);
  }

  onRemovedAllMembers() {
    this.determinants = removeAllMembersFromDeterminants(this.determinants);
  }

  onDeleteDeterminant(group: any, e) {
    e.stopPropagation();
    // remove group members
    _.each(group ? group.members : [], (groupMember: any) => {
      this.removeMember.emit(groupMember);
    });

    this.determinants = removeDeterminantFromList(this.determinants, group);

    this.emitDeterminants();
  }

  onSortDeterminants(sortedDeterminants: any[]) {
    this.determinants = [...sortedDeterminants];
    this.emitDeterminants();
  }

  onSortDeterminantMembers(sortedMembers: any[], group: any) {
    const groupIndex = this.determinants.indexOf(
      _.find(this.determinants, ['id', group.id])
    );

    if (groupIndex !== -1) {
      this.determinants = [
        ..._.slice(this.determinants, 0, groupIndex),
        { ...group, members: sortedMembers },
        ..._.slice(this.determinants, groupIndex + 1),
      ];

      this.updateSelectedItems.emit(
        _.flatten(
          _.map(
            this.determinants,
            (dataDeterminant: any) => dataDeterminant.members
          )
        )
      );

      this.emitDeterminants();
    }
  }

  emitDeterminants() {
    this.determinantsUpdate.emit(this.determinants);
  }

  onUpdateDeterminant(dataDeterminant: any) {
    this.determinants = updateDeterminantInList(
      this.determinants,
      dataDeterminant
    );
    this.emitDeterminants();
  }

  onOpenDataSelection(determinantId: string, e) {
    e.stopPropagation();
    this.showDataSelection = true;
    this.selectDeterminant.emit(determinantId);
  }

  onCloseDataSelection() {
    this.showDataSelection = false;
  }

  onSetDataFilterGroup(dataFilterGroup: any) {
    this.setDataFilterGroup.emit(dataFilterGroup);
  }

  onToggleDataFilterType(dataFilterTypes: DataFilterType[]) {
    this.toggleDataFilterType.emit(dataFilterTypes);
  }

  onSelectDataItem(dataItem: any) {
    this.showDataSelection = false;
    this.onSetCurrentDeterminantMember(dataItem.id);
    this.selectDataItem.emit(dataItem);
  }

  onRemoveDeterminantMember(dataItem: any, determinant: Determinant, e) {
    if (
      this.currentDeterminantMember &&
      this.currentDeterminantMember.id === dataItem.id
    ) {
      this.currentDeterminantMember = null;
    }
    e.stopPropagation();
    this.removeDeterminantMember.emit({ dataItem, determinant });
  }

  onRemoveAllMembers(e) {
    e.stopPropagation();
    this.removeAllDeterminantMembers.emit(null);
  }

  ngOnDestroy() {
    this.dragulaService.destroy('GROUPS');
    this.emitDeterminants();
  }
}
