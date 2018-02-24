import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpretationContainerComponent } from './interpretation-container.component';

describe('InterpretationContainerComponent', () => {
  let component: InterpretationContainerComponent;
  let fixture: ComponentFixture<InterpretationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterpretationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpretationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
