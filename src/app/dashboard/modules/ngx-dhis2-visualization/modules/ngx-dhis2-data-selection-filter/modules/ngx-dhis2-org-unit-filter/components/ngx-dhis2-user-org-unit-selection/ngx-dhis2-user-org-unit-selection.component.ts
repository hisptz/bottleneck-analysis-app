import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { USER_ORG_UNITS } from '../../constants/user-org-units.constants';

@Component({
  selector: 'ngx-dhis2-user-org-unit-selection',
  templateUrl: './ngx-dhis2-user-org-unit-selection.component.html',
  styleUrls: ['./ngx-dhis2-user-org-unit-selection.component.css']
})
export class NgxDhis2UserOrgUnitSelectionComponent implements OnInit {
  @Input() selectedUserOrgUnits: any[];

  @Output() activateUserOrgUnit: EventEmitter<any> = new EventEmitter<any>();
  @Output() deactivateUserOrgUnit: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  get userOrgUnits(): any[] {
    return _.map(USER_ORG_UNITS || [], userOrgUnit => {
      return {
        ...userOrgUnit,
        selected: _.some(
          this.selectedUserOrgUnits,
          selectedUserOrgUnit => selectedUserOrgUnit.id === userOrgUnit.id
        )
      };
    });
  }

  ngOnInit() {}

  onUpdate(e, selectedUserOrgUnit: any) {
    e.stopPropagation();
    if (selectedUserOrgUnit.selected) {
      this.deactivateUserOrgUnit.emit({
        id: selectedUserOrgUnit.id,
        name: selectedUserOrgUnit.name,
        type: selectedUserOrgUnit.type
      });
    } else {
      this.activateUserOrgUnit.emit({
        id: selectedUserOrgUnit.id,
        name: selectedUserOrgUnit.name,
        type: selectedUserOrgUnit.type
      });
    }
  }
}
