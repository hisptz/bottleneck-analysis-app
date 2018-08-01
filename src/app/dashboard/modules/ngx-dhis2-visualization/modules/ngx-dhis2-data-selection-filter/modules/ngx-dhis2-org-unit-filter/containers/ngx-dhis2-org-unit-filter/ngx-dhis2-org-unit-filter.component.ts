import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

import {
  OrgUnitFilterState,
  getOrgUnitLevels,
  getOrgUnitGroups,
  LoadOrgUnitLevelsAction,
  LoadOrgUnitGroupsAction,
  LoadOrgUnitsAction
} from '../../store';
import { OrgUnitLevel, OrgUnitGroup } from '../../models';
import { OrgUnitFilterConfig } from '../../models/org-unit-filter-config.model';
import { DEFAULT_ORG_UNIT_FILTER_CONFIG } from '../../constants';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-org-unit-filter',
  templateUrl: './ngx-dhis2-org-unit-filter.component.html',
  styleUrls: ['./ngx-dhis2-org-unit-filter.component.css']
})
export class NgxDhis2OrgUnitFilterComponent implements OnInit, OnDestroy {
  /**
   * Selected orgUnit list
   */
  @Input() selectedOrgUnitItems: any[];

  /**
   * Org unit filter configuration
   */
  @Input() orgUnitFilterConfig: OrgUnitFilterConfig;

  /**
   * Organisation unit level observable
   */
  orgUnitLevels$: Observable<OrgUnitLevel[]>;

  /**
   * Organisation unit group observable
   */
  orgUnitGroups$: Observable<OrgUnitGroup[]>;

  @Output() orgUnitUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() orgUnitClose: EventEmitter<any> = new EventEmitter<any>();

  selectedOrgUnits: any[];

  constructor(private store: Store<OrgUnitFilterState>) {
    // default org unit filter configuration
    this.orgUnitFilterConfig = DEFAULT_ORG_UNIT_FILTER_CONFIG;

    // Dispatching actions to load organisation unit information
    store.dispatch(new LoadOrgUnitLevelsAction());
    store.dispatch(new LoadOrgUnitGroupsAction());
    store.dispatch(new LoadOrgUnitsAction(this.orgUnitFilterConfig));

    // Selecting organisation unit information
    this.orgUnitLevels$ = store.select(getOrgUnitLevels);
    this.orgUnitGroups$ = store.select(getOrgUnitGroups);
  }

  ngOnInit() {
    this.selectedOrgUnits = this.selectedOrgUnitItems || [];
  }

  ngOnDestroy() {
    this.onOrgUnitClose();
  }

  onSelectOrgUnit(orgUnit: any) {
    this.selectedOrgUnits = !this.orgUnitFilterConfig.singleSelection
      ? [...this.selectedOrgUnits, orgUnit]
      : [
          ..._.filter(
            this.selectedOrgUnits,
            selectedOrgUnit => selectedOrgUnit.type !== orgUnit.type
          ),
          orgUnit
        ];

    if (this.orgUnitFilterConfig.updateOnSelect) {
      this.onOrgUnitUpdate();
    }
  }

  onDeselectOrgUnit(orgUnit: any) {
    const orgUnitIndex = this.selectedOrgUnits.indexOf(
      _.find(this.selectedOrgUnits, ['id', orgUnit.id])
    );

    this.selectedOrgUnits = !this.orgUnitFilterConfig.singleSelection
      ? orgUnitIndex !== -1
        ? [
            ..._.slice(this.selectedOrgUnits, 0, orgUnitIndex),
            ..._.slice(this.selectedOrgUnits, orgUnitIndex + 1)
          ]
        : this.selectedOrgUnits
      : [];

    if (this.orgUnitFilterConfig.updateOnSelect) {
      this.onOrgUnitUpdate();
    }
  }

  onOrgUnitClose() {
    this.orgUnitClose.emit({
      dimension: 'ou',
      items: this.selectedOrgUnits
    });
  }

  onOrgUnitUpdate() {
    this.orgUnitUpdate.emit({
      dimension: 'ou',
      items: this.selectedOrgUnits
    });
  }

  onClose(e) {
    e.stopPropagation();
    this.onOrgUnitClose();
  }

  onUpdate(e) {
    e.stopPropagation();
    this.onOrgUnitUpdate();
  }
}
