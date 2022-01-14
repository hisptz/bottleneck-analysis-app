import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { NgxDhis2OrgUnitLevelGroupComponent } from "./components/ngx-dhis2-org-unit-level-group/ngx-dhis2-org-unit-level-group.component";
import { NgxDhis2OrgUnitProgressComponent } from "./components/ngx-dhis2-org-unit-progress/ngx-dhis2-org-unit-progress.component";
import { NgxDhis2OrgUnitSelectedOrgUnitComponent } from "./components/ngx-dhis2-org-unit-selected-org-unit/ngx-dhis2-org-unit-selected-org-unit.component";
import { NgxDhis2OrgUnitSelectionComponent } from "./components/ngx-dhis2-org-unit-selection/ngx-dhis2-org-unit-selection.component";
import { NgxDhis2OrgUnitTreeItemComponent } from "./components/ngx-dhis2-org-unit-tree-item/ngx-dhis2-org-unit-tree-item.component";
import { NgxDhis2UserOrgUnitSelectionComponent } from "./components/ngx-dhis2-user-org-unit-selection/ngx-dhis2-user-org-unit-selection.component";
import { NgxDhis2OrgUnitFilterComponent } from "./containers/ngx-dhis2-org-unit-filter/ngx-dhis2-org-unit-filter.component";
import { FilterByOrgUnitGroupLevelPipe } from "./pipes/org-unit-group-level-filter.pipe";
import { OrgUnitGroupService } from "./services/org-unit-group.service";
import { OrgUnitLevelService } from "./services/org-unit-level.service";
import { OrgUnitService } from "./services/org-unit.service";
import { OrgUnitGroupEffects } from "./store/effects/org-unit-group.effects";
import { OrgUnitLevelEffects } from "./store/effects/org-unit-level.effects";
import { OrgUnitEffects } from "./store/effects/org-unit.effects.";
import { orgUnitFilterReducer } from "./store/reducers/org-unit-filter.reducer";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    StoreModule.forFeature("orgUnitFilter", orgUnitFilterReducer),
    EffectsModule.forFeature([
      OrgUnitLevelEffects,
      OrgUnitGroupEffects,
      OrgUnitEffects,
    ]),
  ],
  declarations: [
    NgxDhis2OrgUnitFilterComponent,
    NgxDhis2OrgUnitSelectionComponent,
    NgxDhis2UserOrgUnitSelectionComponent,
    NgxDhis2OrgUnitLevelGroupComponent,
    NgxDhis2OrgUnitSelectedOrgUnitComponent,
    NgxDhis2OrgUnitTreeItemComponent,
    NgxDhis2OrgUnitProgressComponent,
    FilterByOrgUnitGroupLevelPipe,
  ],
  providers: [OrgUnitService, OrgUnitGroupService, OrgUnitLevelService],
  exports: [NgxDhis2OrgUnitFilterComponent],
})
export class NgxDhis2OrgUnitFilterModule {}
