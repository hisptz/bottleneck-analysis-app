import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Store } from "@ngrx/store";

import { Observable } from "rxjs";
import { OrgUnit } from "../../models/org-unit.model";
import { OrgUnitFilterState } from "../../store/reducers/org-unit-filter.reducer";
import { getHighestLevelOrgUnitIds } from "../../store/selectors/org-unit.selectors";
import { OrgUnitTypes } from "../../constants/org-unit-types.constants";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-dhis2-org-unit-selection",
  templateUrl: "./ngx-dhis2-org-unit-selection.component.html",
  styleUrls: ["./ngx-dhis2-org-unit-selection.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDhis2OrgUnitSelectionComponent implements OnInit {
  @Input() selectedOrgUnits: any[];
  @Input() loadingOrgUnits: boolean;
  @Input() orgUnitsLoaded: boolean;
  @Input() userOrgUnitSelected: boolean;

  @Output() activateOrgUnit = new EventEmitter();
  @Output() deactivateOrgUnit = new EventEmitter();

  highestLevelOrgUnitIds$: Observable<Array<string>>;
  constructor(private store: Store<OrgUnitFilterState>) {}

  ngOnInit() {
    this.highestLevelOrgUnitIds$ = this.store.select(getHighestLevelOrgUnitIds);
  }

  onActivateOrgUnit(orgUnit: OrgUnit) {
    this.activateOrgUnit.emit({
      id: orgUnit.id,
      name: orgUnit.name,
      level: orgUnit.level,
      type: OrgUnitTypes.ORGANISATION_UNIT,
    });
  }

  onDeactivateOrgUnit(orgUnit: OrgUnit) {
    this.deactivateOrgUnit.emit({
      id: orgUnit.id,
      name: orgUnit.name,
      level: orgUnit.level,
      type: OrgUnitTypes.ORGANISATION_UNIT,
    });
  }
}
