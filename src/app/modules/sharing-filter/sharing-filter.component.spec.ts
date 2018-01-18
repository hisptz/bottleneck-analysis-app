import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingFilterComponent } from './sharing-filter.component';

describe('SharingFilterComponent', () => {
  let component: SharingFilterComponent;
  let fixture: ComponentFixture<SharingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
