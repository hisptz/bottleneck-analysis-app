import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import { OrgUnit } from '../../models';
import { PLUS_CIRCLE_ICON, MINUS_CIRCLE_ICON } from '../../icons';
import { Store } from '@ngrx/store';
import { OrgUnitFilterState } from '../../store';
import { Observable, Subject } from 'rxjs';
import { getOrgUnitById } from '../../store/selectors/org-unit.selectors';
import { first, take, filter } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-org-unit-tree-item',
  templateUrl: './ngx-dhis2-org-unit-tree-item.component.html',
  styleUrls: ['./ngx-dhis2-org-unit-tree-item.component.css']
})
export class NgxDhis2OrgUnitTreeItemComponent implements OnInit, OnChanges {
  @Input() orgUnitId: string;
  @Input() expanded: boolean;
  @Input() selectedOrgUnits: any[];

  // events
  @Output() activate = new EventEmitter();
  @Output() deactivate = new EventEmitter();

  orgUnit$: Observable<OrgUnit>;
  selected: boolean;
  selectedChildren: number;

  // icons
  plusCircleIcon: string;
  minusCircleIcon: string;
  constructor(private store: Store<OrgUnitFilterState>) {
    // icons initialization
    this.plusCircleIcon = PLUS_CIRCLE_ICON;
    this.minusCircleIcon = MINUS_CIRCLE_ICON;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedOrgUnits']) {
      this.setOrgUnitProperties(simpleChanges['selectedOrgUnits'].firstChange);
    }
  }

  ngOnInit() {
    if (this.orgUnitId) {
      // fetch current org unit
      this.orgUnit$ = this.store.select(getOrgUnitById(this.orgUnitId));

      this.setOrgUnitProperties(true);
    }
  }

  setOrgUnitProperties(firstChange?: boolean) {
    // get org unit selection status
    this.selected = _.some(
      this.selectedOrgUnits || [],
      orgUnit => orgUnit.id === this.orgUnitId
    );

    // set expanded state considering has children selected

    if (this.orgUnit$) {
      this.orgUnit$
        .pipe(first((orgUnit: any) => orgUnit))
        .subscribe((orgUnit: OrgUnit) => {
          if (orgUnit && orgUnit.children) {
            const selectedOrgUnitIds = _.map(
              this.selectedOrgUnits,
              selectedOrgUnit => selectedOrgUnit.id
            );

            this.selectedChildren = _.filter(
              orgUnit.children,
              orgUnitChildId =>
                selectedOrgUnitIds.indexOf(orgUnitChildId) !== -1
            ).length;

            if (!this.expanded && firstChange) {
              this.expanded = _.some(
                this.selectedOrgUnits || [],
                selectedOrgUnit =>
                  orgUnit.children.indexOf(selectedOrgUnit.id) !== -1
              );
            }
          }
        });
    }
  }

  onToggleOrgUnitChildren(e) {
    e.stopPropagation();
    this.expanded = !this.expanded;
  }

  onToggleOrgUnit(e) {
    e.stopPropagation();
    this.orgUnit$.pipe(take(1)).subscribe((orgUnit: OrgUnit) => {
      if (this.selected) {
        this.onDeactivateOu(orgUnit);
      } else {
        this.onActivateOu(orgUnit);
      }

      this.selected = !this.selected;
    });
  }

  onDeactivateOu(organisationUnit) {
    this.deactivate.emit(organisationUnit);
  }

  onActivateOu(organisationUnit) {
    this.activate.emit(organisationUnit);
  }
}
