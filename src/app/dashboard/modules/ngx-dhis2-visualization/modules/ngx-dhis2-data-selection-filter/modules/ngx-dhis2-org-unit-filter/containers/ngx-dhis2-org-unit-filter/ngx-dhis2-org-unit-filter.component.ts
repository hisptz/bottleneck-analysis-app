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

  get selectedLevelsOrOrgUnits(): any[] {
    return _.filter(
      this.selectedOrgUnitItems,
      selectedOrgUnit =>
        selectedOrgUnit.type === 'ORGANISATION_UNIT_LEVEL' ||
        selectedOrgUnit.type === 'ORGANISATION_UNIT_GROUP'
    );
  }

  get selectedOrgUnits(): any[] {
    return _.filter(
      this.selectedOrgUnitItems,
      selectedOrgUnit => selectedOrgUnit.type === 'ORGANISATION_UNIT'
    );
  }

  get selectedUserOrgUnits(): any[] {
    return _.filter(
      this.selectedOrgUnitItems,
      selectedOrgUnit => selectedOrgUnit.type === 'USER_ORGANISATION_UNIT'
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.onOrgUnitClose();
  }

  onSelectOrgUnit(orgUnit: any) {
    this.selectedOrgUnitItems = !this.orgUnitFilterConfig.singleSelection
      ? [
          ...(orgUnit.type === 'USER_ORGANISATION_UNIT'
            ? _.filter(
                this.selectedOrgUnitItems,
                selectedOrgUnitItem =>
                  selectedOrgUnitItem.type === 'USER_ORGANISATION_UNIT'
              )
            : this.selectedOrgUnitItems),
          orgUnit
        ]
      : [
          ...(orgUnit.type === 'USER_ORGANISATION_UNIT'
            ? []
            : _.filter(
                this.selectedOrgUnitItems,
                selectedOrgUnit => selectedOrgUnit.type !== orgUnit.type
              )),
          orgUnit
        ];

    if (this.orgUnitFilterConfig.updateOnSelect) {
      this.onOrgUnitUpdate();
    }
  }

  onDeselectOrgUnit(orgUnit: any) {
    const orgUnitIndex = this.selectedOrgUnitItems.indexOf(
      _.find(this.selectedOrgUnitItems, ['id', orgUnit.id])
    );

    this.selectedOrgUnitItems = !this.orgUnitFilterConfig.singleSelection
      ? orgUnitIndex !== -1
        ? [
            ..._.slice(this.selectedOrgUnitItems, 0, orgUnitIndex),
            ..._.slice(this.selectedOrgUnitItems, orgUnitIndex + 1)
          ]
        : this.selectedOrgUnitItems
      : [];

    if (this.orgUnitFilterConfig.updateOnSelect) {
      this.onOrgUnitUpdate();
    }
  }

  onOrgUnitClose() {
    this.orgUnitClose.emit({
      dimension: 'ou',
      items: this.selectedOrgUnitItems
    });
  }

  onOrgUnitUpdate() {
    this.orgUnitUpdate.emit({
      dimension: 'ou',
      items: this.selectedOrgUnitItems
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
