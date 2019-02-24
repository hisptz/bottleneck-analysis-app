import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { DEFAULT_ORG_UNIT_FILTER_CONFIG } from '../../constants';
import { getSanitizedSelectedOrgUnits } from '../../helpers/get-sanitized-selected-org-units.helper';
import { OrgUnitGroup, OrgUnitLevel } from '../../models';
import { OrgUnitFilterConfig } from '../../models/org-unit-filter-config.model';
import {
  getOrgUnitGroupLoading,
  getOrgUnitGroups,
  getOrgUnitLevelLoading,
  getOrgUnitLevels,
  LoadOrgUnitGroupsAction,
  LoadOrgUnitLevelsAction,
  LoadOrgUnitsAction,
  OrgUnitFilterState
} from '../../store';
import {
  getOrgUnitLoading,
  getTopOrgUnitLevel
} from '../../store/selectors/org-unit.selectors';

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
  @Input()
  selectedOrgUnitItems: any[];

  /**
   * Org unit filter configuration
   */
  @Input()
  orgUnitFilterConfig: OrgUnitFilterConfig;

  /**
   * Organisation unit level observable
   */
  orgUnitLevels$: Observable<OrgUnitLevel[]>;

  /**
   * Organisation unit group observable
   */
  orgUnitGroups$: Observable<OrgUnitGroup[]>;

  loadingOrgUnitLevels$: Observable<boolean>;
  loadingOrgUnitGroups$: Observable<boolean>;
  loadingOrgUnits$: Observable<boolean>;

  @Output()
  orgUnitUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  orgUnitClose: EventEmitter<any> = new EventEmitter<any>();

  topOrgUnitLevel$: Observable<number>;

  constructor(private store: Store<OrgUnitFilterState>) {
    // default org unit filter configuration
    this.orgUnitFilterConfig = {
      ...DEFAULT_ORG_UNIT_FILTER_CONFIG,
      ...this.orgUnitFilterConfig
    };

    // Dispatching actions to load organisation unit information
    store.dispatch(new LoadOrgUnitLevelsAction());
    store.dispatch(new LoadOrgUnitGroupsAction());
    store.dispatch(new LoadOrgUnitsAction(this.orgUnitFilterConfig));

    // Selecting organisation unit information
    this.orgUnitLevels$ = store.select(getOrgUnitLevels);
    this.orgUnitGroups$ = store.select(getOrgUnitGroups);
    this.loadingOrgUnitGroups$ = store.select(getOrgUnitGroupLoading);
    this.loadingOrgUnitLevels$ = store.select(getOrgUnitLevelLoading);
    this.loadingOrgUnits$ = store.select(getOrgUnitLoading);
  }

  get selectedLevelsOrOrgUnits(): string[] {
    return _.map(
      _.filter(
        this.selectedOrgUnitItems,
        selectedOrgUnit =>
          selectedOrgUnit.type === 'ORGANISATION_UNIT_LEVEL' ||
          selectedOrgUnit.id.indexOf('LEVEL') > -1 ||
          selectedOrgUnit.type === 'ORGANISATION_UNIT_GROUP'
      ),
      levelOrGroup => levelOrGroup.id
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

  get topOrgUnitLevel(): Observable<number> {
    return this.store.select(getTopOrgUnitLevel(this.selectedOrgUnits));
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.orgUnitFilterConfig.closeOnDestroy) {
      this.onOrgUnitClose();
    }
  }

  onSelectOrgUnit(orgUnit: any) {
    if (
      orgUnit.type === 'ORGANISATION_UNIT_LEVEL' ||
      orgUnit.type === 'ORGANISATION_UNIT_GROUP'
    ) {
      if (orgUnit.type === 'ORGANISATION_UNIT_LEVEL') {
        this.selectedOrgUnitItems = [
          ..._.filter(
            this.selectedOrgUnitItems,
            selectedOrgUnitItem =>
              selectedOrgUnitItem.type !== 'ORGANISATION_UNIT_GROUP'
          ),
          orgUnit
        ];
      } else {
        this.selectedOrgUnitItems = [
          ..._.filter(
            this.selectedOrgUnitItems,
            selectedOrgUnitItem =>
              selectedOrgUnitItem.type !== 'ORGANISATION_UNIT_LEVEL'
          ),
          orgUnit
        ];
      }
    } else {
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
    }

    if (this.orgUnitFilterConfig.updateOnSelect) {
      this.onOrgUnitUpdate();
    }
  }

  onDeselectOrgUnit(orgUnit: any) {
    const orgUnitIndex = this.selectedOrgUnitItems.indexOf(
      _.find(this.selectedOrgUnitItems, ['id', orgUnit.id])
    );

    this.selectedOrgUnitItems =
      orgUnitIndex !== -1
        ? !this.orgUnitFilterConfig.singleSelection
          ? [
              ..._.slice(this.selectedOrgUnitItems, 0, orgUnitIndex),
              ..._.slice(this.selectedOrgUnitItems, orgUnitIndex + 1)
            ]
          : orgUnit.type === 'ORGANISATION_UNIT_LEVEL' ||
            orgUnit.type === 'ORGANISATION_UNIT_GROUP'
          ? [
              ..._.slice(this.selectedOrgUnitItems, 0, orgUnitIndex),
              ..._.slice(this.selectedOrgUnitItems, orgUnitIndex + 1)
            ]
          : []
        : this.selectedOrgUnitItems;

    if (this.orgUnitFilterConfig.updateOnSelect) {
      this.onOrgUnitUpdate();
    }
  }

  onOrgUnitClose() {
    this.orgUnitClose.emit({
      dimension: 'ou',
      items: getSanitizedSelectedOrgUnits(this.selectedOrgUnitItems)
    });
  }

  onOrgUnitUpdate() {
    this.orgUnitUpdate.emit({
      dimension: 'ou',
      items: getSanitizedSelectedOrgUnits(this.selectedOrgUnitItems)
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
