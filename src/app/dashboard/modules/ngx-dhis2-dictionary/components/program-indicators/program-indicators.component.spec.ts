import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramIndicatorsComponent } from './program-indicators.component';

describe('ProgramIndicatorsComponent', () => {
  let component: ProgramIndicatorsComponent;
  let fixture: ComponentFixture<ProgramIndicatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramIndicatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
