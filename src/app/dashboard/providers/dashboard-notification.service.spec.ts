import { TestBed, inject } from '@angular/core/testing';

import { DashboardNotificationService } from './dashboard-notification.service';

describe('DashboardNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardNotificationService]
    });
  });

  it('should be created', inject([DashboardNotificationService], (service: DashboardNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
