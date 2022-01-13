import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NgxDhis2OrgUnitSelectionComponent } from "./ngx-dhis2-org-unit-selection.component";
import { NgxDhis2OrgUnitProgressComponent } from "../ngx-dhis2-org-unit-progress/ngx-dhis2-org-unit-progress.component";
import { NgxDhis2OrgUnitTreeItemComponent } from "../ngx-dhis2-org-unit-tree-item/ngx-dhis2-org-unit-tree-item.component";
import { StoreModule } from "@ngrx/store";
import { reducers, effects } from "src/app/store";
import { EffectsModule } from "@ngrx/effects";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe("NgxDhis2OrgUnitSelectionComponent", () => {
  let component: NgxDhis2OrgUnitSelectionComponent;
  let fixture: ComponentFixture<NgxDhis2OrgUnitSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects),
        RouterTestingModule,
        HttpClientModule,
      ],
      declarations: [
        NgxDhis2OrgUnitSelectionComponent,
        NgxDhis2OrgUnitProgressComponent,
        NgxDhis2OrgUnitTreeItemComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDhis2OrgUnitSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
