import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataElementGroupComponent } from './data-element-group.component';

describe('DataElementGroupComponent', () => {
  let component: DataElementGroupComponent;
  let fixture: ComponentFixture<DataElementGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataElementGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataElementGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
