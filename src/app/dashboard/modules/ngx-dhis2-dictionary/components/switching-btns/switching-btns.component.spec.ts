import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchingBtnsComponent } from './switching-btns.component';

describe('SwitchingBtnsComponent', () => {
  let component: SwitchingBtnsComponent;
  let fixture: ComponentFixture<SwitchingBtnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchingBtnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchingBtnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
