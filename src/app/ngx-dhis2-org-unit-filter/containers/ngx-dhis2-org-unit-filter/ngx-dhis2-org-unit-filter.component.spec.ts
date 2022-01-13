import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NgxDhis2OrgUnitFilterComponent } from "./ngx-dhis2-org-unit-filter.component";
import { NgxDhis2OrgUnitSelectedOrgUnitComponent } from "../../components/ngx-dhis2-org-unit-selected-org-unit/ngx-dhis2-org-unit-selected-org-unit.component";
import { NgxDhis2OrgUnitSelectionComponent } from "../../components/ngx-dhis2-org-unit-selection/ngx-dhis2-org-unit-selection.component";
import { NgxDhis2UserOrgUnitSelectionComponent } from "../../components/ngx-dhis2-user-org-unit-selection/ngx-dhis2-user-org-unit-selection.component";
import { NgxDhis2OrgUnitLevelGroupComponent } from "../../components/ngx-dhis2-org-unit-level-group/ngx-dhis2-org-unit-level-group.component";
import { NgxDhis2OrgUnitProgressComponent } from "../../components/ngx-dhis2-org-unit-progress/ngx-dhis2-org-unit-progress.component";
import { NgxDhis2OrgUnitTreeItemComponent } from "../../components/ngx-dhis2-org-unit-tree-item/ngx-dhis2-org-unit-tree-item.component";
import { StoreModule } from "@ngrx/store";
import { reducers, effects } from "src/app/store";
import { EffectsModule } from "@ngrx/effects";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { FilterByOrgUnitGroupLevelPipe } from "../../pipes/org-unit-group-level-filter.pipe";

describe("NgxDhis2OrgUnitFilterComponent", () => {
  let component: NgxDhis2OrgUnitFilterComponent;
  let fixture: ComponentFixture<NgxDhis2OrgUnitFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
      ],
      declarations: [
        NgxDhis2OrgUnitFilterComponent,
        NgxDhis2OrgUnitSelectedOrgUnitComponent,
        NgxDhis2OrgUnitSelectionComponent,
        NgxDhis2UserOrgUnitSelectionComponent,
        NgxDhis2OrgUnitLevelGroupComponent,
        NgxDhis2OrgUnitProgressComponent,
        NgxDhis2OrgUnitTreeItemComponent,
        FilterByOrgUnitGroupLevelPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2OrgUnitFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
