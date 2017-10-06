import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLoaderComponent } from './chart-loader.component';

describe('ChartLoaderComponent', () => {
  let component: ChartLoaderComponent;
  let fixture: ComponentFixture<ChartLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
