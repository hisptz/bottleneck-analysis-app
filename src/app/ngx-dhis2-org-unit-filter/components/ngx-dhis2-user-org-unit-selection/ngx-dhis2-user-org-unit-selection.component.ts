import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from "@angular/core";

import { OrgUnit } from "../../models/org-unit.model";

@Component({
  selector: "ngx-dhis2-user-org-unit-selection",
  templateUrl: "./ngx-dhis2-user-org-unit-selection.component.html",
  styleUrls: ["./ngx-dhis2-user-org-unit-selection.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxDhis2UserOrgUnitSelectionComponent implements OnInit {
  @Input()
  userOrgUnits: OrgUnit[];

  @Output() activateUserOrgUnit: EventEmitter<any> = new EventEmitter<any>();
  @Output() deactivateUserOrgUnit: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onUpdate(e, selectedUserOrgUnit: any) {
    e.stopPropagation();
    // emit selected or deselected user org unit
    if (selectedUserOrgUnit.selected) {
      this.deactivateUserOrgUnit.emit({
        id: selectedUserOrgUnit.id,
        name: selectedUserOrgUnit.name,
        type: selectedUserOrgUnit.type,
      });
    } else {
      this.activateUserOrgUnit.emit({
        id: selectedUserOrgUnit.id,
        name: selectedUserOrgUnit.name,
        type: selectedUserOrgUnit.type,
      });
    }
  }
}
