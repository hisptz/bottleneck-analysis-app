import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeterminantMemberFormComponent } from './determinant-member-form.component';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DataFilterGroupMemberComponent', () => {
  let component: DeterminantMemberFormComponent;
  let fixture: ComponentFixture<DeterminantMemberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DeterminantMemberFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeterminantMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
