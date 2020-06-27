import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramIndicatorComponent } from './program-indicator.component';
import { StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProgramIndicatorComponent', () => {
  let component: ProgramIndicatorComponent;
  let fixture: ComponentFixture<ProgramIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProgramIndicatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
