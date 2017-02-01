/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DashboardSearchService } from './dashboard-search.service';

describe('DashboardSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardSearchService]
    });
  });

  it('should ...', inject([DashboardSearchService], (service: DashboardSearchService) => {
    expect(service).toBeTruthy();
  }));
});
