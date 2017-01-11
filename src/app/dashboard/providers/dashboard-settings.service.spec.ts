/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DashboardSettingsService } from './dashboard-settings.service';

describe('Service: DashboardSettings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardSettingsService]
    });
  });

  it('should ...', inject([DashboardSettingsService], (service: DashboardSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
