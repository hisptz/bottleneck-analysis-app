import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { CLOSE_ICON } from '../../icons';

@Component({
  selector: 'ngx-dhis2-org-unit-selected-org-unit',
  templateUrl: './ngx-dhis2-org-unit-selected-org-unit.component.html',
  styleUrls: ['./ngx-dhis2-org-unit-selected-org-unit.component.css']
})
export class NgxDhis2OrgUnitSelectedOrgUnitComponent implements OnInit {
  @Input() selectedOrgUnits: any[];

  closeIcon: string;
  constructor() {
    this.closeIcon = CLOSE_ICON;
  }

  get selectedOrgUnitsOnly() {
    return _.filter(
      this.selectedOrgUnits || [],
      orgUnit => orgUnit.type === 'ORGANISATION_UNIT'
    );
  }

  ngOnInit() {}
}
