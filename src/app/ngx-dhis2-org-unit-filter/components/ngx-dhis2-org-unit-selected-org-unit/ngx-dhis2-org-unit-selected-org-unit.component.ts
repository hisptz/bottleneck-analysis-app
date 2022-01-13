import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";

import { OrgUnit } from "../../models/org-unit.model";

@Component({
  selector: "ngx-dhis2-org-unit-selected-org-unit",
  templateUrl: "./ngx-dhis2-org-unit-selected-org-unit.component.html",
  styleUrls: ["./ngx-dhis2-org-unit-selected-org-unit.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDhis2OrgUnitSelectedOrgUnitComponent implements OnInit {
  @Input() selectedOrgUnits: any[];

  @Output() deactivateOrgUnit = new EventEmitter();
  @Output() deactivateAllOrgUnits = new EventEmitter();

  showAll: boolean;
  constructor() {}
  get selectedString() {
    const selectedOrgUnitString = (this.selectedOrgUnits || [])
      .map((selectedOrgUnit: any) => selectedOrgUnit.name)
      .join(", ");
    return (this.selectedOrgUnits || []).length > 1
      ? `${(this.selectedOrgUnits || []).length} Selected`
      : selectedOrgUnitString;
  }

  ngOnInit() {}

  onDeactivateOrgUnit(orgUnit: OrgUnit, e) {
    e.stopPropagation();
    this.deactivateOrgUnit.emit(orgUnit);
  }

  onDeactivateAllOrgUnits(e) {
    e.stopPropagation();
    this.deactivateAllOrgUnits.emit(null);
  }

  onToggleShowMore(e) {
    e.stopPropagation();
    this.showAll = !this.showAll;
  }
}
