import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadLegendComponent } from './download-legend.component';

describe('DownloadLegendComponent', () => {
  let component: DownloadLegendComponent;
  let fixture: ComponentFixture<DownloadLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
