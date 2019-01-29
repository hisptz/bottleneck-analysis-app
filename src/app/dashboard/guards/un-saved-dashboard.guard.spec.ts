import { TestBed, async, inject } from '@angular/core/testing';

import { UnSavedDashboardGuard } from './un-saved-dashboard.guard';

describe('UnSavedDashboardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnSavedDashboardGuard]
    });
  });

  it('should ...', inject([UnSavedDashboardGuard], (guard: UnSavedDashboardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
