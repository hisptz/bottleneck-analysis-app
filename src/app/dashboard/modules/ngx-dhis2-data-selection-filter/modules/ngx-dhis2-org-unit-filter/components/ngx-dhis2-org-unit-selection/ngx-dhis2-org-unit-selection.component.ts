import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { OrgUnit } from '../../models/org-unit.model';
import { OrgUnitFilterState } from '../../store';
import { getHighestLevelOrgUnitIds } from '../../store/selectors/org-unit.selectors';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-org-unit-selection',
  templateUrl: './ngx-dhis2-org-unit-selection.component.html',
  styleUrls: ['./ngx-dhis2-org-unit-selection.component.css']
})
export class NgxDhis2OrgUnitSelectionComponent implements OnInit {
  @Input() selectedOrgUnits: any[];
  @Input() loadingOrgUnits: boolean;

  @Output() activateOrgUnit = new EventEmitter();
  @Output() deactivateOrgUnit = new EventEmitter();

  highestLevelOrgUnitIds$: Observable<Array<string>>;
  constructor(private store: Store<OrgUnitFilterState>) {
    this.highestLevelOrgUnitIds$ = this.store.select(getHighestLevelOrgUnitIds);
  }

  ngOnInit() {}

  onActivateOrgUnit(orgUnit: OrgUnit) {
    this.activateOrgUnit.emit({
      id: orgUnit.id,
      name: orgUnit.name,
      level: orgUnit.level,
      type: 'ORGANISATION_UNIT'
    });
  }

  onDeactivateOrgUnit(orgUnit: OrgUnit) {
    this.deactivateOrgUnit.emit({
      id: orgUnit.id,
      name: orgUnit.name,
      level: orgUnit.level,
      type: 'ORGANISATION_UNIT'
    });
  }
}
