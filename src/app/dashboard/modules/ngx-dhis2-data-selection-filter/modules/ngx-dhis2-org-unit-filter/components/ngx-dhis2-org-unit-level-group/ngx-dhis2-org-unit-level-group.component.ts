import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { TICK } from '../../icons';
import { OrgUnitLevel, OrgUnitGroup } from '../../models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-org-unit-level-group',
  templateUrl: './ngx-dhis2-org-unit-level-group.component.html',
  styleUrls: ['./ngx-dhis2-org-unit-level-group.component.css']
})
export class NgxDhis2OrgUnitLevelGroupComponent implements OnInit {
  /**
   * Input for selected levels or groups
   */
  @Input() selectedLevelsOrGroups: string[];

  @Input() topOrgUnitLevel: number;

  /**
   * Input for organisation unit levels
   */
  @Input() orgUnitLevels: OrgUnitLevel[];

  @Input() loadingLevels: boolean;
  @Input() loadingGroups: boolean;

  /**
   * Input for organisation unit groups
   */
  @Input() orgUnitGroups: OrgUnitGroup[];

  /**
   * base 64 image string for the tick icon
   */
  tickIcon: string;

  /**
   * Search query for org unit group and levels
   */
  orgUnitGroupLevelSearchQuery: string;

  @Output() activateOrgUnitLevelOrGroup = new EventEmitter();
  @Output() deactivateOrgUnitLevelOrGroup = new EventEmitter();

  constructor() {
    this.tickIcon = TICK;
  }

  get filteredOrgUnitLevels(): any[] {
    return _.map(
      _.filter(
        this.orgUnitLevels,
        orgUnitLevel => orgUnitLevel.level >= this.topOrgUnitLevel
      ),
      orgUnitLevel => {
        return {
          ...orgUnitLevel,
          selected:
            this.selectedLevelsOrGroups.indexOf(
              'LEVEL-' + orgUnitLevel.level
            ) !== -1
        };
      }
    );
  }

  get filteredOrgUnitGroups(): any[] {
    return _.map(this.orgUnitGroups, orgUnitGroup => {
      return {
        ...orgUnitGroup,
        selected:
          this.selectedLevelsOrGroups.indexOf('OU_GROUP-' + orgUnitGroup.id) !==
          -1
      };
    });
  }

  ngOnInit() {}

  onOrgUnitGroupLevelFilter(e) {
    e.stopPropagation();
    this.orgUnitGroupLevelSearchQuery = e.target.value;
  }

  onUpdate(e, selectedOrgUnitLevelOrGroup: any, itemType: string) {
    e.stopPropagation();
    if (selectedOrgUnitLevelOrGroup.selected) {
      this.deactivateOrgUnitLevelOrGroup.emit({
        id:
          itemType === 'LEVEL'
            ? 'LEVEL-' + selectedOrgUnitLevelOrGroup.level
            : 'OU_GROUP-' + selectedOrgUnitLevelOrGroup.id,
        name: selectedOrgUnitLevelOrGroup.name,
        type:
          itemType === 'LEVEL'
            ? 'ORGANISATION_UNIT_LEVEL'
            : 'ORGANISATION_UNIT_GROUP'
      });
    } else {
      this.activateOrgUnitLevelOrGroup.emit({
        id:
          itemType === 'LEVEL'
            ? 'LEVEL-' + selectedOrgUnitLevelOrGroup.level
            : 'OU_GROUP-' + selectedOrgUnitLevelOrGroup.id,
        name: selectedOrgUnitLevelOrGroup.name,
        type:
          itemType === 'LEVEL'
            ? 'ORGANISATION_UNIT_LEVEL'
            : 'ORGANISATION_UNIT_GROUP'
      });
    }
  }
}
