import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartListComponent } from './chart-list.component';
import { ChartItemComponent } from '../chart-item/chart-item.component';

describe('ChartListComponent', () => {
  let component: ChartListComponent;
  let fixture: ComponentFixture<ChartListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartListComponent, ChartItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
