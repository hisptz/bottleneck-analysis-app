import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramIndicatorComponent } from './program-indicator.component';

describe('ProgramIndicatorComponent', () => {
  let component: ProgramIndicatorComponent;
  let fixture: ComponentFixture<ProgramIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramIndicatorComponent ]
    })
    .compileComponents();
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
