import { Component, OnInit, Input } from '@angular/core';
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
  @Input() selectedLevelsOrGroups: any[];
  /**
   * Input for organisation unit levels
   */
  @Input() orgUnitLevels: OrgUnitLevel[];

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

  constructor() {
    this.tickIcon = TICK;
  }

  ngOnInit() {}

  onOrgUnitGroupLevelFilter(e) {
    e.stopPropagation();
    this.orgUnitGroupLevelSearchQuery = e.target.value;
  }
}
