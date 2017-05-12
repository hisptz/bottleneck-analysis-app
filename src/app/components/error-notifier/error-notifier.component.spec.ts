import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNotifierComponent } from './error-notifier.component';

describe('ErrorNotifierComponent', () => {
  let component: ErrorNotifierComponent;
  let fixture: ComponentFixture<ErrorNotifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorNotifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
