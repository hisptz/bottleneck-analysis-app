import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';

describe('AnalyticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDhis2HttpClientModule.forRoot({
          version: 1,
          namespace: 'bottleneck',
          models: {},
        }),
      ],
      providers: [AnalyticsService],
    });
  });

  it('should be created', inject(
    [AnalyticsService],
    (service: AnalyticsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
