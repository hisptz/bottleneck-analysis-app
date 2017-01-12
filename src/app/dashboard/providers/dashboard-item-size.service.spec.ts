/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DashboardItemSizeService } from './dashboard-item-size.service';

describe('Service: DashboardItemSize', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardItemSizeService]
    });
  });

  it('should ...', inject([DashboardItemSizeService], (service: DashboardItemSizeService) => {
    expect(service).toBeTruthy();
  }));
});
